'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  ExternalLink,
  Check,
  Loader2,
  Sparkles,
  Sliders,
  Layers,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Play,
  Pause,
  Gauge,
  Clock,
  Zap,
  Turtle,
  Waves,
  Palette,
  Sun,
  Moon,
  Smartphone,
  Monitor,
  RotateCcw,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { updateHeroSettingsAction } from '@/app/actions/hero-settings';
import type { HeroSettings, HeroGradientSettings } from '@/types/hero-settings';
import type { HeroSlide } from '@/lib/data/hero-slides';
import {
  defaultHeroGradientSettings,
  mergeHeroGradientSettings,
  buildHeroGradientCss,
  isValidHex,
} from '@/lib/hero-gradient';

interface HeroSettingsFormProps {
  initialSettings: HeroSettings;
  slides?: HeroSlide[];
}

export default function HeroSettingsForm({ initialSettings, slides = [] }: HeroSettingsFormProps) {
  const [settings, setSettings] = useState<HeroSettings>(() => ({
    ...initialSettings,
    gradient: mergeHeroGradientSettings(initialSettings.gradient),
  }));

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Interactive Admin Preview State
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  // Active Gradient Tab
  const [gradientTab, setGradientTab] = useState<'dark' | 'light' | 'mobile' | 'blur'>('dark');

  const currentGradient = settings.gradient || defaultHeroGradientSettings;
  const currentSlide = slides[previewSlideIdx] || slides[0] || {
    label: 'Rayida Tech',
    words: ['Build.', 'Scale.', 'Dominate Your', 'Digital Presence'],
    body: 'We design and develop powerful digital solutions that help startups and businesses grow.',
    image: '/img/about-portrait.png',
  };

  const handleInputChange = (field: keyof HeroSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGradientChange = (updater: (prev: HeroGradientSettings) => HeroGradientSettings) => {
    setSettings((prev) => {
      const existing = prev.gradient || defaultHeroGradientSettings;
      const updated = updater(existing);
      return {
        ...prev,
        gradient: mergeHeroGradientSettings(updated),
      };
    });
  };

  const handleResetGradientDefaults = () => {
    if (confirm('Reset hero background gradient controls to recommended default settings?')) {
      handleGradientChange(() => defaultHeroGradientSettings);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');

    // Validate colors before saving
    const finalGradient = mergeHeroGradientSettings(settings.gradient);
    if (!isValidHex(finalGradient.dark.color)) {
      finalGradient.dark.color = '#0A0C18';
    }
    if (!isValidHex(finalGradient.light.color)) {
      finalGradient.light.color = '#FFFFFF';
    }

    const payload: HeroSettings = {
      ...settings,
      gradient: finalGradient,
    };

    startTransition(async () => {
      const result = await updateHeroSettingsAction(payload);
      if (result.success) {
        setStatus('success');
        setStatusMessage('Hero section & background gradient settings saved successfully!');
        setTimeout(() => setStatus('idle'), 4500);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to update hero settings.');
      }
    });
  };

  const previewCss = buildHeroGradientCss(
    currentGradient,
    previewTheme,
    previewDevice === 'mobile'
  );

  const previewBlurAmount =
    currentGradient.blur.enabled && currentGradient.blur.amount > 0
      ? currentGradient.blur.amount
      : 0;

  const inputClass =
    'w-full px-3.5 py-2.5 bg-ink border border-(--line) rounded-lg text-paper text-sm placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--line)">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/hero"
            className="p-2 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/[0.04] transition-colors"
            title="Back to Hero Slides"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-paper">Hero Section Settings</h1>
            <p className="text-xs text-mist-2 mt-0.5">
              Control the theme-aware background gradient, slider flow, status pill, and call-to-actions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-(--line) text-mist-1 hover:text-paper text-xs font-medium transition-colors"
          >
            <span>Preview Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-paper text-sm font-medium transition-all shadow-md shadow-primary/20 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {status === 'success' && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <Check className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ── LIVE INTERACTIVE HERO GRADIENT SIMULATOR ── */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-display uppercase tracking-wider">Live Gradient & Composition Preview</h2>
          </div>

          {/* Preview Controls (Theme / Device / Slide) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Theme Toggle */}
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-(--line)">
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono-tight transition-all cursor-pointer ${
                  previewTheme === 'dark'
                    ? 'bg-primary text-paper font-medium shadow-sm'
                    : 'text-mist-2 hover:text-paper'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono-tight transition-all cursor-pointer ${
                  previewTheme === 'light'
                    ? 'bg-primary text-paper font-medium shadow-sm'
                    : 'text-mist-2 hover:text-paper'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Light</span>
              </button>
            </div>

            {/* Device Toggle */}
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-(--line)">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono-tight transition-all cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-secondary/20 text-secondary border border-secondary/30 font-medium'
                    : 'text-mist-2 hover:text-paper'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono-tight transition-all cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-secondary/20 text-secondary border border-secondary/30 font-medium'
                    : 'text-mist-2 hover:text-paper'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Slide Selector */}
            {slides.length > 0 && (
              <select
                value={previewSlideIdx}
                onChange={(e) => setPreviewSlideIdx(Number(e.target.value))}
                className="bg-white/5 border border-(--line) text-paper text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary"
              >
                {slides.map((s, idx) => (
                  <option key={idx} value={idx} className="bg-ink text-paper">
                    Slide {idx + 1}: {s.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Live Simulator Viewport */}
        <div
          className={`relative mx-auto rounded-xl overflow-hidden border border-(--line) shadow-2xl transition-all duration-300 ${
            previewDevice === 'mobile'
              ? 'max-w-sm min-h-[460px]'
              : 'w-full min-h-[380px]'
          } ${previewTheme === 'light' ? 'bg-[#f8f7fb]' : 'bg-[#1a1a2e]'}`}
          style={{
            colorScheme: previewTheme,
          }}
        >
          {/* Background Image Layer with optional Blur */}
          <div className="absolute inset-0 z-0 overflow-hidden select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSlide.image}
              alt={currentSlide.label}
              className={`w-full h-full object-cover ${
                previewDevice === 'mobile' ? 'object-center' : 'object-center md:object-[center_right]'
              } ${previewBlurAmount > 0 ? 'scale-105' : ''}`}
              style={previewBlurAmount > 0 ? { filter: `blur(${previewBlurAmount}px)` } : undefined}
            />
          </div>

          {/* Simulated Dynamic Gradient Overlay */}
          {previewCss !== 'none' && (
            <div
              className="absolute inset-0 z-[1] transition-all duration-200 pointer-events-none"
              style={{ background: previewCss }}
            />
          )}

          {/* Grid pattern texture */}
          <div
            className="bg-grid-pattern absolute inset-0 z-[2] opacity-20 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
            }}
          />

          {/* Simulated Foreground Content */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-center h-full min-h-[360px] max-w-xl">
            {/* Status Pill simulation */}
            {settings.show_status_pill && (
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-medium border backdrop-blur-md ${
                    previewTheme === 'light'
                      ? 'bg-white/80 border-black/10 text-slate-800 shadow-sm'
                      : 'bg-white/10 border-white/15 text-slate-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      settings.status_pill_available ? 'bg-emerald-400' : 'bg-slate-400'
                    }`}
                  />
                  <span>{settings.status_pill_text || 'Available for projects'}</span>
                </span>
              </div>
            )}

            {/* Category Kicker */}
            <p className="flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-widest text-secondary font-semibold">
              <span className="h-px w-6 bg-secondary/60" />
              {currentSlide.label}
            </p>

            {/* Simulated Title */}
            <h3
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-2 leading-tight ${
                previewTheme === 'light' ? 'text-slate-900' : 'text-slate-100'
              }`}
            >
              {currentSlide.words.slice(0, 2).join(' ')}{' '}
              <span className="text-primary">{currentSlide.words[2] || 'Digital Reach'}</span>
            </h3>

            {/* Simulated Body Copy */}
            <p
              className={`text-xs sm:text-sm mt-3 line-clamp-2 leading-relaxed ${
                previewTheme === 'light' ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              {currentSlide.body}
            </p>

            {/* Buttons simulation */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {settings.primary_cta_label && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm">
                  <span>{settings.primary_cta_label}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              )}
              {settings.secondary_cta_label && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium border backdrop-blur-sm ${
                    previewTheme === 'light'
                      ? 'border-black/15 bg-black/5 text-slate-900'
                      : 'border-white/15 bg-white/5 text-white'
                  }`}
                >
                  <span>{settings.secondary_cta_label}</span>
                </span>
              )}
            </div>

            {/* Stats row simulation */}
            <div
              className={`mt-6 pt-4 border-t flex items-center gap-4 text-xs ${
                previewTheme === 'light'
                  ? 'border-black/10 text-slate-700'
                  : 'border-white/10 text-slate-300'
              }`}
            >
              <div>
                <span className="font-bold font-display text-sm">50+</span> Projects
              </div>
              <div>
                <span className="font-bold font-display text-sm">5+ Yrs</span> Experience
              </div>
              <div>
                <span className="font-bold font-display text-sm text-primary">
                  {settings.floating_stat_value || '98%'}
                </span>{' '}
                Satisfaction
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono-tight text-mist-2 bg-white/[0.02] p-2.5 rounded-lg border border-(--line) gap-2">
          <span>Active CSS: {previewCss.substring(0, 95)}...</span>
          <span className="shrink-0 text-secondary">
            {previewDevice === 'desktop'
              ? `${previewTheme.toUpperCase()} Desktop (${currentGradient[previewTheme].width}% reach @ ${currentGradient[previewTheme].opacity}% opacity)`
              : `${previewTheme.toUpperCase()} Mobile (${currentGradient.mobile.direction} @ ${currentGradient.mobile.opacity}% opacity)`}
          </span>
        </div>
      </div>

      {/* ── SECTION: HERO BACKGROUND GRADIENT CONTROLS ── */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--line) pb-4">
          <div className="flex items-center gap-2.5 text-paper font-semibold">
            <Palette className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-display">Hero Background Gradient Controls</h2>
              <p className="text-xs text-mist-2 font-normal mt-0.5">
                Configure theme-aware gradient overlays, opacity, reach width, fade stops, and background blur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetGradientDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) text-mist-1 hover:text-paper text-xs font-mono-tight transition-colors cursor-pointer hover:bg-white/5"
              title="Reset all gradient settings to recommended defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            {/* Master Gradient Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-paper bg-white/5 px-3 py-1.5 rounded-lg border border-(--line)">
              <input
                type="checkbox"
                checked={currentGradient.enabled}
                onChange={(e) =>
                  handleGradientChange((prev) => ({
                    ...prev,
                    enabled: e.target.checked,
                  }))
                }
                className="rounded border-(--line) text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span>Master Overlay: {currentGradient.enabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
        </div>

        {/* Tab Navigation for Gradient Settings */}
        <div className="flex flex-wrap items-center gap-2 border-b border-(--line) pb-2">
          <button
            type="button"
            onClick={() => {
              setGradientTab('dark');
              setPreviewTheme('dark');
              setPreviewDevice('desktop');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              gradientTab === 'dark'
                ? 'bg-primary text-paper shadow-md shadow-primary/20'
                : 'text-mist-1 hover:text-paper hover:bg-white/5'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Theme Gradient</span>
            <span className="text-[10px] opacity-75 font-mono-tight">({currentGradient.dark.width}%)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGradientTab('light');
              setPreviewTheme('light');
              setPreviewDevice('desktop');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              gradientTab === 'light'
                ? 'bg-primary text-paper shadow-md shadow-primary/20'
                : 'text-mist-1 hover:text-paper hover:bg-white/5'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Theme Gradient</span>
            <span className="text-[10px] opacity-75 font-mono-tight">({currentGradient.light.width}%)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGradientTab('mobile');
              setPreviewDevice('mobile');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              gradientTab === 'mobile'
                ? 'bg-primary text-paper shadow-md shadow-primary/20'
                : 'text-mist-1 hover:text-paper hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Overrides</span>
          </button>

          <button
            type="button"
            onClick={() => setGradientTab('blur')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              gradientTab === 'blur'
                ? 'bg-primary text-paper shadow-md shadow-primary/20'
                : 'text-mist-1 hover:text-paper hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Background Blur</span>
            {currentGradient.blur.enabled && (
              <span className="text-[10px] bg-secondary/30 text-secondary px-1.5 py-0.2 rounded">ON</span>
            )}
          </button>
        </div>

        {/* ── TAB 1: DARK THEME GRADIENT ── */}
        {gradientTab === 'dark' && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-paper flex items-center gap-2">
                  <span>Dark Mode Settings</span>
                  <span className="text-xs font-normal text-mist-2">
                    (Active when website is viewed in Dark theme)
                  </span>
                </h3>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-mist-1">
                <input
                  type="checkbox"
                  checked={currentGradient.dark.enabled}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      dark: { ...prev.dark, enabled: e.target.checked },
                    }))
                  }
                  className="rounded border-(--line) text-primary focus:ring-primary/20"
                />
                <span>Enable Dark Overlay</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Picker & HEX Input */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Base Gradient Color</label>
                  <span className="text-[11px] font-mono-tight text-mist-2">Default: #0A0C18</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={isValidHex(currentGradient.dark.color) ? currentGradient.dark.color : '#0A0C18'}
                    onChange={(e) =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        dark: { ...prev.dark, color: e.target.value.toUpperCase() },
                      }))
                    }
                    className="w-10 h-10 rounded-lg border border-(--line) bg-transparent cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentGradient.dark.color}
                      onChange={(e) =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          dark: { ...prev.dark, color: e.target.value },
                        }))
                      }
                      placeholder="#0A0C18"
                      className={`${inputClass} font-mono-tight`}
                    />
                  </div>
                </div>
                {!isValidHex(currentGradient.dark.color) && (
                  <p className="text-[11px] text-amber-400">Please enter a valid 3- or 6-digit HEX color.</p>
                )}
              </div>

              {/* Direction Selector */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Gradient Direction</label>
                  <span className="text-[11px] font-mono-tight text-mist-2">Desktop</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        dark: { ...prev.dark, direction: 'left-to-right' },
                      }))
                    }
                    className={`p-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      currentGradient.dark.direction === 'left-to-right'
                        ? 'bg-primary/20 border-primary text-paper shadow-sm'
                        : 'border-(--line) text-mist-1 hover:text-paper hover:bg-white/5'
                    }`}
                  >
                    Left-to-Right (Recommended)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        dark: { ...prev.dark, direction: 'right-to-left' },
                      }))
                    }
                    className={`p-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      currentGradient.dark.direction === 'right-to-left'
                        ? 'bg-primary/20 border-primary text-paper shadow-sm'
                        : 'border-(--line) text-mist-1 hover:text-paper hover:bg-white/5'
                    }`}
                  >
                    Right-to-Left
                  </button>
                </div>
              </div>

              {/* Gradient Width / Reach Slider */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Gradient Width (Horizontal Reach)</label>
                  <div className="flex items-center gap-1 font-mono-tight text-xs font-semibold text-paper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentGradient.dark.width}
                      onChange={(e) =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          dark: {
                            ...prev.dark,
                            width: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          },
                        }))
                      }
                      className="w-14 px-2 py-0.5 rounded bg-white/5 border border-(--line) text-center focus:outline-none focus:border-primary"
                    />
                    <span>%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentGradient.dark.width}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      dark: { ...prev.dark, width: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                />
                <p className="text-[11px] text-mist-2">
                  At 0%, horizontal gradient is removed. At 100%, it spans edge-to-edge. Default: 65%.
                </p>
              </div>

              {/* Gradient Opacity / Intensity Slider */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Gradient Opacity / Intensity</label>
                  <div className="flex items-center gap-1 font-mono-tight text-xs font-semibold text-paper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentGradient.dark.opacity}
                      onChange={(e) =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          dark: {
                            ...prev.dark,
                            opacity: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          },
                        }))
                      }
                      className="w-14 px-2 py-0.5 rounded bg-white/5 border border-(--line) text-center focus:outline-none focus:border-primary"
                    />
                    <span>%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentGradient.dark.opacity}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      dark: { ...prev.dark, opacity: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                />
                <p className="text-[11px] text-mist-2">
                  Controls peak alpha behind text. Default for dark mode: 85%.
                </p>
              </div>
            </div>

            {/* Fade & Distribution Stops */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-paper">Gradient Stops & Fade Distribution</h4>
                  <p className="text-[11px] text-mist-2">
                    Fine-tune how quickly solid color transitions into gentle transparency.
                  </p>
                </div>
                <span className="text-[11px] font-mono-tight text-secondary">Advanced Tuning</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-mist-1 mb-1">
                    <span>Solid Hold Point (solidUntil)</span>
                    <span className="font-mono-tight text-paper">{currentGradient.dark.stops.solidUntil}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={currentGradient.dark.stops.solidUntil}
                    onChange={(e) =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        dark: {
                          ...prev.dark,
                          stops: { ...prev.dark.stops, solidUntil: Number(e.target.value) },
                        },
                      }))
                    }
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-mist-1 mb-1">
                    <span>Fade Start Position (fadeStart)</span>
                    <span className="font-mono-tight text-paper">{currentGradient.dark.stops.fadeStart}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="95"
                    value={currentGradient.dark.stops.fadeStart}
                    onChange={(e) =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        dark: {
                          ...prev.dark,
                          stops: { ...prev.dark.stops, fadeStart: Number(e.target.value) },
                        },
                      }))
                    }
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: LIGHT THEME GRADIENT ── */}
        {gradientTab === 'light' && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-paper flex items-center gap-2">
                  <span>Light Mode Settings</span>
                  <span className="text-xs font-normal text-mist-2">
                    (Active when website is viewed in Light theme)
                  </span>
                </h3>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-mist-1">
                <input
                  type="checkbox"
                  checked={currentGradient.light.enabled}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      light: { ...prev.light, enabled: e.target.checked },
                    }))
                  }
                  className="rounded border-(--line) text-primary focus:ring-primary/20"
                />
                <span>Enable Light Overlay</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Picker & HEX Input */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Base Gradient Color</label>
                  <span className="text-[11px] font-mono-tight text-mist-2">Default: #FFFFFF</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={isValidHex(currentGradient.light.color) ? currentGradient.light.color : '#FFFFFF'}
                    onChange={(e) =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        light: { ...prev.light, color: e.target.value.toUpperCase() },
                      }))
                    }
                    className="w-10 h-10 rounded-lg border border-(--line) bg-transparent cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentGradient.light.color}
                      onChange={(e) =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          light: { ...prev.light, color: e.target.value },
                        }))
                      }
                      placeholder="#FFFFFF"
                      className={`${inputClass} font-mono-tight`}
                    />
                  </div>
                </div>
                {!isValidHex(currentGradient.light.color) && (
                  <p className="text-[11px] text-amber-400">Please enter a valid 3- or 6-digit HEX color.</p>
                )}
              </div>

              {/* Direction Selector */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Gradient Direction</label>
                  <span className="text-[11px] font-mono-tight text-mist-2">Desktop</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        light: { ...prev.light, direction: 'left-to-right' },
                      }))
                    }
                    className={`p-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      currentGradient.light.direction === 'left-to-right'
                        ? 'bg-primary/20 border-primary text-paper shadow-sm'
                        : 'border-(--line) text-mist-1 hover:text-paper hover:bg-white/5'
                    }`}
                  >
                    Left-to-Right (Recommended)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        light: { ...prev.light, direction: 'right-to-left' },
                      }))
                    }
                    className={`p-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                      currentGradient.light.direction === 'right-to-left'
                        ? 'bg-primary/20 border-primary text-paper shadow-sm'
                        : 'border-(--line) text-mist-1 hover:text-paper hover:bg-white/5'
                    }`}
                  >
                    Right-to-Left
                  </button>
                </div>
              </div>

              {/* Gradient Width / Reach Slider */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Gradient Width (Horizontal Reach)</label>
                  <div className="flex items-center gap-1 font-mono-tight text-xs font-semibold text-paper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentGradient.light.width}
                      onChange={(e) =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          light: {
                            ...prev.light,
                            width: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          },
                        }))
                      }
                      className="w-14 px-2 py-0.5 rounded bg-white/5 border border-(--line) text-center focus:outline-none focus:border-primary"
                    />
                    <span>%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentGradient.light.width}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      light: { ...prev.light, width: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                />
                <p className="text-[11px] text-mist-2">
                  At 0%, horizontal gradient is removed. At 100%, it spans edge-to-edge. Default: 65%.
                </p>
              </div>

              {/* Gradient Opacity / Intensity Slider */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Gradient Opacity / Intensity</label>
                  <div className="flex items-center gap-1 font-mono-tight text-xs font-semibold text-paper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentGradient.light.opacity}
                      onChange={(e) =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          light: {
                            ...prev.light,
                            opacity: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          },
                        }))
                      }
                      className="w-14 px-2 py-0.5 rounded bg-white/5 border border-(--line) text-center focus:outline-none focus:border-primary"
                    />
                    <span>%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentGradient.light.opacity}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      light: { ...prev.light, opacity: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                />
                <p className="text-[11px] text-mist-2">
                  Controls peak white intensity behind dark headline text. Default: 90%.
                </p>
              </div>
            </div>

            {/* Fade & Distribution Stops */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-paper">Gradient Stops & Fade Distribution</h4>
                  <p className="text-[11px] text-mist-2">
                    Fine-tune the feather curve for crisp text readability in light mode.
                  </p>
                </div>
                <span className="text-[11px] font-mono-tight text-secondary">Advanced Tuning</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-mist-1 mb-1">
                    <span>Solid Hold Point (solidUntil)</span>
                    <span className="font-mono-tight text-paper">{currentGradient.light.stops.solidUntil}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={currentGradient.light.stops.solidUntil}
                    onChange={(e) =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        light: {
                          ...prev.light,
                          stops: { ...prev.light.stops, solidUntil: Number(e.target.value) },
                        },
                      }))
                    }
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-mist-1 mb-1">
                    <span>Fade Start Position (fadeStart)</span>
                    <span className="font-mono-tight text-paper">{currentGradient.light.stops.fadeStart}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="95"
                    value={currentGradient.light.stops.fadeStart}
                    onChange={(e) =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        light: {
                          ...prev.light,
                          stops: { ...prev.light.stops, fadeStart: Number(e.target.value) },
                        },
                      }))
                    }
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: MOBILE OVERRIDES ── */}
        {gradientTab === 'mobile' && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-paper flex items-center gap-2">
                  <span>Mobile Screen Readability Overlays</span>
                </h3>
                <p className="text-xs text-mist-2 mt-0.5">
                  Small viewports stack text on top of images. A directional overlay ensures contrast without washing out the photo.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-mist-1">
                <input
                  type="checkbox"
                  checked={currentGradient.mobile.enabled}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      mobile: { ...prev.mobile, enabled: e.target.checked },
                    }))
                  }
                  className="rounded border-(--line) text-primary focus:ring-primary/20"
                />
                <span>Enable Mobile Overlay</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Direction */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <label className="text-xs font-medium text-mist-1">Mobile Gradient Orientation</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top-to-bottom', label: 'Top-to-Bottom' },
                    { id: 'bottom-to-top', label: 'Bottom-to-Top' },
                    { id: 'left-to-right', label: 'Left-to-Right' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          mobile: {
                            ...prev.mobile,
                            direction: d.id as any,
                          },
                        }))
                      }
                      className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                        currentGradient.mobile.direction === d.id
                          ? 'bg-primary/20 border-primary text-paper shadow-sm'
                          : 'border-(--line) text-mist-1 hover:text-paper hover:bg-white/5'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Intensity */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Mobile Gradient Intensity</label>
                  <div className="flex items-center gap-1 font-mono-tight text-xs font-semibold text-paper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentGradient.mobile.opacity}
                      onChange={(e) =>
                        handleGradientChange((prev) => ({
                          ...prev,
                          mobile: {
                            ...prev.mobile,
                            opacity: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          },
                        }))
                      }
                      className="w-14 px-2 py-0.5 rounded bg-white/5 border border-(--line) text-center focus:outline-none focus:border-primary"
                    />
                    <span>%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentGradient.mobile.opacity}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      mobile: { ...prev.mobile, opacity: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                />
                <p className="text-[11px] text-mist-2">Recommended: 85%–92% for optimal mobile text contrast.</p>
              </div>

              {/* Mobile Fade Start */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-mist-1">Mobile Fade Point</label>
                  <span className="font-mono-tight text-xs font-semibold text-paper">
                    {currentGradient.mobile.fadeStart}%
                  </span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="90"
                  step="1"
                  value={currentGradient.mobile.fadeStart}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      mobile: { ...prev.mobile, fadeStart: Number(e.target.value) },
                    }))
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
                />
                <p className="text-[11px] text-mist-2">
                  Controls where the strong readability wash transitions into the lower photo section. Default: 60%.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: BACKGROUND BLUR ── */}
        {gradientTab === 'blur' && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-paper flex items-center gap-2">
                  <span>Background Image Soft Blur (Optional)</span>
                </h3>
                <p className="text-xs text-mist-2 mt-0.5">
                  Applies a soft Gaussian blur strictly to the background photograph without blurring text or foreground UI.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-mist-1">
                <input
                  type="checkbox"
                  checked={currentGradient.blur.enabled}
                  onChange={(e) =>
                    handleGradientChange((prev) => ({
                      ...prev,
                      blur: { ...prev.blur, enabled: e.target.checked },
                    }))
                  }
                  className="rounded border-(--line) text-primary focus:ring-primary/20"
                />
                <span>Enable Image Blur</span>
              </label>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-mist-1">Blur Radius (px)</label>
                <div className="flex items-center gap-1 font-mono-tight text-xs font-semibold text-paper">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={currentGradient.blur.amount}
                    onChange={(e) =>
                      handleGradientChange((prev) => ({
                        ...prev,
                        blur: {
                          ...prev.blur,
                          amount: Math.max(0, Math.min(20, Number(e.target.value) || 0)),
                        },
                      }))
                    }
                    className="w-14 px-2 py-0.5 rounded bg-white/5 border border-(--line) text-center focus:outline-none focus:border-primary"
                  />
                  <span>px</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={currentGradient.blur.amount}
                onChange={(e) =>
                  handleGradientChange((prev) => ({
                    ...prev,
                    blur: { ...prev.blur, amount: Number(e.target.value) },
                  }))
                }
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
              />

              <div className="flex items-center gap-2 text-[11px] text-mist-2 bg-white/5 p-3 rounded-lg border border-(--line)">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>
                  Edge-bleed protection is active: when blur is enabled, the image container automatically scales to prevent perimeter gaps.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 1: Status Pill & Availability */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <span className="h-2 w-2 rounded-full signal-dot" />
            <h2 className="text-base font-display">Status Pill & Availability</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-mist-1">
            <input
              type="checkbox"
              checked={settings.show_status_pill}
              onChange={(e) => handleInputChange('show_status_pill', e.target.checked)}
              className="rounded border-(--line) text-primary focus:ring-primary/20"
            />
            <span>Show status pill on hero</span>
          </label>
        </div>

        {settings.show_status_pill && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Pill Text
              </label>
              <input
                type="text"
                value={settings.status_pill_text}
                onChange={(e) => handleInputChange('status_pill_text', e.target.value)}
                className={inputClass}
                placeholder="e.g. Available for projects"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Link Target
              </label>
              <input
                type="text"
                value={settings.status_pill_link}
                onChange={(e) => handleInputChange('status_pill_link', e.target.value)}
                className={inputClass}
                placeholder="/contact"
              />
            </div>

            <div className="md:col-span-3">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-mist-1">
                <input
                  type="checkbox"
                  checked={settings.status_pill_available}
                  onChange={(e) => handleInputChange('status_pill_available', e.target.checked)}
                  className="rounded border-(--line) text-primary focus:ring-primary/20"
                />
                <span>Pulsing green dot indicates &ldquo;Available&rdquo; (uncheck for inactive/busy dot)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Call-To-Action Buttons */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center gap-2 text-paper font-semibold border-b border-(--line) pb-3">
          <Layers className="w-4 h-4 text-primary" />
          <h2 className="text-base font-display">Call-To-Action (CTA) Buttons</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary CTA */}
          <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-(--line)">
            <div className="flex items-center gap-2 text-xs font-mono-tight uppercase text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Primary Button (Filled Violet)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={settings.primary_cta_label}
                onChange={(e) => handleInputChange('primary_cta_label', e.target.value)}
                className={inputClass}
                placeholder="Start Your Project"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Button Link
              </label>
              <input
                type="text"
                value={settings.primary_cta_link}
                onChange={(e) => handleInputChange('primary_cta_link', e.target.value)}
                className={inputClass}
                placeholder="/contact"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-(--line)">
            <div className="flex items-center gap-2 text-xs font-mono-tight uppercase text-mist-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mist-2" />
              <span>Secondary Button (Glass Outline)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={settings.secondary_cta_label}
                onChange={(e) => handleInputChange('secondary_cta_label', e.target.value)}
                className={inputClass}
                placeholder="View My Work"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Button Link
              </label>
              <input
                type="text"
                value={settings.secondary_cta_link}
                onChange={(e) => handleInputChange('secondary_cta_link', e.target.value)}
                className={inputClass}
                placeholder="/projects"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Floating Stat Badge */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <h2 className="text-base font-display">Floating Portrait Stat Badge</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-mist-1">
            <input
              type="checkbox"
              checked={settings.show_floating_stat}
              onChange={(e) => handleInputChange('show_floating_stat', e.target.checked)}
              className="rounded border-(--line) text-primary focus:ring-primary/20"
            />
            <span>Show floating stat over silhouette</span>
          </label>
        </div>

        {settings.show_floating_stat && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Metric Value / Number
              </label>
              <input
                type="text"
                value={settings.floating_stat_value}
                onChange={(e) => handleInputChange('floating_stat_value', e.target.value)}
                className={inputClass}
                placeholder="e.g. 98% or 100+"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-mist-1 mb-1">
                Metric Label
              </label>
              <input
                type="text"
                value={settings.floating_stat_label}
                onChange={(e) => handleInputChange('floating_stat_label', e.target.value)}
                className={inputClass}
                placeholder="e.g. Client Satisfaction"
              />
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Slider Timing & Flow Control */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <Sliders className="w-4 h-4 text-primary" />
            <h2 className="text-base font-display">Slider Flow & Rotation Speed</h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tight font-medium border ${
                settings.autoplay_enabled
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  settings.autoplay_enabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{settings.autoplay_enabled ? 'FLOW RUNNING' : 'FLOW PAUSED'}</span>
            </span>
          </div>
        </div>

        {/* Start / Pause Flow Banner Control */}
        <div className="p-4 rounded-xl bg-ink-deep border border-(--line) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-paper">
              {settings.autoplay_enabled
                ? 'Automatic slide rotation is active'
                : 'Automatic slide rotation is paused'}
            </p>
            <p className="text-xs text-mist-2 mt-0.5">
              {settings.autoplay_enabled
                ? `Slides cycle forward automatically every ${settings.autoplay_interval} seconds.`
                : 'Slides will remain static until visitors navigate using arrows or indicator pills.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleInputChange('autoplay_enabled', !settings.autoplay_enabled)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-md cursor-pointer ${
              settings.autoplay_enabled
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
                : 'bg-emerald-500 hover:bg-emerald-400 text-ink-deep font-semibold shadow-emerald-500/25 hover:shadow-emerald-500/40'
            }`}
          >
            {settings.autoplay_enabled ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Flow</span>
              </>
            )}
          </button>
        </div>

        {/* Speed Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-mist-1">
              <Gauge className="w-3.5 h-3.5 text-secondary" />
              <span>Rotation Speed:</span>
              <span className="font-mono-tight font-semibold text-paper text-sm bg-white/5 px-2 py-0.5 rounded border border-(--line)">
                {settings.autoplay_interval} seconds
              </span>
            </div>
            <span className="text-[11px] font-mono-tight text-mist-2">Range: 2s – 30s</span>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={settings.autoplay_interval}
            onChange={(e) =>
              handleInputChange('autoplay_interval', Math.max(2, parseInt(e.target.value) || 5))
            }
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
          />

          {/* Quick Speed Presets */}
          <div>
            <p className="text-[11px] font-mono-tight text-mist-2 mb-2">Quick presets:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Fast', seconds: 3, icon: Zap, hint: '3s per slide' },
                { label: 'Standard', seconds: 5, icon: Clock, hint: '5s per slide (recommended)' },
                { label: 'Relaxed', seconds: 8, icon: Waves, hint: '8s per slide' },
                { label: 'Slow', seconds: 12, icon: Turtle, hint: '12s per slide' },
              ].map((preset) => {
                const Icon = preset.icon;
                const isSelected = settings.autoplay_interval === preset.seconds;
                return (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => handleInputChange('autoplay_interval', preset.seconds)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary/15 border-secondary text-secondary font-semibold shadow-sm shadow-secondary/20'
                        : 'bg-white/[0.02] border-(--line) text-mist-1 hover:text-paper hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    <div className="text-left">
                      <p className="font-medium">{preset.label}</p>
                      <p className="text-[10px] text-mist-2 font-mono-tight">{preset.hint}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
