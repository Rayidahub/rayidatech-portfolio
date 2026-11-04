'use client';

import Image from 'next/image';
import { ReactNode, useState, useEffect } from 'react';

interface SpecSlot {
  icon?: ReactNode;
  label: string;
}

interface MetricSlot {
  icon: ReactNode;
  label: string;
}

interface PremiumCardProps {
  /** Hero image src */
  imageSrc?: string | null;
  imageAlt: string;
  /** Top-left badge in default state */
  badge: string;
  /** Primary heading */
  title: string;
  /** Optional subtitle / address below the title (default state) */
  subtitle?: string;
  /** Secondary description shown on hover */
  description: string;
  /** Right-side metric in default state */
  primaryMetric?: string;
  /** Quick specs for the bottom metadata row (default state). Strings render as text; objects render icon + label. */
  bottomSpecs: (string | SpecSlot)[];
  /** Capsule badge icon + text on hover */
  hoverBadge: { icon: ReactNode; label: string };
  /** Metrics shown in the inline row on hover */
  hoverMetrics: MetricSlot[];
  /** Tag labels */
  tags: string[];
  /** Call-to-action label */
  ctaLabel: string;
  className?: string;
}

function normalizeSpec(spec: string | SpecSlot): SpecSlot {
  return typeof spec === 'string' ? { label: spec } : spec;
}

const easeOutExpo = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DEFAULT_CARD_COVER = '/img/card1.png';

export default function PremiumCard({
  imageSrc,
  imageAlt,
  badge,
  title,
  subtitle,
  description,
  primaryMetric,
  bottomSpecs,
  hoverBadge,
  hoverMetrics,
  tags,
  ctaLabel,
  className = '',
}: PremiumCardProps) {
  const fallbackSrc = DEFAULT_CARD_COVER;
  const initialSrc = imageSrc && imageSrc.trim() ? imageSrc.trim() : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);

  useEffect(() => {
    if (imageSrc && imageSrc.trim()) {
      setCurrentSrc(imageSrc.trim());
    } else {
      setCurrentSrc(fallbackSrc);
    }
  }, [imageSrc]);

  const tagsPreview = tags.slice(0, 3);
  const extraCount = tags.length - tagsPreview.length;

  return (
    <div
      className={`group relative w-full h-[520px] sm:h-[580px] md:h-[620px] overflow-hidden rounded-[28px] sm:rounded-[32px] bg-ink shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[0.98] border border-(--line) shadow-lg hover:shadow-2xl hover:border-primary/40 ${className}`}
    >
      {/* Background image — shared across both states */}
      <Image
        src={currentSrc}
        alt={imageAlt || title}
        fill
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setCurrentSrc(fallbackSrc)}
      />

      {/* ── LAYER: Default state ── */}
      <div
        className="absolute inset-0 flex flex-col justify-end transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:pointer-events-none"
        style={{ transitionTimingFunction: easeOutExpo }}
      >
        {/* Bottom shadow gradient — deep & high contrast so text is always crisp */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/75 to-transparent"
          aria-hidden="true"
        />

        {/* Top-left badge */}
        <div className="absolute top-4 left-4 glass-strong text-paper rounded-full px-3.5 py-1.5 text-xs font-medium shadow-md border border-(--line)">
          {badge}
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-sm" />
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="w-1 h-1 rounded-full bg-white/40" />
        </div>

        {/* Content footer */}
        <div className="relative z-10 p-6 sm:p-7 flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs sm:text-sm text-mist-1 font-mono-tight truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {primaryMetric && (
              <span className="shrink-0 font-mono-tight text-xs uppercase tracking-wider text-secondary px-3 py-1.5 rounded-full glass border border-(--line)">
                {primaryMetric}
              </span>
            )}
          </div>

          {/* Quick specs / metadata row */}
          {bottomSpecs.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-mist-1 pt-2 border-t border-white/10">
              {bottomSpecs.map((spec, i) => {
                const norm = normalizeSpec(spec);
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 font-mono-tight">
                    {norm.icon && (
                      <span className="text-secondary/80 shrink-0">{norm.icon}</span>
                    )}
                    <span>{norm.label}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── LAYER: Hover state ── */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 opacity-0 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:pointer-events-auto"
        style={{ transitionTimingFunction: easeOutExpo }}
      >
        {/* Full-card dark overlay for maximum legibility on hover */}
        <div
          className="pointer-events-none absolute inset-0 bg-ink/90 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Top hover row: capsule badge with icon */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full glass-strong border border-primary/30 px-3.5 py-1.5 text-xs font-medium text-secondary">
            {hoverBadge.icon}
            <span>{hoverBadge.label}</span>
          </span>
          <span className="font-mono-tight text-[11px] text-mist-2 uppercase tracking-wider">
            Case Study
          </span>
        </div>

        {/* Middle: Expanded description */}
        <div className="relative z-10 my-auto py-4">
          <h4 className="font-display text-xl sm:text-2xl font-bold text-paper mb-2">
            {title}
          </h4>
          <p className="text-sm sm:text-base leading-relaxed text-mist-1 line-clamp-4">
            {description}
          </p>
        </div>

        {/* Bottom hover: metrics row + tags + CTA button */}
        <div className="relative z-10 flex flex-col gap-4 pt-4 border-t border-white/10">
          {/* Key metrics grid */}
          {hoverMetrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {hoverMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-(--line)"
                >
                  <span className="text-primary shrink-0">{metric.icon}</span>
                  <span className="font-mono-tight text-paper truncate">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags preview */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {tagsPreview.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono-tight px-2.5 py-1 rounded-md bg-white/5 text-mist-1 border border-white/5"
                >
                  {tag}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="text-[10px] font-mono-tight text-mist-2">
                  +{extraCount} more
                </span>
              )}
            </div>
          )}

          {/* Call to action pill */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-paper group-hover:text-secondary transition-colors inline-flex items-center gap-1.5">
              <span>{ctaLabel}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <span className="text-[11px] font-mono-tight text-mist-2">View details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
