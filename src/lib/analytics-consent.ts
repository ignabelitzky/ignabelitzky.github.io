export const analyticsConsentKey = 'ib-analytics-consent-v1';
export type AnalyticsConsent = 'accepted' | 'rejected' | null;

export interface ConsentStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function normalizeConsent(value: unknown): AnalyticsConsent {
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function readConsent(store: ConsentStore): AnalyticsConsent {
  try {
    return normalizeConsent(store.getItem(analyticsConsentKey));
  } catch {
    return null;
  }
}

export function writeConsent(store: ConsentStore, value: Exclude<AnalyticsConsent, null>): boolean {
  try {
    store.setItem(analyticsConsentKey, value);
    return true;
  } catch {
    return false;
  }
}

export function analyticsConfigured(measurementId: string): boolean {
  return /^G-[A-Z0-9]{4,}$/.test(measurementId.trim());
}
