import { useEffect, useMemo, useRef, useState } from 'react';
import { LAYOUTS, type LayoutId } from '@/content/layouts';
import { inferLayout, type CalibrationAnswers } from '@/engines/keyboard/detect';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { captureFromKeyboardEvent } from '@/engines/keyboard/capture';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Keyboard } from '@/components/Keyboard/Keyboard';
import { Hands } from '@/components/Hands/Hands';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'A · Z · Q', desc: 'Posición base QWERTY', keys: ['KeyA', 'KeyZ', 'KeyQ'] as const },
  { id: 2, label: 'Ñ / ;', desc: 'ES vs US', keys: ['Semicolon'] as const },
  { id: 3, label: '< >', desc: 'ISO (IntlBackslash)', keys: ['IntlBackslash'] as const },
  { id: 4, label: '⌘ · ⌥', desc: 'Modificadores Mac', keys: ['MetaLeft', 'AltLeft'] as const },
  { id: 5, label: 'Confirmar', desc: 'Elige layout', keys: [] as const },
] as const;

export function CalibrationWizard() {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState<Map<string, string>>(new Map());
  const [codes, setCodes] = useState<Set<string>>(new Set());
  const setLayout = useKeyboardStore((s) => s.setLayout);
  const active = useKeyboardStore((s) => s.activeProfile);
  const inputRef = useRef<HTMLInputElement>(null);

  const answers: CalibrationAnswers = useMemo(
    () => ({
      q: events.get('KeyQ') ?? '',
      a: events.get('KeyA') ?? '',
      z: events.get('KeyZ') ?? '',
      special: events.get('Semicolon') ?? '',
      isoKey: events.get('IntlBackslash') ?? '',
      backquote: events.get('Backquote') ?? '',
    }),
    [events],
  );

  const detection = useMemo(() => {
    const keys = new Map(events);
    return inferLayout(
      { codes, keys, platform: navigator.platform, hasGetLayoutMap: !!(navigator as unknown as { keyboard?: unknown }).keyboard },
      answers,
    );
  }, [codes, events, answers]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const c = captureFromKeyboardEvent(e.nativeEvent);
    setEvents((prev) => new Map(prev).set(c.code, c.key));
    setCodes((prev) => new Set(prev).add(c.code));
  }

  const suggested = detection.suggested;
  const activeId = active?.id as LayoutId | undefined;
  const previewLayout = active ? active : LAYOUTS[suggested];
  const lastCode = [...codes].at(-1) ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Badge variant="muted" className="rounded-full">PRD §11 — Calibración</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Calibración del teclado</h1>
        <p className="text-sm text-muted-foreground">
          No afirmamos el modelo exacto. Sigue los pasos y confirma visualmente. Propuesta:{' '}
          <span className="font-medium text-foreground">{LAYOUTS[suggested].name}</span>{' '}
          <Badge variant={detection.confidence === 'high' ? 'default' : 'secondary'} className="ml-1">{detection.confidence}</Badge>
        </p>
      </div>

      {/* Steps — Mac segmented control */}
      <div className="flex gap-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            aria-current={step === s.id ? 'step' : undefined}
            className={cn(
              'flex-1 rounded-xl border px-3 py-3 text-left transition',
              step === s.id ? 'bg-foreground text-background border-foreground shadow-sm' : 'bg-card hover:bg-accent',
            )}
          >
            <div className={cn('text-xs font-medium', step === s.id ? 'text-background/70' : 'text-muted-foreground')}>Paso {s.id}</div>
            <div className="text-sm font-semibold">{s.label}</div>
            <div className={cn('text-xs', step === s.id ? 'text-background/60' : 'text-muted-foreground')}>{s.desc}</div>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{STEPS[step - 1]?.label}</CardTitle>
          <CardDescription>{STEPS[step - 1]?.desc} — haz foco en el input y pulsa las teclas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            ref={inputRef}
            onKeyDown={onKeyDown}
            placeholder="Pulsa aquí las teclas del paso actual…"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {(STEPS[step - 1]?.keys.length ?? 0) > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(STEPS[step - 1]?.keys ?? []).map((k) => (
                <Badge key={k} variant={codes.has(k as string) ? 'default' : 'outline'} className="font-mono">
                  {k} → {events.get(k as string) ?? '…'} {codes.has(k as string) ? '✓' : ''}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>← Anterior</Button>
            <Button variant="outline" size="sm" onClick={() => setStep((s) => Math.min(5, s + 1))} disabled={step === 5}>Siguiente →</Button>
            <Button variant="ghost" size="sm" onClick={() => { setEvents(new Map()); setCodes(new Set()); setStep(1); }}>Reiniciar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview visual — teclado + manos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vista previa — {previewLayout.name}</CardTitle>
          <CardDescription>Tecla objetivo con anillo · punto = dedo · ✕ = error. Manos abajo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Keyboard layout={previewLayout} highlightedCode={[...codes].at(-1) ?? null} pressedCode={lastCode} />
          <Separator />
          <Hands activeFinger={previewLayout.keys.find((k) => k.code === lastCode)?.finger ?? null} />
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Razones de la propuesta</summary>
            <ul className="mt-2 list-disc pl-4">
              {detection.reasons.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <p className="mt-2 font-mono">codes: {[...codes].join(', ') || '—'} — keys: {[...events.entries()].map(([c,k])=>`${c}=${k}`).join(', ') || '—'}</p>
          </details>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Confirmar teclado</CardTitle>
          <CardDescription>Elegí el que coincide con tu hardware. Se guarda versionado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(Object.keys(LAYOUTS) as LayoutId[]).map((id) => (
            <Button
              key={id}
              variant={activeId === id ? 'default' : suggested === id ? 'secondary' : 'outline'}
              onClick={() => setLayout(id)}
              aria-pressed={activeId === id}
              className="rounded-full"
            >
              {LAYOUTS[id].name} {suggested === id ? '★' : ''} {activeId === id ? '✓' : ''}
            </Button>
          ))}
        </CardContent>
      </Card>

      {active && (
        <div className="rounded-xl bg-foreground px-4 py-3 text-sm text-background">
          Perfil activo: <strong>{active.name}</strong> — {active.physical} {active.logical} · {active.keys.length} teclas · v{active.version}
        </div>
      )}
    </div>
  );
}
