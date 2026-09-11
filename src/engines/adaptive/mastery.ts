// PRD §15.2 + Curriculum §5,6,21,16 — reglas dominio, spaced repetition, dificultad adaptativa
// Mastery 0..100 con niveles introduced(0-20) → automatic(96-100)

export interface MasteryCheck {
  accuracy: number; // 0-1
  fingerAccuracy: number; // 0-1
  consecutivePasses: number;
}

export function canUnlock(check: MasteryCheck): boolean {
  return check.accuracy >= 0.95 && check.fingerAccuracy >= 0.9 && check.consecutivePasses >= 3;
}

export function shouldIncreaseDifficulty(prevAccuracy: number, nextAccuracy: number, nextWpm: number, prevWpm: number): boolean {
  // no subir si velocidad sube pero precisión baja §15.2
  if (nextWpm > prevWpm && nextAccuracy < prevAccuracy) return false;
  return nextAccuracy >= 0.95;
}

// dominio 0-100 con decaimiento leve (repetición espaciada) — 2 puntos por día
export function decayMastery(mastery: number, daysSince: number): number {
  return Math.max(0, mastery - daysSince * 2);
}

export function nextIntervalDays(mastery: number): number {
  // mastery 0..1 legacy compat
  const m = mastery > 1 ? mastery / 100 : mastery;
  if (m >= 0.9) return 7;
  if (m >= 0.7) return 3;
  return 1;
}

// §21 mastery 0..100 niveles
export function masteryLevel(score: number): 'introduced' | 'learning' | 'developing' | 'proficient' | 'strong' | 'automatic' {
  if (score >= 96) return 'automatic';
  if (score >= 81) return 'strong';
  if (score >= 61) return 'proficient';
  if (score >= 41) return 'developing';
  if (score >= 21) return 'learning';
  return 'introduced';
}

export function calcMasteryScore(prev: number, accuracy: number, passed: boolean): number {
  let s = prev;
  if (passed) s += 12 + Math.round(accuracy * 18);
  else s = Math.max(0, s - 8);
  if (accuracy >= 0.95 && passed) s += 5;
  return Math.max(0, Math.min(100, Math.round(s)));
}

// §6 intervalos 1,3,7,14,30 days
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

export function nextReviewAt(from: Date, reviewCount: number): string {
  const days = REVIEW_INTERVALS[Math.min(reviewCount, REVIEW_INTERVALS.length - 1)] ?? 30;
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function isDue(nextReviewAt: string | null | undefined): boolean {
  if (!nextReviewAt) return false;
  return new Date(nextReviewAt) <= new Date();
}

// §7 Adaptación a errores — clasifica y sugiere ejercicios
export type ErrorKind = 'motor' | 'memory' | 'concept' | 'syntax' | 'logic' | 'navigation' | 'attention';

export interface ErrorEvent {
  target: string;
  mistypedAs?: string;
  count: number;
  context: 'typing' | 'vim' | 'code';
  movement?: string;
}

export function classifyError(ev: { target: string; mistypedAs?: string; context: string }): ErrorKind {
  if (ev.context === 'typing' && ev.mistypedAs) {
    // si es tecla vecina físicamente → motor
    const neighbors: Record<string, string[]> = {
      f: ['r', 't', 'g', 'v'], r: ['f', 't', 'e'], // simplificado
    };
    if (neighbors[ev.target]?.includes(ev.mistypedAs)) return 'motor';
    return 'motor';
  }
  if (ev.context === 'vim') {
    if (ev.target.startsWith('dw') || ev.target.startsWith('ciw')) return 'memory';
    return 'navigation';
  }
  if (ev.context === 'code') {
    if (ev.target.includes(':') || ev.target.includes('(')) return 'syntax';
    return 'logic';
  }
  return 'attention';
}

// Genera ejercicios de remediación sin repetir toda la lección §7
export function remediationExercises(error: ErrorEvent): string[] {
  const t = error.target;
  const m = error.mistypedAs ?? '';
  // ejemplo: r→t confundido → ejercicios fr, rf, fra, fer, fre
  if (t === 'r' && m === 't') return ['fr', 'rf', 'fra', 'fer', 'fre'];
  if (t.length === 1 && m.length === 1) {
    return [`${t}${m}`, `${m}${t}`, `${t}${t}${m}`, `${m}${m}${t}`];
  }
  // bigram débil
  if (t.length === 2) return [t, t.split('').reverse().join(''), `${t}a`, `a${t}`];
  return [t];
}

// §15 dificultad 1..5
export function suggestDifficulty(masteryScore: number, accuracy: number): 1 | 2 | 3 | 4 | 5 {
  if (masteryScore < 20) return 1;
  if (masteryScore < 40) return 2;
  if (masteryScore < 60) return 3;
  if (masteryScore < 80) return 4;
  if (accuracy >= 0.95) return 5;
  return 4;
}
