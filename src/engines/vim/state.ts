// PRD §14 — motor determinista, no emula Neovim real
export type VimMode = 'normal' | 'insert' | 'visual' | 'command';

export interface VimState {
  mode: VimMode;
  cursor: { line: number; col: number };
  buffer: string[]; // líneas
  history: string[][]; // para u / Ctrl-r
  future: string[][]; // redo
  lastSearch?: string;
}

export function createState(initial: string): VimState {
  return {
    mode: 'normal',
    cursor: { line: 0, col: 0 },
    buffer: initial.split('\n'),
    history: [],
    future: [],
  };
}

export function toText(s: VimState): string {
  return s.buffer.join('\n');
}

function pushHistory(s: VimState): VimState {
  return { ...s, history: [...s.history, [...s.buffer]], future: [] };
}
function clampCursor(s: VimState): VimState {
  const line = Math.max(0, Math.min(s.buffer.length - 1, s.cursor.line));
  const col = Math.max(0, Math.min((s.buffer[line]?.length ?? 0), s.cursor.col));
  return { ...s, cursor: { line, col } };
}

// movimientos básicos h j k l
export function move(s: VimState, dir: 'h' | 'j' | 'k' | 'l'): VimState {
  let { line, col } = s.cursor;
  if (dir === 'h') col -= 1;
  if (dir === 'l') col += 1;
  if (dir === 'j') line += 1;
  if (dir === 'k') line -= 1;
  return clampCursor({ ...s, cursor: { line, col } });
}

export function wordForward(s: VimState): VimState {
  const text = toText(s);
  const offset = offsetOf(s);
  const m = text.slice(offset + 1).search(/\W\w/);
  if (m === -1) return s;
  return fromOffset(s, offset + 1 + m + 1);
}
export function wordBack(s: VimState): VimState {
  const text = toText(s);
  const offset = offsetOf(s);
  const before = text.slice(0, offset);
  const m = [...before.matchAll(/\w+/g)].at(-1);
  if (!m || m.index === undefined) return s;
  return fromOffset(s, m.index);
}
function offsetOf(s: VimState): number {
  let off = 0;
  for (let i = 0; i < s.cursor.line; i++) off += (s.buffer[i]?.length ?? 0) + 1;
  return off + s.cursor.col;
}
function fromOffset(s: VimState, off: number): VimState {
  let rem = off;
  for (let i = 0; i < s.buffer.length; i++) {
    const len = s.buffer[i]!.length + 1;
    if (rem < len) return clampCursor({ ...s, cursor: { line: i, col: rem } });
    rem -= len;
  }
  return s;
}

export function lineStart(s: VimState): VimState { return { ...s, cursor: { ...s.cursor, col: 0 } }; }
export function lineEnd(s: VimState): VimState { return { ...s, cursor: { ...s.cursor, col: s.buffer[s.cursor.line]?.length ?? 0 } }; }
export function docStart(s: VimState): VimState { return { ...s, cursor: { line: 0, col: 0 } }; }
export function docEnd(s: VimState): VimState { return { ...s, cursor: { line: s.buffer.length - 1, col: 0 } }; }

export function insertMode(s: VimState): VimState { return { ...s, mode: 'insert' }; }
export function normalMode(s: VimState): VimState { return { ...s, mode: 'normal' }; }

export function insertChar(s: VimState, ch: string): VimState {
  if (s.mode !== 'insert') return s;
  const n = pushHistory(s);
  const line = n.buffer[n.cursor.line] ?? '';
  n.buffer[n.cursor.line] = line.slice(0, n.cursor.col) + ch + line.slice(n.cursor.col);
  n.cursor.col += ch.length;
  return n;
}
export function deleteChar(s: VimState): VimState {
  const n = pushHistory(s);
  const line = n.buffer[n.cursor.line] ?? '';
  n.buffer[n.cursor.line] = line.slice(0, n.cursor.col) + line.slice(n.cursor.col + 1);
  return n;
}
export function deleteLine(s: VimState): VimState {
  const n = pushHistory(s);
  n.buffer.splice(n.cursor.line, 1);
  if (n.buffer.length === 0) n.buffer.push('');
  return clampCursor(n);
}
export function undo(s: VimState): VimState {
  if (s.history.length === 0) return s;
  const prev = s.history.at(-1)!;
  return { ...s, buffer: [...prev], history: s.history.slice(0, -1), future: [[...s.buffer], ...s.future] };
}
export function redo(s: VimState): VimState {
  if (s.future.length === 0) return s;
  const next = s.future[0]!;
  return { ...s, buffer: [...next], history: [...s.history, [...s.buffer]], future: s.future.slice(1) };
}
