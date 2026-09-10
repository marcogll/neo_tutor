// PRD §18 — contrato común para typing, neovim, python, go
export type LessonDomain = 'typing' | 'neovim' | 'python' | 'go';

export interface LessonBlock {
  id: string;
  kind: 'position' | 'movement' | 'pattern' | 'syllable' | 'zen' | 'evaluation' | 'vim-challenge' | 'code';
  prompt?: string;
  targetKeys?: string[];
  content?: string;
  config?: Record<string, unknown>;
}

export interface EvaluatorConfig {
  kind: 'typing' | 'vim' | 'code';
  referenceKeystrokes?: number;
  acceptedSolutions?: string[];
  allowArrows?: boolean;
  disableBackspace?: boolean;
}

export interface MasteryRule {
  minAccuracy: number; // 0.95
  minFingerAccuracy?: number; // 0.90
  consecutivePasses: number;
}

export interface Lesson {
  id: string;
  version: number;
  domain: LessonDomain;
  title: string;
  objectives: string[];
  prerequisites: string[];
  blocks: LessonBlock[];
  evaluator: EvaluatorConfig;
  mastery: MasteryRule;
}
