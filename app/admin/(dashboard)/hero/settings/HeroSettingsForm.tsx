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
} from 'lucide-react';
import { updateHeroSettingsAction } from '@/app/actions/hero-settings';
import type { HeroSettings } from '@/types/hero-settings';

interface HeroSettingsFormProps {
  initialSettings: HeroSettings;
}

export default function HeroSettingsForm({ initialSettings }: HeroSettingsFormProps) {
  const [settings, setSettings] = useState<HeroSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (field: keyof HeroSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');

    startTransition(async () => {
      const result = await updateHeroSettingsAction(settings);
      if (result.success) {
        setStatus('success');
        setStatusMessage('Hero section settings saved successfully!');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to update hero settings.');
      }
    });
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-[var(--ink)] border border-(--line) rounded-lg text-paper text-sm placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all';

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
              Customize call-to-action buttons, status pill, floating stat badge, and slider behavior.
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
            <span>Preview Homepage</span>
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

      {/* Live Preview Card */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-display uppercase tracking-wider">Live Components Preview</h2>
          </div>
          <span className="text-[11px] font-mono-tight text-mist-2">Real-time simulation</span>
        </div>

        <div className="p-6 rounded-xl bg-[var(--ink-deep)] border border-(--line) space-y-6">
          {/* Status Pill preview */}
          {settings.show_status_pill && (
            <div>
              <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 border border-(--line)">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    settings.status_pill_available ? 'signal-dot' : 'bg-mist-2'
                  }`}
                />
                <span className="text-xs font-medium text-mist-1">
                  {settings.status_pill_text || 'Available for projects'}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons preview */}
          <div className="flex flex-wrap items-center gap-3">
            {settings.primary_cta_label && (
              <span className="btn-glow inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-medium text-paper">
                <span>{settings.primary_cta_label}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
            {settings.secondary_cta_label && (
              <span className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-paper/5 px-6 py-3 text-xs font-medium text-paper">
                <span>{settings.secondary_cta_label}</span>
              </span>
            )}
          </div>

          {/* Floating stat preview */}
          {settings.show_floating_stat && (
            <div className="inline-block glass-strong rounded-2xl px-5 py-3 border border-(--line)">
              <p className="font-display text-2xl font-semibold gradient-text tabular-nums">
                {settings.floating_stat_value || '98%'}
              </p>
              <p className="font-mono-tight text-[11px] uppercase tracking-[0.15em] text-mist-2">
                {settings.floating_stat_label || 'Client Satisfaction'}
              </p>
            </div>
          )}
        </div>
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

          {/* Live Progress Simulation Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono-tight text-mist-2 mb-1">
              <span>Timing preview:</span>
              <span>{settings.autoplay_enabled ? `Cycles every ${settings.autoplay_interval}s` : 'Paused'}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              {settings.autoplay_enabled ? (
                <div
                  key={`${settings.autoplay_interval}-${settings.autoplay_enabled}`}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{
                    animation: `slider-preview-progress ${settings.autoplay_interval}s linear infinite`,
                  }}
                />
              ) : (
                <div className="h-full w-full bg-amber-500/20" />
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

