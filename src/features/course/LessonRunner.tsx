import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAnyLesson, ALL_COURSES } from '@/content/courses';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { canRunLesson } from '@/engines/keyboard/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Keyboard } from '@/components/Keyboard/Keyboard';
import { Hands } from '@/components/Hands/Hands';
import { calcAccuracy, buildKeystrokeLog, calcWPM } from '@/engines/typing/metrics';
import { useProgressStore } from '@/storage/progress';
import { getLessonSessions, getBlockText, masteryLevel } from '@/domains/lesson';
import { remediationExercises } from '@/engines/adaptive/mastery';
import { checkPython, checkGo } from '@/engines/code/evaluator';
import { generateTypingExercise } from '@/engines/typing/generator';

export function LessonRunner() {
  const { id } = useParams<{ id: string }>();
  const lesson = id ? getAnyLesson(id) : undefined;
  const navigate = useNavigate();
  const profile = useKeyboardStore((s) => s.activeProfile);
  const { byId, isUnlocked, touch, setSessionBlock, recordAttempt, recordError, resetLesson, lastLessonId, overall } = useProgressStore();

  const sessions = useMemo(() => (lesson ? getLessonSessions(lesson) : []), [lesson]);
  // derived flat for progress bar
  const flatBlocks = useMemo(() => sessions.flatMap((s) => s.blocks), [sessions]);
  const totalBlocks = flatBlocks.length;

  const prog = id ? byId[id] : undefined;
  const savedSess = id ? (useProgressStore.getState().lastSessionByLesson[id]?.session ?? prog?.currentSession ?? 0) : 0;
  const savedBlk = id ? (useProgressStore.getState().lastSessionByLesson[id]?.block ?? prog?.currentBlock ?? 0) : 0;

  const [sessionIdx, setSessionIdx] = useState<number>(savedSess);
  const [blockIdx, setBlockIdx] = useState<number>(savedBlk);
  const [input, setInput] = useState('');
  const [showRecall, setShowRecall] = useState(false);
  const [result, setResult] = useState<{ acc: number; pass: boolean } | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [extraTarget, setExtraTarget] = useState<string | null>(null);

  // sync saved progress on mount/change
  useEffect(() => {
    if (id) {
      const p = byId[id];
      const s = p?.currentSession ?? savedSess;
      const b = p?.currentBlock ?? savedBlk;
      setSessionIdx(s);
      setBlockIdx(b);
      touch(id);
    }
    setShowRecall(false);
    setResult(null);
    setInput('');
    setStartedAt(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (lesson && id) setSessionBlock(lesson.id, sessionIdx, blockIdx);
  }, [lesson, id, sessionIdx, blockIdx, setSessionBlock]);

  // Atajos de teclado §30: Enter evaluar, Ctrl+Enter continuar, Alt+←/→ navegar, R reiniciar, ? ayuda, P practicar más
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && result?.pass) {
        e.preventDefault();
        goNext();
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        if (lesson) resetLesson(lesson.id);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePracticeMore();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, sessionIdx, blockIdx, lesson]);

  const session = sessions[sessionIdx];
  const block = session?.blocks[blockIdx];
  const baseTarget = useMemo(() => getBlockText(block as never, lesson?.domain), [block, lesson?.domain]);
  const target = extraTarget ?? baseTarget;
  const blockType = (block?.type ?? (block as unknown as { kind?: string })?.kind) as string;
  const isEval = blockType === 'evaluation';
  const isRecall = blockType === 'recall';
  const isReview = blockType === 'review';
  const isConcept = blockType === 'concept';
  const isPosition = blockType === 'position';
  const isZen = blockType === 'zen';
  const isDebug = blockType === 'debug';
  const isChallenge = blockType === 'challenge';

  const required = useMemo(() => [...new Set(flatBlocks.flatMap((b) => b.targetKeys ?? []))], [flatBlocks]);
  const blocked = useMemo(() => (lesson ? (profile ? !canRunLesson(profile as never, required) : true) : false), [lesson, profile, required]);

  const logs = useMemo(() => buildKeystrokeLog(target, input, [], []), [target, input]);
  const acc = useMemo(() => calcAccuracy(logs.slice(0, input.length)), [logs, input.length]);
  const wpm = useMemo(() => {
    if (!startedAt || input.length === 0) return 0;
    const elapsed = Date.now() - startedAt;
    return Math.round(calcWPM(input.length, elapsed));
  }, [input.length, startedAt]);
  const cpm = useMemo(() => wpm * 5, [wpm]);

  function handleInputChange(v: string) {
    if (v.length === 1 && startedAt === null) setStartedAt(Date.now());
    if (v.length === 0) setStartedAt(null);
    setInput(v);
  }
  const nextCode = useMemo(() => {
    if (!target || input.length >= target.length) return null;
    const ch = target[input.length];
    if (!ch || ch === ' ' || ch === '\n') return null;
    // simple mapping a-z, símbolos fallback
    const upper = ch.toUpperCase();
    if (/[A-Z]/.test(upper)) return `Key${upper}`;
    if (ch === 'ñ' || ch === 'Ñ') return 'Semicolon';
    if (ch === ',') return 'Comma';
    if (ch === '.') return 'Period';
    if (/[0-9]/.test(ch)) return `Digit${ch}`;
    return null;
  }, [target, input.length]);

  const nextLesson = useMemo(() => {
    if (!lesson) return undefined;
    const idx = ALL_COURSES.findIndex((l) => l.id === lesson.id);
    return ALL_COURSES[idx + 1];
  }, [lesson]);

  const flatIndex = useMemo(() => {
    let acc = 0;
    for (let i = 0; i < sessionIdx; i++) acc += sessions[i]?.blocks.length ?? 0;
    return acc + blockIdx;
  }, [sessionIdx, blockIdx, sessions]);

  function handlePracticeMore() {
    if (!lesson || !block) return;
    // Genera ejercicio extra con mismo targetKeys + weakPatterns + dificultad adaptada
    const unlocked = new Set<string>(
      flatBlocks.flatMap((b) => b.targetKeys ?? []).map((c) => c.replace('Key', '').toLowerCase()).concat(['a', 's', 'd', 'f', 'j', 'k', 'l', 'ñ']),
    );
    // fallback simple: si targetKeys existe, úsalos
    const targetKeys = block.targetKeys ?? lesson.targetKeys ?? [];
    const unlockedForGen = new Set<string>([...unlocked, ...targetKeys.map((k) => k.replace('Key', '').toLowerCase())].filter(Boolean));
    const weak = prog?.weakPatterns ?? [];
    const diff = (block.difficulty ?? 2) as 1 | 2 | 3 | 4 | 5;
    const kind = (blockType === 'pattern' ? 'alternancia' : blockType === 'isolation' ? 'repeticion' : undefined) as never;
    const gen = generateTypingExercise({
      unlockedKeys: unlockedForGen,
      targetKeys,
      weakBigrams: weak.filter((w) => w.length === 2),
      weakPatterns: weak,
      difficulty: diff,
      language: 'es',
      kind,
    });
    setExtraTarget(gen);
    setInput('');
    setResult(null);
    setStartedAt(null);
  }

  function submit() {
    if (!lesson || !block) return;
    // Si hay extraTarget generado, evaluar contra ese en lugar de target original
    const effectiveTarget = extraTarget ?? target;
    const effectiveAcc = (() => {
      const logsTmp = buildKeystrokeLog(effectiveTarget, input, [], []);
      return calcAccuracy(logsTmp.slice(0, input.length));
    })();
    // Evaluación por dominio §18: typing→precisión, code→tokens, vim→texto final
    let pass = false;
    let accForRecord = effectiveAcc;
    if (lesson.domain === 'python' || lesson.domain === 'go') {
      const tokens = effectiveTarget.split(/\W+/).filter(Boolean).slice(0, 3);
      const r = lesson.domain === 'python' ? checkPython(input || effectiveTarget, tokens) : checkGo(input || effectiveTarget, tokens);
      pass = r.ok;
      accForRecord = r.ok ? 1 : 0;
      setResult({ acc: accForRecord, pass });
      if (isEval) recordAttempt(lesson.id, accForRecord, pass);
      if (!pass) recordError(effectiveTarget.slice(0, 10), input.slice(0, 10), 'code', blockType);
      return;
    }
    if (lesson.domain === 'neovim' && (blockType === 'challenge' || blockType === 'application')) {
      // vim: considera pass si texto final coincide (simplificado: input contiene expected substring)
      const expected = effectiveTarget.trim();
      pass = input.includes(expected) || effectiveAcc >= (lesson.mastery.minAccuracy ?? 0.9);
      accForRecord = pass ? 1 : effectiveAcc;
      setResult({ acc: accForRecord, pass });
      if (isEval) recordAttempt(lesson.id, accForRecord, pass);
      if (!pass) recordError(expected.slice(0, 5), input.slice(0, 5), 'vim', blockType);
      return;
    }
    pass = effectiveAcc >= (lesson.mastery.minAccuracy ?? 0.95);
    const isEvalBlock = isEval;
    setResult({ acc: effectiveAcc, pass });
    if (isEvalBlock) recordAttempt(lesson.id, effectiveAcc, pass);
    // error adaptación §7 — registra tecla/bigram/movimiento incluso en no-eval
    if (!pass) {
      for (let i = 0; i < Math.min(effectiveTarget.length, input.length); i++) {
        if (effectiveTarget[i] !== input[i]) {
          const movement = `${effectiveTarget[i]}->${input[i]}`;
          recordError(effectiveTarget[i] ?? '', input[i], 'typing', movement);
          break;
        }
      }
      // bigram débil
      if (effectiveTarget.length >= 2 && input.length >= 2) {
        const bg = effectiveTarget.slice(Math.max(0, input.length - 2), input.length).toLowerCase();
        if (bg.length === 2) recordError(bg, undefined, 'typing', `bigram:${bg}`);
      }
    }
  }

  function goNext() {
    if (!session) return;
    if (blockIdx < session.blocks.length - 1) {
      setBlockIdx((i) => i + 1);
    } else if (sessionIdx < sessions.length - 1) {
      setSessionIdx((i) => i + 1);
      setBlockIdx(0);
    }
    setInput('');
    setResult(null);
    setShowRecall(false);
    setStartedAt(null);
    setExtraTarget(null);
  }
  function goPrev() {
    if (blockIdx > 0) setBlockIdx((i) => i - 1);
    else if (sessionIdx > 0) {
      const prevLen = sessions[sessionIdx - 1]?.blocks.length ?? 1;
      setSessionIdx((i) => i - 1);
      setBlockIdx(prevLen - 1);
    }
    setInput('');
    setResult(null);
    setShowRecall(false);
    setStartedAt(null);
    setExtraTarget(null);
  }

  if (!lesson) {
    const ov = overall();
    const nextId = useProgressStore.getState().nextRecommended();
    const due = useProgressStore.getState().dueReviews();
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Lecciones</h1>
            <Badge variant="secondary" className="rounded-full">
              {ov.completed}/{ov.total} · {ov.pct}%
            </Badge>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-foreground transition-all" style={{ width: `${ov.pct}%` }} />
          </div>
          {due.length > 0 && (
            <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revisión vencida</CardTitle>
                <CardDescription className="text-xs">Tienes {due.length} habilidad(es) para repasar (spaced repetition +1/3/7/14/30 días)</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {due.map((did) => (
                  <Button key={did} size="sm" variant="outline" onClick={() => navigate(`/leccion/${did}`)}>
                    Repasar {ALL_COURSES.find((l) => l.id === did)?.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
          {lastLessonId && (
            <Button size="sm" onClick={() => navigate(`/leccion/${lastLessonId}`)}>
              Continuar donde quedaste → {ALL_COURSES.find((l) => l.id === lastLessonId)?.title}
            </Button>
          )}
          {nextId && nextId !== lastLessonId && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/leccion/${nextId}`)}>
              Siguiente recomendada → {ALL_COURSES.find((l) => l.id === nextId)?.title}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {(['typing', 'neovim', 'python', 'go'] as const).map((domain) => {
            const lessons = ALL_COURSES.filter((l) => l.domain === domain);
            const domainLabel = domain === 'typing' ? 'Touch Typing' : domain === 'neovim' ? 'Neovim' : domain === 'python' ? 'Python' : 'Go';
            return (
              <div key={domain} className="space-y-3">
                <h2 className="text-sm font-semibold tracking-tight">{domainLabel} — {lessons.length} lecciones</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {lessons.map((l, idx) => {
                    const p = byId[l.id];
                    const unlocked = isUnlocked(l.id);
                    const rawStatus = p?.status ?? (unlocked ? 'available' : 'locked');
                    const status = rawStatus === 'completed' ? 'mastered' : rawStatus;
                    const mastery = p?.masteryScore ?? 0;
                    const level = masteryLevel(mastery);
                    const sess = (l as unknown as { sessions?: { blocks: unknown[]; title: string; id: string }[] }).sessions ?? [];
                    const total = (sess as { blocks: unknown[] }[]).reduce((a, s) => a + s.blocks.length, 0) || l.blocks.length;
                    const cur = p ? p.currentSession * 5 + p.currentBlock + (isCompletedLike(status) ? 1 : 0) : 0;
                    const pctBlocks = p ? Math.round((Math.min(cur, total) / total) * 100) : 0;
                    return (
                      <Card key={l.id} className={status === 'mastered' ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20' : !unlocked ? 'opacity-60' : status === 'review' ? 'border-amber-300 bg-amber-50/40' : ''}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant={status === 'mastered' ? 'default' : status === 'in_progress' ? 'secondary' : status === 'review' ? 'outline' : unlocked ? 'outline' : 'muted'} className="rounded-full">
                              {idx + 1}. {status === 'mastered' ? '✓' : status === 'locked' ? '🔒' : status === 'in_progress' ? '●' : status === 'review' ? '↻' : '○'} {status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{p?.passes ?? 0}/3 · {mastery}% {level}</span>
                          </div>
                          <CardTitle className="text-base leading-tight">{l.title}</CardTitle>
                          <CardDescription className="text-xs">{l.description ?? l.objectives.join(' · ')}</CardDescription>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {sess.slice(0, 3).map((s) => (
                              <Badge key={s.id} variant="muted" className="text-[10px]">
                                {s.title.split('—')[0]?.trim()}
                              </Badge>
                            ))}
                            {sess.length > 3 && <Badge variant="muted" className="text-[10px]">+{sess.length - 3}</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                S{p?.currentSession ?? 0 + 1} · B{(p?.currentBlock ?? 0) + 1}/{total}
                              </span>
                              <span>{(p?.bestAccuracy ?? 0) ? `${(p!.bestAccuracy * 100).toFixed(0)}% mejor` : ''}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                              <div className="h-full bg-foreground transition-all" style={{ width: `${pctBlocks}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" disabled={!unlocked} asChild={unlocked ? ({ href: `/leccion/${l.id}` } as never) : undefined} onClick={unlocked ? undefined : () => {}}>
                              {unlocked ? (
                                <Link to={`/leccion/${l.id}`}>{status === 'in_progress' ? 'Continuar' : status === 'mastered' ? 'Repasar' : status === 'review' ? 'Repaso' : 'Empezar'}</Link>
                              ) : (
                                <span>Bloqueada</span>
                              )}
                            </Button>
                            {p && p.attempts > 0 && (
                              <Button variant="ghost" size="sm" onClick={() => resetLesson(l.id)} title="FR004 reiniciar sin borrar todo">
                                Reiniciar
                              </Button>
                            )}
                          </div>
                          {!unlocked && <p className="text-xs text-muted-foreground">Requiere: {l.prerequisites.join(', ')}</p>}
                          {p?.weakPatterns && p.weakPatterns.length > 0 && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-300">Débil: {p.weakPatterns.slice(0, 3).join(', ')}</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Todos los dominios — 33 lecciones</CardTitle>
            <CardDescription>Touch Typing 10 · Neovim 9 · Python 7 · Go 7 — skill graph ver progreso</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link to="/cursos">Ver cursos por dominio</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/progreso">Mapa de habilidades</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (blocked) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Teclado no compatible</CardTitle>
          <CardDescription>KB005 — requiere {required.join(', ')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/calibracion">Calibrar</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const masteryPct = prog?.masteryScore ?? 0;
  const lvl = masteryLevel(masteryPct);
  const statusLabel = prog?.status === 'completed' ? 'mastered' : prog?.status ?? 'available';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted" className="rounded-full">
              {lesson.id}
            </Badge>
            <Badge variant={statusLabel === 'mastered' ? 'default' : statusLabel === 'review' ? 'outline' : 'secondary'} className="rounded-full">
              {statusLabel}
            </Badge>
            <Badge variant="outline">
              {prog?.passes ?? 0}/3 · {masteryPct}% {lvl}
            </Badge>
            {prog?.nextReviewAt && <Badge variant="muted">rev {new Date(prog.nextReviewAt).toLocaleDateString()}</Badge>}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.description ?? lesson.objectives.join(' · ')} {prog?.bestAccuracy ? `· mejor ${(prog.bestAccuracy * 100).toFixed(0)}%` : ''}</p>
          {prog?.weakPatterns && prog.weakPatterns.length > 0 && (
            <p className="text-xs text-amber-700 dark:text-amber-300">Enfoque: {prog.weakPatterns.slice(0, 4).join(' · ')}</p>
          )}
        </div>
        <Button variant="ghost" asChild>
          <Link to="/leccion">← Lecciones</Link>
        </Button>
      </div>

      <div className="text-xs text-muted-foreground flex flex-wrap gap-1.5">
        <span>Atajos:</span>
        <Badge variant="outline" className="text-[10px]">
          Enter evaluar
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          Ctrl+↵ continuar
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          Alt+→ siguiente
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          Ctrl+P más ejercicios
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          ? ayuda
        </Badge>
      </div>

      {/* Sessions tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sesión</span>
          <div className="flex flex-1 gap-1">
            {sessions.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setSessionIdx(i);
                  setBlockIdx(0);
                  setInput('');
                  setResult(null);
                  setShowRecall(false);
                }}
                className={`flex-1 rounded-full px-2 py-1 text-xs font-medium transition ${i === sessionIdx ? 'bg-foreground text-background' : i < sessionIdx ? 'bg-foreground/20' : 'bg-secondary text-muted-foreground hover:bg-accent'}`}
              >
                {s.title.split('—')[0]?.trim() ?? `S${i + 1}`}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{sessionIdx + 1}/{sessions.length}</span>
        </div>
        {session && <p className="text-xs text-muted-foreground">{session.title} · {session.estimatedMinutes} min · {session.objectives?.join(' · ')}</p>}
        {/* Blocks within session */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Bloque {flatIndex + 1}/{totalBlocks}</span>
          <div className="flex flex-1 gap-1.5">
            {flatBlocks.map((_, i) => {
              const isDone = i < flatIndex;
              const isCurrent = i === flatIndex;
              return <div key={i} className={`h-1.5 flex-1 rounded-full transition ${isCurrent ? 'bg-foreground' : isDone ? 'bg-foreground/40' : 'bg-border'}`} />;
            })}
          </div>
          <span className="text-xs text-muted-foreground">{blockType}</span>
        </div>
        <div className="flex gap-1.5">
          {session?.blocks.map((b, i) => (
            <button
              key={b.id}
              onClick={() => {
                setBlockIdx(i);
                setInput('');
                setResult(null);
                setShowRecall(false);
              }}
              className={`h-1.5 flex-1 rounded-full transition ${i === blockIdx ? 'bg-foreground' : i < blockIdx ? 'bg-foreground/40' : 'bg-border'}`}
              aria-label={`Bloque ${i + 1} ${b.type ?? (b as unknown as { kind?: string }).kind}`}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base capitalize">
            <span>
              {blockType ?? ''} — {session?.title.split('—')[0]?.trim()} · bloque {blockIdx + 1}/{session?.blocks.length}
            </span>
            {isZen && <Badge variant="muted">ZEN</Badge>}
            {isEval && <Badge variant="outline">EVAL</Badge>}
            <Badge variant="secondary" className="ml-auto">
              diff {(block?.difficulty ?? 1)}/5
            </Badge>
          </CardTitle>
          <CardDescription>
            {(block as unknown as { instructions?: string })?.instructions ?? block?.prompt ?? 'Sigue las instrucciones.'} {isEval && '(evaluación — 3 PASS en sesiones diferentes)'}
            {isZen && ' · interfaz mínima — sin WPM visible'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Block renderers */}
          {(isConcept || isPosition) && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-accent/30 p-4 text-sm leading-relaxed">
                {(block as unknown as { instructions?: string })?.instructions ?? block?.prompt ?? ''}
              </div>
              {isPosition && block?.targetKeys && (
                <>
                  <p className="text-xs text-muted-foreground">ÁMBAR=conjunto activo · NEGRO=objetivo · PUNTO=dedo</p>
                  <div className="overflow-x-auto pb-2">{profile && <Keyboard layout={profile as never} highlightedCode={block.targetKeys[0] ?? null} activeCodes={block.targetKeys} />}</div>
                  {profile && block.targetKeys[0] && <Hands activeFinger={profile.keys.find((k) => k.code === block.targetKeys![0])?.finger ?? null} />}
                </>
              )}
              {isConcept && block?.content && (
                <pre className="rounded-xl bg-muted p-3 font-mono text-xs leading-relaxed">{Array.isArray(block.content) ? block.content.join('\n') : block.content}</pre>
              )}
              <div className="flex gap-2">
                <Button onClick={() => goNext()}>Entendido → Siguiente</Button>
                <Button variant="ghost" onClick={goPrev}>
                  ← Anterior
                </Button>
              </div>
            </div>
          )}

          {(isRecall || isReview) && (
            <div className="space-y-4">
              <div className={`rounded-xl border p-4 text-sm ${isReview ? 'bg-sky-50 dark:bg-sky-950 border-sky-200' : 'bg-amber-50 dark:bg-amber-950'}`}>
                <div className="font-medium">{isReview ? 'REVIEW — repetición espaciada §6' : 'RECALL — recuperación activa'}</div>
                <p className="text-xs text-muted-foreground">{isReview ? 'Vence en intervalos +1/3/7/14/30 días — recupera sin pista.' : '¿Qué movimiento usarías? Escribe sin mirar la respuesta primero.'}</p>
              </div>
              {!showRecall ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-muted p-4 font-mono text-sm blur-sm select-none">fj dk sl añ — oculto hasta pulsar Mostrar</div>
                  <Button size="sm" variant="outline" onClick={() => setShowRecall(true)}>
                    Mostrar
                  </Button>
                  <p className="text-xs text-muted-foreground">Intenta recuperar de memoria antes de ver.</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-muted p-4 font-mono text-sm leading-relaxed">
                    {target.split('').map((ch: string, i: number) => {
                      const typed = input[i];
                      if (typed === undefined) return <span key={i} className="text-muted-foreground">{ch}</span>;
                      return <span key={i} className={typed === ch ? 'text-foreground' : 'text-destructive underline decoration-wavy'}>{ch}</span>;
                    })}
                  </div>
                  <input
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && input.length) submit();
                    }}
                    placeholder="Recuperación — escribe"
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">{(acc * 100).toFixed(0)}% precisión</Badge>
                    {!isZen && <Badge variant="outline">{cpm} CPM · {wpm} WPM</Badge>}
                    <Badge variant="outline">
                      {input.length}/{target.length}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={submit} disabled={!input.length}>
                      Evaluar ↩
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setInput(''); setStartedAt(null); }}>
                      Limpiar
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {!isConcept && !isPosition && !isRecall && !isReview && (
            <>
              {/* Zen minimal: ocultar keyboard/WPM */}
              <div className={`rounded-xl p-4 font-mono text-sm leading-relaxed ${isZen ? 'bg-card border' : 'bg-muted'}`}>
                {target.split('').map((ch: string, i: number) => {
                  const typed = input[i];
                  if (typed === undefined) return <span key={i} className={isZen ? 'text-muted-foreground' : 'text-muted-foreground'}>{ch}</span>;
                  return <span key={i} className={typed === ch ? 'text-foreground' : 'text-destructive underline decoration-wavy'}>{ch}</span>;
                })}
                {!target && <span className="text-muted-foreground">Escribe siguiendo la consigna.</span>}
              </div>

              {isChallenge && (
                <p className="rounded-lg bg-violet-50 p-3 text-xs text-violet-900 dark:bg-violet-950 dark:text-violet-100">
                  CHALLENGE — objetivo sin pasos: decide tú el movimiento/comando.
                </p>
              )}
              {isDebug && (
                <p className="rounded-lg bg-red-50 p-3 text-xs text-red-900 dark:bg-red-950 dark:text-red-100">
                  DEBUG — recibe código incorrecto, descubre y repara.
                </p>
              )}
              {isZen && (
                <p className="text-xs text-muted-foreground">ZEN — solo contenido, cursor, errores y progreso. Sin WPM/leaderboard/tips.</p>
              )}
              {prog?.weakPatterns && prog.weakPatterns.length > 0 && (blockType === 'pattern' || blockType === 'combination' || blockType === 'isolation') && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs dark:bg-amber-950 dark:border-amber-800">
                  <div className="font-medium">Adaptado a tus errores §7 — sin repetir toda la lección</div>
                  <div className="text-muted-foreground">Débil: {prog.weakPatterns.slice(0, 3).join(', ')} → practica: {remediationExercises({ target: prog.weakPatterns[0] ?? 'r', mistypedAs: prog.weakPatterns[0]?.split('->')[1], count: 1, context: 'typing' as const }).join(', ')}</div>
                </div>
              )}

              {lesson.domain === 'python' || lesson.domain === 'go' ? (
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={
                    isEval ? 'Evaluación — escribe código y evalúa' : isDebug ? 'Corrige el código' : 'Escribe código aquí'
                  }
                  rows={6}
                  className="flex w-full rounded-xl border border-input bg-background p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                />
              ) : (
                <input
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && input.length) submit();
                  }}
                  placeholder={
                    isEval
                      ? 'Evaluación — Enter para evaluar (≥95% para PASS)'
                      : isZen
                        ? 'Zen — escribe continuo'
                        : isChallenge
                          ? 'Challenge — intenta sin pista'
                          : 'Escribe aquí… Enter para evaluar'
                  }
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                />
              )}

              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">{(acc * 100).toFixed(0)}% precisión</Badge>
                {!isZen && (
                  <>
                    <Badge variant="outline">{cpm} CPM · {wpm} WPM</Badge>
                    <Badge variant="outline">{input.length} chars</Badge>
                  </>
                )}
                <Badge variant="outline">
                  {input.length}/{target.length}
                </Badge>
                {prog?.bestAccuracy ? <Badge variant="outline">mejor {(prog.bestAccuracy * 100).toFixed(0)}%</Badge> : null}
                {isEval && <Badge variant="outline">{prog?.passes ?? 0}/3 PASS</Badge>}
              </div>

              {!isZen && (
                <>
                  <Separator />
                  <div className="overflow-x-auto pb-2">
                    {profile && <Keyboard layout={profile as never} highlightedCode={nextCode} activeCodes={block?.targetKeys ?? flatBlocks.flatMap((b) => b.targetKeys ?? [])} />}
                  </div>
                  {profile && nextCode && <Hands activeFinger={profile.keys.find((k) => k.code === nextCode)?.finger ?? null} />}
                </>
              )}
            </>
          )}

          <div className="flex flex-wrap gap-2">
            {!isConcept && !isPosition && (
              <>
                <Button size="sm" onClick={submit} disabled={input.length === 0 && !isDebug}>
                  Evaluar ↩<span className="ml-1 hidden sm:inline text-xs opacity-60">Enter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput('');
                    setResult(null);
                    setStartedAt(null);
                  }}
                >
                  Limpiar
                </Button>
                <Button variant="outline" size="sm" onClick={handlePracticeMore} title="Atajo: Ctrl+P">
                  Practicar más <span className="ml-1 hidden sm:inline text-xs opacity-60">Ctrl+P</span>
                </Button>
                {result?.pass && (
                  <Button size="sm" onClick={goNext} className="bg-emerald-600 hover:bg-emerald-700 text-white" title="Atajo: Ctrl+Enter">
                    {isEval ? 'Continuar lección →' : 'Seguir →'} <span className="ml-1 hidden sm:inline text-xs opacity-80">Ctrl+↵</span>
                  </Button>
                )}
              </>
            )}
            <Button variant="ghost" size="sm" onClick={goPrev} disabled={sessionIdx === 0 && blockIdx === 0} title="Atajo: Alt+←">
              ← Anterior
            </Button>
            <Button variant="ghost" size="sm" onClick={goNext} disabled={sessionIdx === sessions.length - 1 && blockIdx === (session?.blocks.length ?? 1) - 1} title="Atajo: Alt+→">
              Siguiente →
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => resetLesson(lesson.id)} title="Atajo: Ctrl+R">
              Reiniciar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowHelp((v) => !v)} title="Atajo: ?">
              {showHelp ? 'Ocultar atajos' : 'Atajos ?'}
            </Button>
          </div>

          {extraTarget && (
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm dark:bg-violet-950 dark:border-violet-800">
              <div className="font-medium">Ejercicio extra generado — misma habilidad, nueva secuencia</div>
              <div className="font-mono text-xs mt-1">{extraTarget}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => setExtraTarget(null)}>
                  Volver al original
                </Button>
                <Button size="sm" variant="ghost" onClick={handlePracticeMore}>
                  Otro más
                </Button>
              </div>
            </div>
          )}

          {result && (
            <div className={`rounded-xl p-3 text-sm ${result.pass ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100'}`}>
              <div className="font-medium">
                {result.pass ? '✓ Aprobado' : '✕ No alcanza 95%'} — {(result.acc * 100).toFixed(1)}% {isEval && `· racha ${prog?.passes ?? 0}/3`}
                {result.pass && isEval && (prog?.status === 'mastered' || prog?.status === 'completed') && ' · ¡Mastered!'}
              </div>
              {result.pass && isEval && (prog?.status === 'mastered' || prog?.status === 'completed') && (
                <div className="mt-1">¡Lección dominada! Siguiente: {nextLesson ? <Link to={`/leccion/${nextLesson.id}`} className="underline">{nextLesson.title} →</Link> : '¡Curso completado!'} · Próxima revisión {prog?.nextReviewAt ? new Date(prog.nextReviewAt).toLocaleDateString() : ''}</div>
              )}
              {!result.pass && isEval && <div className="mt-1 text-xs opacity-80">Racha reinicia. Sin subir dificultad — precisión antes que velocidad.</div>}
              {result.pass && !isEval && <div className="mt-1 text-xs opacity-80">¡Bien! Usa “Seguir →” (Ctrl+Enter) o “Practicar más” (Ctrl+P) para reforzar sin salir de la lección.</div>}
              {result.pass && !isEval && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={goNext} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Seguir → Siguiente bloque
                  </Button>
                  <Button size="sm" variant="outline" onClick={handlePracticeMore}>
                    Practicar más ejercicios
                  </Button>
                </div>
              )}
            </div>
          )}
          {showHelp && (
            <Card className="border-dashed bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Atajos — cómo seguir (shortcuts)</CardTitle>
                <CardDescription>Teclado completo sin mouse §30</CardDescription>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed space-y-1">
                <div className="grid gap-1 sm:grid-cols-2">
                  <div>
                    <Badge variant="outline" className="mr-1">
                      Enter
                    </Badge>{' '}
                    Evaluar
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-1">
                      Ctrl+Enter
                    </Badge>{' '}
                    Continuar / Seguir
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-1">
                      Alt+→
                    </Badge>{' '}
                    Siguiente bloque
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-1">
                      Alt+←
                    </Badge>{' '}
                    Anterior
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-1">
                      Ctrl+P
                    </Badge>{' '}
                    Practicar más ejercicios (genera variante con tus teclas débiles)
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-1">
                      Ctrl+R
                    </Badge>{' '}
                    Reiniciar lección
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-1">
                      ?
                    </Badge>{' '}
                    Mostrar/ocultar ayuda
                  </div>
                </div>
                <p className="text-muted-foreground pt-2">
                  Flujo: <span className="font-medium text-foreground">Evaluar (Enter) → si apruebas, “Seguir →”</span> avanza al siguiente bloque/sesión sin salir. “Practicar más” genera un ejercicio nuevo de la misma habilidad con dificultad {block?.difficulty ?? 1}/5 y tus bigramas débiles, sin repetir toda la lección (§7).
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Footer: why this practice? */}
      <Card className="border-dashed bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">¿Por qué esta práctica?</CardTitle>
        </CardHeader>
        <CardContent className="text-xs leading-relaxed text-muted-foreground">
          {prog?.weakPatterns && prog.weakPatterns.length > 0
            ? `Repetición espaciada: refuerzas ${prog.weakPatterns.slice(0, 3).join(', ')} (error adaptativo §7). Dificultad actual ${(block?.difficulty ?? 1)}/5.`
            : `Progresión principal: Typing → Neovim → Python → Go. Esta lección entrena ${lesson.skills?.join(', ') ?? lesson.id}. Dificultad ${(block?.difficulty ?? 1)}/5.`}
          {' · '} Mastery {masteryPct}% → {lvl}. Próxima sesión diaria se compondrá automáticamente según tu habilidad débil y revisiones vencidas.
        </CardContent>
      </Card>
    </div>
  );
}

function isCompletedLike(s: string): boolean {
  return s === 'completed' || s === 'mastered';
}
