import { TYPING_ES } from './typing-es';
import { NEOVIM_ES } from './neovim-es';
import { PYTHON_ES } from './python-es';
import { GO_ES } from './go-es';
import type { Lesson } from '@/domains/lesson';

export const ALL_COURSES = [...TYPING_ES, ...NEOVIM_ES, ...PYTHON_ES, ...GO_ES] as Lesson[];
export const COURSE_BY_DOMAIN = { typing: TYPING_ES, neovim: NEOVIM_ES, python: PYTHON_ES, go: GO_ES } as const;

export function getAnyLesson(id: string) { return ALL_COURSES.find((l) => l.id === id); }
export function domainOf(id: string) { return ALL_COURSES.find((l) => l.id === id)?.domain ?? null; }
