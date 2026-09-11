// PRD §18 + Curriculum NeoType §23-26 — contrato común con sesiones y bloques ricos
// Cada lección es una unidad completa de aprendizaje, no un tema aislado.
// Soporta modelo legado (blocks plano) + nuevo modelo (sessions[].blocks) para migración progresiva.

export type LessonDomain = 'typing' | 'neovim' | 'python' | 'go';

// Bloques — taxonomía completa del curriculum §4
export type LessonBlockType =
  | 'recall'
  | 'concept'
  | 'position'
  | 'isolation'
  | 'pattern'
  | 'combination'
  | 'typing'
  | 'application'
  | 'challenge'
  | 'zen'
  | 'debug'
  | 'review'
  | 'evaluation'
  // legacy aliases — se mapean a los nuevos
  | 'movement'
  | 'syllable'
  | 'vim-challenge'
  | 'code';

export type LegacyBlockKind = 'position' | 'movement' | 'pattern' | 'syllable' | 'zen' | 'evaluation' | 'vim-challenge' | 'code';

export interface LessonBlock {
  id: string;
  // nuevo campo canónico (opcional para compatibilidad legacy)
  type?: LessonBlockType;
  // legacy alias — si solo existe kind, se deriva type
  kind?: LegacyBlockKind | LessonBlockType;
  title?: string;
  prompt?: string;
  instructions?: string;
  targetKeys?: string[];
  content?: string | string[];
  config?: Record<string, unknown>;
  difficulty?: number; // 1..5 §15
}

export interface LessonSession {
  id: string; // e.g. "typing-es-01--A"
  title: string; // e.g. "Session A — Discover"
  objectives?: string[];
  estimatedMinutes: number;
  blocks: LessonBlock[];
}

export interface MasteryRule {
  minAccuracy: number; // 0.95
  minFingerAccuracy?: number; // 0.90
  consecutivePasses: number; // 3 PASS para dominio
}

export interface ReviewRule {
  afterDays: number; // 1,3,7,14,30
}

export interface EvaluatorConfig {
  kind: 'typing' | 'vim' | 'code';
  referenceKeystrokes?: number;
  acceptedSolutions?: string[];
  allowArrows?: boolean;
  disableBackspace?: boolean;
}

export interface Lesson {
  id: string;
  version: number;
  domain: LessonDomain;
  // nuevo: curso semántico; mapea 1:1 con domain para MVP pero permite variantes (typing-es vs typing-en)
  courseId?: string;
  title: string;
  description?: string;
  objectives: string[];
  prerequisites: string[];
  // qué habilidades entrena (skillIds) — §21 SkillMastery
  skills?: string[];
  targetKeys?: string[];
  sessions?: LessonSession[];
  // legacy plano — derivado de sessions si no existe
  blocks: LessonBlock[];
  evaluator: EvaluatorConfig;
  mastery: MasteryRule;
  reviews?: ReviewRule[];
}

// === Helpers para compatibilidad ===

// Normaliza un bloque legacy -> nuevo type + difficulty default
export function normalizeBlock(b: LessonBlock): LessonBlock {
  if (b.type) return { ...b, type: b.type, difficulty: b.difficulty ?? 1 };
  const kind = (b.kind ?? 'pattern') as string;
  const map: Record<string, LessonBlockType> = {
    position: 'position',
    movement: 'isolation',
    pattern: 'pattern',
    syllable: 'combination',
    zen: 'zen',
    evaluation: 'evaluation',
    'vim-challenge': 'challenge',
    code: 'application',
  };
  return {
    ...b,
    type: (map[kind] ?? 'pattern') as LessonBlockType,
    difficulty: b.difficulty ?? (kind === 'evaluation' ? 5 : kind === 'position' ? 1 : 2),
  };
}

export function getLessonBlocks(lesson: Lesson): LessonBlock[] {
  if (lesson.blocks && lesson.blocks.length > 0) return lesson.blocks.map(normalizeBlock);
  return (lesson.sessions ?? []).flatMap((s) => s.blocks.map(normalizeBlock));
}

export function getLessonSessions(lesson: Lesson): LessonSession[] {
  if (lesson.sessions && lesson.sessions.length > 0) return lesson.sessions.map((s) => ({ ...s, blocks: s.blocks.map(normalizeBlock) }));
  // deriva sesión única con bloques planos (compatibilidad)
  return [
    {
      id: `${lesson.id}--legacy`,
      title: lesson.title,
      objectives: lesson.objectives,
      estimatedMinutes: 10,
      blocks: (lesson.blocks ?? []).map(normalizeBlock),
    },
  ];
}

// Bloque activo según currentSession/currentBlock
export function getActiveBlock(lesson: Lesson, sessionIdx: number, blockIdx: number): LessonBlock | undefined {
  const sessions = getLessonSessions(lesson);
  return sessions[sessionIdx]?.blocks[blockIdx];
}

export function getBlockText(block: LessonBlock | undefined, domain?: string): string {
  if (!block) return '';
  if (Array.isArray(block.content)) {
    // Para typing (isolation/pattern/etc) unir con espacio, para código con salto de línea
    const isCode = domain === 'python' || domain === 'go' || block.type === 'debug' || block.type === 'application';
    // Si es typing y content son secuencias cortas (ej. bigramas), mejor espacio; si son líneas de código, newline
    if (isCode) return block.content.join('\n');
    // Heurística: si algún elemento contiene espacio ya, unir con espacio simple
    return block.content.join(' ');
  }
  return (block.content ?? block.prompt ?? '') as string;
}

export function getBlockPrompt(block: LessonBlock | undefined): string {
  if (!block) return '';
  return block.prompt ?? block.instructions ?? block.title ?? '';
}

// === Mastery / Skill layer §21 ===

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'review' | 'mastered';

// Compatible con storage progress (before: 'completed' === 'mastered')
export const STATUS_ALIASES: Record<string, LessonStatus> = {
  completed: 'mastered',
  locked: 'locked',
  available: 'available',
  in_progress: 'in_progress',
  review: 'review',
  mastered: 'mastered',
};

export interface SkillMastery {
  skillId: string;
  accuracy: number; // 0..1
  attempts: number;
  successfulAttempts: number;
  mastery: number; // 0..100 §21
  lastPracticedAt: string;
  nextReviewAt: string;
  weakPatterns: string[];
}

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  currentSession: number;
  currentBlock: number;
  passes: number; // racha actual 0..3
  attempts: number;
  bestAccuracy?: number;
  masteryScore: number; // 0..100
  lastActivityAt?: string;
  nextReviewAt?: string;
  weakPatterns?: string[];
  completedAt?: string | null;
}

// Intervalos espaciados §6
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

export function nextReviewDate(from: Date, intervalIndex: number): string {
  const days = REVIEW_INTERVALS[Math.min(intervalIndex, REVIEW_INTERVALS.length - 1)] ?? 30;
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function masteryLevel(score: number): string {
  if (score >= 96) return 'automatic';
  if (score >= 81) return 'strong';
  if (score >= 61) return 'proficient';
  if (score >= 41) return 'developing';
  if (score >= 21) return 'learning';
  return 'introduced';
}

// Skill Graph §22 — grafo dirigido simple
export interface SkillNode {
  id: string;
  label: string;
  domain: LessonDomain;
  lessonId: string;
  prerequisites: string[];
}

export const SKILL_GRAPH: SkillNode[] = [
  { id: 'home-right', label: 'Home Row derecha', domain: 'typing', lessonId: 'typing-es-01', prerequisites: [] },
  { id: 'home-left', label: 'Home Row izquierda', domain: 'typing', lessonId: 'typing-es-02', prerequisites: ['home-right'] },
  { id: 'both-hands', label: 'Coordinación manos', domain: 'typing', lessonId: 'typing-es-03', prerequisites: ['home-left', 'home-right'] },
  { id: 'top-left', label: 'Fila superior izq', domain: 'typing', lessonId: 'typing-es-04', prerequisites: ['both-hands'] },
  { id: 'top-right', label: 'Fila superior der', domain: 'typing', lessonId: 'typing-es-05', prerequisites: ['top-left'] },
  { id: 'bottom-row', label: 'Fila inferior', domain: 'typing', lessonId: 'typing-es-06', prerequisites: ['top-right'] },
  { id: 'fluency-alpha', label: 'Fluidez alfabética', domain: 'typing', lessonId: 'typing-es-07', prerequisites: ['bottom-row'] },
  { id: 'shift-numbers', label: 'Shift y números', domain: 'typing', lessonId: 'typing-es-08', prerequisites: ['fluency-alpha'] },
  { id: 'symbols', label: 'Símbolos prog', domain: 'typing', lessonId: 'typing-es-09', prerequisites: ['shift-numbers'] },
  { id: 'full-fluency', label: 'Fluidez completa', domain: 'typing', lessonId: 'typing-es-10', prerequisites: ['symbols'] },
  // Neovim rama — IDs corregidos a neovim-es-*
  { id: 'vim-modes', label: 'Normal/Insert', domain: 'neovim', lessonId: 'neovim-es-01', prerequisites: ['both-hands'] },
  { id: 'vim-motions', label: 'h/j/k/l', domain: 'neovim', lessonId: 'neovim-es-02', prerequisites: ['vim-modes'] },
  { id: 'vim-words', label: 'Palabras w/b/e', domain: 'neovim', lessonId: 'neovim-es-03', prerequisites: ['vim-motions'] },
  { id: 'vim-lines', label: 'Líneas 0^$', domain: 'neovim', lessonId: 'neovim-es-04', prerequisites: ['vim-words'] },
  { id: 'vim-document', label: 'Documento gg G', domain: 'neovim', lessonId: 'neovim-es-05', prerequisites: ['vim-lines'] },
  { id: 'vim-edit', label: 'Edición x r u', domain: 'neovim', lessonId: 'neovim-es-06', prerequisites: ['vim-document'] },
  { id: 'vim-operators', label: 'Operators d/c/y', domain: 'neovim', lessonId: 'neovim-es-07', prerequisites: ['vim-edit'] },
  { id: 'vim-lines-copy', label: 'Líneas dd yy p', domain: 'neovim', lessonId: 'neovim-es-08', prerequisites: ['vim-operators'] },
  { id: 'vim-search', label: 'Search / .', domain: 'neovim', lessonId: 'neovim-es-09', prerequisites: ['vim-lines-copy'] },
  // Python rama — IDs corregidos a python-es-*
  { id: 'py-values', label: 'Valores y vars', domain: 'python', lessonId: 'python-es-01', prerequisites: ['symbols'] },
  { id: 'py-control', label: 'Control flujo', domain: 'python', lessonId: 'python-es-02', prerequisites: ['py-values'] },
  { id: 'py-functions', label: 'Funciones', domain: 'python', lessonId: 'python-es-03', prerequisites: ['py-control'] },
  { id: 'py-collections', label: 'Colecciones', domain: 'python', lessonId: 'python-es-04', prerequisites: ['py-functions'] },
  { id: 'py-files', label: 'Files y errores', domain: 'python', lessonId: 'python-es-05', prerequisites: ['py-collections'] },
  { id: 'py-testing', label: 'Testing', domain: 'python', lessonId: 'python-es-06', prerequisites: ['py-files'] },
  { id: 'py-cli', label: 'CLI Project', domain: 'python', lessonId: 'python-es-07', prerequisites: ['py-testing'] },
  // Go rama — IDs corregidos a go-es-*
  { id: 'go-vars', label: 'Vars y funcs', domain: 'go', lessonId: 'go-es-01', prerequisites: ['py-functions'] },
  { id: 'go-structs', label: 'Structs', domain: 'go', lessonId: 'go-es-02', prerequisites: ['go-vars'] },
  { id: 'go-slices', label: 'Slices/maps', domain: 'go', lessonId: 'go-es-03', prerequisites: ['go-structs'] },
  { id: 'go-errors', label: 'Errores', domain: 'go', lessonId: 'go-es-04', prerequisites: ['go-slices'] },
  { id: 'go-testing', label: 'Testing Go', domain: 'go', lessonId: 'go-es-05', prerequisites: ['go-errors'] },
  { id: 'go-concurrency', label: 'Concurrency', domain: 'go', lessonId: 'go-es-06', prerequisites: ['go-testing'] },
  { id: 'go-http', label: 'HTTP Service', domain: 'go', lessonId: 'go-es-07', prerequisites: ['go-concurrency'] },
];
