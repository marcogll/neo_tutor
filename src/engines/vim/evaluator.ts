import { toText, type VimState } from './state';

// PRD §14.2 — evalúa texto final + secuencia + eficiencia
export interface VimChallenge {
  id: string;
  title: string;
  initial: string;
  expected: string;
  acceptedSolutions?: string[]; // secuencias alternativas declaradas
  optimalKeystrokes: number;
  hint: string;
}

export interface VimResult {
  success: boolean;
  textMatch: boolean;
  sequenceMatch: boolean;
  efficiency: number; // óptimas / usadas *100
  used: number;
}

export function evaluate(ch: VimChallenge, finalState: VimState, sequence: string): VimResult {
  const text = toText(finalState);
  const textMatch = text === ch.expected;
  const sequenceMatch = ch.acceptedSolutions ? ch.acceptedSolutions.includes(sequence) : true;
  // si aceptó alternativa, success por texto basta
  const success = textMatch && (ch.acceptedSolutions ? sequenceMatch || textMatch : true);
  const used = sequence.length;
  const efficiency = used > 0 ? (ch.optimalKeystrokes / used) * 100 : 0;
  return { success, textMatch, sequenceMatch, efficiency: Math.min(100, efficiency), used };
}

export const CHALLENGES: VimChallenge[] = [
  { id: 'vim-01', title: 'Normal → Insert → Normal', initial: 'hola', expected: 'hola mundo', optimalKeystrokes: 8, hint: 'Usa a o i para entrar a insert, escribe, y Esc', acceptedSolutions: ['amundo\x1b', 'i mundo\x1b'] },
  { id: 'vim-02', title: 'Movimiento w', initial: 'hola mundo feliz', expected: 'hola mundo feliz', optimalKeystrokes: 2, hint: 'Desde inicio, w te lleva a la siguiente palabra' },
  { id: 'vim-03', title: 'Borra palabra dw', initial: 'hola mundo', expected: 'hola', optimalKeystrokes: 3, hint: 'dw borra desde cursor hasta siguiente palabra' },
  { id: 'vim-04', title: '0 y $', initial: '  hola', expected: '  hola', optimalKeystrokes: 1, hint: '0 inicio, $ final, ^ primer no-espacio' },
];
