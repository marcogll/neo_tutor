import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TYPING_ES } from '@/content/courses/typing-es';

// Almacenamiento simple — una sola fuente, reanudable, explicable
// PRD §15.2 + FR001/FR002/FR004/FR010

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  currentBlock: number; // índice 0..n-1, para reanudar
  passes: number; // racha actual 0..3
  bestAccuracy: number; // 0-1
  attempts: number;
  lastAt: string | null;
  completedAt: string | null;
}

interface ProgressState {
  version: 2;
  byId: Record<string, LessonProgress>;
  lastLessonId: string | null;
  lastBlockByLesson: Record<string, number>;

  // derivadas
  getLesson: (id: string) => LessonProgress;
  isUnlocked: (id: string) => boolean;
  nextRecommended: () => string | null;
  overall: () => { total: number; completed: number; pct: number };

  // mutaciones
  touch: (id: string) => void;
  setBlock: (id: string, idx: number) => void;
  recordAttempt: (id: string, accuracy: number, passed: boolean) => void;
  resetLesson: (id: string) => void;
  resetAll: () => void;
  // migración
  _hydrate: () => void;
}

function initialFor(id: string, idx: number): LessonProgress {
  const unlocked = idx === 0; // primera siempre disponible, resto depende de prereq
  return {
    lessonId: id,
    status: unlocked ? 'available' : 'locked',
    currentBlock: 0,
    passes: 0,
    bestAccuracy: 0,
    attempts: 0,
    lastAt: null,
    completedAt: null,
  };
}

function computeInitial(): Record<string, LessonProgress> {
  const map: Record<string, LessonProgress> = {};
  TYPING_ES.forEach((l, i) => (map[l.id] = initialFor(l.id, i)));
  // marca available según prereqs (para seed)
  TYPING_ES.forEach((l) => {
    if (l.prerequisites.length === 0) map[l.id]!.status = 'available';
  });
  return map;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      version: 2,
      byId: computeInitial(),
      lastLessonId: null,
      lastBlockByLesson: {},

      getLesson: (id) => get().byId[id] ?? initialFor(id, 0),
      isUnlocked: (id) => {
        const lesson = TYPING_ES.find((l) => l.id === id);
        if (!lesson) return false;
        if (lesson.prerequisites.length === 0) return true;
        return lesson.prerequisites.every((p) => get().byId[p]?.status === 'completed');
      },
      nextRecommended: () => {
        const byId = get().byId;
        // primera no completada y desbloqueada
        const cand = TYPING_ES.find((l) => byId[l.id]?.status !== 'completed' && get().isUnlocked(l.id));
        return cand?.id ?? TYPING_ES.find((l) => byId[l.id]?.status !== 'completed')?.id ?? null;
      },
      overall: () => {
        const total = TYPING_ES.length;
        const completed = Object.values(get().byId).filter((p) => p.status === 'completed').length;
        return { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
      },

      touch: (id) =>
        set((s) => {
          const cur = s.byId[id] ?? initialFor(id, 0);
          const next: LessonProgress = {
            ...cur,
            status: cur.status === 'completed' ? 'completed' : cur.status === 'locked' ? 'available' : 'in_progress',
            lastAt: new Date().toISOString(),
          };
          return { byId: { ...s.byId, [id]: next }, lastLessonId: id };
        }),

      setBlock: (id, idx) =>
        set((s) => ({
          byId: { ...s.byId, [id]: { ...(s.byId[id] ?? initialFor(id, 0)), currentBlock: idx, lastAt: new Date().toISOString(), status: 'in_progress' } },
          lastLessonId: id,
          lastBlockByLesson: { ...s.lastBlockByLesson, [id]: idx },
        })),

      recordAttempt: (id, accuracy, passed) =>
        set((s) => {
          const cur = s.byId[id] ?? initialFor(id, 0);
          const passes = passed ? cur.passes + 1 : 0;
          const completed = passes >= 3;
          const next: LessonProgress = {
            ...cur,
            passes,
            bestAccuracy: Math.max(cur.bestAccuracy, accuracy),
            attempts: cur.attempts + 1,
            lastAt: new Date().toISOString(),
            completedAt: completed ? new Date().toISOString() : cur.completedAt,
            status: completed ? 'completed' : passed ? 'in_progress' : cur.status === 'locked' ? 'available' : 'in_progress',
          };
          // desbloquear la siguiente si se completó
          const updated: Record<string, LessonProgress> = { ...s.byId, [id]: next };
          if (completed) {
            const idx = TYPING_ES.findIndex((l) => l.id === id);
            const nxt = TYPING_ES[idx + 1];
            if (nxt && updated[nxt.id]?.status === 'locked') {
              updated[nxt.id] = { ...updated[nxt.id]!, status: 'available' };
            }
          }
          return { byId: updated, lastLessonId: id };
        }),

      resetLesson: (id) =>
        set((s) => {
          const lessonIdx = TYPING_ES.findIndex((l) => l.id === id);
          return {
            byId: { ...s.byId, [id]: initialFor(id, lessonIdx) },
            lastBlockByLesson: { ...s.lastBlockByLesson, [id]: 0 },
          };
        }),

      resetAll: () => set({ byId: computeInitial(), lastLessonId: null, lastBlockByLesson: {} }),

      _hydrate: () => {
        // migra versión 1 (passes/completed) si existe en localStorage
        try {
          const raw = localStorage.getItem('neotype:progress');
          if (raw) {
            const old = JSON.parse(raw) as { state?: { passes?: Record<string, number>; completed?: Record<string, boolean> } };
            const passes = old.state?.passes;
            if (passes && Object.keys(get().byId).length > 0) {
              const byId = { ...get().byId };
              for (const [k, v] of Object.entries(passes)) {
                if (byId[k]) {
                  byId[k] = { ...byId[k]!, passes: v, status: v >= 3 ? 'completed' : v > 0 ? 'in_progress' : byId[k]!.status };
                  if (v >= 3) byId[k]!.completedAt = new Date().toISOString();
                }
              }
              // re-eval unlocks
              TYPING_ES.forEach((l) => {
                if (l.prerequisites.length && l.prerequisites.every((p) => byId[p]?.status === 'completed')) {
                  if (byId[l.id]?.status === 'locked') byId[l.id]!.status = 'available';
                }
              });
              set({ byId });
            }
          }
        } catch {}
      },
    }),
    {
      name: 'neotype:progress-v2',
      version: 2,
      // Dexie seguirá existiendo para eventos detallados §22, pero el progreso simple vive aquí para FR001/FR002
      onRehydrateStorage: () => (state) => state?._hydrate(),
    },
  ),
);
