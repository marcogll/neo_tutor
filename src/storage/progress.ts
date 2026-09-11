import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_COURSES } from '@/content/courses';
import type { LessonStatus as DomainStatus } from '@/domains/lesson';
import { REVIEW_INTERVALS, nextReviewDate, masteryLevel as masteryLabel, SKILL_GRAPH } from '@/domains/lesson';

// Re-export para compatibilidad — ahora incluye review/mastered, con alias completed
export type LessonStatus = DomainStatus | 'completed';
export type CompatStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'review' | 'mastered';

function normalizeStatus(s: string): DomainStatus {
  if (s === 'completed') return 'mastered';
  return s as DomainStatus;
}
function isCompletedLike(s: string): boolean {
  return s === 'completed' || s === 'mastered';
}

export interface LessonProgress {
  lessonId: string;
  status: CompatStatus; // se persiste compat, pero se normaliza a DomainStatus al leer
  currentSession: number;
  currentBlock: number; // legacy flat index — kept for compat; nuevo: currentSession/currentBlock
  passes: number; // racha 0..3
  bestAccuracy: number; // 0-1
  attempts: number;
  masteryScore: number; // 0..100 §21
  lastAt: string | null; // alias lastActivityAt
  lastActivityAt?: string | null;
  completedAt: string | null;
  nextReviewAt?: string | null;
  reviewCount?: number; // cuántas revisiones superadas (índice en REVIEW_INTERVALS)
  weakPatterns?: string[];
  // compat alias
  currentBlockLegacy?: number;
}

export interface SkillMasteryState {
  skillId: string;
  accuracy: number;
  attempts: number;
  successfulAttempts: number;
  mastery: number; // 0..100
  lastPracticedAt: string;
  nextReviewAt: string;
  weakPatterns: string[];
}

export interface ErrorStat {
  target: string; // tecla o bigram
  mistypedAs?: string;
  count: number;
  context?: string; // typing/vim/code
  movement?: string;
  lastAt: string;
}

interface ProgressState {
  version: 3;
  byId: Record<string, LessonProgress>;
  skillStates: Record<string, SkillMasteryState>;
  errorStats: Record<string, ErrorStat>; // key = target|mistypedAs
  lastLessonId: string | null;
  lastBlockByLesson: Record<string, number>;
  lastSessionByLesson: Record<string, { session: number; block: number }>;

  // derivadas
  getLesson: (id: string) => LessonProgress;
  isUnlocked: (id: string) => boolean;
  nextRecommended: () => string | null;
  overall: () => { total: number; completed: number; pct: number };
  overallByDomain: (domain: string) => { total: number; completed: number; pct: number };
  dueReviews: () => string[];
  weakSkills: () => { lessonId: string; accuracy: number }[];
  masteryLabelFor: (lessonId: string) => string;

  // mutaciones
  touch: (id: string) => void;
  setBlock: (id: string, idx: number) => void;
  setSessionBlock: (id: string, sessionIdx: number, blockIdx: number) => void;
  recordAttempt: (id: string, accuracy: number, passed: boolean) => void;
  recordError: (target: string, mistypedAs?: string, context?: string, movement?: string) => void;
  markReviewed: (id: string, passed: boolean) => void;
  resetLesson: (id: string) => void;
  resetAll: () => void;
  _hydrate: () => void;
}

function initialFor(id: string, idx: number): LessonProgress {
  const unlocked = idx === 0;
  const lesson = ALL_COURSES.find((l) => l.id === id);
  const noPrereq = !lesson || lesson.prerequisites.length === 0;
  return {
    lessonId: id,
    status: unlocked || noPrereq ? 'available' : 'locked',
    currentSession: 0,
    currentBlock: 0,
    passes: 0,
    bestAccuracy: 0,
    attempts: 0,
    masteryScore: 0,
    lastAt: null,
    lastActivityAt: null,
    completedAt: null,
    nextReviewAt: null,
    reviewCount: 0,
    weakPatterns: [],
  };
}

function computeInitial(): Record<string, LessonProgress> {
  const map: Record<string, LessonProgress> = {};
  ALL_COURSES.forEach((l, i) => (map[l.id] = initialFor(l.id, i)));
  ALL_COURSES.forEach((l) => {
    if (l.prerequisites.length === 0) map[l.id]!.status = 'available';
  });
  return map;
}

function calcMasteryScore(prev: number, accuracy: number, passed: boolean): number {
  // §21: 0–100, no es solo completed. Combina accuracy + racha.
  // Incremento simple: +15 por pass, + (accuracy*10), penaliza fail -10, clamp 0..100
  let s = prev;
  if (passed) {
    s += 12 + Math.round(accuracy * 18); // max +30
  } else {
    s = Math.max(0, s - 8);
  }
  // bonifica consistencia: si accuracy >0.95, +5
  if (accuracy >= 0.95 && passed) s += 5;
  return Math.max(0, Math.min(100, Math.round(s)));
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      version: 3,
      byId: computeInitial(),
      skillStates: {},
      errorStats: {},
      lastLessonId: null,
      lastBlockByLesson: {},
      lastSessionByLesson: {},

      getLesson: (id) => get().byId[id] ?? initialFor(id, 0),

      isUnlocked: (id) => {
        const lesson = ALL_COURSES.find((l) => l.id === id);
        if (!lesson) return false;
        if (lesson.prerequisites.length === 0) return true;
        const byId = get().byId;
        const skillStates = get().skillStates;
        // lesson prerequisites (id based)
        const lessonsOk = lesson.prerequisites.every((p) => {
          const s = byId[p]?.status;
          return s ? isCompletedLike(s) : false;
        });
        if (!lessonsOk) return false;
        // skill-based prerequisites §27 — e.g., typing-es-04 requires home-left >= proficient (61)
        // Derive via SKILL_GRAPH: find skill node for this lesson, check its prereq skills mastery
        const node = SKILL_GRAPH.find((n) => n.lessonId === id);
        if (node) {
          for (const prereqSkill of node.prerequisites) {
            const st = skillStates[prereqSkill];
            // if no state yet, treat as locked unless lesson prereq already completed (above)
            if (!st) continue;
            if (st.mastery < 41) return false; // developing threshold — must be at least developing to unlock next
          }
        }
        return true;
      },

      nextRecommended: () => {
        const byId = get().byId;
        // §14 prioridad: 1) critical weakness, 2) due review, 3) current lesson, 4) prerrequisito deteriorado, 5) next unlocked
        // 1) critical weakness — mastery 0-20 introduced with attempts >2
        const critical = Object.values(byId).find((p) => p.masteryScore < 20 && p.attempts >= 2 && get().isUnlocked(p.lessonId));
        if (critical) return critical.lessonId;
        // 2) due review
        const due = get().dueReviews();
        if (due.length > 0) return due[0] ?? null;
        // 3) current in_progress
        const inProg = ALL_COURSES.find((l) => byId[l.id]?.status === 'in_progress' && get().isUnlocked(l.id));
        if (inProg) return inProg.id;
        // 4) prerrequisito deteriorado — completed but mastery decayed low (<40) and is prereq for next
        const deteriorated = SKILL_GRAPH.find((n) => {
          const st = get().skillStates[n.id];
          return st && st.mastery < 40 && byId[n.lessonId]?.status && isCompletedLike(byId[n.lessonId]!.status);
        });
        if (deteriorated) return deteriorated.lessonId;
        // 5) next unlocked
        const cand = ALL_COURSES.find((l) => {
          const s = byId[l.id]?.status;
          return s !== 'mastered' && s !== 'completed' && get().isUnlocked(l.id);
        });
        return cand?.id ?? ALL_COURSES.find((l) => {
          const s = byId[l.id]?.status;
          return s !== 'mastered' && s !== 'completed';
        })?.id ?? null;
      },

      overall: () => {
        const total = ALL_COURSES.length;
        const completed = Object.values(get().byId).filter((p) => isCompletedLike(p.status) || p.masteryScore >= 96).length;
        return { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
      },

      overallByDomain: (domain: string) => {
        const list = ALL_COURSES.filter((l) => l.domain === domain);
        const completed = list.filter((l) => {
          const p = get().byId[l.id];
          return p ? isCompletedLike(p.status) || p.masteryScore >= 96 : false;
        }).length;
        return { total: list.length, completed, pct: list.length ? Math.round((completed / list.length) * 100) : 0 };
      },

      dueReviews: () => {
        const now = new Date().toISOString();
        return Object.values(get().byId)
          .filter((p) => isCompletedLike(p.status) || p.status === 'review')
          .filter((p) => p.nextReviewAt && p.nextReviewAt <= now)
          .map((p) => p.lessonId);
      },

      weakSkills: () => {
        return Object.values(get().byId)
          .filter((p) => p.masteryScore < 60 && p.attempts > 0)
          .sort((a, b) => a.masteryScore - b.masteryScore)
          .slice(0, 5)
          .map((p) => ({ lessonId: p.lessonId, accuracy: p.bestAccuracy }));
      },

      masteryLabelFor: (lessonId: string) => {
        const p = get().byId[lessonId];
        return masteryLabel(p?.masteryScore ?? 0);
      },

      touch: (id) =>
        set((s) => {
          const cur = s.byId[id] ?? initialFor(id, 0);
          const statusNorm = normalizeStatus(cur.status as string);
          let nextStatus: CompatStatus = cur.status;
          if (statusNorm === 'locked') nextStatus = 'available';
          else if (statusNorm === 'mastered' || isCompletedLike(cur.status)) {
            // si está vencida, pasa a review
            const due = cur.nextReviewAt && cur.nextReviewAt <= new Date().toISOString();
            nextStatus = due ? 'review' : cur.status;
          } else if (cur.status === 'available' || cur.status === 'review') nextStatus = 'in_progress';
          const now = new Date().toISOString();
          const next: LessonProgress = {
            ...cur,
            status: nextStatus,
            lastAt: now,
            lastActivityAt: now,
          };
          return { byId: { ...s.byId, [id]: next }, lastLessonId: id };
        }),

      setBlock: (id, idx) =>
        set((s) => {
          const cur = s.byId[id] ?? initialFor(id, 0);
          const now = new Date().toISOString();
          // legacy flat idx → también actualiza session/block: intenta mapear via lesson.sessions flat
          const lesson = ALL_COURSES.find((l) => l.id === id);
          let sess = cur.currentSession;
          let blk = idx;
          if (lesson?.sessions) {
            let acc = 0;
            for (let si = 0; si < lesson.sessions.length; si++) {
              const len = lesson.sessions[si]!.blocks.length;
              if (idx < acc + len) {
                sess = si;
                blk = idx - acc;
                break;
              }
              acc += len;
            }
          }
          return {
            byId: {
              ...s.byId,
              [id]: {
                ...cur,
                currentSession: sess,
                currentBlock: blk,
                lastAt: now,
                lastActivityAt: now,
                status: isCompletedLike(cur.status) ? cur.status : 'in_progress',
              },
            },
            lastLessonId: id,
            lastBlockByLesson: { ...s.lastBlockByLesson, [id]: idx },
            lastSessionByLesson: { ...s.lastSessionByLesson, [id]: { session: sess, block: blk } },
          };
        }),

      setSessionBlock: (id, sessionIdx, blockIdx) =>
        set((s) => {
          const cur = s.byId[id] ?? initialFor(id, 0);
          const now = new Date().toISOString();
          const lesson = ALL_COURSES.find((l) => l.id === id);
          const flat = lesson?.sessions
            ? lesson.sessions.slice(0, sessionIdx).reduce((a, sess) => a + sess.blocks.length, 0) + blockIdx
            : blockIdx;
          return {
            byId: {
              ...s.byId,
              [id]: {
                ...cur,
                currentSession: sessionIdx,
                currentBlock: blockIdx,
                lastAt: now,
                lastActivityAt: now,
                status: isCompletedLike(cur.status) ? cur.status : 'in_progress',
              },
            },
            lastLessonId: id,
            lastBlockByLesson: { ...s.lastBlockByLesson, [id]: flat },
            lastSessionByLesson: { ...s.lastSessionByLesson, [id]: { session: sessionIdx, block: blockIdx } },
          };
        }),

      recordAttempt: (id, accuracy, passed) =>
        set((s) => {
          const cur = s.byId[id] ?? initialFor(id, 0);
          const passes = passed ? cur.passes + 1 : 0;
          const completed = passes >= 3;
          const reviewDue = cur.nextReviewAt && cur.nextReviewAt <= new Date().toISOString();
          const now = new Date().toISOString();
          const masteryScore = calcMasteryScore(cur.masteryScore, accuracy, passed);
          let status: CompatStatus = cur.status;
          if (completed) {
            status = 'mastered';
          } else if (passed) {
            status = reviewDue ? 'review' : 'in_progress';
          } else if (cur.status === 'locked') status = 'available';
          else status = 'in_progress';

          // spaced repetition nextReviewAt
          let nextReviewAt = cur.nextReviewAt ?? null;
          let reviewCount = cur.reviewCount ?? 0;
          if (status === 'mastered') {
            // primera mastery → +1 día
            nextReviewAt = nextReviewDate(new Date(), reviewCount);
            reviewCount = Math.min(reviewCount + 1, REVIEW_INTERVALS.length - 1);
          } else if (status === 'review' && passed) {
            nextReviewAt = nextReviewDate(new Date(), reviewCount);
            reviewCount = Math.min(reviewCount + 1, REVIEW_INTERVALS.length - 1);
          }

          const next: LessonProgress = {
            ...cur,
            passes: completed ? 3 : passes,
            bestAccuracy: Math.max(cur.bestAccuracy, accuracy),
            attempts: cur.attempts + 1,
            masteryScore,
            lastAt: now,
            lastActivityAt: now,
            completedAt: completed ? now : cur.completedAt,
            status,
            nextReviewAt,
            reviewCount,
          };

          const updated: Record<string, LessonProgress> = { ...s.byId, [id]: next };

          // actualizar skillState
          const skillStates = { ...s.skillStates };
          const lesson = ALL_COURSES.find((l) => l.id === id);
          const skillIds = lesson?.skills ?? [id];
          for (const sid of skillIds) {
            const prev = skillStates[sid];
            const attempts = (prev?.attempts ?? 0) + 1;
            const succ = (prev?.successfulAttempts ?? 0) + (passed ? 1 : 0);
            const acc = prev ? (prev.accuracy * (attempts - 1) + accuracy) / attempts : accuracy;
            const mastery = masteryScore;
            skillStates[sid] = {
              skillId: sid,
              accuracy: acc,
              attempts,
              successfulAttempts: succ,
              mastery,
              lastPracticedAt: now,
              nextReviewAt: nextReviewAt ?? nextReviewDate(new Date(), 0),
              weakPatterns: cur.weakPatterns ?? [],
            };
          }

          if (completed || status === 'mastered') {
            for (const l of ALL_COURSES) {
              if (l.prerequisites.includes(id)) {
                const prereqsOk = l.prerequisites.every((p) => {
                  const sp = updated[p]?.status;
                  return sp ? isCompletedLike(sp) : false;
                });
                if (prereqsOk && updated[l.id]?.status === 'locked') {
                  updated[l.id] = { ...updated[l.id]!, status: 'available' };
                }
              }
            }
          }
          return { byId: updated, skillStates, lastLessonId: id };
        }),

      recordError: (target, mistypedAs, context, movement) =>
        set((s) => {
          const key = `${target}|${mistypedAs ?? ''}|${context ?? 'typing'}`;
          const prev = s.errorStats[key];
          const next: ErrorStat = {
            target,
            mistypedAs,
            count: (prev?.count ?? 0) + 1,
            context,
            movement,
            lastAt: new Date().toISOString(),
          };
          // también empuja a weakPatterns de la lección activa si hay
          const lastId = s.lastLessonId;
          const byId = { ...s.byId };
          if (lastId && byId[lastId]) {
            const weak = new Set(byId[lastId]!.weakPatterns ?? []);
            // bigram target+mistypedAs
            weak.add(target);
            if (mistypedAs) weak.add(`${target}->${mistypedAs}`);
            if (movement) weak.add(movement);
            byId[lastId] = { ...byId[lastId]!, weakPatterns: [...weak].slice(-10) };
          }
          return { errorStats: { ...s.errorStats, [key]: next }, byId };
        }),

      markReviewed: (id, passed) =>
        set((s) => {
          const cur = s.byId[id] ?? initialFor(id, 0);
          const now = new Date().toISOString();
          const rc = cur.reviewCount ?? 0;
          let nextReviewAt: string | null = cur.nextReviewAt ?? null;
          let status: CompatStatus = cur.status;
          if (passed) {
            nextReviewAt = nextReviewDate(new Date(), rc);
            status = 'mastered';
          } else {
            // falló review → vuelve a in_progress / review
            status = 'review';
            nextReviewAt = nextReviewDate(new Date(), Math.max(0, rc - 1));
          }
          return {
            byId: {
              ...s.byId,
              [id]: {
                ...cur,
                status,
                nextReviewAt,
                reviewCount: passed ? Math.min(rc + 1, REVIEW_INTERVALS.length - 1) : Math.max(0, rc - 1),
                lastAt: now,
                lastActivityAt: now,
              },
            },
          };
        }),

      resetLesson: (id) =>
        set((s) => {
          const lessonIdx = ALL_COURSES.findIndex((l) => l.id === id);
          const init = initialFor(id, lessonIdx >= 0 ? lessonIdx : 0);
          // mantiene disponibilidad si prereqs cumplidos
          const lesson = ALL_COURSES.find((l) => l.id === id);
          if (lesson && lesson.prerequisites.length > 0) {
            const ok = lesson.prerequisites.every((p) => {
              const sp = s.byId[p]?.status;
              return sp ? isCompletedLike(sp) : false;
            });
            if (ok) init.status = 'available';
          }
          return {
            byId: { ...s.byId, [id]: init },
            lastBlockByLesson: { ...s.lastBlockByLesson, [id]: 0 },
            lastSessionByLesson: { ...s.lastSessionByLesson, [id]: { session: 0, block: 0 } },
          };
        }),

      resetAll: () => set({ byId: computeInitial(), skillStates: {}, errorStats: {}, lastLessonId: null, lastBlockByLesson: {}, lastSessionByLesson: {} }),

      _hydrate: () => {
        try {
          // migración desde v2: name neotype:progress-v2 → v3
          const rawV2 = localStorage.getItem('neotype:progress-v2');
          if (rawV2) {
            const parsed = JSON.parse(rawV2);
            const state = parsed.state ?? parsed;
            if (state.byId && !state.skillStates) {
              // migra byId: completed→mastered, añade masteryScore/nextReview etc
              const byId: Record<string, LessonProgress> = {};
              for (const [k, v] of Object.entries(state.byId as Record<string, LessonProgress>)) {
                const old = v as unknown as LessonProgress & { currentBlock?: number; status: string };
                const st = old.status === 'completed' ? 'mastered' : old.status;
                byId[k] = {
                  lessonId: k,
                  status: st as CompatStatus,
                  currentSession: (old as unknown as { currentSession?: number }).currentSession ?? 0,
                  currentBlock: old.currentBlock ?? 0,
                  passes: old.passes ?? 0,
                  bestAccuracy: old.bestAccuracy ?? 0,
                  attempts: old.attempts ?? 0,
                  masteryScore: old.passes >= 3 ? 96 : old.passes > 0 ? old.passes * 30 : 0,
                  lastAt: old.lastAt ?? null,
                  lastActivityAt: (old as unknown as { lastActivityAt?: string }).lastActivityAt ?? old.lastAt ?? null,
                  completedAt: old.completedAt ?? null,
                  nextReviewAt: isCompletedLike(st as string) ? nextReviewDate(new Date(), 0) : null,
                  reviewCount: isCompletedLike(st as string) ? 1 : 0,
                  weakPatterns: [],
                };
              }
              set({ byId });
            }
          }
          const rawOld = localStorage.getItem('neotype:progress');
          if (rawOld) {
            const old = JSON.parse(rawOld) as { state?: { passes?: Record<string, number> } };
            const passes = old.state?.passes;
            if (passes) {
              const byId = { ...get().byId };
              for (const [k, v] of Object.entries(passes)) {
                if (byId[k]) {
                  const st = v >= 3 ? 'mastered' : v > 0 ? 'in_progress' : byId[k]!.status;
                  byId[k] = { ...byId[k]!, passes: v, status: st as CompatStatus, masteryScore: v >= 3 ? 96 : v * 30 };
                  if (v >= 3) byId[k]!.completedAt = new Date().toISOString();
                  if (v >= 3) byId[k]!.nextReviewAt = nextReviewDate(new Date(), 0);
                }
              }
              set({ byId });
            }
          }
        } catch {}
      },
    }),
    {
      name: 'neotype:progress-v3',
      version: 3,
      onRehydrateStorage: () => (state) => state?._hydrate(),
      migrate: (persistedState, version) => {
        if (version < 3) {
          // deja que _hydrate haga la migración fina
          return persistedState as never;
        }
        return persistedState as never;
      },
    },
  ),
);
