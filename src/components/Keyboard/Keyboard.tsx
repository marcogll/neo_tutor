import type { KeyboardLayout } from '@/content/layouts/types';
import { cn } from '@/lib/utils';

type Props = {
  layout: KeyboardLayout;
  highlightedCode?: string | null;
  errorCode?: string | null;
  pressedCode?: string | null;
  onKeySelect?: (code: string) => void;
};

const FINGER_DOT: Record<string, string> = {
  LP: 'bg-pink-400',
  LR: 'bg-violet-400',
  LM: 'bg-sky-400',
  LI: 'bg-emerald-400',
  RI: 'bg-amber-400',
  RM: 'bg-sky-400',
  RR: 'bg-violet-400',
  RP: 'bg-pink-400',
  LT: 'bg-zinc-400',
  RT: 'bg-zinc-400',
};

export function Keyboard({ layout, highlightedCode, errorCode, pressedCode, onKeySelect }: Props) {
  const rows = new Map<number, typeof layout.keys>();
  for (const k of layout.keys) {
    const arr = rows.get(k.row) ?? [];
    arr.push(k);
    rows.set(k.row, arr);
  }
  const sortedRows = [...rows.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div role="group" aria-label={`Teclado ${layout.name} ${layout.physical} ${layout.logical}`} className="flex min-w-[640px] flex-col gap-1.5">
      {sortedRows.map(([row, keys]) => (
        <div key={row} className="flex gap-1.5 justify-center flex-nowrap">
          {[...keys].sort((a, b) => a.col - b.col).map((k) => {
            const isTarget = k.code === highlightedCode;
            const isError = k.code === errorCode;
            const isPressed = k.code === pressedCode;
            return (
              <button
                key={k.code}
                type="button"
                data-code={k.code}
                data-finger={k.finger}
                aria-label={`${k.label} dedo ${k.finger} código ${k.code}${isTarget ? ' objetivo' : ''}${isError ? ' error' : ''}`}
                aria-pressed={isPressed}
                onClick={() => onKeySelect?.(k.code)}
                className={cn(
                  'relative flex h-9 items-center justify-center rounded-xl border px-2 font-mono text-[13px] font-medium transition-all',
                  'bg-card shadow-sm',
                  isTarget && 'border-foreground bg-foreground text-background ring-2 ring-foreground ring-offset-2',
                  isError && 'border-destructive bg-destructive/10 text-destructive',
                  isPressed && !isTarget && !isError && 'bg-accent',
                  !isTarget && !isError && 'border-border hover:bg-accent',
                )}
                style={{ minWidth: `${36 * (k.width ?? 1)}px`, flex: k.width && k.width > 1.2 ? `0 0 ${36 * k.width}px` : undefined }}
              >
                {k.label}
                <span className={cn('absolute bottom-1 right-1 size-1.5 rounded-full', FINGER_DOT[k.finger] ?? 'bg-zinc-300')} aria-hidden />
                {isTarget && <span aria-hidden className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]">●</span>}
                {isError && <span aria-hidden className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]">✕</span>}
              </button>
            );
          })}
        </div>
      ))}
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="size-2 rounded bg-foreground" /> objetivo</span>
        {' · '}<span className="inline-flex items-center gap-1"><span className="size-2 rounded bg-destructive" /> error</span>
        {' · punto = dedo recomendado'}
      </p>
    </div>
  );
}
