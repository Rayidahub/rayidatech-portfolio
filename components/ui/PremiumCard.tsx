'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

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
  imageSrc: string;
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
  const tagsPreview = tags.slice(0, 3);
  const extraCount = tags.length - tagsPreview.length;

  return (
    <div
      className={`group relative w-full h-[620px] overflow-hidden rounded-[32px] bg-ink shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[0.98] ${className}`}
    >
      {/* Background image — shared across both states */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* ── LAYER: Default state ── */}
      <div
        className="absolute inset-0 flex flex-col justify-end transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:pointer-events-none"
        style={{ transitionTimingFunction: easeOutExpo }}
      >
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Top-left badge */}
        <div className="absolute top-4 left-4 glass-strong text-paper rounded-full px-3 py-1 text-xs font-medium">
          {badge}
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-paper/80" />
          <span className="w-1 h-1 rounded-full bg-paper/40" />
          <span className="w-1 h-1 rounded-full bg-paper/40" />
        </div>

        {/* Main info */}
        <div className="absolute bottom-14 inset-x-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-paper text-lg font-semibold leading-tight truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-paper/70 text-sm mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          {primaryMetric && (
            <span className="text-paper/90 text-sm font-medium whitespace-nowrap">
              {primaryMetric}
            </span>
          )}
        </div>

        {/* Bottom metadata row */}
        <div className="absolute bottom-4 inset-x-6 flex items-center gap-3 text-xs text-paper/70">
          {bottomSpecs.map((spec, i) => {
            const { icon, label } = normalizeSpec(spec);
            return (
              <span key={i} className="flex items-center gap-1.5 truncate">
                {i > 0 && (
                  <span className="inline-block w-px h-3 bg-paper/20 mr-1.5" />
                )}
                {icon && <span className="shrink-0">{icon}</span>}
                <span>{label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── LAYER: Hover state — glass bottom sheet ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[72%] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-ink/80 backdrop-blur-xl border-t border-(--line) rounded-t-[32px] flex flex-col p-6"
        style={{ transitionTimingFunction: easeOutExpo }}
      >
        {/* Capsule badge */}
        <div className="self-start flex items-center gap-1.5 bg-paper/10 text-paper rounded-full px-3 py-1.5 text-xs font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {hoverBadge.icon}
          <span>{hoverBadge.label}</span>
        </div>

        {/* Title */}
        <h3 className="text-paper text-xl font-semibold leading-tight mt-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-mist-1 text-sm leading-relaxed line-clamp-3 mt-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {description}
        </p>

        {/* Spacer */}
        <div className="flex-1 min-h-4" />

        {/* Metrics row */}
        <div className="flex items-stretch border-y border-(--line) -mx-6 px-6 py-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          {hoverMetrics.map((metric, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 flex-1 ${
                i < hoverMetrics.length - 1 ? 'border-r border-(--line-strong)' : ''
              }`}
            >
              <span className="text-secondary shrink-0">{metric.icon}</span>
              <span className="text-xs text-mist-1 truncate">{metric.label}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {tagsPreview.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-paper/10 text-mist-1 px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full bg-primary/20 text-primary px-3 py-1 text-xs font-semibold">
              +{extraCount}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="pt-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="w-full bg-primary text-paper text-sm font-medium rounded-full py-3 text-center transition-colors duration-200 group-hover:bg-primary/90">
            {ctaLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
