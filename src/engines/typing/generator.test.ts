import { describe, expect, it } from 'vitest';
import { generatePattern, isContentAllowed } from './generator';

describe('generator TY001', () => {
  it('solo genera con teclas desbloqueadas', () => {
    const unlocked = new Set(['a', 's', 'd', 'f']);
    expect(isContentAllowed(generatePattern('misma-fila', unlocked), unlocked)).toBe(true);
  });
  it('filtra contenido no permitido', () => {
    expect(isContentAllowed('asdf', new Set(['a', 's']))).toBe(false);
    expect(isContentAllowed('as', new Set(['a', 's']))).toBe(true);
  });
});
