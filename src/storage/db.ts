import Dexie, { type Table } from 'dexie';
import type { LessonDomain } from '@/domains/lesson';

// PRD §22
export interface UserProfile {
  id: string;
  language: string;
  preferences: Record<string, unknown>;
  createdAt: string;
}

export interface KeyboardProfile {
  id: string;
  physical: 'ANSI' | 'ISO';
  logical: 'US' | 'ES' | 'LA';
  platform: string;
  keys: { code: string; label: string; finger: string }[];
  modifiers: Record<string, string>;
  version: number;
  createdAt: string;
}

export interface PracticeSession {
  id: string;
  lessonId: string;
  domain: LessonDomain;
  startedAt: string;
  endedAt?: string;
  mode: 'guided' | 'zen' | 'vim';
  summary?: Record<string, unknown>;
}

export interface KeystrokeEvent {
  id?: number;
  sessionId: string;
  code: string;
  key: string;
  expected?: string;
  time: number;
  modifiers: { shift: boolean; alt: boolean; meta: boolean; ctrl: boolean };
  context?: string;
}

export interface SkillState {
  id: string; // `${domain}:${skillId}`
  domain: LessonDomain;
  skillId: string;
  mastery: number; // 0-1
  lastPracticedAt?: string;
  intervalDays: number;
  difficulty: number;
}

export interface VimAttempt {
  id?: number;
  lessonId: string;
  initialState: string;
  actions: string[];
  result: string;
  efficiency: number;
  hintsUsed: number;
  createdAt: string;
}

class NeoTypeDB extends Dexie {
  userProfiles!: Table<UserProfile, string>;
  keyboardProfiles!: Table<KeyboardProfile, string>;
  practiceSessions!: Table<PracticeSession, string>;
  keystrokeEvents!: Table<KeystrokeEvent, number>;
  skillStates!: Table<SkillState, string>;
  vimAttempts!: Table<VimAttempt, number>;

  constructor() {
    super('neotype');
    this.version(1).stores({
      userProfiles: 'id',
      keyboardProfiles: 'id',
      practiceSessions: 'id, lessonId',
      keystrokeEvents: '++id, sessionId',
      skillStates: 'id, domain',
      vimAttempts: '++id, lessonId',
    });
  }
}

export const db = new NeoTypeDB();
