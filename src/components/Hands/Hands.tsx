import type { Finger } from '@/content/layouts/types';
import { cn } from '@/lib/utils';

const FINGERS: { id: Finger; label: string; hand: 'L' | 'R' }[] = [
  { id: 'LP', label: 'meñique L', hand: 'L' },
  { id: 'LR', label: 'anular L', hand: 'L' },
  { id: 'LM', label: 'medio L', hand: 'L' },
  { id: 'LI', label: 'índice L', hand: 'L' },
  { id: 'LT', label: 'pulgar L', hand: 'L' },
  { id: 'RT', label: 'pulgar R', hand: 'R' },
  { id: 'RI', label: 'índice R', hand: 'R' },
  { id: 'RM', label: 'medio R', hand: 'R' },
  { id: 'RR', label: 'anular R', hand: 'R' },
  { id: 'RP', label: 'meñique R', hand: 'R' },
];

export function Hands({ activeFinger }: { activeFinger?: Finger | null }) {
  return (
    <div role="group" aria-label="Manos y dedos recomendados" className="flex flex-wrap justify-center gap-6">
      {(['L', 'R'] as const).map((hand) => (
        <div key={hand} aria-label={`Mano ${hand === 'L' ? 'izquierda' : 'derecha'}`} className="flex items-end gap-1.5">
          {FINGERS.filter((f) => f.hand === hand).map((f) => {
            const active = f.id === activeFinger;
            return (
              <div
                key={f.id}
                data-finger={f.id}
                aria-label={`${f.label}${active ? ' activo' : ''}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex items-center justify-center rounded-xl border text-[10px] font-medium shadow-sm',
                  f.id.includes('T') ? 'h-9 w-7' : 'h-12 w-[22px]',
                  active ? 'border-foreground bg-foreground text-background' : 'bg-card border-border text-muted-foreground',
                )}
              >
                {f.id}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
