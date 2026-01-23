import type { AppTheme } from '../components/theme-switcher/theme-switcher';

export function isAppTheme(input: unknown): input is AppTheme {
  return typeof input === 'string' && (input === 'dark' || input === 'light' || input === 'system');
}

export function isEmptyObject(input: unknown): input is object {
  return typeof input === 'object' && input !== null && Object.keys(input).length === 0;
}
