import { useMemo, useState } from 'react';
import { CHALLENGES, evaluate } from '@/engines/vim/evaluator';
import { createState, lineEnd, lineStart, move, type VimState, toText, insertMode, normalMode, insertChar, deleteChar, deleteLine, undo } from '@/engines/vim/state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';

function applyKeys(initial: VimState, seq: string): VimState {
  let s = initial;
  for (const ch of seq) {
    if (ch === 'h' || ch === 'j' || ch === 'k' || ch === 'l') s = move(s, ch as never);
    else if (ch === '0') s = lineStart(s);
    else if (ch === '$') s = lineEnd(s);
    else if (ch === 'w') {
      // simplificado w
      const t = toText(s);
      const off = s.cursor.col + 1;
      const idx = t.slice(off).search(/\w/);
      if (idx !== -1) s = { ...s, cursor: { ...s.cursor, col: off + idx } };
    }
    else if (ch === 'i') s = insertMode(s);
    else if (ch === '\x1b') s = normalMode(s);
    else if (ch === 'x') s = deleteChar(s);
    else if (seq.slice(seq.indexOf(ch)).startsWith('dd')) { s = deleteLine(s); break; }
    else if (s.mode === 'insert') s = insertChar(s, ch);
  }
  return s;
}

export function Lab() {
  const [challengeId, setChallengeId] = useState(CHALLENGES[0]!.id);
  const challenge = useMemo(() => CHALLENGES.find((c) => c.id === challengeId)!, [challengeId]);
  const [seq, setSeq] = useState('');
  const [hintIdx, setHintIdx] = useState(0);
  const [blockArrows, setBlockArrows] = useState(true);

  const initial = useMemo(() => createState(challenge.initial), [challenge]);
  const final = useMemo(() => applyKeys(initial, seq), [initial, seq]);
  const result = useMemo(() => evaluate(challenge, final, seq), [challenge, final, seq]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Badge variant="muted" className="rounded-full">PRD §14 — Simulador determinista</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Laboratorio Neovim</h1>
        <p className="text-sm text-muted-foreground">Motor propio sobre texto. No es Neovim real. Evalúa texto final + secuencia + eficiencia.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CHALLENGES.map((c) => (
          <Button key={c.id} variant={c.id === challengeId ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => { setChallengeId(c.id); setSeq(''); setHintIdx(0); }}>
            {c.title}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {challenge.title}
            <Badge variant={final.mode === 'normal' ? 'secondary' : 'default'} className="rounded-full">NV001 modo: {final.mode}</Badge>
            <Badge variant="outline">{result.efficiency.toFixed(0)}% eficiencia</Badge>
          </CardTitle>
          <CardDescription>Objetivo: convierte <Kbd>{challenge.initial}</Kbd> en <Kbd>{challenge.expected}</Kbd> · óptimo {challenge.optimalKeystrokes} pulsaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Superficie CodeMirror minimal — textarea + modo persistente */}
          <div className="rounded-xl border bg-card p-4 font-mono text-sm">
            <div className="mb-2 flex gap-2 text-xs text-muted-foreground">
              <span>-- {final.mode.toUpperCase()} --</span>
              <span>línea {final.cursor.line + 1} col {final.cursor.col + 1}</span>
              {blockArrows && <Badge variant="outline" className="ml-auto">NV004 flechas bloqueadas</Badge>}
            </div>
            <pre className="whitespace-pre-wrap break-words">{toText(final) || ' '}</pre>
            <div className="mt-2 h-0.5 w-full bg-border">
              <div className="h-0.5 bg-foreground" style={{ width: `${Math.min(100, (seq.length / Math.max(1, challenge.optimalKeystrokes)) * 100)}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['h', 'j', 'k', 'l', 'w', '0', '$', 'i', 'x', 'dd', 'u', 'Esc'].map((k) => (
              <Button
                key={k}
                variant="outline"
                size="sm"
                className="h-7 rounded-full font-mono text-xs"
                onClick={() => {
                  if (blockArrows && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) return;
                  if (k === 'Esc') setSeq((s) => s + '\x1b');
                  else if (k === 'u') {
                    void undo(final);
                  } else setSeq((s) => s + k);
                }}
              >
                {k}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={seq.replaceAll('\x1b', '<Esc>')}
              onChange={(e) => setSeq(e.target.value.replaceAll('<Esc>', '\x1b'))}
              placeholder="Escribe secuencia (ej: amundo<Esc>)"
              className="flex h-9 flex-1 rounded-xl border border-input bg-background px-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button variant="outline" onClick={() => setSeq('')}>Limpiar</Button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant={result.textMatch ? 'default' : 'outline'}>{result.textMatch ? '✓ texto ok' : '✕ texto no coincide'}</Badge>
            <Badge variant="secondary">{result.used} pulsaciones / {challenge.optimalKeystrokes} óptimas</Badge>
            <Badge variant={result.success ? 'default' : 'secondary'}>{result.success ? '✓ éxito' : '—'}</Badge>
            <label className="ml-auto flex items-center gap-1">
              <input type="checkbox" checked={blockArrows} onChange={(e) => setBlockArrows(e.target.checked)} /> bloquear flechas NV004
            </label>
          </div>

          <Separator />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setHintIdx((i) => Math.min(3, i + 1))}>NV003 pista {hintIdx + 1}/3</Button>
            {hintIdx > 0 && <span className="text-sm text-muted-foreground">{challenge.hint.slice(0, Math.floor((hintIdx / 3) * challenge.hint.length))}…</span>}
          </div>

          <details className="text-xs text-muted-foreground">
            <summary>NV005 historial reproducible</summary>
            <pre className="mt-2 rounded bg-muted p-2 font-mono">{JSON.stringify({ seq, final: toText(final), expected: challenge.expected }, null, 2)}</pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
