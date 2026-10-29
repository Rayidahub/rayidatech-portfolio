// lib/privacy/cookie-consent.ts
// Cookie & Privacy Consent Management Engine for Rayida Tech
// Designed in accordance with the Nigeria Data Protection Act (NDPA) 2023

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export interface CookieConsentCategories {
  necessary: true; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  status: 'all' | 'essential' | 'custom';
  categories: CookieConsentCategories;
  timestamp: string;
  version: string;
}

export const CURRENT_POLICY_VERSION = '2026.1';
export const CONSENT_STORAGE_KEY = 'rayida_cookie_consent';
export const CONSENT_EVENT_NAME = 'rayida:consent-changed';
export const OPEN_PREFERENCES_EVENT = 'rayida:open-cookie-preferences';

const DEFAULT_ESSENTIAL_CONSENT: CookieConsentCategories = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
};

const DEFAULT_ALL_CONSENT: CookieConsentCategories = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

/**
 * Retrieves the stored consent state from localStorage (client-side only).
 */
export function getStoredConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentState;
    // Always enforce necessary = true
    parsed.categories.necessary = true;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Checks whether the user has explicitly consented to a specific cookie category.
 * If no consent is recorded, only 'necessary' returns true.
 */
export function hasConsentedTo(category: CookieCategory): boolean {
  if (category === 'necessary') return true;
  if (typeof window === 'undefined') return false;

  const state = getStoredConsent();
  if (!state) return false;

  return Boolean(state.categories[category]);
}

/**
 * Persists cookie preferences to localStorage and broadcasts the consent change event.
 */
export function saveConsent(
  status: 'all' | 'essential' | 'custom',
  customCategories?: Partial<CookieConsentCategories>
): CookieConsentState {
  if (typeof window === 'undefined') {
    return {
      status,
      categories: DEFAULT_ESSENTIAL_CONSENT,
      timestamp: new Date().toISOString(),
      version: CURRENT_POLICY_VERSION,
    };
  }

  let categories: CookieConsentCategories;
  if (status === 'all') {
    categories = { ...DEFAULT_ALL_CONSENT };
  } else if (status === 'essential') {
    categories = { ...DEFAULT_ESSENTIAL_CONSENT };
  } else {
    categories = {
      necessary: true,
      functional: customCategories?.functional ?? true,
      analytics: customCategories?.analytics ?? false,
      marketing: customCategories?.marketing ?? false,
    };
  }

  const newState: CookieConsentState = {
    status,
    categories,
    timestamp: new Date().toISOString(),
    version: CURRENT_POLICY_VERSION,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newState));
  } catch (err) {
    console.warn('[CookieConsent] Failed to persist consent in localStorage:', err);
  }

  // Broadcast event across the application
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, { detail: newState }));

  return newState;
}

/**
 * Triggers the Cookie Preferences modal to open from anywhere (e.g., footer button).
 */
export function triggerOpenCookiePreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}

/**
 * Subscribes to consent updates. Returns an unsubscribe cleanup function.
 */
export function subscribeToConsentChanges(
  callback: (state: CookieConsentState) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CookieConsentState>;
    callback(customEvent.detail);
  };

  window.addEventListener(CONSENT_EVENT_NAME, handler);
  return () => window.removeEventListener(CONSENT_EVENT_NAME, handler);
}
