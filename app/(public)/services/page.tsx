import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  HelpCircle,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import StatusPill from '@/components/ui/StatusPill';
import { createClient } from '@/lib/supabase/server';
import type { Service } from '@/types/service';
import { defaultServices } from '@/lib/data/services';
import { ServiceIcon } from '@/lib/service-icons';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Services & Capabilities',
  description:
    'End-to-end design and engineering solutions — UI/UX design, product architecture, branding, high-performance web development, and tech mentorship by Raymond Gaius.',
};

async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultServices;
    }

    return data;
  } catch {
    return defaultServices;
  }
}

const guarantees = [
  {
    icon: Zap,
    title: 'Speed & Precision',
    description:
      'Fast turnaround without sacrificing craft. Rapid prototyping and milestone-driven delivery keep your project on schedule.',
  },
  {
    icon: Layers,
    title: 'Scalable Systems',
    description:
      'From modular design tokens in Figma to maintainable TypeScript codebases, everything is built to scale smoothly as you grow.',
  },
  {
    icon: ShieldCheck,
    title: 'Engineered For Trust',
    description:
      'Human-centered design principles that eliminate user friction, enhance security, and drive measurable conversion.',
  },
  {
    icon: Sparkles,
    title: 'Founder Direct',
    description:
      'Direct collaboration with Raymond Gaius. No junior handoffs or convoluted agency layers — just transparent, senior execution.',
  },
];

const faqs = [
  {
    q: 'How does the engagement process work?',
    a: 'We begin with an exploratory discovery session to unpack your vision, target audience, and business KPIs. From there, we define a concrete scope, timeline, and phased milestones before moving directly into iterative design or development.',
  },
  {
    q: 'Can services be combined into a bespoke package?',
    a: 'Absolutely. Many clients require an integrated suite — such as Brand Identity combined with UI/UX Design and Next.js Web Development. We tailor our scope specifically to what moves your business forward.',
  },
  {
    q: 'What is your typical project timeline?',
    a: 'Timelines range depending on scope: focused design sprints or landing pages typically launch within 1–2 weeks, while full product MVPs and comprehensive design systems usually span 3–6 weeks.',
  },
  {
    q: 'Do you provide post-launch support and handoff?',
    a: 'Yes. Every project includes comprehensive design documentation, component libraries, and clean repository handoffs, along with dedicated post-launch support to guarantee smooth continuity.',
  },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="bg-ink min-h-screen">
      {/* ── Hero Header ── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-(--line)">
        {/* Ambient atmospheric glows */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[28rem] rounded-full bg-radial-glow from-primary/[0.12] via-secondary/[0.05] to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.2]" />
        </div>

        <Container size="default" className="relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-6">
              <StatusPill />
            </div>
          </Reveal>

          <Reveal>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-paper tracking-tight mb-6 max-w-4xl mx-auto leading-[1.12]">
              Capabilities &amp; Digital{' '}
              <span className="gradient-text">Solutions</span>
            </h1>
          </Reveal>

          <Reveal>
            <p className="text-mist-1 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              End-to-end design and engineering tailored for ambitious brands. We craft
              intuitive interfaces, resilient identity systems, and high-performance
              web solutions built to scale.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-glow inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3.5 text-sm font-medium transition-all shadow-lg shadow-primary/20"
              >
                Start A Project <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.link/tlezg8"
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-paper hover:text-secondary transition-colors"
              >
                Direct WhatsApp
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Services Grid Section ── */}
      <Section className="relative overflow-hidden">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Reveal key={service.id} index={index}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full"
                >
                  <GlassCard className="p-7 md:p-8 h-full flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-secondary/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-secondary/5">
                    {/* Glowing accent border on hover */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-secondary/50 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    />

                    <div>
                      {/* Top Row: Icon squircle + Order badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-(--line) group-hover:border-secondary/40 flex items-center justify-center text-secondary group-hover:scale-105 transition-all duration-300 shadow-inner">
                          <ServiceIcon
                            name={service.icon_name}
                            className="w-6 h-6 text-secondary transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <span className="font-mono-tight text-xs uppercase tracking-widest text-mist-2/70 bg-paper/[0.03] border border-(--line) px-3 py-1 rounded-full group-hover:text-secondary group-hover:border-secondary/30 transition-colors">
                          0{index + 1}
                        </span>
                      </div>

                      {/* Service Category & Title */}
                      <p className="font-mono-tight text-xs uppercase tracking-[0.18em] text-secondary mb-2">
                        Service Offering
                      </p>
                      <h2 className="font-display text-2xl font-semibold text-paper group-hover:text-secondary transition-colors duration-300 mb-2">
                        {service.title}
                      </h2>
                      <p className="text-secondary/80 text-xs font-mono-tight mb-3">
                        {service.headline}
                      </p>
                      <p className="text-mist-1 text-sm leading-relaxed mb-6 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Key Deliverables Highlights */}
                      {service.features && service.features.length > 0 && (
                        <div className="border-t border-(--line) pt-4 mb-6">
                          <p className="font-mono-tight text-[11px] uppercase tracking-wider text-mist-2 mb-3">
                            Key Deliverables
                          </p>
                          <ul className="space-y-2">
                            {service.features.slice(0, 3).map((feat, fIdx) => (
                              <li
                                key={fIdx}
                                className="flex items-center gap-2 text-xs text-mist-1"
                              >
                                <span className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 text-secondary" />
                                </span>
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Link */}
                    <div className="pt-4 border-t border-(--line) flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-secondary group-hover:text-paper transition-colors duration-300">
                        Explore Capability
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-secondary" />
                      </span>
                      <span className="text-[11px] font-mono-tight text-mist-2 uppercase tracking-wider">
                        Learn More
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── The Rayida Standard / Principles ── */}
      <Section className="bg-[var(--ink-deep)] relative overflow-hidden border-y border-(--line)">
        <div
          className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <Container size="default" className="relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                Methodology &amp; Quality
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-4">
                The Rayida Standard
              </h2>
              <p className="text-mist-1 text-base max-w-xl mx-auto leading-relaxed">
                Every service is backed by rigorous execution standards designed to
                protect your investment and deliver quantifiable results.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} index={index}>
                  <GlassCard className="p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-secondary/40 hover:-translate-y-1">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mb-5 text-secondary border border-secondary/20 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-paper mb-2">
                        {item.title}
                      </h3>
                      <p className="text-mist-1 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── Frequently Asked Questions ── */}
      <Section className="relative overflow-hidden">
        <Container size="narrow">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-secondary" />
                <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
                  Answers &amp; Clarity
                </p>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-mist-1 text-base max-w-lg mx-auto">
                Everything you need to know about working together, timelines, and deliverables.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} index={index}>
                <GlassCard className="p-6 transition-all duration-300 hover:border-primary/40">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-paper mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-mist-1 text-sm leading-relaxed">{faq.a}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Final Call to Action ── */}
      <Section className="relative overflow-hidden py-20 md:py-28">
        <Container size="narrow">
          <Reveal>
            <GlassCard className="p-10 md:p-14 text-center relative overflow-hidden">
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/15 blur-3xl"
                aria-hidden="true"
              />
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3 relative z-10">
                Kickstart Your Vision
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-4 relative z-10">
                Ready to Elevate Your Digital Presence?
              </h2>
              <p className="text-mist-1 mb-8 max-w-md mx-auto text-base relative z-10 leading-relaxed">
                Whether you need a full product sprint, a refreshed visual identity, or a
                high-speed web platform — let&apos;s build something remarkable.
              </p>
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3.5 text-sm font-medium transition-all shadow-lg shadow-primary/20"
                >
                  Schedule A Discovery Call <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.link/tlezg8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-paper hover:text-secondary transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
