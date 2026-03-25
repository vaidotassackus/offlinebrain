import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '../utils/storage';

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

interface SettingsState {
  hasSeeded: boolean;
  setHasSeeded: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hasSeeded: false,
      setHasSeeded: (v) => set({ hasSeeded: v }),
    }),
    {
      name: 'offlinebrain-settings',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
