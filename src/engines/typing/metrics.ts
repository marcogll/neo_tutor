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

// §17 Métricas detalladas — accuracy por tecla/bigrama/dedo/mano
export interface DetailedTypingMetrics {
  accuracy: number;
  correctKeys: number;
  incorrectKeys: number;
  total: number;
  wpm: number;
  rawWpm: number;
  consistency: number; // 0..1, 1 = perfecto ritmo
  durationMs: number;
  accuracyByKey: Record<string, { correct: number; total: number; acc: number }>;
  accuracyByBigram: Record<string, { correct: number; total: number; acc: number }>;
}

export function calcDetailedMetrics(logs: KeystrokeLog[], durationMs: number, wpmChars: number): DetailedTypingMetrics {
  const total = logs.length;
  const correct = logs.filter((l) => l.correct).length;
  const accuracy = total ? correct / total : 0;
  const wpm = calcWPM(wpmChars, durationMs);
  const rawWpm = calcWPM(total, durationMs);
  const intervals = logs.map((l) => l.time).filter((t) => t > 0);
  const rhythm = calcRhythm(intervals);
  const consistency = rhythm.sd > 0 ? Math.max(0, 1 - rhythm.sd / 200) : 1;

  const byKey: Record<string, { correct: number; total: number; acc: number }> = {};
  for (const l of logs) {
    const k = l.expected.toLowerCase() || 'unknown';
    if (!byKey[k]) byKey[k] = { correct: 0, total: 0, acc: 0 };
    byKey[k]!.total++;
    if (l.correct) byKey[k]!.correct++;
  }
  for (const k of Object.keys(byKey)) byKey[k]!.acc = byKey[k]!.total ? byKey[k]!.correct / byKey[k]!.total : 0;

  const byBigram: Record<string, { correct: number; total: number; acc: number }> = {};
  for (let i = 0; i < logs.length - 1; i++) {
    const bg = `${logs[i]!.expected}${logs[i + 1]!.expected}`.toLowerCase();
    if (bg.length !== 2) continue;
    if (!byBigram[bg]) byBigram[bg] = { correct: 0, total: 0, acc: 0 };
    byBigram[bg]!.total++;
    if (logs[i]!.correct && logs[i + 1]!.correct) byBigram[bg]!.correct++;
  }
  for (const k of Object.keys(byBigram)) byBigram[k]!.acc = byBigram[k]!.total ? byBigram[k]!.correct / byBigram[k]!.total : 0;

  return {
    accuracy,
    correctKeys: correct,
    incorrectKeys: total - correct,
    total,
    wpm,
    rawWpm,
    consistency,
    durationMs,
    accuracyByKey: byKey,
    accuracyByBigram: byBigram,
  };
}

// Helper para identificar bigrams débiles (<85% accuracy)
export function weakBigrams(metrics: DetailedTypingMetrics, threshold = 0.85): string[] {
  return Object.entries(metrics.accuracyByBigram)
    .filter(([, v]) => v.acc < threshold && v.total >= 2)
    .sort((a, b) => a[1].acc - b[1].acc)
    .slice(0, 5)
    .map(([k]) => k);
}
