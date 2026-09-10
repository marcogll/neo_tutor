// PG001-PG004 reservado: evaluación local sin red, límites simulados
// En MVP solo valida presencia de tokens, no ejecuta real (seguridad §23)

export interface CodeCheck {
  ok: boolean;
  reason: string;
  hint?: string;
}

export function checkPython(code: string, expectedTokens: string[]): CodeCheck {
  const missing = expectedTokens.filter((t) => !code.includes(t));
  if (missing.length) return { ok: false, reason: `Falta: ${missing.join(', ')}`, hint: `Incluye ${missing[0]}` };
  if (code.includes('import os') || code.includes('socket')) return { ok: false, reason: 'Red no permitida PG002' };
  return { ok: true, reason: 'OK' };
}

export function checkGo(code: string, expectedTokens: string[]): CodeCheck {
  const missing = expectedTokens.filter((t) => !code.includes(t));
  if (missing.length) return { ok: false, reason: `Falta: ${missing.join(', ')}` };
  // GO001 gofmt simulado: debe terminar con newline
  if (!code.endsWith('\n') && !code.endsWith('}')) return { ok: false, reason: 'Formato gofmt GO001: añade salto final' };
  return { ok: true, reason: 'OK' };
}
