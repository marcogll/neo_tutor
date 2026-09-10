// PRD KB002-KB005 — perfil versionado, re-etiquetado y guard de lecciones
import type { KeyboardLayout } from '@/content/layouts/types';
import { LAYOUTS, type LayoutId } from '@/content/layouts';

export interface KeyboardProfile extends KeyboardLayout {
  version: number;
  createdAt: string;
  overrides: Record<string, string>; // code -> label custom (KB002)
}

export function createProfile(layoutId: LayoutId): KeyboardProfile {
  const base = LAYOUTS[layoutId];
  return {
    ...structuredClone(base),
    version: 1,
    createdAt: new Date().toISOString(),
    overrides: {},
  };
}

export function applyOverride(profile: KeyboardProfile, code: string, label: string): KeyboardProfile {
  const next = structuredClone(profile);
  next.overrides[code] = label;
  const key = next.keys.find((k) => k.code === code);
  if (key) key.label = label;
  next.version += 1;
  return next;
}

export function resetOverrides(profile: KeyboardProfile): KeyboardProfile {
  const base = LAYOUTS[profile.id as LayoutId];
  if (!base) return profile;
  return {
    ...structuredClone(base),
    version: profile.version + 1,
    createdAt: profile.createdAt,
    overrides: {},
  };
}

/** KB005 — ninguna lección debe iniciar si sus teclas no existen */
export function canRunLesson(profile: KeyboardProfile, requiredCodes: string[]): boolean {
  const available = new Set(profile.keys.map((k) => k.code));
  return requiredCodes.every((c) => available.has(c));
}
