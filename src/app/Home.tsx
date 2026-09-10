import { Link } from 'react-router-dom';
import { useProgressStore } from '@/storage/progress';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { TYPING_ES } from '@/content/courses/typing-es';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Home() {
  const { byId, nextRecommended, overall, lastLessonId } = useProgressStore();
  const profile = useKeyboardStore((s) => s.activeProfile);
  const ov = overall();
  const nextId = nextRecommended();
  const nextLesson = TYPING_ES.find((l) => l.id === nextId);
  const lastLesson = lastLessonId ? TYPING_ES.find((l) => l.id === lastLessonId) : null;

  const needsCalibration = !profile;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-3 rounded-2xl border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted" className="rounded-full">{ov.completed}/{ov.total} lecciones</Badge>
          <Badge variant="secondary" className="rounded-full">{ov.pct}%</Badge>
          <span className="ml-auto text-xs text-muted-foreground">{profile ? `${profile.name}` : 'Sin calibrar'}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Mecanografía táctil.</h1>
        <p className="text-sm text-muted-foreground">Precisión antes que velocidad. Tu avance se guarda solo FR002 — recarga y continúas FR001.</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-foreground transition-all" style={{ width: `${ov.pct}%` }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {needsCalibration ? (
            <Button asChild><Link to="/calibracion">1. Calibrar teclado →</Link></Button>
          ) : nextLesson ? (
            <>
              <Button asChild><Link to={`/leccion/${nextLesson.id}`}>Continuar → {nextLesson.title}</Link></Button>
              {lastLesson && lastLesson.id !== nextLesson.id && <Button variant="outline" asChild><Link to={`/leccion/${lastLesson.id}`}>Última: {lastLesson.title}</Link></Button>}
            </>
          ) : (
            <Badge variant="default" className="rounded-full">¡Curso completado! 🎉</Badge>
          )}
          <Button variant="ghost" asChild><Link to="/progreso">Ver progreso</Link></Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { title: 'Calibración', desc: profile ? `✓ ${profile.name}` : '5 pasos', href: '/calibracion', done: !!profile },
          { title: 'Diagnóstico', desc: '3 tests rápidos', href: '/diagnostico', done: false },
          { title: 'Zen', desc: 'Sin reloj, con resumen', href: '/zen', done: false },
        ].map((c) => (
          <Card key={c.title} className={c.done ? 'bg-accent/20' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{c.title} {c.done ? '✓' : ''}</CardTitle>
              <CardDescription className="text-xs">{c.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" asChild><Link to={c.href}>Abrir →</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Lecciones recientes</CardTitle>
          <CardDescription>Toque para continuar donde quedaste · Cursos completos por dominio</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {TYPING_ES.slice(0, 4).map((l) => {
            const p = byId[l.id];
            return (
              <Link key={l.id} to={`/leccion/${l.id}`} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-accent">
                <span className="truncate">{l.title}</span>
                <Badge variant={p?.status === 'completed' ? 'default' : 'outline'} className="ml-2 shrink-0">{p?.status ?? 'locked'}</Badge>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Cursos completos</CardTitle>
          <CardDescription>Typing 10 · Vim 9 · Python 7 · Go 7 — todo sobre Lesson §18</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild><Link to="/cursos">Ver todos los cursos</Link></Button>
          <Button variant="outline" size="sm" asChild><Link to="/code/python-es-01">Python demo</Link></Button>
          <Button variant="outline" size="sm" asChild><Link to="/code/go-es-01">Go demo</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
