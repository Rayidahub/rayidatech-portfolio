import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Download,
  Building2,
  Check,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { getProposalBySlug } from '@/lib/data/proposals';

export const revalidate = 3600;

interface ProposalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProposalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const proposal = getProposalBySlug(slug);

  return {
    title: `Digital Upgrade Proposal — ${proposal.clientName} | Rayida Tech`,
    description: `Official scope of work, deliverables, and commercial proposal for ${proposal.clientName} prepared by Raymond Gaius at Rayida Tech.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const proposal = getProposalBySlug(slug);

  return (
    <div className="min-h-screen bg-ink text-paper selection:bg-primary/30 selection:text-white">
      {/* Top Notice Header */}
      <div className="border-b border-(--line) bg-ink-deep/90 backdrop-blur-md sticky top-0 z-40">
        <Container size="wide" className="py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono-tight text-mist-1">Official Client Proposal</span>
            <span className="text-mist-2 hidden sm:inline">•</span>
            <span className="text-white font-medium hidden sm:inline">{proposal.clientName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-tight text-[11px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              Valid for {proposal.validityDays} Days
            </span>
            <Link
              href="/projects/crestfield-academy"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono-tight text-mist-1 hover:text-white transition-colors"
            >
              Live Demo <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </Container>
      </div>

      <Container size="default" className="py-12 md:py-20 space-y-16">
        {/* Hero Section */}
        <Reveal>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono-tight uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Scope of Work & Commercial Agreement
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Digital Upgrade Proposal for{' '}
                <span className="gradient-text">{proposal.clientName}</span>
              </h1>
              <p className="text-mist-1 text-base sm:text-lg max-w-2xl leading-relaxed">
                {proposal.objective}
              </p>
            </div>

            {/* Proposal Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-(--line)">
              <div>
                <span className="text-[11px] font-mono-tight uppercase text-mist-2 block">Client</span>
                <span className="text-sm font-medium text-white flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> {proposal.clientName}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono-tight uppercase text-mist-2 block">Date Issued</span>
                <span className="text-sm font-medium text-white flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-secondary" /> {proposal.dateCreated}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono-tight uppercase text-mist-2 block">Turnaround</span>
                <span className="text-sm font-medium text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {proposal.deliveryTimeline}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono-tight uppercase text-mist-2 block">Architect</span>
                <span className="text-sm font-medium text-white flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Raymond Gaius
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Deliverables Section */}
        <Reveal index={1}>
          <div className="space-y-6">
            <div>
              <p className="font-mono-tight text-xs uppercase tracking-widest text-secondary mb-1">
                Phase 1 Deliverables
              </p>
              <h2 className="font-display text-2xl font-semibold text-white">
                Everything Included in Your System
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposal.deliverables.map((item, idx) => (
                <GlassCard key={idx} className="p-5 flex flex-col justify-between hover:border-primary/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono-tight text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-mist-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </GlassCard>
              ))}

              {/* Demo Weapon Callout Card */}
              <GlassCard className="p-5 border-secondary/30 bg-secondary/5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono-tight text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full">
                      Live Reference
                    </span>
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {proposal.demoProject.title}
                  </h3>
                  <p className="text-xs text-mist-1 leading-relaxed">
                    {proposal.demoProject.description}
                  </p>
                </div>
                <div className="pt-3">
                  <Link
                    href={proposal.demoProject.url}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
                  >
                    Launch Interactive Demo Preview <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </GlassCard>
            </div>
          </div>
        </Reveal>

        {/* Commercial Investment & Milestones */}
        <Reveal index={2}>
          <div className="space-y-6">
            <div>
              <p className="font-mono-tight text-xs uppercase tracking-widest text-primary mb-1">
                Commercial Architecture
              </p>
              <h2 className="font-display text-2xl font-semibold text-white">
                Total Investment & Milestones
              </h2>
            </div>

            <div className="bg-ink-deep border border-(--line) rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-(--line)">
                <div>
                  <span className="text-xs font-mono-tight uppercase text-mist-2 block">Package Selected</span>
                  <p className="font-display text-xl font-bold text-white mt-0.5">{proposal.packageName}</p>
                  <p className="text-xs text-mist-1 mt-1">Full turnkey design, engineering, mobile optimization & deployment</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs font-mono-tight uppercase text-mist-2 block">Total Investment</span>
                  <p className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-0.5">
                    {proposal.formattedPrice}
                  </p>
                </div>
              </div>

              {/* Milestones Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {proposal.milestones.map((m, idx) => (
                  <div key={idx} className="bg-ink p-5 rounded-2xl border border-(--line) space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tight text-xs text-white font-medium">{m.stage}</span>
                      <span className="font-mono-tight text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {m.formattedAmount} ({m.percentage}%)
                      </span>
                    </div>
                    <p className="text-xs text-mist-1">{m.description}</p>
                    <p className="text-[11px] font-mono-tight text-mist-2 pt-1 border-t border-(--line)">
                      {m.trigger}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Optional Care Retainer */}
        <Reveal index={3}>
          <div className="bg-gradient-to-br from-primary/10 via-ink to-secondary/10 border border-primary/20 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono-tight uppercase text-secondary block">
                  Optional Ongoing Protection
                </span>
                <h3 className="font-display text-xl font-semibold text-white mt-0.5">
                  {proposal.carePlan.name} Retainer
                </h3>
                <p className="text-xs text-mist-1 mt-1">
                  Keep your digital system secure, fast, and constantly updated post-launch.
                </p>
              </div>
              <div className="sm:text-right">
                <span className="font-display text-2xl font-bold text-white">
                  {proposal.carePlan.formattedPrice}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-primary/20">
              {proposal.carePlan.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-mist-1">
                  <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Acceptance Action Block */}
        <Reveal index={4}>
          <div className="bg-white rounded-3xl p-8 text-center text-slate-900 space-y-5 shadow-2xl">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono-tight text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 7-Day Turnaround Guarantee
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Ready to Upgrade {proposal.clientName}?
              </h2>
              <p className="text-sm text-slate-600">
                Click below to accept this proposal and receive your kickoff invoice. Development commences within 24 hours of Milestone 1 deposit.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={proposal.whatsappAcceptanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Accept Proposal via WhatsApp
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
              >
                Have a Question? Contact Us
              </Link>
            </div>

            <p className="text-[11px] font-mono-tight text-slate-500 pt-2">
              Rayida Tech • RC Registered • rayidatech.name.ng • Abuja, Nigeria
            </p>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
