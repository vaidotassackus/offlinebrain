import { createMMKV, type MMKV } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({ id: 'offlinebrain' });

export function getStorageItem(key: string): string | undefined {
  return storage.getString(key);
}

export function setStorageItem(key: string, value: string): void {
  storage.set(key, value);
}

export function removeStorageItem(key: string): void {
  storage.remove(key);
}

export function getStorageBool(key: string): boolean {
  return storage.getBoolean(key) ?? false;
}

export function setStorageBool(key: string, value: boolean): void {
  storage.set(key, value);
}
