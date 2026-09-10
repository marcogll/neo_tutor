// PRD §11.3 KB001 — layouts físicos y lógicos
export type Physical = 'ANSI' | 'ISO';
export type Logical = 'US' | 'ES' | 'LA';

export type Finger =
  | 'LP' // meñique izq
  | 'LR'
  | 'LM'
  | 'LI'
  | 'RI'
  | 'RM'
  | 'RR'
  | 'RP' // meñique der
  | 'LT'
  | 'RT';

export interface LayoutKey {
  code: string; // KeyboardEvent.code — posición física
  label: string; // etiqueta visible (KeyboardEvent.key)
  finger: Finger;
  row: number; // 0..5 para render
  col: number;
  width?: number; // unidades relativas
}

export interface KeyboardLayout {
  id: string; // "mac-ansi-us"
  name: string;
  physical: Physical;
  logical: Logical;
  platform: 'mac';
  keys: LayoutKey[];
  modifiers: Record<string, string>; // "Meta" -> "Command"
}
