// PRD §11.1 — señales técnicas + heurística
import type { LayoutId } from '@/content/layouts';

export interface DetectionSignals {
  codes: Set<string>; // codes observados (IntlBackslash, etc.)
  keys: Map<string, string>; // code -> key
  platform: string; // navigator.platform
  hasGetLayoutMap: boolean;
}

export interface DetectionResult {
  suggested: LayoutId;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
}

/**
 * Inferencia no concluyente — propone layout según §11.1.
 * Nunca afirma modelo exacto; requiere confirmación del usuario.
 */
export function inferLayout(signals: DetectionSignals, calibration: CalibrationAnswers): DetectionResult {
  const reasons: string[] = [];
  const hasIso = signals.codes.has('IntlBackslash') || calibration.isoKey === '<';
  const hasEnie = calibration.special === 'ñ' || signals.keys.get('Semicolon') === 'ñ';

  if (hasIso) reasons.push('IntlBackslash presente → ISO');
  else reasons.push('Sin IntlBackslash → ANSI');

  if (hasEnie) reasons.push('Ñ detectada → ES/LA');
  else reasons.push('Sin Ñ → US');

  // Q/A/Z consistencia QWERTY — si falla, confianza baja
  const qOk = signals.keys.get('KeyQ')?.toLowerCase() === 'q';
  if (!qOk && signals.keys.size > 0) reasons.push('Q no coincide — posible AZERTY u otro');

  let suggested: LayoutId = 'mac-ansi-us';
  if (hasIso && hasEnie) {
    // distinguir ES vs LA por etiqueta secundaria (´ vs {) o por key específica
    // heurística simple: si Backquote es º → ES, si es | → LA
    const bq = signals.keys.get('Backquote') ?? calibration.backquote;
    if (bq === '|') {
      suggested = 'mac-iso-la';
      reasons.push('Backquote = | → LA');
    } else {
      suggested = 'mac-iso-es';
      reasons.push('Backquote = º → ES');
    }
  } else if (hasIso) {
    suggested = 'mac-iso-es';
  } else if (hasEnie) {
    // ISO sin IntlBackslash es raro, pero cae a ES por Ñ
    suggested = 'mac-iso-es';
  }

  const confidence = signals.codes.size >= 3 && calibration.q === 'q' ? 'high' : signals.codes.size >= 1 ? 'medium' : 'low';

  return { suggested, confidence, reasons };
}

export interface CalibrationAnswers {
  q: string; // lo que produjo KeyQ
  a: string;
  z: string;
  special: string; // ñ o ;
  isoKey: string; // < o vacío
  backquote: string;
  metaSide?: string;
}
