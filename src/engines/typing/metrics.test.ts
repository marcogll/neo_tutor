import { describe, expect, it } from 'vitest';
import { calcAccuracy, calcRhythm, calcWPM } from './metrics';

describe('metrics', () => {
  it('precisión', () => {
    expect(calcAccuracy([{ expected: 'a', received: 'a', code: 'KeyA', time: 0, correct: true }])).toBe(1);
    expect(calcAccuracy([{ expected: 'a', received: 'b', code: 'KeyA', time: 0, correct: false }])).toBe(0);
  });
  it('WPM', () => {
    expect(calcWPM(25, 60000)).toBe(5); // 25 chars = 5 palabras en 1min
  });
  it('ritmo sd baja = estable', () => {
    const r = calcRhythm([100, 102, 98]);
    expect(r.sd).toBeLessThan(5);
  });
});
