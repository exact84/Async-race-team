import type { TypeGuard } from './types';

const LS_SUFFIX = '2a0000c0-e0af-4bda-9964-00d00208f5fc';

export type LocalStorageKey = 'app-theme';

export function getFromLocalStorage<T>(
  key: LocalStorageKey,
  typeGuard: TypeGuard<T>,
  fallback: T
): T {
  const storageValue = localStorage.getItem(`${key}-${LS_SUFFIX}`);

  if (!storageValue) {
    return fallback;
  }

  const parsedValue: unknown = JSON.parse(storageValue);

  return typeGuard(parsedValue) ? parsedValue : fallback;
}

export function setToLocalStorage(key: LocalStorageKey, value: unknown): void {
  localStorage.setItem(`${key}-${LS_SUFFIX}`, JSON.stringify(value));
}
