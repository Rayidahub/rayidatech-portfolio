'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  const mediaQueryList = window.matchMedia(QUERY);
  mediaQueryList.addEventListener('change', callback);
  return () => mediaQueryList.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * SSR-safe `prefers-reduced-motion` check via `useSyncExternalStore`.
 *
 * The server has no `matchMedia`, so `getServerSnapshot` always returns
 * `false` — React reuses that value for the first client render too, which
 * keeps hydration consistent even when a visitor's real preference differs.
 * The real value takes effect on the next paint after mount.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
