// Stub — Fase 5 motor determinista
export type VimMode = 'normal' | 'insert' | 'visual' | 'command';
export interface VimState {
  mode: VimMode;
  cursor: { line: number; col: number };
  buffer: string[];
}
