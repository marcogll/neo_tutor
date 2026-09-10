import type { KeyboardLayout } from './types';
import ansiUs from './mac-ansi-us.json';
import isoEs from './mac-iso-es.json';
import isoLa from './mac-iso-la.json';

export const LAYOUTS = {
  'mac-ansi-us': ansiUs as KeyboardLayout,
  'mac-iso-es': isoEs as KeyboardLayout,
  'mac-iso-la': isoLa as KeyboardLayout,
} as const;

export type LayoutId = keyof typeof LAYOUTS;

export const LAYOUT_LIST = Object.values(LAYOUTS);

export function getLayout(id: string): KeyboardLayout | undefined {
  return LAYOUTS[id as LayoutId];
}

export function hasCode(layout: KeyboardLayout, code: string): boolean {
  return layout.keys.some((k) => k.code === code);
}
