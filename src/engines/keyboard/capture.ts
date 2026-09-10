// PRD §11.1 — captura code vs key, solo con foco en superficie de práctica
export interface CapturedKeystroke {
  code: string;
  key: string;
  time: number;
  modifiers: { shift: boolean; alt: boolean; meta: boolean; ctrl: boolean };
}

export function captureFromKeyboardEvent(e: KeyboardEvent): CapturedKeystroke {
  return {
    code: e.code,
    key: e.key,
    time: performance.now(),
    modifiers: {
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey,
      ctrl: e.ctrlKey,
    },
  };
}
