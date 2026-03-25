import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
