'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const THEME_KEY = 'theme';
const THEME_CHANGE_EVENT = 'themechange';

export function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // ignore
  }
  return 'light';
}

export function getClientTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const attr = document.documentElement.getAttribute('data-theme') as Theme | null;
  if (attr === 'light' || attr === 'dark') return attr;
  return getSavedTheme();
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(THEME_CHANGE_EVENT, handler);

  let observer: MutationObserver | null = null;
  if (typeof document !== 'undefined') {
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          callback();
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handler);
    if (observer) observer.disconnect();
  };
}

export function useActiveTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    getClientTheme,
    () => 'light'
  );
}
