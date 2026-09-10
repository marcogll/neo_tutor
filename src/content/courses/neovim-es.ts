import type { Lesson } from '@/domains/lesson';

// PRD §14.1 — 9 módulos progresivos, motor determinista
export const NEOVIM_ES: Lesson[] = [
  {
    id: 'neovim-es-01', version: 1, domain: 'neovim', title: 'Modos — Normal/Insert', objectives: ['Entender modos', 'i/a y Esc'], prerequisites: ['typing-es-03'],
    blocks: [
      { id: 'b1', kind: 'vim-challenge', prompt: 'Entra a Insert con i, escribe hola y vuelve con Esc', content: 'hola' },
      { id: 'b2', kind: 'vim-challenge', prompt: 'Usa a para añadir al final', content: 'hola mundo' },
    ], evaluator: { kind: 'vim', referenceKeystrokes: 8 }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-02', version: 1, domain: 'neovim', title: 'Movimiento h/j/k/l', objectives: ['Sin flechas', 'Eficiencia'], prerequisites: ['neovim-es-01'],
    blocks: [
      { id: 'b1', kind: 'vim-challenge', prompt: 'Desde inicio, llega a la 3ª palabra solo con l/w', content: 'h j k l' },
    ], evaluator: { kind: 'vim', referenceKeystrokes: 4 }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-03', version: 1, domain: 'neovim', title: 'Palabras w/b/e', objectives: ['Saltos por palabra'], prerequisites: ['neovim-es-02'],
    blocks: [{ id: 'b1', kind: 'vim-challenge', prompt: 'Borra la segunda palabra con dw', content: 'dw' }], evaluator: { kind: 'vim', referenceKeystrokes: 2 }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-04', version: 1, domain: 'neovim', title: 'Líneas 0/^/$', objectives: ['0 inicio, $ fin, ^ primer no-espacio'], prerequisites: ['neovim-es-03'],
    blocks: [{ id: 'b1', kind: 'vim-challenge', prompt: 'Ve al final de la línea con $ y al inicio con 0', content: '0 $' }], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-05', version: 1, domain: 'neovim', title: 'Documento gg/G', objectives: ['Saltos globales'], prerequisites: ['neovim-es-04'],
    blocks: [{ id: 'b1', kind: 'vim-challenge', prompt: 'gg inicio, G final, { } párrafos', content: 'gg G' }], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-06', version: 1, domain: 'neovim', title: 'Edición x/r', objectives: ['Borrar y reemplazar char'], prerequisites: ['neovim-es-05'],
    blocks: [{ id: 'b1', kind: 'vim-challenge', prompt: 'Borra 2 chars con x y reemplaza con r', content: 'x r' }], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-07', version: 1, domain: 'neovim', title: 'Operadores d/c/y', objectives: ['Operador + movimiento'], prerequisites: ['neovim-es-06'],
    blocks: [{ id: 'b1', kind: 'vim-challenge', prompt: 'dw = delete word, ciw = change inner word', content: 'ciw' }], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-08', version: 1, domain: 'neovim', title: 'Compuestos dd/yy/p', objectives: ['Líneas completas'], prerequisites: ['neovim-es-07'],
    blocks: [{ id: 'b1', kind: 'vim-challenge', prompt: 'dd corta línea, yy copia, p pega', content: 'dd yy p' }], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-09', version: 1, domain: 'neovim', title: 'Búsqueda / y .u', objectives: ['/ patrón, n/N, . repetir, u deshacer'], prerequisites: ['neovim-es-08'],
    blocks: [{ id: 'b1', kind: 'vim-challenge', prompt: 'Busca /hola, repite con n, deshaz con u', content: '/ n u' }], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
];
export const getNeovimLesson = (id: string) => NEOVIM_ES.find((l) => l.id === id);
