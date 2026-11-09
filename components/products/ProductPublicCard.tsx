'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Check, Sparkles, ArrowRight, Bell } from 'lucide-react';
import type { EcosystemProduct } from '@/types/ecosystem-product';
import GlassCard from '@/components/ui/GlassCard';
import { formatProductStatus, getProductBadge } from '@/lib/products';

interface ProductPublicCardProps {
  product: EcosystemProduct;
  onOpenWaitlist: (product: EcosystemProduct) => void;
}

export default function ProductPublicCard({ product, onOpenWaitlist }: ProductPublicCardProps) {
  const isLive = product.status === 'live';
  const isBeta = product.status === 'beta';
  const statusInfo = formatProductStatus(product.status);
  const badgeLabel = getProductBadge(product);

  const formattedDate = product.launch_date
    ? new Date(product.launch_date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <GlassCard className="h-full flex flex-col justify-between p-6 sm:p-7 md:p-8 group relative overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
      {/* Decorative gradient glow behind the icon */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl opacity-40 group-hover:opacity-75 transition-opacity duration-500"
        aria-hidden="true"
      />

      <div className="space-y-5">
        {/* Top Meta Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-white/5 border border-(--line) group-hover:scale-105 group-hover:border-secondary/40 transition-all duration-300 shadow-inner">
            {product.emoji || '🚀'}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono-tight bg-white/5 text-mist-1 border border-white/10">
              {product.category || 'AI & Intelligence'}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono-tight border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} ${isLive ? 'animate-pulse' : ''}`} />
              <span>{statusInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Title, Tagline & Description */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-paper group-hover:text-white transition-colors">
              {product.name}
            </h3>
            {badgeLabel && badgeLabel !== statusInfo.label && (
              <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-primary/15 text-accent-soft border border-primary/25">
                {badgeLabel}
              </span>
            )}
          </div>

          {product.tagline && (
            <p className="text-sm font-medium text-secondary mb-3 leading-snug">
              {product.tagline}
            </p>
          )}

          <p className="text-sm leading-relaxed text-mist-1">
            {product.description}
          </p>
        </div>

        {/* Visual Mockup Graphic (if available) */}
        {product.image && (
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-(--line) bg-black/40 shadow-inner group/img">
            <Image
              src={product.image}
              alt={`${product.name} visual preview`}
              fill
              className="object-cover transition-transform duration-700 group-hover/img:scale-105"
            />
          </div>
        )}

        {/* Feature Highlights */}
        {product.features && product.features.length > 0 && (
          <div className="pt-2 border-t border-(--line) space-y-2">
            <p className="text-xs font-mono-tight uppercase tracking-wider text-mist-2">
              Key Capabilities
            </p>
            <ul className="space-y-1.5">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-mist-1 leading-relaxed">
                  <span className="p-0.5 rounded bg-primary/20 text-accent-soft shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer / Action Controls */}
      <div className="pt-6 mt-6 border-t border-(--line) flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono-tight text-mist-2">
          {isLive ? (
            <span className="text-emerald-400/90 font-medium">● Available to Public</span>
          ) : formattedDate ? (
            <span>Target Launch: {formattedDate}</span>
          ) : (
            <span>Roadmap Milestone</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {product.website_url ? (
            <Link
              href={product.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/80 transition-colors shadow-md"
            >
              <span>Visit App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onOpenWaitlist(product)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-paper bg-secondary/10 hover:bg-secondary/20 border border-secondary/25 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-secondary" />
              <span>{isBeta ? 'Join Beta' : 'Join Waitlist'}</span>
            </button>
          )}

          <Link
            href={`/contact?topic=${encodeURIComponent(product.name)}`}
            className="p-2 rounded-xl text-mist-2 hover:text-paper hover:bg-white/5 transition-colors text-xs font-mono-tight"
            title={`Contact team regarding ${product.name}`}
          >
            Inquire →
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
