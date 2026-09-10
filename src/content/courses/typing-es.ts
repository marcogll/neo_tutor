import type { Lesson } from '@/domains/lesson';

// PRD §12.1 — 7 niveles completos. Curso truType: precisión → ritmo → velocidad → código
export const TYPING_ES: Lesson[] = [
  // N1 — fila central
  {
    id: 'typing-es-01',
    version: 2,
    domain: 'typing',
    title: 'N1 — Fila central jklñ',
    objectives: ['Postura fila central', 'Retorno sin mirar', 'Meñique ñ'],
    prerequisites: [],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Mano derecha: j (índice) k (medio) l (anular) ñ (meñique)', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b2', kind: 'movement', content: 'jjjj kkkk llll ññññ', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b3', kind: 'pattern', content: 'jklñ jklñ lk jñ', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b4', kind: 'syllable', content: 'al la ña', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'KeyA'] },
      { id: 'b5', kind: 'zen', content: 'j k l ñ j k l a', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b6', kind: 'evaluation', content: 'jklñ ñlkj', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
    ],
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, minFingerAccuracy: 0.9, consecutivePasses: 3 },
  },
  {
    id: 'typing-es-02',
    version: 2,
    domain: 'typing',
    title: 'N1 — Fila central asdf',
    objectives: ['Mano izquierda', 'Ancla f/j'],
    prerequisites: ['typing-es-01'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'a (meñique) s (anular) d (medio) f (índice) — anclas en f y j', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b2', kind: 'movement', content: 'aaaa ssss dddd ffff', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b3', kind: 'pattern', content: 'asdf fdsa as df', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b4', kind: 'syllable', content: 'asa ala fada', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b5', kind: 'zen', content: 'a s d f a s d f', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b6', kind: 'evaluation', content: 'asdf jklñ', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
    ],
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, minFingerAccuracy: 0.9, consecutivePasses: 3 },
  },
  {
    id: 'typing-es-03',
    version: 2,
    domain: 'typing',
    title: 'N1 — Ambas manos + ritmo',
    objectives: ['Alternancia', 'Ritmo estable'],
    prerequisites: ['typing-es-02'],
    blocks: [
      { id: 'b1', kind: 'pattern', content: 'fj dk sl añ', targetKeys: ['KeyF', 'KeyJ', 'KeyD', 'KeyK', 'KeyS', 'KeyL', 'KeyA', 'Semicolon'] },
      { id: 'b2', kind: 'pattern', content: 'fdfd jkjk asas lñlñ', targetKeys: ['KeyF', 'KeyD', 'KeyJ', 'KeyK', 'KeyA', 'KeyS', 'Semicolon'] },
      { id: 'b3', kind: 'syllable', content: 'al la ja ja sal', targetKeys: ['KeyA', 'KeyL', 'KeyJ', 'KeyD', 'KeyS'] },
      { id: 'b4', kind: 'zen', content: 'asdf jklñ asdf jklñ', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b5', kind: 'evaluation', content: 'al la sal jal', targetKeys: ['KeyA', 'KeyS', 'KeyL', 'KeyJ'] },
    ],
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
  // N2 — fila superior
  {
    id: 'typing-es-04',
    version: 2,
    domain: 'typing',
    title: 'N2 — Fila superior qwert',
    objectives: ['Alcance vertical sin mover muñeca'],
    prerequisites: ['typing-es-03'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'q (meñique) w (anular) e (medio) r (índice) t (índice)', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'] },
      { id: 'b2', kind: 'movement', content: 'aqz aqz qw er rt', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR'] },
      { id: 'b3', kind: 'pattern', content: 'qwer wert q a z', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyA', 'KeyZ'] },
      { id: 'b4', kind: 'syllable', content: 'que ter wer', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR'] },
      { id: 'b5', kind: 'zen', content: 'qwert asdfg', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'] },
      { id: 'b6', kind: 'evaluation', content: 'que tal qwert', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
  {
    id: 'typing-es-05',
    version: 2,
    domain: 'typing',
    title: 'N2 — Fila superior yuiop',
    objectives: ['Mano derecha superior'],
    prerequisites: ['typing-es-04'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'y u i o p — meñique alcanza p', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'] },
      { id: 'b2', kind: 'pattern', content: 'yuiop poy iu', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'] },
      { id: 'b3', kind: 'syllable', content: 'yo tu pio', targetKeys: ['KeyY', 'KeyO', 'KeyU', 'KeyI', 'KeyP'] },
      { id: 'b4', kind: 'zen', content: 'yuiop jklñ yui', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'] },
      { id: 'b5', kind: 'evaluation', content: 'puyo tuyo pio', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
  // N3 — fila inferior
  {
    id: 'typing-es-06',
    version: 2,
    domain: 'typing',
    title: 'N3 — Fila inferior zxcv + m',
    objectives: ['Saltos de fila', 'Estabilidad'],
    prerequisites: ['typing-es-05'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'z x c v b + n m , . — sin desplazar mano', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'] },
      { id: 'b2', kind: 'movement', content: 'az aqz sx sw dc de fv fr', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b3', kind: 'pattern', content: 'zxcv bnm', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'] },
      { id: 'b4', kind: 'evaluation', content: 'casa vez con', targetKeys: ['KeyC', 'KeyA', 'KeyS', 'KeyV', 'KeyZ'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
  // N4 — mayúsculas, números y puntuación
  {
    id: 'typing-es-07',
    version: 2,
    domain: 'typing',
    title: 'N4 — Mayúsculas y números',
    objectives: ['Shift opuesto', 'Números sin mirar'],
    prerequisites: ['typing-es-06'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Mayúscula con mano opuesta — ej: A = Shift derecho + a', targetKeys: ['KeyA', 'ShiftLeft', 'ShiftRight'] },
      { id: 'b2', kind: 'pattern', content: 'Aa Ss Dd Ff Jj', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ'] },
      { id: 'b3', kind: 'pattern', content: '123 456 7890', targetKeys: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'] },
      { id: 'b4', kind: 'evaluation', content: 'Hola 123', targetKeys: ['KeyH', 'KeyO', 'KeyL', 'KeyA', 'Digit1', 'Digit2', 'Digit3'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.92, consecutivePasses: 2 },
  },
  // N5 — bigramas y palabras frecuentes
  {
    id: 'typing-es-08',
    version: 2,
    domain: 'typing',
    title: 'N5 — Bigramas es/de/la',
    objectives: ['Automatizar bigramas', 'Ritmo en lenguaje'],
    prerequisites: ['typing-es-07'],
    blocks: [
      { id: 'b1', kind: 'pattern', content: 'de en la es el', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA', 'KeyN', 'KeyS'] },
      { id: 'b2', kind: 'syllable', content: 'de la en es por', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA', 'KeyN', 'KeyS', 'KeyP', 'KeyO', 'KeyR'] },
      { id: 'b3', kind: 'zen', content: 'de la casa en la sala', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA', 'KeyC', 'KeyS'] },
      { id: 'b4', kind: 'evaluation', content: 'es de la sala', targetKeys: ['KeyE', 'KeyS', 'KeyD', 'KeyL', 'KeyA'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.92, consecutivePasses: 2 },
  },
  // N6 — símbolos y código
  {
    id: 'typing-es-09',
    version: 2,
    domain: 'typing',
    title: 'N6 — Símbolos de código (){}[]=>',
    objectives: ['Precisión técnica 95%', 'Sin mirar símbolos'],
    prerequisites: ['typing-es-08'],
    blocks: [
      { id: 'b1', kind: 'pattern', content: '() {} [] =>', targetKeys: ['Digit9', 'Digit0', 'BracketLeft', 'BracketRight', 'Equal'] },
      { id: 'b2', kind: 'pattern', content: 'const x = () => {}', targetKeys: ['KeyC', 'KeyO', 'KeyN', 'KeyS', 'KeyT', 'Equal'] },
      { id: 'b3', kind: 'zen', content: 'if (a) { return b; }', targetKeys: ['KeyI', 'KeyF', 'BracketLeft', 'BracketRight'] },
      { id: 'b4', kind: 'evaluation', content: '() => {} []', targetKeys: ['Digit9', 'Digit0', 'Equal', 'BracketLeft', 'BracketRight'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 2 },
  },
  // N7 — texto libre
  {
    id: 'typing-es-10',
    version: 2,
    domain: 'typing',
    title: 'N7 — Texto libre',
    objectives: ['Rendimiento sostenible', 'Sesión larga sin caída'],
    prerequisites: ['typing-es-09'],
    blocks: [
      { id: 'b1', kind: 'zen', content: 'la sala es la jaula del alma y el ritmo construye velocidad', targetKeys: ['KeyL', 'KeyA', 'KeyS', 'KeyJ'] },
      { id: 'b2', kind: 'evaluation', content: 'la casa es azul y la sal es fina', targetKeys: ['KeyL', 'KeyA', 'KeyC', 'KeyS'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
];

export function getLesson(id: string): Lesson | undefined {
  return TYPING_ES.find((l) => l.id === id);
}
export const ALL_TYPING_IDS = TYPING_ES.map((l) => l.id);
