import { create } from 'zustand';

type BannerState = 'offline' | 'syncing' | 'online';

interface NetworkState {
  isOnline: boolean;
  isSyncing: boolean;
  bannerState: BannerState;
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
}

function deriveBannerState(isOnline: boolean, isSyncing: boolean): BannerState {
  if (!isOnline) return 'offline';
  if (isSyncing) return 'syncing';
  return 'online';
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: true,
  isSyncing: false,
  bannerState: 'online',
  setOnline: (online) =>
    set((state) => ({
      isOnline: online,
      bannerState: deriveBannerState(online, state.isSyncing),
    })),
  setSyncing: (syncing) =>
    set((state) => ({
      isSyncing: syncing,
      bannerState: deriveBannerState(state.isOnline, syncing),
    })),
}));
