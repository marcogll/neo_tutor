import { Link } from 'react-router-dom';
import { useProgressStore } from '@/storage/progress';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { TYPING_ES } from '@/content/courses/typing-es';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Progress() {
  const { byId, isUnlocked, overall, nextRecommended, resetLesson, resetAll } = useProgressStore();
  const profile = useKeyboardStore((s) => s.activeProfile);
  const ov = overall();
  const nextId = nextRecommended();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Badge variant="muted" className="rounded-full">PRD §15 — Motor adaptativo</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Progreso</h1>
        <p className="text-sm text-muted-foreground">Todo guardado local FR002. Toca una lección para continuar donde quedaste FR001.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumen</CardTitle>
          <CardDescription>{profile ? `${profile.name} · ${profile.physical} ${profile.logical}` : 'Sin perfil — ve a Calibración'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{ov.completed}</span>
            <span className="text-muted-foreground">/ {ov.total} completadas</span>
            <span className="ml-auto text-lg font-medium">{ov.pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-foreground transition-all" style={{ width: `${ov.pct}%` }} />
          </div>
          <div className="flex gap-2">
            {nextId && <Button size="sm" asChild><Link to={`/leccion/${nextId}`}>Continuar → {TYPING_ES.find((l) => l.id === nextId)?.title}</Link></Button>}
            <Button variant="ghost" size="sm" onClick={resetAll}>Reiniciar curso</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {TYPING_ES.map((l, idx) => {
          const p = byId[l.id];
          const unlocked = isUnlocked(l.id);
          const status = p?.status ?? 'locked';
          const bar = ((p?.currentBlock ?? 0) / l.blocks.length) * 100;
          return (
            <Card key={l.id} className={status === 'completed' ? 'bg-accent/20' : !unlocked ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={status === 'completed' ? 'default' : status === 'in_progress' ? 'secondary' : 'outline'} className="rounded-full">
                    {idx + 1}. {status}
                  </Badge>
                  <span className="ml-auto text-xs text-muted-foreground">{p?.passes ?? 0}/3 · {(p?.bestAccuracy ? `${(p.bestAccuracy * 100).toFixed(0)}%` : '')}</span>
                </div>
                <CardTitle className="text-sm leading-tight">{l.title}</CardTitle>
                <CardDescription className="text-xs">{l.objectives.join(' · ')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-foreground" style={{ width: `${bar}%` }} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={status === 'completed' ? 'ghost' : 'default'} disabled={!unlocked} asChild>
                    <Link to={`/leccion/${l.id}`}>{!unlocked ? '🔒 Bloqueada' : status === 'in_progress' ? 'Continuar' : status === 'completed' ? 'Repasar' : 'Empezar'}</Link>
                  </Button>
                  {p && p.attempts > 0 && <Button variant="ghost" size="sm" onClick={() => resetLesson(l.id)}>Reiniciar FR004</Button>}
                </div>
                {!unlocked && <p className="text-xs text-muted-foreground">Desbloquea completando: {l.prerequisites.join(', ')}</p>}
                {p?.lastAt && <p className="text-xs text-muted-foreground">Último: {new Date(p.lastAt).toLocaleDateString()}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">¿Cómo avanza?</CardTitle>
          <CardDescription>FR010 — explicación reproducible</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Cada lección requiere <strong>3 evaluaciones ≥95%</strong> seguidas. Si fallas, la racha vuelve a 0 (no se borra el resto). Al completar, la siguiente se desbloquea. Tu mejor precisión y bloque actual se guardan tras cada pulsación — recarga y sigues igual. FR004: puedes reiniciar una sola lección sin perder las demás.
        </CardContent>
      </Card>
    </div>
  );
}
