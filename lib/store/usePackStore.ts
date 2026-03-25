import { create } from 'zustand';

export interface Pack {
  id: string;
  name: string;
  description: string;
  category: string;
  sizeBytes: number;
  version: string;
  isRequired: boolean;
  isInstalled: boolean;
  installedAt: number | null;
}

interface PackState {
  packs: Pack[];
  setPacks: (packs: Pack[]) => void;
  updatePack: (id: string, updates: Partial<Pack>) => void;
}

export const usePackStore = create<PackState>((set) => ({
  packs: [],
  setPacks: (packs) => set({ packs }),
  updatePack: (id, updates) =>
    set((state) => ({
      packs: state.packs.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
}));
