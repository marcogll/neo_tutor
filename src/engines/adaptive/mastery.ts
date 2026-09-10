// PRD §15.2 — reglas de dominio 0-1 + desbloqueo

export interface MasteryCheck {
  accuracy: number; // 0-1
  fingerAccuracy: number; // 0-1
  consecutivePasses: number;
}

export function canUnlock(check: MasteryCheck): boolean {
  return check.accuracy >= 0.95 && check.fingerAccuracy >= 0.9 && check.consecutivePasses >= 3;
}

export function shouldIncreaseDifficulty(prevAccuracy: number, nextAccuracy: number, nextWpm: number, prevWpm: number): boolean {
  // no subir si velocidad sube pero precisión baja
  if (nextWpm > prevWpm && nextAccuracy < prevAccuracy) return false;
  return nextAccuracy >= 0.95;
}

// dominio 0-1 con decaimiento leve (repetición espaciada)
export function decayMastery(mastery: number, daysSince: number): number {
  return Math.max(0, mastery - daysSince * 0.02);
}

export function nextIntervalDays(mastery: number): number {
  if (mastery >= 0.9) return 7;
  if (mastery >= 0.7) return 3;
  return 1;
}
