'use client';

import { useState } from 'react';
import {
  Sparkles,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Columns,
  Maximize2,
  AlignCenter,
  BookOpen,
  Tv,
} from 'lucide-react';
import { BrandApplicationCategory, BrandApplicationLayout } from '@/types/project';
import {
  getLayoutDisplayName,
  getLayoutDescription,
  getLayoutAspectRatioClass,
  getLayoutBadgeColor,
  formatApplicationPreviewData,
} from '@/lib/brand-application-preview';

interface BrandApplicationCardPreviewProps {
  title?: string;
  category?: BrandApplicationCategory | string;
  layout: BrandApplicationLayout;
  description?: string;
  imageUrl?: string | null;
  onLayoutChange?: (layout: BrandApplicationLayout) => void;
  defaultExpanded?: boolean;
}

const LAYOUT_OPTIONS: Array<{
  id: BrandApplicationLayout;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'split', label: 'Split', icon: Columns },
  { id: 'hero', label: 'Hero', icon: Maximize2 },
  { id: 'centered', label: 'Centered', icon: AlignCenter },
  { id: 'editorial', label: 'Editorial', icon: BookOpen },
  { id: 'wide', label: 'Wide', icon: Tv },
];

export default function BrandApplicationCardPreview({
  title = '',
  category = 'Product Packaging',
  layout = 'split',
  description = '',
  imageUrl = '',
  onLayoutChange,
  defaultExpanded = true,
}: BrandApplicationCardPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasError, setHasError] = useState(false);

  const preview = formatApplicationPreviewData({
    title,
    category: category as BrandApplicationCategory,
    layout_preference: layout,
    description,
    primary_image: imageUrl || '',
  });

  const hasValidImage = Boolean(imageUrl) && !hasError;

  return (
    <div className="mt-4 rounded-xl border border-(--line) bg-ink-deep/60 overflow-hidden transition-all duration-200">
      {/* Preview Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 bg-white/[0.02] border-b border-(--line)">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-secondary/15 text-secondary shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-[11px] font-mono-tight uppercase tracking-wider text-mist-1 font-semibold truncate">
            Live Layout Preview
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tight border ${getLayoutBadgeColor(
              layout
            )}`}
          >
            {getLayoutDisplayName(layout)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Layout Mode Buttons */}
          {onLayoutChange && (
            <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/5">
              {LAYOUT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = layout === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onLayoutChange(opt.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono-tight transition-colors cursor-pointer ${
                      active
                        ? 'bg-primary text-white font-medium shadow-xs'
                        : 'text-mist-2 hover:text-paper hover:bg-white/5'
                    }`}
                    title={`Switch to ${opt.label} layout`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Toggle Preview Button */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono-tight text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
            title={isExpanded ? 'Hide Live Preview' : 'Show Live Preview'}
          >
            {isExpanded ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Collapse</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Body Canvas */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-ink/40">
          <p className="text-[11px] text-mist-2 font-mono-tight mb-4 flex items-center justify-between">
            <span>{getLayoutDescription(layout)}</span>
            <span className="text-[10px] text-secondary/80 hidden md:inline">
              Simulated public case study view
            </span>
          </p>

          {!hasValidImage ? (
            /* Empty State Wireframe Placeholder */
            <div className="rounded-2xl border border-dashed border-(--line) bg-white/[0.01] p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-mist-2 mb-2">
                <ImageIcon className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-xs font-medium text-mist-1">No Mockup Image Attached</p>
              <p className="text-[11px] text-mist-2 max-w-sm mt-0.5">
                Upload or paste a mockup URL above to preview this deliverable formatted as{' '}
                <span className="text-secondary">{getLayoutDisplayName(layout)}</span>.
              </p>
            </div>
          ) : (
            /* Live Layout Variations */
            <div className="animate-in fade-in duration-200">
              {/* 1. Split Layout (50/50 Two Columns) */}
              {layout === 'split' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-4 rounded-2xl glass border border-(--line)">
                  <div className="md:col-span-7">
                    <div className="rounded-xl overflow-hidden border border-(--line) bg-black/40 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl || ''}
                        alt={preview.title}
                        onError={() => setHasError(true)}
                        className={`w-full ${getLayoutAspectRatioClass('split')} object-cover`}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-5 space-y-2.5">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25 text-[11px] font-mono-tight font-medium">
                      {preview.category}
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-semibold text-paper leading-snug">
                      {preview.title}
                    </h4>
                    <p className="text-xs text-mist-1 leading-relaxed">
                      {preview.description}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Hero Layout (Full-width cinematic banner) */}
              {layout === 'hero' && (
                <div className="space-y-3.5 p-4 rounded-2xl glass border border-(--line)">
                  <div className="rounded-xl overflow-hidden border border-(--line) bg-black/40 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl || ''}
                      alt={preview.title}
                      onError={() => setHasError(true)}
                      className={`w-full ${getLayoutAspectRatioClass('hero')} object-cover`}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                    <div>
                      <span className="text-[10px] font-mono-tight uppercase tracking-wider text-secondary">
                        {preview.category}
                      </span>
                      <h4 className="font-display text-lg font-semibold text-paper">
                        {preview.title}
                      </h4>
                    </div>
                    {preview.description && (
                      <p className="text-xs text-mist-1 max-w-md truncate">
                        {preview.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Centered Layout (Focused Spotlight) */}
              {layout === 'centered' && (
                <div className="max-w-lg mx-auto space-y-3.5 text-center p-4 rounded-2xl glass border border-(--line)">
                  <div className="rounded-xl overflow-hidden border border-(--line) bg-black/40 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl || ''}
                      alt={preview.title}
                      onError={() => setHasError(true)}
                      className={`w-full ${getLayoutAspectRatioClass('centered')} object-cover`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-tight uppercase tracking-wider text-secondary">
                      {preview.category}
                    </span>
                    <h4 className="font-display text-lg font-semibold text-paper mt-0.5">
                      {preview.title}
                    </h4>
                    <p className="text-xs text-mist-1 max-w-sm mx-auto mt-1">
                      {preview.description}
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Editorial Layout (Asymmetric Magazine Spread) */}
              {layout === 'editorial' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 rounded-2xl glass border border-(--line)">
                  <div className="md:col-span-8">
                    <div className="rounded-xl overflow-hidden border border-(--line) bg-black/40 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl || ''}
                        alt={preview.title}
                        onError={() => setHasError(true)}
                        className={`w-full ${getLayoutAspectRatioClass('editorial')} object-cover`}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-4 p-3.5 rounded-xl glass-strong border border-(--line) space-y-2">
                    <span className="text-[10px] font-mono-tight uppercase tracking-wider text-secondary">
                      {preview.category}
                    </span>
                    <h4 className="font-display text-base font-semibold text-paper leading-snug">
                      {preview.title}
                    </h4>
                    <p className="text-xs text-mist-1 line-clamp-3">
                      {preview.description}
                    </p>
                  </div>
                </div>
              )}

              {/* 5. Wide Layout (Expansive Panoramic) */}
              {layout === 'wide' && (
                <div className="space-y-3 p-4 rounded-2xl glass border border-(--line)">
                  <div className="rounded-xl overflow-hidden border border-(--line) bg-black/40 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl || ''}
                      alt={preview.title}
                      onError={() => setHasError(true)}
                      className={`w-full ${getLayoutAspectRatioClass('wide')} object-cover`}
                    />
                  </div>
                  <div className="flex items-center justify-between px-1 text-xs">
                    <h4 className="font-display font-semibold text-paper">
                      {preview.title}
                    </h4>
                    <span className="font-mono-tight text-mist-2 text-[11px]">
                      {preview.category}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
