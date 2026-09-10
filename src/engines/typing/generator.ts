// PRD §12.2 — generador restringido: solo produce contenido con teclas desbloqueadas (TY001)

export type PatternKind = 'repeticion' | 'misma-fila' | 'vertical' | 'alternancia' | 'rodamiento-interior' | 'rodamiento-exterior' | 'mismo-dedo' | 'bigrama' | 'codigo';

const PATTERN_DEMO: Record<PatternKind, string[]> = {
  repeticion: ['ffff', 'jjjj', 'aaaa', 'llll'],
  'misma-fila': ['asdf', 'jklñ', 'sdf', 'jkl'],
  vertical: ['fr', 'fv', 'ju', 'jn', 'de', 'ki'],
  alternancia: ['fj', 'dk', 'sl', 'añ', 'fjdk'],
  'rodamiento-interior': ['sdf', 'jkl', 'asdf', 'jklñ'],
  'rodamiento-exterior': ['fds', 'lkj', 'fdsa', 'ñlkj'],
  'mismo-dedo': ['fr', 'ft', 'ju', 'ju', 'de'],
  bigrama: ['de', 'en', 'la', 'es', 'el'],
  codigo: ['()', '{}', '[]', '=>', 'const'],
};

export function generatePattern(kind: PatternKind, unlocked: Set<string>): string {
  const candidates = PATTERN_DEMO[kind] ?? [];
  // filtra solo caracteres cuyas teclas estén desbloqueadas (case-insensitive)
  const filtered = candidates.filter((s) => [...s].every((ch) => ch === ' ' || unlocked.has(ch.toLowerCase())));
  return filtered[0] ?? [...unlocked].slice(0, 4).join('') ?? 'asdf';
}

export function generateSyllables(unlocked: Set<string>): string {
  const keys = [...unlocked].filter((k) => /[a-zñ]/.test(k));
  if (keys.length < 2) return keys.join(' ');
  // genera sílabas simples solo con unlocked
  const syls = ['la', 'de', 'en', 'el', 'al', 'as', 'ja', 'da'];
  return syls.filter((s) => [...s].every((ch) => unlocked.has(ch))).slice(0, 4).join(' ') || keys.slice(0, 3).join(' ');
}

export function isContentAllowed(content: string, unlocked: Set<string>): boolean {
  return [...content.toLowerCase()].every((ch) => ch === ' ' || !/[a-zñ]/.test(ch) || unlocked.has(ch));
}
