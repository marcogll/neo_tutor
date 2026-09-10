import { describe, expect, it } from 'vitest';
import { createState, insertMode, insertChar, normalMode } from './state';
import { evaluate } from './evaluator';

describe('vim evaluator §14.2', () => {
  it('eficiencia óptimas/usadas*100 con alternativa', () => {
    let s = createState('hola');
    s = { ...s, cursor: { line: 0, col: 4 } };
    s = insertMode(s);
    for (const ch of ' mundo') s = insertChar(s, ch);
    s = normalMode(s);
    const r = evaluate({ id: 'x', title: 't', initial: 'hola', expected: 'hola mundo', optimalKeystrokes: 8, hint: '', acceptedSolutions: ['a mundo'] }, s, 'a mundo');
    expect(r.textMatch).toBe(true);
    expect(r.efficiency).toBeCloseTo(100);
  });
});
