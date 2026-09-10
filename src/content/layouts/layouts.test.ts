import { describe, expect, it } from 'vitest';
import { LAYOUTS } from './index';

describe('layouts', () => {
  it('los tres layouts existen y tienen physical/logical correctos', () => {
    expect(LAYOUTS['mac-ansi-us'].physical).toBe('ANSI');
    expect(LAYOUTS['mac-ansi-us'].logical).toBe('US');
    expect(LAYOUTS['mac-iso-es'].physical).toBe('ISO');
    expect(LAYOUTS['mac-iso-es'].logical).toBe('ES');
    expect(LAYOUTS['mac-iso-la'].physical).toBe('ISO');
    expect(LAYOUTS['mac-iso-la'].logical).toBe('LA');
  });

  it('ANSI no tiene IntlBackslash, ISO sí', () => {
    const ansiCodes = LAYOUTS['mac-ansi-us'].keys.map((k) => k.code);
    const isoEsCodes = LAYOUTS['mac-iso-es'].keys.map((k) => k.code);
    expect(ansiCodes).not.toContain('IntlBackslash');
    expect(isoEsCodes).toContain('IntlBackslash');
  });

  it('ISO ES y LA tienen ñ en Semicolon', () => {
    const es = LAYOUTS['mac-iso-es'].keys.find((k) => k.code === 'Semicolon');
    const la = LAYOUTS['mac-iso-la'].keys.find((k) => k.code === 'Semicolon');
    expect(es?.label).toBe('ñ');
    expect(la?.label).toBe('ñ');
  });

  it('US tiene ; en Semicolon, no ñ', () => {
    const us = LAYOUTS['mac-ansi-us'].keys.find((k) => k.code === 'Semicolon');
    expect(us?.label).toBe(';');
  });
});
