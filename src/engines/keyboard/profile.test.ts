import { describe, expect, it } from 'vitest';
import { applyOverride, canRunLesson, createProfile, resetOverrides } from './profile';

describe('profile KB002/KB005', () => {
  it('KB002 re-etiqueta sin mover posición física', () => {
    const p = createProfile('mac-ansi-us');
    const next = applyOverride(p, 'Semicolon', 'ñ');
    expect(next.keys.find((k) => k.code === 'Semicolon')?.label).toBe('ñ');
    expect(next.overrides['Semicolon']).toBe('ñ');
  });

  it('KB003 reset restaura base', () => {
    const p = applyOverride(createProfile('mac-iso-es'), 'Semicolon', 'X');
    const reset = resetOverrides(p);
    expect(reset.keys.find((k) => k.code === 'Semicolon')?.label).toBe('ñ');
    expect(Object.keys(reset.overrides)).toHaveLength(0);
  });

  it('KB005 bloquea lección si falta tecla', () => {
    const p = createProfile('mac-ansi-us');
    expect(canRunLesson(p, ['KeyA', 'KeyB'])).toBe(true);
    expect(canRunLesson(p, ['IntlBackslash'])).toBe(false);
  });
});
