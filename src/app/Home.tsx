import { Link } from 'react-router-dom';
import { useProgressStore } from '@/storage/progress';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { ALL_COURSES } from '@/content/courses';
import { TYPING_ES } from '@/content/courses/typing-es';
import { getLessonSessions, masteryLevel } from '@/domains/lesson';
import { INTEGRATIONS } from '@/content/courses/integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Home() {
  const { byId, nextRecommended, overall, lastLessonId, dueReviews, weakSkills, isUnlocked } = useProgressStore();
  const profile = useKeyboardStore((s) => s.activeProfile);
  const ov = overall();
  const nextId = nextRecommended();
  const nextLesson = nextId ? ALL_COURSES.find((l) => l.id === nextId) : null;
  const lastLesson = lastLessonId ? ALL_COURSES.find((l) => l.id === lastLessonId) : null;
  const lastProg = lastLessonId ? byId[lastLessonId] : undefined;
  const lastSessions = lastLesson ? getLessonSessions(lastLesson) : [];
  const currentSessionTitle = lastProg && lastSessions[lastProg.currentSession]?.title;

  const due = dueReviews();
  const weak = weakSkills();
  const needsCalibration = !profile;

  // Daily session composition example
  const daily = [
    { label: 'Warmup', min: 2 },
    { label: 'Recall', min: 3 },
    { label: 'Habilidad actual', min: 8 },
    { label: 'Habilidad débil', min: 3 },
    { label: 'Application', min: 5 },
    { label: 'Challenge', min: 3 },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ¿Dónde estoy? + barra global */}
      <div className="space-y-3 rounded-2xl border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted" className="rounded-full">
            {ov.completed}/{ov.total} · {ov.pct}%
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            33 lecciones · Typing 10 · Vim 9 · Python 7 · Go 7
          </Badge>
          <span className="ml-auto text-xs text-muted-foreground">{profile ? `${profile.name}` : 'Sin calibrar'}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Primero controlo las teclas.</h1>
        <p className="text-sm text-muted-foreground">Después el editor. Después el código. Después sistemas. — Progreso {ov.pct}% (local-first, 0% pérdida)</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-foreground transition-all" style={{ width: `${ov.pct}%` }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {needsCalibration ? (
            <Button asChild>
              <Link to="/calibracion">1. Calibrar teclado →</Link>
            </Button>
          ) : nextLesson ? (
            <>
              <Button asChild>
                <Link to={`/leccion/${nextLesson.id}`}>Continuar → {nextLesson.title}</Link>
              </Button>
              {lastLesson && lastLesson.id !== nextLesson.id && (
                <Button variant="outline" asChild>
                  <Link to={`/leccion/${lastLesson.id}`}>Última: {lastLesson.title}</Link>
                </Button>
              )}
            </>
          ) : (
            <Badge variant="default" className="rounded-full">
              ¡Evolución completada! 🎉
            </Badge>
          )}
          <Button variant="ghost" asChild>
            <Link to="/progreso">Ver mapa de habilidades</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Filosofía: recordar → descubrir → practicar aislado → combinar → usar → resolver → demostrar dominio → volver después.
        </p>
      </div>

      {/* ¿Qué debo practicar? */}
      <Card className="border-foreground/20">
        <CardHeader>
          <CardTitle className="text-base">¿Qué debo practicar? — Sesión diaria</CardTitle>
          <CardDescription>Composición automática (ejemplo 15 min) — no es solo “continuar lección” §13</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* CONTINUAR */}
          {lastLesson && lastProg && (
            <div className="rounded-xl border bg-accent/30 p-3 text-sm">
              <div className="font-medium">CONTINUAR</div>
              <div>
                {lastLesson.title} · {currentSessionTitle ?? `Sesión ${lastProg.currentSession + 1}`} · Bloque {lastProg.currentBlock + 1}
              </div>
              <div className="text-xs text-muted-foreground">{lastSessions[lastProg.currentSession]?.estimatedMinutes ?? 8} min · {masteryLevel(lastProg.masteryScore)} · {lastProg.passes}/3 PASS</div>
              <Button size="sm" className="mt-2" asChild>
                <Link to={`/leccion/${lastLesson.id}`}>Continuar donde quedaste →</Link>
              </Button>
            </div>
          )}
          {/* REVISIÓN */}
          {due.length > 0 ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm dark:bg-amber-950">
              <div className="font-medium">REVISIÓN VENCIDA</div>
              {due.slice(0, 2).map((did) => {
                const l = ALL_COURSES.find((x) => x.id === did)!;
                const p = byId[did]!;
                return (
                  <div key={did} className="flex items-center justify-between py-1">
                    <span>
                      {l.title} · accuracy {(p.bestAccuracy * 100).toFixed(0)}% · {p.masteryScore}% {masteryLevel(p.masteryScore)}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/leccion/${did}`}>Repasar 2 min →</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : weak.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-card p-3 text-sm">
              <div className="font-medium">HABILIDAD DÉBIL</div>
              {weak.slice(0, 2).map((w) => {
                const l = ALL_COURSES.find((x) => x.id === w.lessonId)!;
                return (
                  <div key={w.lessonId} className="flex items-center justify-between py-1">
                    <span>
                      {l.title} — {(w.accuracy * 100).toFixed(0)}%
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/leccion/${w.lessonId}`}>Reforzar 3 min →</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-3 text-sm text-muted-foreground">Sin debilidades críticas — continúa con la siguiente habilidad.</div>
          )}

          {/* PRÓXIMO */}
          {nextLesson && (
            <div className="rounded-xl border p-3 text-sm">
              <div className="font-medium">PRÓXIMO</div>
              <div>
                {nextLesson.title} · {nextLesson.description ?? nextLesson.objectives.join(' · ')}
              </div>
              <div className="text-xs text-muted-foreground">Prerequisitos: {nextLesson.prerequisites.join(', ') || 'ninguno'}</div>
            </div>
          )}

          {/* Composición diaria visual */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {daily.map((d) => (
              <Badge key={d.label} variant="secondary" className="text-xs">
                {d.label} {d.min}′
              </Badge>
            ))}
            <span className="text-xs text-muted-foreground ml-auto">configurable: 5/10/15/20/30 min</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" asChild>
              <Link to="/zen">Iniciar Zen 5 min</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/leccion">Ver todas las lecciones</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ¿Por qué? */}
      <Card className="border-dashed bg-muted/20">
        <CardHeader>
          <CardTitle className="text-sm">¿Por qué esta práctica?</CardTitle>
          <CardDescription className="text-xs">Motor de recomendaciones §14 — prioridad: 1) habilidad crítica débil 2) revisión vencida 3) habilidad actual 4) prerrequisito deteriorado 5) siguiente</CardDescription>
        </CardHeader>
        <CardContent className="text-xs leading-relaxed text-muted-foreground">
          {nextLesson ? (
            <>
              Siguiente: <span className="font-medium text-foreground">{nextLesson.title}</span> porque {due.length ? 'hay revisión vencida' : weak.length ? 'hay habilidad débil' : 'es la siguiente habilidad desbloqueada'}.
              {' — '} La progresión real es: <span className="font-mono">KEY → PATTERN → WORD → TEXT → COMMAND → MOTION → EDIT → EXPRESSION → FUNCTION → PROGRAM → SYSTEM</span> §39.
            </>
          ) : (
            'Has completado la evolución. Mantén repetición espaciada +1/3/7/14/30 días.'
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { title: 'Calibración', desc: profile ? `✓ ${profile.name}` : '5 pasos', href: '/calibracion', done: !!profile },
          { title: 'Diagnóstico', desc: '3 tests sin penalización', href: '/diagnostico', done: false },
          { title: 'Zen', desc: '6 formatos · 5/10/20 min · sin métricas durante', href: '/zen', done: false },
        ].map((c) => (
          <Card key={c.title} className={c.done ? 'bg-accent/20' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {c.title} {c.done ? '✓' : ''}
              </CardTitle>
              <CardDescription className="text-xs">{c.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" asChild>
                <Link to={c.href}>Abrir →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Lecciones recientes · Touch Typing</CardTitle>
          <CardDescription>Progreso por sesión — recuerda → domina</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {TYPING_ES.slice(0, 6).map((l) => {
            const p = byId[l.id];
            const sLabel = p ? masteryLevel(p.masteryScore) : 'locked';
            return (
              <Link key={l.id} to={`/leccion/${l.id}`} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-accent">
                <span className="truncate">{l.title}</span>
                <Badge variant={p?.status === 'mastered' || p?.status === 'completed' ? 'default' : p?.status === 'review' ? 'outline' : 'outline'} className="ml-2 shrink-0">
                  {sLabel} {p ? `${p.masteryScore}%` : ''}
                </Badge>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Proyectos de integración §12 — no cuentan como lecciones</CardTitle>
          <CardDescription>Consolidan conocimientos — se desbloquean tras hitos</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-xs">
          {INTEGRATIONS.map((it) => {
            const unlocked = isUnlocked(it.id) || it.prerequisites.every((p) => {
              const s = byId[p]?.status;
              return s === 'mastered' || s === 'completed';
            });
            return (
              <Badge key={it.id} variant={unlocked ? 'secondary' : 'outline'} className="text-xs">
                <Link to={`/leccion/${it.id}`} className={unlocked ? '' : 'opacity-60'}>
                  {it.title} {unlocked ? '→' : '🔒'}
                </Link>
              </Badge>
            );
          })}
          <Button size="sm" asChild className="ml-auto">
            <Link to="/cursos">Ver cursos por dominio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
