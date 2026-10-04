import { createClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';
import type { Service } from '@/types/service';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  Send,
  Image as ImageIcon,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import StatusPill from '@/components/ui/StatusPill';
import { ServiceIcon } from '@/lib/service-icons';
import {
  defaultServices,
  getDefaultService,
  getServiceImage,
  cleanServiceContent,
} from '@/lib/data/services';

export const revalidate = 3600;

async function getService(slug: string): Promise<Service | null> {
  try {
    const supabaseClient = await createClient();
    const { data, error } = await supabaseClient
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return getDefaultService(slug) || null;
    }

    return data;
  } catch {
    return getDefaultService(slug) || null;
  }
}

async function getAllServices(): Promise<Service[]> {
  try {
    const supabaseClient = await createClient();
    const { data, error } = await supabaseClient
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

export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('services').select('slug');
    if (!data || data.length === 0) {
      return defaultServices.map((service) => ({ slug: service.slug }));
    }
    return data.map((service) => ({ slug: service.slug }));
  } catch {
    return defaultServices.map((service) => ({ slug: service.slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) return { title: 'Service Not Found | Raymond Gaius' };

  return {
    title: `${service.title} | Capabilities & Services`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const allServices = await getAllServices();
  const otherServices = allServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  const imageUrl = getServiceImage(service);
  const displayContent = cleanServiceContent(service.content);

  const whatsappMessage = encodeURIComponent(
    `Hi Raymond, I came across your portfolio and I am interested in discussing a project regarding ${service.title}.`
  );

  return (
    <main className="bg-ink min-h-screen pt-32 pb-24 md:pt-40 md:pb-32">
      {/* ── Background Atmosphere ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[30rem] rounded-full bg-radial-glow from-primary/[0.1] via-secondary/[0.04] to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.15]" />
      </div>

      <Container size="default">
        {/* Back Link */}
        <Reveal>
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-mist-1 hover:text-secondary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to all services</span>
            </Link>
          </div>
        </Reveal>

        {/* ── Service Header Banner ── */}
        <Reveal>
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary shadow-lg shadow-primary/10">
                <ServiceIcon name={service.icon_name} className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="font-mono-tight text-xs uppercase tracking-[0.2em] text-secondary">
                  Specialized Service
                </p>
                <h2 className="font-display text-lg font-semibold text-paper">
                  {service.title}
                </h2>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-paper tracking-tight mb-6 leading-[1.18] max-w-3xl">
              {service.headline}
            </h1>

            <p className="text-mist-1 text-lg md:text-xl leading-relaxed max-w-3xl">
              {service.description}
            </p>
          </div>
        </Reveal>

        {/* ── Visual Showcase Image Banner ── */}
        {imageUrl && (
          <Reveal>
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-(--line) group shadow-2xl shadow-primary/10 mb-12 bg-white/[0.02]">
              {/* Ambient backdrop glow */}
              <div
                className="pointer-events-none absolute -inset-4 bg-radial-glow from-primary/20 via-secondary/10 to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                aria-hidden="true"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`${service.title} Visual Showcase`}
                className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Bottom gradient fade */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-8 z-30 flex items-center gap-3">
                <span className="glass px-3.5 py-1.5 rounded-full text-xs font-mono-tight text-secondary border border-secondary/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary signal-dot" />
                  <span>{service.title} Visual Showcase</span>
                </span>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── Main Details Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column: Long-form Content & In-depth Overview */}
          <div className="lg:col-span-2 space-y-8">
            <Reveal>
              <GlassCard className="p-8 md:p-10 relative overflow-hidden">
                <div
                  className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-2xl"
                  aria-hidden="true"
                />
                <h3 className="font-display text-xl font-semibold text-paper mb-4 flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <span>Overview &amp; Strategic Approach</span>
                </h3>
                <p className="text-mist-1 text-base leading-relaxed whitespace-pre-line mb-8">
                  {displayContent || service.description}
                </p>

                {/* Key Benefits Callout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-(--line) pt-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-paper mb-1">
                        High Reliability
                      </h4>
                      <p className="text-xs text-mist-1 leading-relaxed">
                        Industry-standard architecture, test coverage, and responsive delivery.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-paper mb-1">
                        Agile Turnaround
                      </h4>
                      <p className="text-xs text-mist-1 leading-relaxed">
                        Structured sprints, frequent updates, and continuous milestone reviews.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* What You Get / Deliverables Checklist */}
            <Reveal>
              <GlassCard className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-mono-tight text-xs uppercase tracking-wider text-secondary mb-1">
                      Deliverables Checklist
                    </p>
                    <h3 className="font-display text-xl font-semibold text-paper">
                      What You Receive
                    </h3>
                  </div>
                  <span className="font-mono-tight text-xs bg-secondary/10 border border-secondary/20 text-secondary px-3 py-1 rounded-full">
                    {service.features.length} Items Included
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3.5 p-4 rounded-xl bg-paper/[0.02] border border-(--line) hover:border-secondary/30 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-secondary" />
                      </span>
                      <span className="text-sm text-mist-1 font-medium leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>

          {/* Right Column: Fast Contact / Action Sidebar */}
          <div className="space-y-6">
            <Reveal>
              <GlassCard className="p-7 md:p-8 relative overflow-hidden border-secondary/30">
                <div
                  className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-secondary/10 blur-2xl"
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between mb-4">
                  <StatusPill />
                  {imageUrl && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-(--line) shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <h3 className="font-display text-2xl font-semibold text-paper mb-2">
                  Request This Service
                </h3>
                <p className="text-mist-1 text-sm leading-relaxed mb-6">
                  Ready to collaborate on {service.title}? Let&apos;s evaluate your requirements
                  and formulate an actionable project proposal.
                </p>

                <div className="space-y-3">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="btn-glow w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full py-3.5 text-sm font-medium transition-all shadow-lg shadow-primary/25"
                  >
                    <Send className="w-4 h-4" />
                    <span>Inquire Now</span>
                  </Link>

                  <a
                    href={`https://wa.link/tlezg8?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium text-paper hover:text-secondary transition-colors"
                  >
                    <span>Instant WhatsApp Chat</span>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-(--line) text-xs text-mist-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>Response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>Fixed-price or milestone retainers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>Strict NDA &amp; confidentiality honored</span>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Quick Process Snapshot */}
            <Reveal>
              <GlassCard className="p-6">
                <h4 className="font-display text-sm font-semibold text-paper mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-secondary" />
                  <span>Execution Roadmap</span>
                </h4>
                <ol className="space-y-3 text-xs text-mist-1">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tight text-secondary font-bold">1.</span>
                    <span>Discovery &amp; requirement synthesis</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tight text-secondary font-bold">2.</span>
                    <span>Wireframing, prototypes &amp; architecture</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tight text-secondary font-bold">3.</span>
                    <span>High-fidelity production &amp; engineering</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tight text-secondary font-bold">4.</span>
                    <span>Quality assurance, testing &amp; final handoff</span>
                  </li>
                </ol>
              </GlassCard>
            </Reveal>
          </div>
        </div>

        {/* ── Related Services ── */}
        {otherServices.length > 0 && (
          <div className="border-t border-(--line) pt-16">
            <Reveal>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="font-mono-tight text-xs uppercase tracking-wider text-secondary mb-1">
                    Complementary Expertise
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-paper">
                    Explore Other Services
                  </h3>
                </div>
                <Link
                  href="/services"
                  className="text-sm text-secondary hover:underline inline-flex items-center gap-1 font-mono-tight"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherServices.map((other, idx) => (
                <Reveal key={other.id} index={idx}>
                  <Link
                    href={`/services/${other.slug}`}
                    className="group block h-full"
                  >
                    <GlassCard className="p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-secondary/40 hover:-translate-y-1">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-secondary mb-4">
                          <ServiceIcon name={other.icon_name} className="w-5 h-5 text-secondary" />
                        </div>
                        <h4 className="font-display text-lg font-semibold text-paper group-hover:text-secondary transition-colors mb-1">
                          {other.title}
                        </h4>
                        <p className="text-xs text-mist-1 line-clamp-2 leading-relaxed">
                          {other.description}
                        </p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-(--line) flex items-center gap-1.5 text-xs font-medium text-secondary">
                        <span>Learn more</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
