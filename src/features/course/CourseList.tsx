import { Link } from 'react-router-dom';
import { COURSE_BY_DOMAIN } from '@/content/courses';
import { useProgressStore } from '@/storage/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const META = {
  typing: { title: 'TrueType — Mecanografía', desc: '7 niveles, 10 lecciones, de fila central a código', color: 'bg-foreground' },
  neovim: { title: 'Vim — Edición modal', desc: '9 módulos de modos a búsqueda, motor determinista', color: 'bg-violet-600' },
  python: { title: 'Python — Futuro', desc: '7 módulos, ejecución aislada PG002, sin red', color: 'bg-emerald-600' },
  go: { title: 'Go — Futuro', desc: '7 módulos, gofmt GO001, concurrency determinista', color: 'bg-sky-600' },
} as const;

export function CourseList() {
  const { byId, isUnlocked, overall } = useProgressStore();
  const ov = overall();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Cursos</h1>
        <Badge variant="secondary" className="rounded-full">{ov.completed}/{ov.total} typing · {ov.pct}%</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.entries(COURSE_BY_DOMAIN) as [keyof typeof COURSE_BY_DOMAIN, typeof COURSE_BY_DOMAIN[keyof typeof COURSE_BY_DOMAIN]][]).map(([domain, lessons]) => {
          const meta = META[domain];
          const done = lessons.filter((l) => byId[l.id]?.status === 'completed').length;
          return (
            <Card key={domain} className="overflow-hidden">
              <div className={`h-1.5 ${meta.color}`} />
              <CardHeader>
                <CardTitle className="text-base">{meta.title}</CardTitle>
                <CardDescription>{meta.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground"><span>{done}/{lessons.length} lecciones</span><span>{Math.round((done / lessons.length) * 100)}%</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"><div className="h-full bg-foreground" style={{ width: `${(done / lessons.length) * 100}%` }} /></div>
                <div className="flex flex-wrap gap-1.5">
                  {lessons.slice(0, 4).map((l) => {
                    const unlocked = isUnlocked(l.id);
                    return <Badge key={l.id} variant={unlocked ? 'outline' : 'muted'} className="text-xs">{l.id.split('-').pop()}</Badge>;
                  })}
                  {lessons.length > 4 && <Badge variant="muted">+{lessons.length - 4}</Badge>}
                </div>
                <Button size="sm" asChild><Link to={domain === 'typing' ? '/leccion' : domain === 'neovim' ? '/neovim' : `/cursos/${domain}`}>Abrir</Link></Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Contrato común Lesson §18</CardTitle><CardDescription>Todos los dominios comparten id/version/domain/title/objectives/prerequisites/blocks/evaluator/mastery — Python/Go reservan PG001-GO004 sin ejecución remota hasta revisión de seguridad.</CardDescription></CardHeader>
      </Card>
    </div>
  );
}
