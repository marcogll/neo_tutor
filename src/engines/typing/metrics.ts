// PRD §12, §15 — métricas deterministas typing

export interface KeystrokeLog {
  expected: string;
  received: string;
  code: string;
  time: number; // ms desde inicio
  correct: boolean;
}

export function calcAccuracy(logs: KeystrokeLog[]): number {
  if (logs.length === 0) return 0;
  return logs.filter((l) => l.correct).length / logs.length;
}

export function calcWPM(chars: number, ms: number): number {
  if (ms <= 0) return 0;
  return (chars / 5) / (ms / 60000);
}

export interface RhythmStats {
  mean: number;
  median: number;
  sd: number;
  count: number;
}

export function calcRhythm(intervals: number[]): RhythmStats {
  if (intervals.length === 0) return { mean: 0, median: 0, sd: 0, count: 0 };
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const sorted = [...intervals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
  const variance = intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length;
  return { mean, median, sd: Math.sqrt(variance), count: intervals.length };
}

// TY002 — conserva contexto para cada error
export function buildKeystrokeLog(
  target: string,
  input: string,
  codes: string[],
  times: number[],
): KeystrokeLog[] {
  const n = Math.max(target.length, input.length);
  const logs: KeystrokeLog[] = [];
  for (let i = 0; i < n; i++) {
    const expected = target[i] ?? '';
    const received = input[i] ?? '';
    logs.push({
      expected,
      received,
      code: codes[i] ?? '',
      time: times[i] ?? 0,
      correct: expected === received && expected !== '',
    });
  }
  return logs;
}
