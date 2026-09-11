import { Link } from 'react-router-dom';
import { useProgressStore } from '@/storage/progress';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { ALL_COURSES } from '@/content/courses';
import { masteryLevel } from '@/domains/lesson';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function isCompletedLike(s: string): boolean {
  return s === 'completed' || s === 'mastered';
}

export function Progress() {
  const { byId, isUnlocked, overall, nextRecommended, resetLesson, resetAll, dueReviews, weakSkills, skillStates, errorStats } = useProgressStore();
  const profile = useKeyboardStore((s) => s.activeProfile);
  const ov = overall();
  const nextId = nextRecommended();
  const due = dueReviews();
  const weak = weakSkills();

  const masteryBuckets = {
    automatic: Object.values(byId).filter((p) => p.masteryScore >= 96).length,
    strong: Object.values(byId).filter((p) => p.masteryScore >= 81 && p.masteryScore < 96).length,
    proficient: Object.values(byId).filter((p) => p.masteryScore >= 61 && p.masteryScore < 81).length,
    developing: Object.values(byId).filter((p) => p.masteryScore >= 41 && p.masteryScore < 61).length,
    learning: Object.values(byId).filter((p) => p.masteryScore >= 21 && p.masteryScore < 41).length,
    introduced: Object.values(byId).filter((p) => (p.masteryScore ?? 0) < 21 && p.attempts > 0).length,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Badge variant="muted" className="rounded-full">Curriculum §21 — Mastery & Spaced Repetition</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Progreso</h1>
        <p className="text-sm text-muted-foreground">Mapas por tecla/dedo/bigrama, evolución y repetición espaciada +1/3/7/14/30. Todo local FR002.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumen global — 33 lecciones</CardTitle>
          <CardDescription>{profile ? `${profile.name} · ${profile.physical} ${profile.logical}` : 'Sin perfil — ve a Calibración'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{ov.completed}</span>
            <span className="text-muted-foreground">/ {ov.total} masterizadas</span>
            <span className="ml-auto text-lg font-medium">{ov.pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-foreground transition-all" style={{ width: `${ov.pct}%` }} />
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <Badge variant="default">automatic {masteryBuckets.automatic}</Badge>
            <Badge variant="secondary">strong {masteryBuckets.strong}</Badge>
            <Badge variant="outline">proficient {masteryBuckets.proficient}</Badge>
            <Badge variant="muted">developing {masteryBuckets.developing}</Badge>
            <Badge variant="muted">learning {masteryBuckets.learning}</Badge>
            <Badge variant="outline">introduced {masteryBuckets.introduced}</Badge>
          </div>
          <div className="flex gap-2">
            {nextId && (
              <Button size="sm" asChild>
                <Link to={`/leccion/${nextId}`}>Continuar → {ALL_COURSES.find((l) => l.id === nextId)?.title}</Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={resetAll}>
              Reiniciar todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {due.length > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
          <CardHeader>
            <CardTitle className="text-sm">Revisiones vencidas — spaced repetition §6</CardTitle>
            <CardDescription>{due.length} habilidad(es) con nextReviewAt pasado</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {due.map((did) => (
              <Button key={did} size="sm" variant="outline" asChild>
                <Link to={`/leccion/${did}`}>↻ {ALL_COURSES.find((l) => l.id === did)?.title}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {weak.length > 0 && (
        <Card className="border-violet-200 bg-violet-50/40 dark:bg-violet-950/20">
          <CardHeader>
            <CardTitle className="text-sm">Habilidades débiles — adaptación §7</CardTitle>
            <CardDescription>Error por tecla/bigram/hand/finger → ejercicios sin repetir toda la lección</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {weak.map((w) => {
              const p = byId[w.lessonId]!;
              return (
                <div key={w.lessonId} className="flex items-center justify-between rounded-xl border bg-card px-3 py-2 text-sm">
                  <span>{ALL_COURSES.find((l) => l.id === w.lessonId)?.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{(w.accuracy * 100).toFixed(0)}% · {p.masteryScore}% {masteryLevel(p.masteryScore)}</Badge>
                    <Badge variant="muted">{p.weakPatterns?.slice(0, 2).join(', ') ?? '—'}</Badge>
                  </div>
                </div>
              );
            })}
            {Object.entries(errorStats).slice(0, 5).map(([k, v]) => (
              <div key={k} className="text-xs text-muted-foreground">
                {v.target} → {v.mistypedAs ?? '∅'} · {v.count}× · {v.context} {v.movement ? `· ${v.movement}` : ''}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {ALL_COURSES.slice(0, 12).map((l) => {
          const p = byId[l.id];
          const unlocked = isUnlocked(l.id);
          const raw = p?.status ?? 'locked';
          const status = raw === 'completed' ? 'mastered' : raw;
          const mastery = p?.masteryScore ?? 0;
          const lvl = masteryLevel(mastery);
          const totalBlocks = (l.sessions?.reduce((a, s) => a + s.blocks.length, 0) ?? l.blocks.length) || 1;
          const cur = p ? p.currentSession * 4 + p.currentBlock : 0;
          const bar = Math.min(100, (cur / totalBlocks) * 100);
          return (
            <Card key={l.id} className={isCompletedLike(status) ? 'bg-accent/20 border-emerald-200' : status === 'review' ? 'border-amber-200 bg-amber-50/30' : !unlocked ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={isCompletedLike(status) ? 'default' : status === 'in_progress' ? 'secondary' : status === 'review' ? 'outline' : 'outline'} className="rounded-full">
                    {status}
                  </Badge>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {p?.passes ?? 0}/3 · {mastery}% {lvl} · {(p?.bestAccuracy ? `${(p.bestAccuracy * 100).toFixed(0)}%` : '')}
                  </span>
                </div>
                <CardTitle className="text-sm leading-tight">
                  {l.title}
                </CardTitle>
                <CardDescription className="text-xs">{l.description ?? l.objectives.join(' · ')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-foreground" style={{ width: `${bar}%` }} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={isCompletedLike(status) ? 'ghost' : 'default'} disabled={!unlocked} asChild>
                    <Link to={l.domain === 'typing' ? `/leccion/${l.id}` : l.domain === 'neovim' ? `/leccion/${l.id}` : `/code/${l.id}`}>
                      {!unlocked ? '🔒 Bloqueada' : isCompletedLike(status) ? 'Repasar' : status === 'review' ? 'Revisión' : 'Continuar'}
                    </Link>
                  </Button>
                  {p && p.attempts > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => resetLesson(l.id)}>
                      Reiniciar
                    </Button>
                  )}
                </div>
                {!unlocked && <p className="text-xs text-muted-foreground">Requiere: {l.prerequisites.join(', ')}</p>}
                {p?.nextReviewAt && <p className="text-xs text-muted-foreground">Próxima revisión: {new Date(p.nextReviewAt).toLocaleDateString()} · {p.reviewCount ?? 0}/5</p>}
                {p?.lastAt && <p className="text-xs text-muted-foreground">Último: {new Date(p.lastAt).toLocaleDateString()}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill Graph §22</CardTitle>
          <CardDescription>home-right → home-left → both-hands → top-left → top-right → bottom-row → fluency → shift → symbols → full-fluency → vim → python → go → system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(skillStates).slice(0, 6).map(([k, v]) => (
              <div key={k} className="rounded-xl border px-3 py-2 text-xs">
                <div className="font-medium">
                  {k} — {v.mastery}% {masteryLevel(v.mastery)}
                </div>
                <div className="text-muted-foreground">
                  {v.attempts} intentos · {v.successfulAttempts} éxitos · próx {new Date(v.nextReviewAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          {Object.keys(skillStates).length === 0 && <p className="text-xs text-muted-foreground">Aún sin habilidades registradas — completa lecciones para poblar el skill graph.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">¿Cómo avanza? §5,6,16,21</CardTitle>
          <CardDescription>FR010 — explicación reproducible + mastery</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground space-y-2">
          <div>Cada habilidad guarda accuracy, attempts, successfulAttempts, mastery (0–100), lastPracticedAt, nextReviewAt, weakPatterns.</div>
          <div>
            Niveles: 0–20 introduced · 21–40 learning · 41–60 developing · 61–80 proficient · 81–95 strong · 96–100 automatic.
          </div>
          <div>3 PASS (≥95% + ≤3 errores críticos) pueden ocurrir en sesiones diferentes. Después spaced repetition +1/3/7/14/30 días introduce recall dentro de lecciones posteriores.</div>
          <div>Errores se clasifican motor/memory/concept/syntax/logic/navigation/attention (§16) y generan ejercicios sin repetir toda la lección (§7).</div>
        </CardContent>
      </Card>
    </div>
  );
}
