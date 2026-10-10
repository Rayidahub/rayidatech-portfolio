'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Play,
  Pause,
  Gauge,
  Sliders,
  Check,
  Loader2,
  Clock,
  Sparkles,
  Zap,
  Turtle,
  Waves,
} from 'lucide-react';
import { toggleHeroAutoplayAction, updateHeroSpeedAction } from '@/app/actions/hero-settings';
import type { HeroSettings } from '@/types/hero-settings';

interface HeroFlowControllerProps {
  initialSettings: HeroSettings;
  totalSlides: number;
}

const SPEED_PRESETS = [
  { label: 'Fast', seconds: 3, icon: Zap, hint: 'Quick teaser / energetic' },
  { label: 'Standard', seconds: 5, icon: Clock, hint: 'Recommended balance' },
  { label: 'Relaxed', seconds: 8, icon: Waves, hint: 'Time to read headline & body' },
  { label: 'Slow', seconds: 12, icon: Turtle, hint: 'Deliberate & showcase-style' },
];

export default function HeroFlowController({
  initialSettings,
  totalSlides,
}: HeroFlowControllerProps) {
  const [enabled, setEnabled] = useState(initialSettings.autoplay_enabled !== false);
  const [interval, setInterval] = useState(initialSettings.autoplay_interval || 5);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  // Synchronize with external changes
  useEffect(() => {
    setEnabled(initialSettings.autoplay_enabled !== false);
    setInterval(initialSettings.autoplay_interval || 5);
  }, [initialSettings]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleFlow = () => {
    const nextState = !enabled;
    setEnabled(nextState);

    startTransition(async () => {
      const res = await toggleHeroAutoplayAction(nextState);
      if (res.success) {
        showFeedback(nextState ? 'Slider flow started live on homepage!' : 'Slider flow paused on homepage!');
      } else {
        // Revert on failure
        setEnabled(!nextState);
        showFeedback(res.error || 'Failed to update flow state.');
      }
    });
  };

  const handleSpeedChange = (newSeconds: number) => {
    const clamped = Math.max(2, Math.min(30, newSeconds));
    setInterval(clamped);

    startTransition(async () => {
      const res = await updateHeroSpeedAction(clamped);
      if (res.success) {
        showFeedback(`Speed updated to ${clamped}s live on homepage!`);
      } else {
        showFeedback(res.error || 'Failed to update slider speed.');
      }
    });
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 border border-(--line) mb-8 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent shadow-xl">
      {/* Background ambient indicator */}
      <div
        className={`pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 ${
          enabled ? 'opacity-25 bg-emerald-500' : 'opacity-15 bg-amber-500'
        }`}
        aria-hidden="true"
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Status & Main Start/Pause Action */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-secondary">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-paper">
                  Hero Slider Flow Controller
                </h2>
                {/* Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono-tight font-medium border transition-colors ${
                    enabled
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      enabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>{enabled ? 'FLOW RUNNING' : 'FLOW PAUSED'}</span>
                </span>
              </div>
              <p className="text-xs text-mist-2 mt-0.5">
                {enabled
                  ? `Cycling automatically through ${totalSlides} slides every ${interval}s.`
                  : 'Automatic flow is halted. Visitors can navigate slides manually.'}
              </p>
            </div>
          </div>

          {/* Quick Start / Pause Button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleToggleFlow}
              disabled={isPending}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg cursor-pointer ${
                enabled
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-ink-deep font-semibold shadow-emerald-500/25 hover:shadow-emerald-500/40'
              }`}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : enabled ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Slider Flow</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Slider Flow</span>
                </>
              )}
            </button>

            {feedback && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono-tight animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{feedback}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Speed Controller & Presets */}
        <div className="lg:w-[420px] bg-ink-deep/60 p-4 rounded-xl border border-(--line) space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-mist-1">
              <Gauge className="w-3.5 h-3.5 text-secondary" />
              <span>Rotation Speed:</span>
              <span className="font-mono-tight font-semibold text-paper text-sm bg-white/5 px-2 py-0.5 rounded border border-(--line)">
                {interval}s
              </span>
            </div>
            <span className="text-[11px] font-mono-tight text-mist-2">Range: 2s – 30s</span>
          </div>

          {/* Range Slider */}
          <div className="relative">
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={interval}
              disabled={isPending}
              onChange={(e) => handleSpeedChange(parseInt(e.target.value) || 5)}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)]"
            />
          </div>

          {/* Speed Presets */}
          <div className="grid grid-cols-4 gap-2">
            {SPEED_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = interval === preset.seconds;
              return (
                <button
                  key={preset.seconds}
                  type="button"
                  onClick={() => handleSpeedChange(preset.seconds)}
                  disabled={isPending}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-secondary/15 border-secondary text-secondary font-semibold shadow-sm shadow-secondary/20'
                      : 'bg-white/[0.02] border-(--line) text-mist-1 hover:text-paper hover:bg-white/[0.05]'
                  }`}
                  title={`${preset.label} (${preset.seconds}s): ${preset.hint}`}
                >
                  <Icon className="w-3.5 h-3.5 mb-1 opacity-80" />
                  <span className="font-medium text-[11px]">{preset.label}</span>
                  <span className="font-mono-tight text-[10px] text-mist-2">{preset.seconds}s</span>
                </button>
              );
            })}
          </div>

          {/* Live Progress Simulation Bar */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono-tight text-mist-2 mb-1">
              <span>Live timing simulation:</span>
              <span>{enabled ? `Cycles every ${interval}s` : 'Paused'}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              {enabled ? (
                <div
                  key={`${interval}-${enabled}`}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{
                    animation: `slider-preview-progress ${interval}s linear infinite`,
                  }}
                />
              ) : (
                <div className="h-full w-full bg-amber-500/20" />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slider-preview-progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
