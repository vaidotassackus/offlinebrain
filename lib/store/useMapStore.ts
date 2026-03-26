import { create } from 'zustand';
import type { MapRegion } from '../maps/types';
import { MOCK_REGIONS } from '../maps/regions';

interface MapState {
  regions: MapRegion[];
  setRegions: (regions: MapRegion[]) => void;
  updateRegion: (id: string, updates: Partial<MapRegion>) => void;
}

export const useMapStore = create<MapState>((set) => ({
  regions: MOCK_REGIONS,
  setRegions: (regions) => set({ regions }),
  updateRegion: (id, updates) =>
    set((state) => ({
      regions: state.regions.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
}));
