import { describe, expect, it } from 'vitest';
import { captureFromKeyboardEvent } from './capture';

describe('captureFromKeyboardEvent', () => {
  it('distingue code vs key', () => {
    const e = new KeyboardEvent('keydown', { code: 'KeyA', key: 'a', shiftKey: false });
    const c = captureFromKeyboardEvent(e);
    expect(c.code).toBe('KeyA');
    expect(c.key).toBe('a');
  });

  it('captura modificadores', () => {
    const e = new KeyboardEvent('keydown', { code: 'KeyA', key: 'A', shiftKey: true, metaKey: true });
    const c = captureFromKeyboardEvent(e);
    expect(c.modifiers.shift).toBe(true);
    expect(c.modifiers.meta).toBe(true);
  });
});
