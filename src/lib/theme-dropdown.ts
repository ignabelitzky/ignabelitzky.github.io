import type { ThemePreference } from './theme.ts';

export const themeOptions: readonly ThemePreference[] = ['system', 'light', 'dark'];
export interface DropdownState {
  open: boolean;
  active: number;
  selected: ThemePreference;
}
export interface KeyResult {
  state: DropdownState;
  handled: boolean;
  commit?: ThemePreference;
}

// Selection is committed only with Enter/Space. Escape and Tab discard a previewed option.
export function themeKeyResult(state: DropdownState, key: string): KeyResult {
  const selectedIndex = themeOptions.indexOf(state.selected);
  if (key === 'Escape' || key === 'Tab') {
    return {
      state: { ...state, open: false, active: selectedIndex },
      handled: state.open && key === 'Escape',
    };
  }
  if (key === 'Enter' || key === ' ') {
    if (!state.open)
      return { state: { ...state, open: true, active: selectedIndex }, handled: true };
    const commit = themeOptions[state.active]!;
    return {
      state: { open: false, active: state.active, selected: commit },
      handled: true,
      commit,
    };
  }
  if (key === 'ArrowDown' || key === 'ArrowUp') {
    const step = key === 'ArrowDown' ? 1 : -1;
    const active = state.open
      ? (state.active + step + themeOptions.length) % themeOptions.length
      : selectedIndex;
    return { state: { ...state, open: true, active }, handled: true };
  }
  if (key === 'Home' || key === 'End') {
    return {
      state: { ...state, open: true, active: key === 'Home' ? 0 : themeOptions.length - 1 },
      handled: true,
    };
  }
  return { state, handled: false };
}
