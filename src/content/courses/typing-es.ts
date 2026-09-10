import type { Lesson } from '@/domains/lesson';

// PRD §12.1 Nivel 1 — fila central, postura y retorno. 95% precisión + 3 aprobadas.
export const TYPING_ES: Lesson[] = [
  {
    id: 'typing-es-01',
    version: 1,
    domain: 'typing',
    title: 'Fila central — jklñ',
    objectives: ['Postura fila central', 'Retorno sin mirar'],
    prerequisites: [],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Mano derecha: j k l ñ — meñique en ñ', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b2', kind: 'movement', content: 'jjjj kkkk llll ññññ', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b3', kind: 'pattern', content: 'jklñ jklñ', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b4', kind: 'syllable', content: 'al la', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'KeyA'] },
      { id: 'b5', kind: 'zen', content: 'jklñ j k l a', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b6', kind: 'evaluation', content: 'jklñ asdf', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
    ],
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, minFingerAccuracy: 0.9, consecutivePasses: 3 },
  },
  {
    id: 'typing-es-02',
    version: 1,
    domain: 'typing',
    title: 'Fila central — asdf',
    objectives: ['Mano izquierda fila central'],
    prerequisites: ['typing-es-01'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Mano izquierda: a s d f', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b2', kind: 'movement', content: 'aaaa ssss dddd ffff', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b3', kind: 'pattern', content: 'asdf asdf fdsa', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b4', kind: 'syllable', content: 'asa ala', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b5', kind: 'zen', content: 'a s d f a s d f', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
      { id: 'b6', kind: 'evaluation', content: 'asdf jklñ', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'] },
    ],
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, minFingerAccuracy: 0.9, consecutivePasses: 3 },
  },
  {
    id: 'typing-es-03',
    version: 1,
    domain: 'typing',
    title: 'Fila central — ambas manos',
    objectives: ['Alternancia y ritmo'],
    prerequisites: ['typing-es-02'],
    blocks: [
      { id: 'b1', kind: 'pattern', content: 'fj dk sl añ', targetKeys: ['KeyF', 'KeyJ', 'KeyD', 'KeyK', 'KeyS', 'KeyL', 'KeyA', 'Semicolon'] },
      { id: 'b2', kind: 'pattern', content: 'fdfd jkjk', targetKeys: ['KeyF', 'KeyD', 'KeyJ', 'KeyK'] },
      { id: 'b3', kind: 'syllable', content: 'al la ja ja', targetKeys: ['KeyA', 'KeyL', 'KeyJ', 'KeyD'] },
      { id: 'b4', kind: 'zen', content: 'asdf jklñ asdf', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'] },
      { id: 'b5', kind: 'evaluation', content: 'al la sal jal', targetKeys: ['KeyA', 'KeyS', 'KeyL', 'KeyJ'] },
    ],
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
  {
    id: 'typing-es-04',
    version: 1,
    domain: 'typing',
    title: 'Palabra y ritmo',
    objectives: ['Bigrama y ritmo estable'],
    prerequisites: ['typing-es-03'],
    blocks: [
      { id: 'b1', kind: 'pattern', content: 'de la en el', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA', 'KeyN'] },
      { id: 'b2', kind: 'syllable', content: 'de la al el', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA'] },
      { id: 'b3', kind: 'zen', content: 'la casa es de ala', targetKeys: ['KeyL', 'KeyA', 'KeyC', 'KeyS', 'KeyE', 'KeyD'] },
      { id: 'b4', kind: 'evaluation', content: 'la sala sale', targetKeys: ['KeyL', 'KeyA', 'KeyS'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
  {
    id: 'typing-es-05',
    version: 1,
    domain: 'typing',
    title: 'Frase Zen — fila central',
    objectives: ['Texto libre sostenible'],
    prerequisites: ['typing-es-04'],
    blocks: [
      { id: 'b1', kind: 'zen', content: 'la sala es la jaula del alma', targetKeys: ['KeyL', 'KeyA', 'KeyS', 'KeyJ', 'KeyD', 'KeyE', 'KeyM'] },
      { id: 'b2', kind: 'evaluation', content: 'la sal de la salsa', targetKeys: ['KeyL', 'KeyA', 'KeyS', 'KeyD', 'KeyE'] },
    ],
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },
];

export function getLesson(id: string): Lesson | undefined {
  return TYPING_ES.find((l) => l.id === id);
}
