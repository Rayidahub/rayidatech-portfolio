'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import {
  DIGITAL_UPGRADE_PACKAGES,
  CARE_RETAINER_PLANS,
  type PricingPackage,
  type CarePlan,
} from '@/lib/data/pricing-packages';

const WHATSAPP_PHONE = '2348123456789'; // Rayida Tech official business line

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export default function ServicePricingPackages() {
  const [activeTab, setActiveTab] = useState<'packages' | 'care'>('packages');

  return (
    <section className="relative py-20 md:py-28 overflow-hidden border-b border-(--line) bg-ink">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[42rem] h-[24rem] rounded-full bg-radial-glow from-primary/[0.10] via-secondary/[0.04] to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.2]" />
      </div>

      <Container size="wide" className="relative z-10">
        {/* Section Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono-tight uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent, Productized Pricing</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-paper tracking-tight mb-4">
              Business Digital Upgrade <span className="gradient-text">Packages</span>
            </h2>
            <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
              No vague hourly billing. Predictable pricing, defined deliverables, and rapid turnaround
              designed to turn your online presence into a client-attracting system.
            </p>

            {/* Toggle Switch: Project Packages vs Care Plans */}
            <div className="inline-flex items-center p-1 rounded-full bg-paper/[0.04] border border-(--line) mt-8">
              <button
                type="button"
                onClick={() => setActiveTab('packages')}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'packages'
                    ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                    : 'text-mist-2 hover:text-paper'
                }`}
              >
                Project Packages (One-off)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'care'
                    ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                    : 'text-mist-2 hover:text-paper'
                }`}
              >
                Website Care Retainers (Monthly)
              </button>
            </div>
          </div>
        </Reveal>

        {/* Tab 1: Project Packages */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {DIGITAL_UPGRADE_PACKAGES.map((pkg, idx) => {
              const waLink = buildWhatsAppUrl(pkg.whatsappMessage);

              return (
                <Reveal key={pkg.id} index={idx}>
                  <GlassCard
                    className={`p-7 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                      pkg.isPopular
                        ? 'border-primary/50 shadow-2xl shadow-primary/10 bg-primary/[0.04] -translate-y-1 md:-translate-y-2'
                        : 'hover:border-secondary/30'
                    }`}
                  >
                    {/* Popular Highlight Badge */}
                    {pkg.isPopular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-l from-primary to-secondary text-white text-[10px] uppercase font-mono-tight tracking-widest px-4 py-1 rounded-bl-xl font-bold shadow-sm">
                          {pkg.badge}
                        </div>
                      </div>
                    )}

                    <div>
                      {/* Badge / Category */}
                      {!pkg.isPopular && pkg.badge && (
                        <span className="font-mono-tight text-[11px] uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/20 inline-block mb-3">
                          {pkg.badge}
                        </span>
                      )}

                      <h3 className="font-display text-2xl font-semibold text-paper mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-mist-2 mb-6 min-h-[36px] leading-relaxed">
                        {pkg.tagline}
                      </p>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-(--line)">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-4xl sm:text-5xl font-bold text-paper">
                            {pkg.formattedPrice}
                          </span>
                          <span className="text-xs font-mono-tight text-mist-2">
                            fixed investment
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-secondary mt-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Delivery: {pkg.deliveryTime}</span>
                        </div>
                      </div>

                      {/* Deliverables List */}
                      <div className="space-y-3 mb-8">
                        <p className="text-[11px] font-mono-tight uppercase tracking-wider text-mist-2">
                          What&apos;s Included:
                        </p>
                        <ul className="space-y-2.5">
                          {pkg.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2.5 text-xs text-mist-1">
                              <span className="w-4 h-4 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 text-secondary" />
                              </span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-6 border-t border-(--line) space-y-2.5">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                          pkg.isPopular
                            ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:scale-[1.02]'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-paper border border-(--line)'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{pkg.ctaLabel}</span>
                      </a>
                      <p className="text-[10px] text-center text-mist-2 font-mono-tight">
                        50% deposit &bull; 40% design milestone &bull; 10% launch
                      </p>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Tab 2: Care Retainers */}
        {activeTab === 'care' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {CARE_RETAINER_PLANS.map((plan, idx) => {
              const waLink = buildWhatsAppUrl(plan.whatsappMessage);

              return (
                <Reveal key={plan.id} index={idx}>
                  <GlassCard
                    className={`p-7 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                      plan.isPopular
                        ? 'border-secondary/50 shadow-2xl shadow-secondary/10 bg-secondary/[0.03] -translate-y-1'
                        : 'hover:border-secondary/30'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-l from-secondary to-primary text-ink text-[10px] uppercase font-mono-tight tracking-widest px-4 py-1 rounded-bl-xl font-bold">
                          {plan.badge}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-display text-2xl font-semibold text-paper mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-mist-2 mb-6 min-h-[36px] leading-relaxed">
                        {plan.tagline}
                      </p>

                      <div className="mb-6 pb-6 border-b border-(--line)">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-4xl sm:text-5xl font-bold text-paper">
                            {plan.formattedPrice}
                          </span>
                        </div>
                        <span className="text-xs text-mist-2 mt-1 block">
                          Billed monthly &bull; Cancel anytime
                        </span>
                      </div>

                      <div className="space-y-3 mb-8">
                        <p className="text-[11px] font-mono-tight uppercase tracking-wider text-mist-2">
                          Monthly Coverage:
                        </p>
                        <ul className="space-y-2.5">
                          {plan.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2.5 text-xs text-mist-1">
                              <span className="w-4 h-4 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 text-secondary" />
                              </span>
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-(--line)">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                          plan.isPopular
                            ? 'bg-secondary hover:bg-secondary/90 text-ink font-bold shadow-md shadow-secondary/20 hover:scale-[1.02]'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-paper border border-(--line)'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{plan.ctaLabel}</span>
                      </a>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Milestone Guarantee & Demo Link Banner */}
        <Reveal>
          <div className="mt-14 p-6 sm:p-8 rounded-2xl glass border border-(--line) flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-paper">
                  Want to see the actual standard before committing?
                </h4>
                <p className="text-xs sm:text-sm text-mist-1 mt-1 max-w-xl">
                  Explore our live <strong>Crestfield Academy</strong> demonstration to see our 3-step admission pathway, mobile-first performance, and direct WhatsApp inquiry flow in action.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/projects/crestfield-academy"
                className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium transition-all shadow-md shadow-primary/20"
              >
                <span>View Live Academy Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
