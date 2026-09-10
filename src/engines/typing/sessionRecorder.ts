// PRD TY002-TY003 — event sourcing ligero, determinista
export interface KeystrokeEvent {
  code: string;
  key: string;
  expected: string;
  time: number;
  correct: boolean;
  context: string; // bigrama anterior
}

export interface SessionStats {
  events: KeystrokeEvent[];
  accuracy: number; // 0-1
  wpmNet: number;
  latencies: number[]; // ms entre pulsaciones
  rhythmSd: number;
  backspaces: number;
  startedAt: number;
  endedAt?: number;
}

export function createSession(_target: string): SessionStats {
  return { events: [], accuracy: 0, wpmNet: 0, latencies: [], rhythmSd: 0, backspaces: 0, startedAt: performance.now() };
}

export function recordKeystroke(session: SessionStats, code: string, key: string, expected: string, context: string): SessionStats {
  const correct = key === expected && expected !== '';
  const events = [...session.events, { code, key, expected, time: performance.now(), correct, context }];
  const latencies = events.slice(1).map((e, i) => e.time - events[i]!.time);
  const mean = latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
  const variance = latencies.length ? latencies.reduce((a, b) => a + (b - mean) ** 2, 0) / latencies.length : 0;
  const rhythmSd = Math.sqrt(variance);
  const accuracy = events.length ? events.filter((e) => e.correct).length / events.length : 0;
  const elapsedMin = (performance.now() - session.startedAt) / 60000;
  const wpmNet = elapsedMin > 0 ? (events.filter((e) => e.correct).length / 5) / elapsedMin : 0;
  return { ...session, events, accuracy, wpmNet, latencies, rhythmSd };
}
