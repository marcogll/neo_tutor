import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calcAccuracy, calcRhythm, buildKeystrokeLog } from '@/engines/typing/metrics';

// PRD §13.1 formatos
const FORMATS: Record<string, { label: string; lines: string[] }> = {
  letras: { label: 'Letras', lines: ['f j f j', 'a s d f j k l ñ', 'ffff jjjj'] },
  patrones: { label: 'Patrones', lines: ['fj dk sl añ', 'sdf jkl', 'asdf jklñ'] },
  silabas: { label: 'Sílabas', lines: ['la de en un', 'al la es el', 'ja da la sa'] },
  frases: { label: 'Frases', lines: ['la precisión construye la velocidad', 'el ritmo es la base', 'practica sin mirar'] },
  codigo: { label: 'Código', lines: ['const ritmo = crearPractica();', '() => {}', 'if (a) { return b; }'] },
  neovim: { label: 'Neovim', lines: ['Cambia lento por estable', 'w b e 0 ^ $', 'dd yy p'] },
};

const DURATIONS: Record<string, number> = { '5': 5 * 60 * 1000, '10': 10 * 60 * 1000, '20': 20 * 60 * 1000 };

export function Zen() {
  const [format, setFormat] = useState<keyof typeof FORMATS>('frases');
  const [duration, setDuration] = useState<keyof typeof DURATIONS>('5');
  const [running, setRunning] = useState(false);
  const [hideHints, setHideHints] = useState(false);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [times, setTimes] = useState<number[]>([]);
  const [started, setStarted] = useState<number | null>(null);
  const [finished, setFinished] = useState<{ acc: number; sd: number; wpm: number; chars: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const target = FORMATS[format]!.lines[idx % FORMATS[format]!.lines.length]!;
  const logs = useMemo(() => buildKeystrokeLog(target, input, [], times), [target, input, times]);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setFinishedFromState(), DURATIONS[duration]!);
    return () => clearTimeout(t);
  }, [running, duration]);

  function setFinishedFromState() {
    const acc = calcAccuracy(logs);
    const intervals = times.slice(1).map((t, i) => t - times[i]!);
    const sd = calcRhythm(intervals).sd;
    const elapsedMin = started ? (Date.now() - started) / 60000 : 1;
    setRunning(false);
    setFinished({ acc, sd, wpm: (logs.filter((l) => l.correct).length / 5) / elapsedMin, chars: logs.filter((l) => l.correct).length });
  }

  function start() {
    setRunning(true);
    setFinished(null);
    setStarted(Date.now());
    setInput('');
    setTimes([]);
    setIdx(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function onInput(v: string) {
    if (!running) return;
    setInput(v);
    setTimes((prev) => [...prev, performance.now()]);
    if (v.length >= target.length) {
      // PRD ZN003 — no interrumpir línea por error; avanzar
      setIdx((i) => i + 1);
      setInput('');
      setTimes([]);
    }
  }

  if (finished) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Zen — resumen</CardTitle>
          <CardDescription>ZN001 métricas ocultas durante, visibles al terminar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl border p-3"><div className="text-muted-foreground">Precisión</div><div className="text-lg font-semibold">{(finished.acc * 100).toFixed(1)}%</div></div>
            <div className="rounded-xl border p-3"><div className="text-muted-foreground">WPM</div><div className="text-lg font-semibold">{finished.wpm.toFixed(1)}</div></div>
            <div className="rounded-xl border p-3"><div className="text-muted-foreground">Ritmo sd</div><div className="text-lg font-semibold">{finished.sd.toFixed(0)} ms</div></div>
          </div>
          <div className="text-xs text-muted-foreground">Chars correctos: {finished.chars} · Formato {format} · {duration} min</div>
          <div className="flex gap-2">
            <Button onClick={() => setFinished(null)}>Otra sesión</Button>
            <Button variant="outline" onClick={() => { setFinished(null); setRunning(false); }}>Cerrar</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (running) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 py-12">
        <div className="text-xs text-muted-foreground">{FORMATS[format]!.label} · Zen — sin reloj visible ZN001 {hideHints ? '· hints ocultos ZN002' : ''}</div>
        {/* ZN003 continua aunque haya error — tenue */}
        <div className="text-center font-mono text-xl tracking-wide">
          {target.split('').map((ch, i) => {
            const typed = input[i];
            if (typed === undefined) return <span key={i} className="text-muted-foreground/40">{ch}</span>;
            return <span key={i} className={typed === ch ? 'text-foreground' : 'text-destructive/60'}>{ch}</span>;
          })}
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-foreground align-text-bottom" />
        </div>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => onInput(e.target.value)}
          className="h-10 w-full max-w-xl rounded-xl border border-input bg-transparent px-3 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <Button variant="ghost" size="sm" onClick={setFinishedFromState}>Terminar ahora</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Badge variant="muted" className="rounded-full">PRD §13 — Modo Zen ZN001-ZN004</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Zen</h1>
        <p className="text-sm text-muted-foreground">Una línea centrada, cursor claro y feedback tenue. Sin WPM ni cronómetro durante.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurar sesión</CardTitle>
          <CardDescription>Formatos §13.1 y duraciones §13.2</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 text-xs font-medium">Formato</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FORMATS).map(([k, v]) => (
                <Button key={k} variant={format === k ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => setFormat(k as never)}>{v.label}</Button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium">Duración</div>
            <div className="flex gap-2">
              {Object.keys(DURATIONS).map((d) => (
                <Button key={d} variant={duration === d ? 'secondary' : 'outline'} size="sm" onClick={() => setDuration(d as never)}>{d} min</Button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hideHints} onChange={(e) => setHideHints(e.target.checked)} />
            Ocultar teclado/manos/ayudas (ZN002)
          </label>
          <Button onClick={start}>Iniciar Zen — {FORMATS[format]!.label}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Vista previa</CardTitle></CardHeader>
        <CardContent className="font-mono text-sm text-muted-foreground">
          {FORMATS[format]!.lines.map((l) => <div key={l}>{l}</div>)}
        </CardContent>
      </Card>
    </div>
  );
}
