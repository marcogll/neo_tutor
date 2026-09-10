import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnyLesson } from '@/content/courses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProgressStore } from '@/storage/progress';
import { checkPython, checkGo } from '@/engines/code/evaluator';

export function CodeLesson() {
  const { id } = useParams<{ id: string }>();
  const lesson = id ? getAnyLesson(id) : undefined;
  const { recordAttempt, byId } = useProgressStore();
  const [code, setCode] = useState(lesson?.blocks[0]?.content ?? '');
  const [res, setRes] = useState<{ ok: boolean; reason: string } | null>(null);

  if (!lesson || (lesson.domain !== 'python' && lesson.domain !== 'go')) {
    return <Card><CardHeader><CardTitle>No encontrado</CardTitle></CardHeader></Card>;
  }

  const prog = byId[lesson!.id];
  const isPython = lesson!.domain === 'python';

  function run() {
    const tokens = lesson!.blocks[0]?.content ? lesson!.blocks[0].content.split(/\W+/).filter(Boolean).slice(0, 3) : [];
    const r = isPython ? checkPython(code, tokens) : checkGo(code, tokens);
    setRes(r);
    recordAttempt(lesson!.id, r.ok ? 1 : 0, r.ok);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="muted" className="rounded-full">{lesson.domain} {lesson.id}</Badge>
          <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.objectives.join(' · ')} — {prog?.passes ?? 0}/3</p>
        </div>
        <Button variant="ghost" asChild><Link to="/cursos">← Cursos</Link></Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{lesson.blocks[0]?.prompt}</CardTitle>
          <CardDescription>{isPython ? 'Python — sin red PG002' : 'Go — gofmt GO001, sin red GO002'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={8} className="w-full rounded-xl border bg-muted p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" spellCheck={false} />
          <div className="flex gap-2">
            <Button onClick={run}>Evaluar</Button>
            <Button variant="outline" onClick={() => setCode(lesson.blocks[0]?.content ?? '')}>Reset</Button>
            <Badge variant={res?.ok ? 'default' : 'outline'} className="ml-auto">{res ? (res.ok ? '✓ OK' : `✕ ${res.reason}`) : 'sin evaluar'}</Badge>
          </div>
          {res?.ok && prog?.status === 'completed' && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">¡Dominado! Siguiente disponible.</div>}
          <p className="text-xs text-muted-foreground">Evaluación local sin ejecución remota hasta revisión de seguridad PG004/GO002. Futura: workers aislados con límites.</p>
        </CardContent>
      </Card>
    </div>
  );
}
