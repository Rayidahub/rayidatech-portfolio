'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, Sun, Moon, Grid } from 'lucide-react';
import {
  LogoVariationType,
  LogoStageMode,
  getLogoVariationConfig,
  getLogoStageBackgroundClass,
  getLogoStageBorderClass,
  resolveEffectiveStageMode,
  getLogoRoleBadgeColor,
  getLogoAspectRecommendation,
  isStageActive,
} from '@/lib/brand-logo-showcase';

interface BrandLogoVariationCardProps {
  type: LogoVariationType;
  imageUrl: string;
  alt?: string;
  globalMode?: 'dark' | 'light';
  onInspect?: (url: string, title: string, role: string) => void;
}

export default function BrandLogoVariationCard({
  type,
  imageUrl,
  alt,
  globalMode = 'dark',
  onInspect,
}: BrandLogoVariationCardProps) {
  const config = getLogoVariationConfig(type);
  const [stageOverride, setStageOverride] = useState<LogoStageMode>('auto');

  const effectiveStage = resolveEffectiveStageMode(
    stageOverride,
    config.defaultStage,
    globalMode
  );

  const displayAlt = alt || config.title;

  return (
    <div
      data-testid={`brand-logo-card-${type}`}
      className={`group rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 relative ${
        globalMode === 'dark'
          ? 'bg-white/[0.02] hover:bg-white/[0.04] border-(--line) hover:border-secondary/40 shadow-lg hover:shadow-secondary/5'
          : 'bg-[#f8f9fc] hover:bg-white border-slate-200 hover:border-primary/40 shadow-sm'
      }`}
    >
      {/* Top Header: Index, Role Badge, and Quick Stage Mode Switcher */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-(--line)/50">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono-tight text-[10px] text-mist-2 shrink-0">
            {config.indexLabel.split(' / ')[0]}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tight border truncate ${getLogoRoleBadgeColor(
              type
            )}`}
          >
            {config.role}
          </span>
        </div>

        {/* Individual Stage Backdrop Switcher */}
        <div
          role="group"
          aria-label="Backdrop switcher"
          className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/40 border border-white/5 shrink-0"
        >
          <button
            type="button"
            onClick={() => setStageOverride('light')}
            aria-label="Light backdrop"
            aria-pressed={isStageActive('light', effectiveStage)}
            title="Preview on light backdrop"
            className={`p-1 rounded text-[10px] transition-colors cursor-pointer ${
              isStageActive('light', effectiveStage)
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-mist-2 hover:text-paper hover:bg-white/5'
            }`}
          >
            <Sun className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={() => setStageOverride('dark')}
            aria-label="Dark backdrop"
            aria-pressed={isStageActive('dark', effectiveStage)}
            title="Preview on dark backdrop"
            className={`p-1 rounded text-[10px] transition-colors cursor-pointer ${
              isStageActive('dark', effectiveStage)
                ? 'bg-ink text-secondary shadow-xs'
                : 'text-mist-2 hover:text-paper hover:bg-white/5'
            }`}
          >
            <Moon className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={() => setStageOverride('checkerboard')}
            aria-label="Transparency grid backdrop"
            aria-pressed={isStageActive('checkerboard', effectiveStage)}
            title="Preview on transparency grid"
            className={`p-1 rounded text-[10px] transition-colors cursor-pointer ${
              isStageActive('checkerboard', effectiveStage)
                ? 'bg-primary text-white shadow-xs'
                : 'text-mist-2 hover:text-paper hover:bg-white/5'
            }`}
          >
            <Grid className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Contained Showcase Stage */}
      <div
        onClick={() => onInspect?.(imageUrl, config.title, config.role)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onInspect?.(imageUrl, config.title, config.role);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Inspect ${config.title}`}
        className={`relative w-full h-36 sm:h-40 rounded-xl border overflow-hidden flex items-center justify-center p-4 transition-all duration-300 my-3.5 cursor-zoom-in ${getLogoStageBackgroundClass(
          effectiveStage
        )} ${getLogoStageBorderClass(effectiveStage)}`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={displayAlt}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover Inspect Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-mono-tight border border-white/20 shadow-md">
            <ZoomIn className="w-3 h-3 text-secondary" />
            <span>Inspect Asset</span>
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="space-y-1 text-center sm:text-left">
        <h4
          className={`text-xs sm:text-sm font-display font-semibold transition-colors ${
            globalMode === 'dark'
              ? 'text-paper group-hover:text-secondary'
              : 'text-slate-900 group-hover:text-primary'
          }`}
        >
          {config.title}
        </h4>
        <p
          className={`text-[11px] ${
            globalMode === 'dark' ? 'text-mist-2' : 'text-slate-500'
          }`}
        >
          {config.useCase}
        </p>

        <div className="pt-2 flex items-center justify-between gap-1.5 flex-wrap">
          <span
            className={`inline-block text-[10px] font-mono-tight px-2 py-0.5 rounded-md ${
              globalMode === 'dark'
                ? 'bg-white/[0.03] text-mist-1 border border-white/5'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {config.recommendedBg}
          </span>
          <span
            className={`text-[10px] font-mono-tight shrink-0 ${
              globalMode === 'dark' ? 'text-mist-2' : 'text-slate-400'
            }`}
          >
            {getLogoAspectRecommendation(type)}
          </span>
        </div>
      </div>
    </div>
  );
}
