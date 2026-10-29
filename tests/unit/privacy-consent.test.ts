import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import {
  getStoredConsent,
  hasConsentedTo,
  saveConsent,
  CONSENT_STORAGE_KEY,
  CURRENT_POLICY_VERSION,
} from '@/lib/privacy/cookie-consent';

// Mock browser storage for Node test environment
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

describe('Privacy & Cookie Consent Management', () => {
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;

  beforeAll(() => {
    const mockStorage = new LocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'window', {
      value: {
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      },
      writable: true,
      configurable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('defaults to allowing only strictly necessary storage when no consent is stored', () => {
    expect(hasConsentedTo('necessary')).toBe(true);
    expect(hasConsentedTo('functional')).toBe(false);
    expect(hasConsentedTo('analytics')).toBe(false);
    expect(hasConsentedTo('marketing')).toBe(false);
  });

  it('stores and honors "Accept All" consent', () => {
    const state = saveConsent('all');

    expect(state.status).toBe('all');
    expect(state.categories.necessary).toBe(true);
    expect(state.categories.functional).toBe(true);
    expect(state.categories.analytics).toBe(true);
    expect(state.categories.marketing).toBe(true);
    expect(state.version).toBe(CURRENT_POLICY_VERSION);

    expect(hasConsentedTo('necessary')).toBe(true);
    expect(hasConsentedTo('functional')).toBe(true);
    expect(hasConsentedTo('analytics')).toBe(true);
    expect(hasConsentedTo('marketing')).toBe(true);
  });

  it('stores and honors "Reject Non-Essential" (essential-only) consent', () => {
    const state = saveConsent('essential');

    expect(state.status).toBe('essential');
    expect(state.categories.necessary).toBe(true);
    expect(state.categories.functional).toBe(true);
    expect(state.categories.analytics).toBe(false);
    expect(state.categories.marketing).toBe(false);

    expect(hasConsentedTo('necessary')).toBe(true);
    expect(hasConsentedTo('functional')).toBe(true);
    expect(hasConsentedTo('analytics')).toBe(false);
    expect(hasConsentedTo('marketing')).toBe(false);
  });

  it('stores and honors custom category preferences while always enforcing necessary=true', () => {
    const state = saveConsent('custom', {
      functional: true,
      analytics: false,
      marketing: false,
    });

    expect(state.status).toBe('custom');
    expect(state.categories.necessary).toBe(true);
    expect(state.categories.functional).toBe(true);
    expect(state.categories.analytics).toBe(false);
    expect(state.categories.marketing).toBe(false);

    // Verify localStorage persistence
    const stored = getStoredConsent();
    expect(stored).not.toBeNull();
    expect(stored?.categories.necessary).toBe(true);
    expect(stored?.categories.analytics).toBe(false);
  });

  it('persists policy version and valid ISO timestamp with consent record', () => {
    const state = saveConsent('essential');
    expect(state.version).toBe(CURRENT_POLICY_VERSION);
    expect(new Date(state.timestamp).getTime()).toBeGreaterThan(0);

    const raw = globalThis.localStorage.getItem(CONSENT_STORAGE_KEY);
    expect(raw).toContain(CURRENT_POLICY_VERSION);
  });
});
