'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

const THEME_KEY = 'theme';
const THEME_CHANGE_EVENT = 'themechange';

function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // ignore
  }
  return 'dark';
}

function getClientTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme') as Theme | null;
  if (attr === 'light' || attr === 'dark') return attr;
  return getSavedTheme();
}

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(THEME_CHANGE_EVENT, handler);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, handler);
}

function setTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getClientTheme,
    () => 'dark'
  );
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="rounded-full p-2 text-mist-2 transition-colors hover:text-paper"
      >
        <Moon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-full p-2 text-mist-2 transition-colors hover:text-paper hover:bg-paper/5"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
