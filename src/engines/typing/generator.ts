// PRD §12.2 + Curriculum §31-32 — generador restringido + difficulty + weak patterns
// El currículo define qué enseñar, el generador qué ejercicio concreto mostrar §31

export type PatternKind = 'repeticion' | 'misma-fila' | 'vertical' | 'alternancia' | 'rodamiento-interior' | 'rodamiento-exterior' | 'mismo-dedo' | 'bigrama' | 'codigo';

const PATTERN_DEMO: Record<PatternKind, string[]> = {
  repeticion: ['ffff', 'jjjj', 'aaaa', 'llll', 'qqqq', 'pppp'],
  'misma-fila': ['asdf', 'jklñ', 'sdf', 'jkl', 'qwer', 'yuiop'],
  vertical: ['fr', 'fv', 'ju', 'jn', 'de', 'ki', 'az', 'sx', 'jn', 'l,'],
  alternancia: ['fj', 'dk', 'sl', 'añ', 'fjdk', 'fr ju'],
  'rodamiento-interior': ['sdf', 'jkl', 'asdf', 'jklñ', 'wer', 'uio'],
  'rodamiento-exterior': ['fds', 'lkj', 'fdsa', 'ñlkj', 'rew', 'oiu'],
  'mismo-dedo': ['fr', 'ft', 'ju', 'jm', 'de', 'fv'],
  bigrama: ['de', 'en', 'la', 'es', 'el', 'que', 'un', 'por', 'con'],
  codigo: ['()', '{}', '[]', '=>', 'const', 'func', 'if', 'for'],
};

const SYLLABLES = ['la', 'de', 'en', 'el', 'al', 'as', 'ja', 'da', 'sa', 'fa', 'que', 'por', 'con'];
const WORDS = ['casa', 'sala', 'falda', 'tipo', 'puerta', 'teclado', 'usuario', 'archivo', 'editor', 'servidor'];

export function generatePattern(kind: PatternKind, unlocked: Set<string>): string {
  const candidates = PATTERN_DEMO[kind] ?? [];
  const filtered = candidates.filter((s) => [...s].every((ch) => ch === ' ' || unlocked.has(ch.toLowerCase())));
  return filtered[0] ?? [...unlocked].slice(0, 4).join('') ?? 'asdf';
}

export function generateSyllables(unlocked: Set<string>): string {
  const keys = [...unlocked].filter((k) => /[a-zñ]/.test(k));
  if (keys.length < 2) return keys.join(' ');
  return SYLLABLES.filter((s) => [...s].every((ch) => unlocked.has(ch))).slice(0, 4).join(' ') || keys.slice(0, 3).join(' ');
}

export function isContentAllowed(content: string, unlocked: Set<string>): boolean {
  return [...content.toLowerCase()].every((ch) => ch === ' ' || !/[a-zñ]/.test(ch) || unlocked.has(ch));
}

// §31 Content Engine — genera ejercicio concreto obedeciendo target skill + unlocked skills
export interface GenerateOpts {
  unlockedKeys: Set<string>; // a-zñ + símbolos permitidos
  targetKeys?: string[]; // foco de la lección
  weakBigrams?: string[]; // bigrams débiles detectados §7
  weakPatterns?: string[]; // patterns débiles
  difficulty: number; // 1..5 §15
  language?: 'es' | 'en';
  kind?: PatternKind;
}

export function generateTypingExercise(opts: GenerateOpts): string {
  const { unlockedKeys, targetKeys, weakBigrams, weakPatterns, difficulty, kind } = opts;

  // Prioriza remediación: si hay weakBigrams, genera ejercicios específicos sin repetir toda la lección §7
  if (weakBigrams && weakBigrams.length > 0 && difficulty <= 3) {
    const bg = weakBigrams[0]!;
    // si contiene tecla no desbloqueada, ignora
    if ([...bg].every((ch) => ch === ' ' || unlockedKeys.has(ch.toLowerCase()))) {
      // generar variantes: bg, reverse, + letra conocida
      const rev = bg.split('').reverse().join('');
      const extra = [...unlockedKeys].filter((k) => /[a-zñ]/.test(k))[0] ?? 'a';
      return [bg, rev, `${bg}${extra}`, `${extra}${bg}`].join(' ');
    }
  }

  if (weakPatterns && weakPatterns.length > 0 && difficulty <= 3) {
    const wp = weakPatterns[0]!;
    if ([...wp].every((ch) => ch === ' ' || unlockedKeys.has(ch.toLowerCase()))) return wp;
  }

  // Dificultad 1: habilidad aislada
  if (difficulty === 1 && targetKeys) {
    const chars = targetKeys.map((k) => k.replace('Key', '').toLowerCase()).filter((c) => c.length === 1);
    const filtered = chars.filter((c) => unlockedKeys.has(c));
    if (filtered.length) return filtered.map((c) => c.repeat(4)).join(' ');
  }

  // Dificultad 2: habilidad + conocida
  if (difficulty === 2) {
    if (kind) return generatePattern(kind, unlockedKeys);
    return generatePattern('alternancia', unlockedKeys);
  }

  // Dificultad 3: palabras / tareas
  if (difficulty === 3) {
    const allowedWords = WORDS.filter((w) => [...w].every((ch) => unlockedKeys.has(ch)));
    if (allowedWords.length >= 2) return allowedWords.slice(0, 3).join(' ');
    return generateSyllables(unlockedKeys);
  }

  // Dificultad 4: contexto real
  if (difficulty === 4) {
    const sentences: Record<string, string> = {
      es: 'El editor abre el archivo y la practica precisa mejora el control.',
      en: 'The editor opens the file and precise practice improves control.',
    };
    const s = (sentences[opts.language ?? 'es'] ?? sentences.es) as string;
    // filtra solo si todo permitido, si no fallback a sílabas
    if (isContentAllowed(s!, unlockedKeys)) return s!;
    return generateSyllables(unlockedKeys);
  }

  // Dificultad 5: problema no visto — genera bigramas/trigramas no vistos o código
  if (difficulty === 5) {
    // mezcla de letras no comunes pero permitidas
    const keys = [...unlockedKeys].filter((k) => /[a-zñ]/.test(k));
    if (keys.length >= 4) {
      // bigramas poco frecuentes pero válidos
      return `${keys[0]}${keys[2]} ${keys[1]}${keys[3]} ${keys[2]}${keys[0]}`;
    }
    return generatePattern('codigo', unlockedKeys);
  }

  return generateSyllables(unlockedKeys);
}

// Helper para Daily Session composition §13
export function composeDailySession(availableMinutes: 5 | 10 | 15 | 20 | 30) {
  if (availableMinutes === 5) {
    return [
      { label: 'Warmup', minutes: 2, kind: 'repeticion' as PatternKind },
      { label: 'Current skill', minutes: 3, kind: 'misma-fila' as PatternKind },
    ];
  }
  if (availableMinutes === 10) {
    return [
      { label: 'Warmup', minutes: 2, kind: 'repeticion' as PatternKind },
      { label: 'Recall', minutes: 3, kind: 'bigrama' as PatternKind },
      { label: 'Current skill', minutes: 5, kind: 'misma-fila' as PatternKind },
    ];
  }
  // 15,20,30 → composición completa §13
  return [
    { label: 'Warmup', minutes: 2, kind: 'repeticion' as PatternKind },
    { label: 'Recall', minutes: 3, kind: 'bigrama' as PatternKind },
    { label: 'Current skill', minutes: 8, kind: 'misma-fila' as PatternKind },
    { label: 'Weak skill', minutes: 3, kind: 'vertical' as PatternKind },
    { label: 'Application', minutes: 5, kind: 'codigo' as PatternKind },
    { label: 'Challenge', minutes: 3, kind: 'alternancia' as PatternKind },
  ].slice(0, availableMinutes >= 30 ? 6 : availableMinutes >= 20 ? 5 : 4);
}
