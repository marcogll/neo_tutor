import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from '@/components/Keyboard/Keyboard';
import { Hands } from '@/components/Hands/Hands';
import { LAYOUTS } from '@/content/layouts';
import { calcAccuracy, calcRhythm, buildKeystrokeLog } from '@/engines/typing/metrics';
import { Separator } from '@/components/ui/separator';

type TestId = 'home' | 'coordination' | 'habits';

const TESTS: Record<TestId, { title: string; target: string; desc: string }> = {
  home: { title: 'Fila central', desc: 'Asdf jklñ — retorno sin mirar', target: 'asdf jklñ' },
  coordination: { title: 'Coordinación', desc: 'Alternancia manos', target: 'fj dk sl añ' },
  habits: { title: 'Hábitos', desc: 'Precisión sin penalización', target: 'la casa es azul' },
};

export function Diagnostic() {
  const profile = useKeyboardStore((s) => s.activeProfile);
  const layout = profile ? (profile as unknown as typeof LAYOUTS['mac-ansi-us']) : LAYOUTS['mac-ansi-us'];
  const [active, setActive] = useState<TestId>('home');
  const [input, setInput] = useState('');
  const [times, setTimes] = useState<number[]>([]);
  const [done, setDone] = useState<Record<TestId, { acc: number; rhythm: number }>>({} as never);
  const target = TESTS[active].target;

  const logs = useMemo(() => buildKeystrokeLog(target, input, [], times), [target, input, times]);
  const acc = calcAccuracy(logs.slice(0, input.length));
  const rhythm = useMemo(() => {
    const intervals = times.slice(1).map((t, i) => t - times[i]!);
    return calcRhythm(intervals);
  }, [times]);

  function onChange(v: string) {
    const now = performance.now();
    setInput(v);
    setTimes((prev) => [...prev, now]);
    if (v.length >= target.length) {
      setDone((prev) => ({ ...prev, [active]: { acc, rhythm: rhythm.sd } }));
    }
  }

  if (!profile) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Calibra primero</CardTitle>
          <CardDescription>KB005 — el diagnóstico requiere un perfil activo</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild><Link to="/calibracion">Ir a calibración</Link></Button>
        </CardContent>
      </Card>
    );
  }

  const idx = logs.findIndex((l) => !l.correct && l.received !== '');
  const expectedCode = target[idx]?.toLowerCase() ? `Key${target[idx]!.toUpperCase()}` : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Badge variant="muted" className="rounded-full">PRD §10 — Diagnóstico</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Diagnóstico inicial</h1>
        <p className="text-sm text-muted-foreground">3 pruebas cortas sin penalización. Genera tu ruta inicial y SkillState.</p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(TESTS) as TestId[]).map((id) => (
          <Button key={id} variant={active === id ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => { setActive(id); setInput(''); setTimes([]); }}>
            {TESTS[id].title} {done[id] ? `✓ ${(done[id].acc * 100).toFixed(0)}%` : ''}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{TESTS[active].title}</CardTitle>
          <CardDescription>{TESTS[active].desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-muted p-4 font-mono text-sm tracking-wide">
            {target.split('').map((ch, i) => {
              const typed = input[i];
              const isError = typed !== undefined && typed !== ch;
              const isDone = typed !== undefined;
              return (
                <span key={i} className={isDone ? (isError ? 'text-destructive underline decoration-wavy' : 'text-foreground') : 'text-muted-foreground'}>
                  {ch}
                </span>
              );
            })}
          </div>

          <input
            value={input}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escribe aquí…"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">Precisión {(acc * 100).toFixed(0)}%</Badge>
            <Badge variant="outline">Ritmo sd {rhythm.sd.toFixed(0)}ms</Badge>
            <Badge variant="outline">Chars {input.length}/{target.length}</Badge>
          </div>

          <Separator />
          <Keyboard layout={layout as never} highlightedCode={expectedCode} errorCode={idx >= 0 ? `Key${target[idx]?.toUpperCase()}` : null} />
          <Hands activeFinger={layout.keys.find((k) => k.code === expectedCode)?.finger ?? null} />

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setInput(''); setTimes([]); }}>Reintentar</Button>
            {Object.keys(done).length === 3 && (
              <Button asChild size="sm"><Link to="/">Ver ruta inicial →</Link></Button>
            )}
          </div>
        </CardContent>
      </Card>

      {Object.keys(done).length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Resumen</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-sm">
            {(Object.keys(done) as TestId[]).map((k) => (
              <div key={k} className="rounded-xl border p-3">
                <div className="font-medium">{TESTS[k].title}</div>
                <div className="text-muted-foreground">{(done[k].acc * 100).toFixed(0)}% · sd {done[k].rhythm.toFixed(0)}ms</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
