import { Link } from 'react-router-dom';
import { COURSE_BY_DOMAIN, INTEGRATION_COURSES } from '@/content/courses';
import { useProgressStore } from '@/storage/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { masteryLevel } from '@/domains/lesson';

const META = {
  typing: { title: 'Touch Typing — 10 lecciones', desc: 'Control completo del teclado → símbolos y fluidez completa', color: 'bg-foreground', label: 'Typing' },
  neovim: { title: 'Neovim — 9 lecciones', desc: 'Edición estructural sin mouse — verbo+objeto', color: 'bg-violet-600', label: 'Vim' },
  python: { title: 'Python — 7 lecciones', desc: 'Pensamiento computacional → CLI NeoInventory', color: 'bg-emerald-600', label: 'Python' },
  go: { title: 'Go — 7 lecciones', desc: 'Programación tipada, concurrente y de sistemas → API', color: 'bg-sky-600', label: 'Go' },
} as const;

function isCompletedLike(s: string): boolean {
  return s === 'completed' || s === 'mastered';
}

export function CourseList() {
  const { byId, isUnlocked, overall, overallByDomain } = useProgressStore();
  const ov = overall();

  // aggregate skills
  const typingOv = overallByDomain('typing');
  const vimOv = overallByDomain('neovim');
  const pyOv = overallByDomain('python');
  const goOv = overallByDomain('go');

  const totalMastered = Object.values(byId).filter((p) => isCompletedLike(p.status)).length;
  const developing = Object.values(byId).filter((p) => p.masteryScore >= 21 && p.masteryScore < 61).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Cursos — 33 lecciones</h1>
        <Badge variant="secondary" className="rounded-full">
          {ov.completed}/{ov.total} · {ov.pct}% · {totalMastered} mastered · {developing} developing
        </Badge>
      </div>

      {/* CoursePage top summary like §29 */}
      <Card className="border-dashed bg-muted/20">
        <CardHeader>
          <CardTitle className="text-base">Touch Typing</CardTitle>
          <CardDescription>
            {typingOv.completed} / {typingOv.total} lessons · {totalMastered} skills mastered · {developing} developing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Current: {COURSE_BY_DOMAIN.typing.find((l) => byId[l.id]?.status === 'in_progress')?.title ?? '—'}</span>
            <span>{typingOv.pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-foreground" style={{ width: `${typingOv.pct}%` }} />
          </div>
          {/* Needs work */}
          {(() => {
            const weak = Object.values(byId)
              .filter((p) => p.weakPatterns && p.weakPatterns.length > 0)
              .slice(0, 3);
            if (weak.length === 0) return <p className="text-xs text-muted-foreground">Needs work: — (sin debilidades registradas)</p>;
            return <p className="text-xs text-amber-700 dark:text-amber-300">Needs work: {weak.flatMap((p) => p.weakPatterns!.slice(0, 1)).join(' · ')}</p>;
          })()}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.entries(COURSE_BY_DOMAIN) as [keyof typeof COURSE_BY_DOMAIN, (typeof COURSE_BY_DOMAIN)[keyof typeof COURSE_BY_DOMAIN]][]).map(([domain, lessons]) => {
          const meta = META[domain];
          const done = lessons.filter((l) => isCompletedLike(byId[l.id]?.status ?? '')).length;
          const weakCount = lessons.filter((l) => (byId[l.id]?.masteryScore ?? 0) < 40 && (byId[l.id]?.attempts ?? 0) > 0).length;
          return (
            <Card key={domain} className="overflow-hidden">
              <div className={`h-1.5 ${meta.color}`} />
              <CardHeader>
                <CardTitle className="text-base">{meta.title}</CardTitle>
                <CardDescription>{meta.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {done}/{lessons.length} lecciones · {weakCount ? `${weakCount} débiles` : 'sin débiles'}
                  </span>
                  <span>{Math.round((done / lessons.length) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-foreground" style={{ width: `${(done / lessons.length) * 100}%` }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lessons.slice(0, 6).map((l) => {
                    const p = byId[l.id];
                    const unlocked = isUnlocked(l.id);
                    const st = p?.status ?? (unlocked ? 'available' : 'locked');
                    const ms = p?.masteryScore ?? 0;
                    const lvl = masteryLevel(ms);
                    return (
                      <Badge
                        key={l.id}
                        variant={isCompletedLike(st) ? 'default' : st === 'review' ? 'outline' : unlocked ? 'outline' : 'muted'}
                        className="text-xs"
                        title={`${l.title} · ${lvl} ${ms}% · ${st}`}
                      >
                        {l.id.split('-').pop()} {isCompletedLike(st) ? '✓' : st === 'review' ? '↻' : ''}
                      </Badge>
                    );
                  })}
                  {lessons.length > 6 && <Badge variant="muted">+{lessons.length - 6}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <Link to={domain === 'typing' ? '/leccion' : `/cursos/${domain}`}>Abrir</Link>
                  </Button>
                  {domain === 'neovim' && (
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/neovim">Lab</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progression map §22 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Skill Graph — progression §22: Touch Typing → Neovim → Python/Go
          </CardTitle>
          <CardDescription className="font-mono text-xs">home-left/home-right → both-hands → top-row → bottom-row → symbols → vim → python/go → system</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <div>Python y Go son rutas paralelas después de fundamentos teclado/edición (§2 diagrama).</div>
          <div className="flex gap-2">
            <Badge variant="secondary">Typing {typingOv.completed}/{typingOv.total}</Badge>
            <Badge variant="secondary">Vim {vimOv.completed}/{vimOv.total}</Badge>
            <Badge variant="secondary">Python {pyOv.completed}/{pyOv.total}</Badge>
            <Badge variant="secondary">Go {goOv.completed}/{goOv.total}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Proyectos de integración §12 — consolidación (no cuentan como lecciones nuevas)</CardTitle>
          <CardDescription>Terminal transcription · Edit configuration · Refactor with Vim · Python CLI · Go API</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {INTEGRATION_COURSES.map((it) => {
            const unlocked = isUnlocked(it.id);
            const p = byId[it.id];
            return (
              <Card key={it.id} className={`p-3 text-xs ${unlocked ? '' : 'opacity-60'}`}>
                <div className="font-medium">{it.title}</div>
                <div className="text-muted-foreground">{it.description}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant={isCompletedLike(p?.status ?? '') ? 'default' : unlocked ? 'outline' : 'muted'}>{p?.status ?? (unlocked ? 'available' : 'locked')}</Badge>
                  <Button size="sm" variant="outline" asChild disabled={!unlocked}>
                    <Link to={`/leccion/${it.id}`}>{unlocked ? 'Abrir' : '🔒 Bloqueado'}</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Contrato Lesson §23-26</CardTitle>
          <CardDescription>Sessions → blocks (recall/concept/position/isolation/pattern/combination/application/challenge/zen/debug/evaluation) · mastery 3 PASS · reviews 1/3/7/14/30 · difficulty 1..5</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
