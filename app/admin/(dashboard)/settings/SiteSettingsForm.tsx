'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Save,
  Moon,
  Sun,
  Sparkles,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  ExternalLink,
  Shield,
  Loader2,
} from 'lucide-react';
import {
  updateSiteSettingsAction,
  resetVisitorThemePreferencesAction,
} from '@/app/actions/site-settings';
import type { SiteSettings, ThemeMode } from '@/types/site-settings';

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
}

export default function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [isResetting, startResetTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleThemeSelect = (mode: ThemeMode) => {
    setSettings((prev) => ({
      ...prev,
      default_theme: mode,
    }));
  };

  const handleToggleChange = (allow: boolean) => {
    setSettings((prev) => ({
      ...prev,
      allow_user_toggle: allow,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');

    startTransition(async () => {
      const result = await updateSiteSettingsAction(settings);
      if (result.success) {
        setStatus('success');
        setStatusMessage('Website theme settings saved successfully! Changes are live across the site.');
        if (result.settings) {
          setSettings(result.settings);
        }
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to save settings.');
      }
    });
  };

  const handleResetPreferences = () => {
    if (!confirm('This will reset saved theme preferences for all past visitors and apply the default theme immediately. Continue?')) {
      return;
    }

    startResetTransition(async () => {
      const result = await resetVisitorThemePreferencesAction();
      if (result.success && result.new_version) {
        setSettings((prev) => ({ ...prev, theme_version: result.new_version! }));
        try {
          localStorage.setItem('theme', settings.default_theme);
          localStorage.setItem('theme_version', String(result.new_version));
          document.documentElement.setAttribute('data-theme', settings.default_theme);
        } catch {}
        setStatus('success');
        setStatusMessage(`All visitor theme caches reset (Version ${result.new_version}). Everyone will see ${settings.default_theme} mode!`);
        setTimeout(() => setStatus('idle'), 4500);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to reset preferences.');
      }
    });
  };

  const previewTheme = (mode: ThemeMode) => {
    try {
      document.documentElement.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
      window.dispatchEvent(new Event('themechange'));
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--line)">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-tight text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Website Appearance
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-paper mt-1">
            Site &amp; Theme Settings
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Configure default theme mode (Dark/Light), visitor toggle controls, and global display behaviors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-(--line) text-xs font-medium text-mist-1 hover:text-paper hover:bg-white/[0.04] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Theme Settings</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {status !== 'idle' && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-3 transition-all ${
            status === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {status === 'success' ? (
            <Check className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <Sparkles className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Section: Pick Default Theme */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display font-semibold text-base text-paper flex items-center gap-2">
            <span>Default Website Theme</span>
            <span className="text-[11px] font-mono-tight text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
              Active: {settings.default_theme.toUpperCase()}
            </span>
          </h2>
          <p className="text-xs text-mist-2 mt-1">
            Select the default color theme applied when visitors land on Rayida Tech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dark Mode Card */}
          <div
            onClick={() => handleThemeSelect('dark')}
            className={`relative rounded-2xl p-6 cursor-pointer border transition-all duration-200 overflow-hidden ${
              settings.default_theme === 'dark'
                ? 'border-secondary/60 bg-white/[0.05] ring-2 ring-secondary/30 shadow-lg shadow-primary/10'
                : 'border-(--line) bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-paper">Dark Mode</h3>
                  <span className="text-[11px] font-mono-tight text-secondary">
                    Ink #1a1a2e &bull; Violet/Cyan
                  </span>
                </div>
              </div>

              {settings.default_theme === 'dark' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-[11px] font-mono-tight">
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected Default</span>
                </div>
              )}
            </div>

            {/* Visual Mini Mockup for Dark */}
            <div className="rounded-xl p-3.5 bg-[#1a1a2e] border border-white/10 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="h-3 w-16 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-sm opacity-80" />
                <div className="flex gap-1.5">
                  <div className="h-2 w-8 bg-white/20 rounded-full" />
                  <div className="h-2 w-8 bg-white/20 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-3/4 bg-white/90 rounded-sm font-bold" />
                <div className="h-2 w-1/2 bg-white/40 rounded-sm" />
              </div>
              <div className="pt-1 flex gap-2">
                <span className="h-5 px-2.5 bg-violet-600 text-[10px] text-white rounded-full flex items-center">
                  Start Project
                </span>
                <span className="h-5 px-2 bg-white/5 border border-white/10 text-[10px] text-cyan-400 rounded-full flex items-center">
                  98% Satisfaction
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <p className="text-mist-2">
                Deep obsidian &amp; navy background with neon cyan and violet highlights.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  previewTheme('dark');
                }}
                className="text-[11px] text-secondary hover:underline shrink-0 ml-2"
              >
                Preview live
              </button>
            </div>
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => handleThemeSelect('light')}
            className={`relative rounded-2xl p-6 cursor-pointer border transition-all duration-200 overflow-hidden ${
              settings.default_theme === 'light'
                ? 'border-primary/60 bg-white/[0.05] ring-2 ring-primary/30 shadow-lg shadow-primary/10'
                : 'border-(--line) bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-paper">Light Mode</h3>
                  <span className="text-[11px] font-mono-tight text-mist-2">
                    Ink #f8f7fb &bull; Crisp White
                  </span>
                </div>
              </div>

              {settings.default_theme === 'light' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[11px] font-mono-tight">
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected Default</span>
                </div>
              )}
            </div>

            {/* Visual Mini Mockup for Light */}
            <div className="rounded-xl p-3.5 bg-[#f8f7fb] border border-black/10 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <div className="h-3 w-16 bg-gradient-to-r from-purple-700 to-cyan-600 rounded-sm opacity-90" />
                <div className="flex gap-1.5">
                  <div className="h-2 w-8 bg-black/20 rounded-full" />
                  <div className="h-2 w-8 bg-black/20 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-3/4 bg-[#11111a] rounded-sm font-bold" />
                <div className="h-2 w-1/2 bg-black/40 rounded-sm" />
              </div>
              <div className="pt-1 flex gap-2">
                <span className="h-5 px-2.5 bg-[#7000e0] text-[10px] text-white rounded-full flex items-center">
                  Start Project
                </span>
                <span className="h-5 px-2 bg-black/5 border border-black/10 text-[10px] text-[#7000e0] rounded-full flex items-center">
                  98% Satisfaction
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <p className="text-mist-2">
                Clean porcelain canvas with deep slate typography and rich purple accents.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  previewTheme('light');
                }}
                className="text-[11px] text-primary hover:underline shrink-0 ml-2"
              >
                Preview live
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Control Settings */}
      <div className="glass rounded-2xl p-6 border border-(--line) space-y-6">
        <h3 className="font-display font-semibold text-base text-paper flex items-center gap-2">
          <Shield className="w-4 h-4 text-secondary" />
          <span>Visitor Theme Controls</span>
        </h3>

        <div className="space-y-5 divide-y divide-(--line)">
          {/* Allow Toggle Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="max-w-xl">
              <label className="text-sm font-medium text-paper block">
                Allow visitors to switch theme
              </label>
              <p className="text-xs text-mist-2 mt-0.5">
                Displays the theme toggle icon (Sun / Moon) in the public website navigation bar. If disabled, visitors will always view your chosen default theme.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.allow_user_toggle}
              onClick={() => handleToggleChange(!settings.allow_user_toggle)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.allow_user_toggle ? 'bg-primary' : 'bg-white/20'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.allow_user_toggle ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Preferences Cache */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
            <div className="max-w-xl">
              <label className="text-sm font-medium text-paper block">
                Reset all visitor theme preferences
              </label>
              <p className="text-xs text-mist-2 mt-0.5">
                Past visitors may have saved their previous choice in their browser. Clicking this bumps the theme version (currently v{settings.theme_version}) so all returning visitors are immediately updated to your selected default theme.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetPreferences}
              disabled={isResetting}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-(--line) text-xs font-medium text-mist-1 hover:text-paper hover:bg-white/[0.04] transition-colors shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset All Visitors Cache'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--line)">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Theme Settings</span>
        </button>
      </div>
    </form>
  );
}

