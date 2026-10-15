'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Moon, Sun, ArrowRight, Loader2, Sparkles, Check } from 'lucide-react';
import { quickToggleDefaultThemeAction } from '@/app/actions/site-settings';
import type { ThemeMode } from '@/types/site-settings';

interface QuickThemeCardProps {
  initialTheme: ThemeMode;
  allowToggle: boolean;
}

export default function QuickThemeCard({
  initialTheme,
  allowToggle,
}: QuickThemeCardProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(initialTheme);
  const [isPending, startTransition] = useTransition();
  const [showSaved, setShowSaved] = useState(false);

  const handleToggle = () => {
    startTransition(async () => {
      const result = await quickToggleDefaultThemeAction();
      if (result.success && result.default_theme) {
        setCurrentTheme(result.default_theme);
        try {
          localStorage.setItem('theme', result.default_theme);
          document.documentElement.setAttribute('data-theme', result.default_theme);
          window.dispatchEvent(new Event('themechange'));
        } catch {}
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
      }
    });
  };

  const isDark = currentTheme === 'dark';

  return (
    <div className="glass rounded-2xl p-6 border border-(--line) relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                isDark
                  ? 'bg-violet-950/80 border-violet-500/30 text-cyan-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}
            >
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[11px] font-mono-tight uppercase tracking-wider text-mist-2 block">
                Website Default Theme
              </span>
              <h3 className="font-display font-bold text-base text-paper capitalize">
                {currentTheme} Mode
              </h3>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono-tight px-2.5 py-0.5 rounded-full border ${
              isDark
                ? 'bg-secondary/15 text-secondary border-secondary/30'
                : 'bg-primary/15 text-primary border-primary/30'
            }`}
          >
            {isDark ? 'Ink Deep (#1a1a2e)' : 'Porcelain (#f8f7fb)'}
          </span>
        </div>

        <p className="text-xs text-mist-2 mb-4 leading-relaxed">
          Visitors land on Rayida Tech in{' '}
          <strong className="text-paper capitalize">{currentTheme} mode</strong> by default.{' '}
          {allowToggle ? 'Visitor toggle is enabled.' : 'Visitor toggle is locked.'}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-(--line)">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-(--line) text-xs font-medium text-paper transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
          ) : showSaved ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>
            {isPending
              ? 'Switching...'
              : showSaved
              ? 'Saved!'
              : `Switch Default to ${isDark ? 'Light' : 'Dark'}`}
          </span>
        </button>

        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1 text-xs text-secondary hover:text-secondary/80 font-medium transition-colors"
        >
          <span>Appearance settings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

