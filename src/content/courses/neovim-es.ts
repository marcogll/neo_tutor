import type { Lesson } from '@/domains/lesson';

// PRD §14 — Curso Vim que explica movimientos y shortcuts paso a paso
export const NEOVIM_ES: Lesson[] = [
  {
    id: 'neovim-es-01', version: 2, domain: 'neovim', title: '01 — Modos: Normal vs Insert', objectives: ['Entender la idea de modos', 'i/a para Insert, Esc para Normal'], prerequisites: ['typing-es-03'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Vim no escribe directo: en Normal mueves/edias, en Insert escribes. Proba: estás en Normal. Presiona i → pasas a Insert. Escribe hola → Esc → vuelves a Normal. Indicador --INSERT-- aparece abajo.', targetKeys: ['KeyI'] },
      { id: 'b2', kind: 'pattern', prompt: 'i = insertar donde estás, a = añadir después del cursor. Practica ambos.', content: 'i a Esc' },
      { id: 'b3', kind: 'vim-challenge', prompt: 'Reto: convierte [hola] en [hola mundo] → ve al final con $ , presiona a , escribe " mundo" , Esc', content: 'hola mundo' },
    ], evaluator: { kind: 'vim', referenceKeystrokes: 8 }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-02', version: 2, domain: 'neovim', title: '02 — h/j/k/l sin flechas', objectives: ['h← j↓ k↑ l→', 'No uses flechas (NV004)'], prerequisites: ['neovim-es-01'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Mnemotecnia: h a la izquierda (como hand), l a la derecha (last), j abajo (tiene gancho hacia abajo), k arriba. Practica sin mirar flechas.', targetKeys: ['KeyH', 'KeyJ', 'KeyK', 'KeyL'] },
      { id: 'b2', kind: 'pattern', prompt: 'Desde inicio, mueve 3 a la derecha con l l l , baja con j', content: 'l l l j' },
      { id: 'b3', kind: 'vim-challenge', prompt: 'Reto: en "hola mundo feliz" llega a la f de feliz solo con l y w — intenta llll... vs w w', content: 'feliz' },
    ], evaluator: { kind: 'vim', referenceKeystrokes: 4 }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-03', version: 2, domain: 'neovim', title: '03 — Palabras w/b/e', objectives: ['w = siguiente palabra, b = atrás, e = fin de palabra'], prerequisites: ['neovim-es-02'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'En "hola mundo feliz": w te lleva al inicio de la siguiente palabra (mundo → feliz). b vuelve atrás. e va al final de la palabra actual. Mucho más rápido que llll.', targetKeys: ['KeyW', 'KeyB', 'KeyE'] },
      { id: 'b2', kind: 'pattern', prompt: 'Practica: w w (dos palabras adelante), b (una atrás), e (al final)', content: 'w w b e' },
      { id: 'b3', kind: 'vim-challenge', prompt: 'Reto: borra la segunda palabra con dw → cursor en hola, dw deja "hola feliz"', content: 'dw' },
    ], evaluator: { kind: 'vim', referenceKeystrokes: 2 }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-04', version: 2, domain: 'neovim', title: '04 — Líneas 0 ^ $', objectives: ['0 = inicio absoluto, ^ = primer char no-espacio, $ = fin'], prerequisites: ['neovim-es-03'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Línea: "   hola". 0 va al primer espacio, ^ va a la h, $ va al final (a). Diferencia clave para indentación.', targetKeys: ['Digit0', 'Equal'] },
      { id: 'b2', kind: 'pattern', prompt: 'Practica: $ (fin) → 0 (inicio) → ^ (primer texto)', content: '$ 0 ^' },
      { id: 'b3', kind: 'vim-challenge', prompt: 'Reto: desde el medio, ve al fin con $ y añade "!" con a', content: '!' },
    ], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-05', version: 2, domain: 'neovim', title: '05 — Documento gg G { }', objectives: ['gg = inicio archivo, G = final, {/} = párrafos'], prerequisites: ['neovim-es-04'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Fichero largo: gg te lleva arriba, G abajo, { párrafo arriba, } párrafo abajo. Numeritos: 5G = línea 5.', targetKeys: ['KeyG'] },
      { id: 'b2', kind: 'vim-challenge', prompt: 'Reto: con 3 líneas, haz gg → G → {', content: 'gg G' },
    ], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-06', version: 2, domain: 'neovim', title: '06 — Edición x r ~', objectives: ['x borra char, r reemplaza uno, ~ cambia caja'], prerequisites: ['neovim-es-05'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'x = como Delete bajo cursor (ej: hoxa → hola con x). r = reemplaza sin entrar a Insert (r a).', targetKeys: ['KeyX', 'KeyR'] },
      { id: 'b2', kind: 'vim-challenge', prompt: 'Reto: en "hoxa", mueve cursor a x y presiona r l → "hola"', content: 'r' },
    ], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-07', version: 2, domain: 'neovim', title: '07 — Operadores d/c/y = verbo + movimiento', objectives: ['d=delete, c=change (+Insert), y=yank. Ej: dw, ciw'], prerequisites: ['neovim-es-06'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Fórmula: operador + movimiento. dw = delete word (de a → la), ciw = change inner word (borra palabra y entra a Insert), yy = yank línea.', targetKeys: ['KeyD', 'KeyC', 'KeyY'] },
      { id: 'b2', kind: 'pattern', prompt: 'Practica combinaciones: dw, diw, ciw, yy', content: 'dw ciw' },
      { id: 'b3', kind: 'vim-challenge', prompt: 'Reto: en "hola mundo", sobre mundo haz ciw → escribe "vim" → Esc', content: 'vim' },
    ], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-08', version: 2, domain: 'neovim', title: '08 — Líneas dd yy p P', objectives: ['dd corta, yy copia, p pega abajo, P arriba'], prerequisites: ['neovim-es-07'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'dd corta línea entera, yy la copia (yank), p pega después, P antes. Muy usado para mover bloques.', targetKeys: ['KeyD', 'KeyY', 'KeyP'] },
      { id: 'b2', kind: 'vim-challenge', prompt: 'Reto: dd en línea 1 → G (final) → p (pega abajo)', content: 'dd p' },
    ], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'neovim-es-09', version: 2, domain: 'neovim', title: '09 — Búsqueda / . u Ctrl-r', objectives: ['/texto + n/N, . repite, u deshace, Ctrl-r rehace'], prerequisites: ['neovim-es-08'],
    blocks: [
      { id: 'b1', kind: 'position', prompt: 'Para buscar: /hola Enter → n siguiente, N anterior. . repite última acción. u deshace, Ctrl-r rehace.', targetKeys: ['Slash'] },
      { id: 'b2', kind: 'vim-challenge', prompt: 'Reto final: busca /mundo → dw → . (repite) → u (deshace)', content: '/ dw . u' },
    ], evaluator: { kind: 'vim' }, mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
];
export const getNeovimLesson = (id: string) => NEOVIM_ES.find((l) => l.id === id);
