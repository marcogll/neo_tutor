import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KeyboardProfile } from './profile';
import { createProfile } from './profile';
import type { LayoutId } from '@/content/layouts';

interface KeyboardState {
  activeProfile: KeyboardProfile | null;
  setProfile: (p: KeyboardProfile) => void;
  setLayout: (id: LayoutId) => void;
  clear: () => void;
}

export const useKeyboardStore = create<KeyboardState>()(
  persist(
    (set) => ({
      activeProfile: null,
      setProfile: (p) => set({ activeProfile: p }),
      setLayout: (id) => set({ activeProfile: createProfile(id) }),
      clear: () => set({ activeProfile: null }),
    }),
    { name: 'neotype:keyboard' },
  ),
);
