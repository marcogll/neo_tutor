import { describe, expect, it } from 'vitest';
import { inferLayout } from './detect';

describe('inferLayout', () => {
  it('ANSI US sin IntlBackslash ni ñ', () => {
    const r = inferLayout(
      { codes: new Set(), keys: new Map([['KeyQ', 'q']]), platform: 'MacIntel', hasGetLayoutMap: false },
      { q: 'q', a: 'a', z: 'z', special: ';', isoKey: '', backquote: '`' },
    );
    expect(r.suggested).toBe('mac-ansi-us');
  });

  it('ISO ES con IntlBackslash y ñ', () => {
    const r = inferLayout(
      { codes: new Set(['IntlBackslash']), keys: new Map([['Semicolon', 'ñ']]), platform: 'MacIntel', hasGetLayoutMap: true },
      { q: 'q', a: 'a', z: 'z', special: 'ñ', isoKey: '<', backquote: 'º' },
    );
    expect(r.suggested).toBe('mac-iso-es');
  });

  it('ISO LA con |', () => {
    const r = inferLayout(
      { codes: new Set(['IntlBackslash']), keys: new Map([['Semicolon', 'ñ'], ['Backquote', '|']]), platform: 'MacIntel', hasGetLayoutMap: true },
      { q: 'q', a: 'a', z: 'z', special: 'ñ', isoKey: '<', backquote: '|' },
    );
    expect(r.suggested).toBe('mac-iso-la');
  });
});
