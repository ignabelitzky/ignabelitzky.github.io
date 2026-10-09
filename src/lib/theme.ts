export const themeKey = 'ib-theme';
export type ThemePreference = 'system' | 'light' | 'dark';
export interface PreferenceStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function normalizeTheme(value: unknown): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}
export function readTheme(store: PreferenceStore): ThemePreference {
  try {
    return normalizeTheme(store.getItem(themeKey));
  } catch {
    return 'system';
  }
}
export function writeTheme(store: PreferenceStore, value: ThemePreference): boolean {
  try {
    store.setItem(themeKey, value);
    return true;
  } catch {
    return false;
  }
}
export function effectiveTheme(
  preference: ThemePreference,
  systemIsDark: boolean,
): 'light' | 'dark' {
  return preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference;
}
