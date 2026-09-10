import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLesson, TYPING_ES } from '@/content/courses/typing-es';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { canRunLesson } from '@/engines/keyboard/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Keyboard } from '@/components/Keyboard/Keyboard';
import { Hands } from '@/components/Hands/Hands';
import { calcAccuracy, buildKeystrokeLog } from '@/engines/typing/metrics';
import { useProgressStore } from '@/storage/progress';

export function LessonRunner() {
  const { id } = useParams<{ id: string }>();
  const lesson = id ? getLesson(id) : undefined;
  const navigate = useNavigate();
  const profile = useKeyboardStore((s) => s.activeProfile);
  const { byId, isUnlocked, touch, setBlock, recordAttempt, resetLesson, lastLessonId, overall } = useProgressStore();

  const [blockIdx, setBlockIdx] = useState<number>(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ acc: number; pass: boolean } | null>(null);

  const required = useMemo(() => [...new Set((lesson?.blocks ?? []).flatMap((b) => b.targetKeys ?? []))], [lesson]);
  const blocked = useMemo(() => (lesson ? (profile ? !canRunLesson(profile as never, required) : true) : false), [lesson, profile, required]);
  const block = useMemo(() => lesson?.blocks[blockIdx], [lesson, blockIdx]);
  const target = useMemo(() => block?.content ?? block?.prompt ?? '', [block]);
  const isEval = block?.kind === 'evaluation';
  const prog = id ? byId[id] : undefined;
  const logs = useMemo(() => buildKeystrokeLog(target, input, [], []), [target, input]);
  const acc = useMemo(() => calcAccuracy(logs.slice(0, input.length)), [logs, input.length]);
  const nextCode = useMemo(() => (target[input.length]?.toLowerCase() ? `Key${target[input.length]!.toUpperCase()}` : null), [target, input.length]);
  const nextLesson = useMemo(() => (lesson ? TYPING_ES[TYPING_ES.findIndex((l) => l.id === lesson.id) + 1] : undefined), [lesson]);

  // FR002 guardar tras cada bloque + FR001 reanudar — hooks siempre en mismo orden
  useEffect(() => {
    if (id) {
      const saved = byId[id]?.currentBlock ?? 0;
      setBlockIdx(saved);
      touch(id);
    }
  }, [id]);

  useEffect(() => {
    if (lesson) setBlock(lesson.id, blockIdx);
  }, [lesson, blockIdx]);

  if (!lesson) {
    const ov = overall();
    const nextId = useProgressStore.getState().nextRecommended();
    return (
      <div className="mx-auto max-w-3xl space-y-6">
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
          {lastLessonId && (
            <Button size="sm" onClick={() => navigate(`/leccion/${lastLessonId}`)}>
              Continuar donde quedaste → {TYPING_ES.find((l) => l.id === lastLessonId)?.title}
            </Button>
          )}
          {nextId && nextId !== lastLessonId && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/leccion/${nextId}`)}>
              Siguiente recomendada → {TYPING_ES.find((l) => l.id === nextId)?.title}
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {TYPING_ES.map((l, idx) => {
            const p = byId[l.id];
            const unlocked = isUnlocked(l.id);
            const status = p?.status ?? (unlocked ? 'available' : 'locked');
            const pctBlocks = p ? Math.round(((p.currentBlock + (p.status === 'completed' ? 1 : 0)) / l.blocks.length) * 100) : 0;
            return (
              <Card key={l.id} className={status === 'completed' ? 'border-foreground/20 bg-accent/20' : !unlocked ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={status === 'completed' ? 'default' : status === 'in_progress' ? 'secondary' : unlocked ? 'outline' : 'muted'} className="rounded-full">
                      {idx + 1}. {status === 'completed' ? '✓' : status === 'locked' ? '🔒' : status === 'in_progress' ? '●' : '○'} {status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{p?.passes ?? 0}/3</span>
                  </div>
                  <CardTitle className="text-base leading-tight">{l.title}</CardTitle>
                  <CardDescription className="text-xs">{l.objectives.join(' · ')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Bloque {Math.min((p?.currentBlock ?? 0) + 1, l.blocks.length)}/{l.blocks.length}</span>
                      <span>{(p?.bestAccuracy ?? 0) ? `${(p!.bestAccuracy * 100).toFixed(0)}% mejor` : ''}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-foreground transition-all" style={{ width: `${pctBlocks}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={!unlocked} asChild={unlocked ? { href: `/leccion/${l.id}` } as never : undefined} onClick={unlocked ? undefined : () => {}}>
                      {unlocked ? (
                        <Link to={`/leccion/${l.id}`}>{status === 'in_progress' ? 'Continuar' : status === 'completed' ? 'Repasar' : 'Empezar'}</Link>
                      ) : (
                        <span>Bloqueada</span>
                      )}
                    </Button>
                    {p && (p.attempts > 0) && (
                      <Button variant="ghost" size="sm" onClick={() => resetLesson(l.id)} title="FR004 reiniciar habilidad sin borrar todo">
                        Reiniciar
                      </Button>
                    )}
                  </div>
                  {!unlocked && <p className="text-xs text-muted-foreground">Requiere: {l.prerequisites.join(', ')}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  function submit() {
    if (!lesson) return;
    const pass = acc >= lesson.mastery.minAccuracy;
    setResult({ acc, pass });
    if (isEval) recordAttempt(lesson.id, acc, pass);
    if (pass && blockIdx < lesson.blocks.length - 1 && !isEval) {
      setTimeout(() => { setBlockIdx((i) => i + 1); setInput(''); setResult(null); }, 400);
    }
  }

  if (blocked) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Teclado no compatible</CardTitle>
          <CardDescription>KB005 — requiere {required.join(', ')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild><Link to="/calibracion">Calibrar</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex gap-2">
            <Badge variant="muted" className="rounded-full">{lesson.id}</Badge>
            <Badge variant={prog?.status === 'completed' ? 'default' : 'secondary'} className="rounded-full">{prog?.status ?? 'available'}</Badge>
            <Badge variant="outline">{prog?.passes ?? 0}/3</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.objectives.join(' · ')} {prog?.bestAccuracy ? `· mejor ${(prog.bestAccuracy * 100).toFixed(0)}%` : ''}</p>
        </div>
        <Button variant="ghost" asChild><Link to="/leccion">← Lecciones</Link></Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Bloque {blockIdx + 1}/{lesson.blocks.length}</span>
        <div className="flex flex-1 gap-1.5">
          {lesson.blocks.map((b, i) => (
            <button
              key={b.id}
              onClick={() => { setBlockIdx(i); setInput(''); setResult(null); }}
              className={`h-1.5 flex-1 rounded-full transition ${i === blockIdx ? 'bg-foreground' : i < blockIdx ? 'bg-foreground/40' : 'bg-border'}`}
              aria-label={`Bloque ${i + 1} ${b.kind}`}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base capitalize">{block?.kind ?? ''} — bloque {blockIdx + 1}/{lesson.blocks.length}</CardTitle>
          <CardDescription>{block?.prompt ?? 'Escribe exactamente lo que ves.'} {isEval && '(evaluación 95%)'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {block?.kind === 'position' ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-accent/30 p-4 text-sm leading-relaxed">{block.prompt}</div>
              <p className="text-xs text-muted-foreground">Bloque informativo — observa dedos y posición, luego continúa. No se evalúa precisión.</p>
              <div className="overflow-x-auto pb-2">
                {profile && <Keyboard layout={profile as never} highlightedCode={block.targetKeys?.[0] ?? null} activeCodes={block.targetKeys ?? []} />}
              </div>
              {profile && block.targetKeys?.[0] && <Hands activeFinger={profile.keys.find((k) => k.code === block.targetKeys![0])?.finger ?? null} />}
              <div className="flex gap-2">
                <Button onClick={() => { setBlockIdx((i) => Math.min(lesson.blocks.length - 1, i + 1)); setResult(null); }}>Entendido → Siguiente</Button>
                <Button variant="ghost" onClick={() => setBlockIdx((i) => Math.max(0, i - 1))}>← Anterior</Button>
              </div>
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && input.length) submit(); }}
                placeholder={isEval ? 'Evaluación — Enter para evaluar' : 'Escribe aquí… Enter para evaluar'}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
              />

              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">{(acc * 100).toFixed(0)}% precisión</Badge>
                <Badge variant="outline">{input.length}/{target.length}</Badge>
                {prog?.bestAccuracy ? <Badge variant="outline">mejor {(prog.bestAccuracy * 100).toFixed(0)}%</Badge> : null}
              </div>

              <Separator />
              <div className="overflow-x-auto pb-2">
                {profile && <Keyboard layout={profile as never} highlightedCode={nextCode} activeCodes={block?.targetKeys ?? lesson.blocks.flatMap((b) => b.targetKeys ?? [])} />}
              </div>
              {profile && nextCode && <Hands activeFinger={profile.keys.find((k) => k.code === nextCode)?.finger ?? null} />}
            </>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={submit} disabled={input.length === 0}>Evaluar ↩</Button>
            <Button variant="outline" size="sm" onClick={() => { setInput(''); setResult(null); }}>Limpiar</Button>
            <Button variant="ghost" size="sm" onClick={() => { setBlockIdx((i) => Math.min(lesson.blocks.length - 1, i + 1)); setInput(''); setResult(null); }} disabled={blockIdx === lesson.blocks.length - 1}>Siguiente →</Button>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => resetLesson(lesson.id)}>Reiniciar lección</Button>
          </div>

          {result && (
            <div className={`rounded-xl p-3 text-sm ${result.pass ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100'}`}>
              <div className="font-medium">{result.pass ? '✓ Aprobado' : '✕ No alcanza 95%'} — {(result.acc * 100).toFixed(1)}% {isEval && `· racha ${prog?.passes ?? 0}/3`}</div>
              {result.pass && isEval && prog?.status === 'completed' && <div className="mt-1">¡Lección dominada! {nextLesson ? <Link to={`/leccion/${nextLesson.id}`} className="underline">Siguiente: {nextLesson.title} →</Link> : '¡Curso completado!'}</div>}
              {!result.pass && isEval && <div className="mt-1 text-xs opacity-80">Se reinicia la racha. Repite sin subir dificultad — precisión antes que velocidad.</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
