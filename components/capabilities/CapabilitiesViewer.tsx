'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Printer,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  Briefcase,
  Users,
  Code2,
  Palette,
  ArrowRight,
  MessageCircle,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import StatusPill from '@/components/ui/StatusPill';
import BrandLogo from '@/components/ui/BrandLogo';

type ViewMode = 'statement' | 'deck';

const DECK_SLIDES = [
  {
    id: 1,
    tag: 'Overview & Vision',
    title: 'Building Digital Experiences People Can Trust',
    subtitle: 'High-Velocity Product Design & AI Engineering',
    content: {
      type: 'cover',
      description:
        'Rayida Tech is an agile product design and AI engineering studio led by Raymond Gaius. We help venture-backed startups, high-growth companies, and digital agencies design, architect, and ship high-converting web applications and transparent AI interfaces.',
      highlights: [
        'Integrated Product Designer & Full-Stack Engineer',
        'Proven delivery across 50+ projects & 20+ global clients',
        'Headquartered in Lagos (UTC+1) with worldwide delivery',
      ],
    },
  },
  {
    id: 2,
    tag: 'The Core Problem',
    title: 'Why Startups & Agencies Hit Execution Bottlenecks',
    subtitle: 'The 4 Major Friction Points in Modern Product Delivery',
    content: {
      type: 'cards',
      cards: [
        {
          title: 'The Design-to-Code Chasm',
          desc: 'Designers hand off Figma files that engineers struggle to build cleanly; developers deliver code that compromises the design intent.',
          badge: 'Friction',
        },
        {
          title: 'Agency Capacity Bottlenecks',
          desc: 'Agencies turn down profitable contracts or risk client deadlines because their internal teams are overloaded with backlog sprints.',
          badge: 'Overhead',
        },
        {
          title: 'The "AI Gimmick" Trap',
          desc: 'Most AI implementations feel like ungrounded chatbots with high latency, opaque decision-making, and zero user trust.',
          badge: 'Distrust',
        },
        {
          title: 'Protracted Launch Cycles',
          desc: 'Months of discovery, fragmented handoffs, and token misalignment burn client runway and stall critical time-to-market.',
          badge: 'Lost Revenue',
        },
      ],
    },
  },
  {
    id: 3,
    tag: 'The Solution',
    title: 'The Integrated Design & AI Engineering Partner',
    subtitle: 'Zero Handoff Friction • Production Speed • Explainable AI',
    content: {
      type: 'pillars',
      pillars: [
        {
          title: 'One Seamless Loop',
          desc: 'Eliminate the handoff tax. What is designed in Figma is translated pixel-for-pixel into clean, maintainable Next.js 16 and TypeScript.',
          icon: Code2,
        },
        {
          title: 'White-Label Scalability',
          desc: 'We act as your specialized external bench—absorbing project overflow under strict NDA so your agency keeps 100% of client equity.',
          icon: Users,
        },
        {
          title: 'Explainable AI (XAI)',
          desc: 'We build interfaces that render algorithmic reasoning, confidence scores, and verification steps clearly to build authentic user trust.',
          icon: Cpu,
        },
        {
          title: 'Agile Velocity',
          desc: 'Turn months into days. Pre-audited design token architectures and modular component libraries get MVPs into production in record time.',
          icon: Zap,
        },
      ],
    },
  },
  {
    id: 4,
    tag: 'Core Capabilities',
    title: 'End-to-End Capabilities Across the Product Lifecycle',
    subtitle: 'From Initial Wireframes to Production Deployment',
    content: {
      type: 'matrix',
      items: [
        {
          title: 'Product & UI/UX Design',
          skills: ['Figma Prototypes', 'Design Systems', 'User Research', 'CRO Funnels', 'Usability Audits'],
          metric: 'High Conversion',
        },
        {
          title: 'Full-Stack Web Engineering',
          skills: ['Next.js 16 (Turbopack)', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Supabase / PostgreSQL'],
          metric: 'Sub-second LCP',
        },
        {
          title: 'Explainable AI Systems',
          skills: ['XAI Interface Design', 'LLM Agent Pipelines', 'Contextual Embeddings', 'Token Rate Limiting'],
          metric: 'Zero Hallucination UX',
        },
        {
          title: 'Brand Systems & Strategy',
          skills: ['Visual Identity Manuals', 'Investor Pitch Decks', 'Design Tokens', 'High-Impact Marketing'],
          metric: 'Enterprise Trust',
        },
      ],
    },
  },
  {
    id: 5,
    tag: 'Case Study: FinTech & AI',
    title: 'TrustLayer: Transparent AI Banking Interface',
    subtitle: 'Eliminating the "Black Box" in Algorithmic Credit & Risk',
    content: {
      type: 'case-study',
      client: 'TrustLayer FinTech',
      challenge:
        'Banking customers consistently rejected algorithmic credit scoring and automated decisions due to a complete lack of transparency and fear of automated bias.',
      solution:
        'Rayida Tech architected an explainable AI banking interface featuring interactive risk factor weights, visual confidence breakdown cards, and a real-time automated dispute workflow.',
      metrics: [
        { label: 'User Comprehension', value: '+89%', note: 'in usability testing' },
        { label: 'Support Friction', value: '-42%', note: 'on risk queries' },
        { label: 'Handoff Velocity', value: '2 Weeks', note: 'prototype to code' },
      ],
    },
  },
  {
    id: 6,
    tag: 'Case Study: B2B SaaS',
    title: 'CollectWise: Receivables & Payment Platform',
    subtitle: 'Streamlining Multi-Tenant Invoicing & Enterprise Collections',
    content: {
      type: 'case-study',
      client: 'CollectWise SaaS',
      challenge:
        'Mid-market B2B finance departments suffered from fragmented invoice tracking, late reconciliation, and delayed dispute resolutions with external buyers.',
      solution:
        'Designed and engineered a centralized accounts-receivable dashboard with automated payment triggers, multi-tenant permission controls, and real-time ledger sync.',
      metrics: [
        { label: 'Dispute Cycle Time', value: '-35%', note: 'resolution speedup' },
        { label: 'Client Onboarding', value: '< 3 Min', note: 'self-serve flow' },
        { label: 'Security & RLS', value: '100%', note: 'multi-tenant pass rate' },
      ],
    },
  },
  {
    id: 7,
    tag: 'Technical Excellence',
    title: 'Modern Architecture & Production Standards',
    subtitle: 'Built for Performance, Security, and Scalability',
    content: {
      type: 'tech-specs',
      specs: [
        {
          category: 'Frontend & UI',
          details: 'Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, WCAG 2.1 AA accessible.',
        },
        {
          category: 'Backend & Data',
          details: 'Supabase PostgreSQL, strict Row Level Security (RLS), centralized Auth Guards, REST & Server Actions.',
        },
        {
          category: 'AI Orchestration',
          details: 'Google Gemini & Anthropic Claude APIs, structured JSON schemas, sliding-window rate limiters, token budgets.',
        },
        {
          category: 'Compliance & Quality',
          details: 'Nigeria Data Protection Act (NDPA 2023) aligned, automated Vitest unit testing, hourly ISR revalidation.',
        },
      ],
    },
  },
  {
    id: 8,
    tag: 'Agency Partnerships',
    title: 'Expand Agency Margin Without Expanding Payroll',
    subtitle: 'Three Flexible White-Label Collaboration Models',
    content: {
      type: 'models',
      models: [
        {
          title: 'White-Label "Ghost" Delivery',
          focus: 'Client-Confidential Execution',
          points: [
            'We build under your strict NDA',
            'Your agency retains 100% client relationship and margin',
            'Clean GitHub PRs, Figma specs, and token sync',
            'Optional: client-facing as your senior design engineer',
          ],
        },
        {
          title: 'Dedicated Sprint Retainer',
          focus: 'Ongoing Capacity Augmentation',
          points: [
            '20 or 40 hours/week reserved capacity',
            'Direct Slack / WhatsApp channel integration',
            'Weekly sprint planning and async Loom walkthroughs',
            'Predictable flat monthly investment',
          ],
        },
        {
          title: 'Emergency Surge Overflow',
          focus: 'Rapid Project Rescue',
          points: [
            '48-hour sprint kickoffs for tight deadlines',
            'Unblock stalled milestones and rescue at-risk contracts',
            'Fixed-scope rapid turnaround',
            'Immediate risk mitigation and QA verification',
          ],
        },
      ],
    },
  },
  {
    id: 9,
    tag: 'Collaboration & Timezone',
    title: 'Seamless Global Workflow & Timezone Overlap',
    subtitle: 'West Africa Time (WAT / UTC+1) — Direct Sync with US & Europe',
    content: {
      type: 'workflow',
      zones: [
        { region: 'United Kingdom & Europe (BST/CEST)', overlap: 'Full 8-Hour Workday Overlap', desc: 'Real-time sync, instant Slack replies, concurrent sprint standups.' },
        { region: 'US East Coast (EDT/EST)', overlap: '4–5 Hours Overlap', desc: 'Afternoon real-time pairing; morning async delivery ready for your start.' },
        { region: 'Asia & Australia', overlap: 'Overnight Turnaround', desc: 'Submit requirements at close of business; wake up to tested code & prototypes.' },
      ],
      rhythm: [
        'Async-First Communication: Detailed Loom video walkthroughs with every milestone.',
        'Continuous Deployment: Live preview URLs on Vercel for instant stakeholder review.',
        'Version-Controlled Transparency: Clean semantic commits and documented Figma components.',
      ],
    },
  },
  {
    id: 10,
    tag: 'Next Steps',
    title: 'Let’s Build Something Exceptional Together',
    subtitle: 'Start with a Low-Risk Discovery Sprint or Exploratory Call',
    content: {
      type: 'cta',
      steps: [
        { num: '01', title: '20-Minute Fit Call', desc: 'Discuss your roadmap, current bottlenecks, or upcoming client requirements.' },
        { num: '02', title: '1-Week Pilot Sprint', desc: 'Test our velocity and code quality on a self-contained trial deliverable.' },
        { num: '03', title: 'Scale with Confidence', desc: 'Transition into a recurring monthly retainer or fixed-scope rollout.' },
      ],
      contacts: {
        email: 'info@rayidatech.name.ng',
        altEmail: 'rayidagaius@gmail.com',
        whatsapp: 'https://wa.link/tlezg8',
      },
    },
  },
];

export default function CapabilitiesViewer() {
  const [activeMode, setActiveMode] = useState<ViewMode>('statement');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }, []);

  const handleCopyLink = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin + '/capabilities');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < DECK_SLIDES.length - 1 ? prev + 1 : prev));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation for deck
  useEffect(() => {
    if (activeMode !== 'deck') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, nextSlide, prevSlide]);

  const slide = DECK_SLIDES[currentSlide];

  return (
    <div className="relative min-h-screen text-paper">
      {/* ── Print Stylesheet ── */}
      <style jsx global>{`
        @media print {
          /* Hide non-print chrome */
          nav,
          footer,
          header,
          .no-print,
          .cookie-consent-banner,
          [data-state="open"] {
            display: none !important;
          }

          body {
            background: #ffffff !important;
            color: #111827 !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 11pt !important;
          }

          .print-sheet {
            background: #ffffff !important;
            color: #111827 !important;
            box-shadow: none !important;
            border: none !important;
            padding: 1.5cm !important;
            max-width: 100% !important;
            margin: 0 !important;
          }

          .print-card {
            background: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            color: #111827 !important;
            break-inside: avoid;
          }

          .print-border {
            border-color: #d1d5db !important;
          }

          .print-muted {
            color: #4b5563 !important;
          }

          .print-title {
            color: #111827 !important;
          }

          .print-accent {
            color: #7000e0 !important;
          }

          .print-badge {
            background: #f3f4f6 !important;
            color: #374151 !important;
            border: 1px solid #d1d5db !important;
          }

          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>

      {/* ── Ambient Background Glows (screen only) ── */}
      <div className="no-print pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full opacity-30 blur-[130px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.25) 0%, transparent 70%)',
          }}
        />
      </div>

      <Container size="wide" className="relative z-10 pt-28 pb-20">
        {/* ── Top Header & Mode Switcher Bar ── */}
        <div className="no-print mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-(--line) pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusPill text="Capabilities & Pitch Deck" />
              <span className="text-xs font-mono-tight text-mist-2 uppercase tracking-wider">
                Doc Ref: RT-CAP-2026-V1
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper">
              Rayida Tech Capabilities & Pitch Deck
            </h1>
            <p className="text-mist-1 text-sm sm:text-base mt-1 max-w-2xl">
              Tailored for prospective founders, enterprise teams, and digital agencies seeking dedicated UI/UX and AI engineering capacity.
            </p>
          </div>

          {/* Action buttons & View switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Segments */}
            <div className="inline-flex rounded-xl bg-ink-deep p-1 border border-(--line)">
              <button
                type="button"
                onClick={() => setActiveMode('statement')}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeMode === 'statement'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-mist-1 hover:text-paper hover:bg-white/5'
                }`}
              >
                1-Page Capability Statement
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('deck')}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeMode === 'deck'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-mist-1 hover:text-paper hover:bg-white/5'
                }`}
              >
                Agency Pitch Deck (10 Slides)
              </button>
            </div>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-paper transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-secondary" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-paper transition-colors cursor-pointer"
              title="Copy link to clipboard"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MODE 1: 1-PAGE CAPABILITY STATEMENT (PRINT-READY)
            ══════════════════════════════════════════════════════════════════ */}
        {activeMode === 'statement' && (
          <div className="print-sheet glass-strong rounded-3xl border border-(--line) p-6 sm:p-10 md:p-12 shadow-2xl relative">
            {/* Header / Identity */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b print-border border-(--line)">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BrandLogo className="h-9 w-auto" priority />
                </div>
                <div className="text-xs font-mono-tight text-mist-2 print-muted mt-1">
                  Product Design & AI Engineering Studio • Lagos, Nigeria • Worldwide Delivery
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-paper print-title mt-2">
                  Executive Capability Statement
                </h2>
                <p className="text-sm text-mist-1 print-muted max-w-xl mt-1 leading-relaxed">
                  Building digital experiences people can trust. Specializing in high-converting product UI/UX, explainable AI interfaces, and modern full-stack web engineering.
                </p>
              </div>

              {/* Fast Contact Card */}
              <div className="print-card rounded-2xl bg-white/5 p-4 border print-border border-(--line) text-xs space-y-1.5 min-w-[220px]">
                <div className="font-semibold text-paper print-title text-sm mb-1">Company Details</div>
                <div className="flex items-center gap-2 text-mist-1 print-muted">
                  <Globe className="w-3.5 h-3.5 text-secondary" />
                  <span>rayidatech.name.ng</span>
                </div>
                <div className="flex items-center gap-2 text-mist-1 print-muted">
                  <Mail className="w-3.5 h-3.5 text-secondary" />
                  <span>info@rayidatech.name.ng</span>
                </div>
                <div className="flex items-center gap-2 text-mist-1 print-muted">
                  <MessageCircle className="w-3.5 h-3.5 text-secondary" />
                  <span>WhatsApp: +234 (Direct)</span>
                </div>
                <div className="flex items-center gap-2 text-secondary font-mono-tight pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>NDPA 2023 Compliant</span>
                </div>
              </div>
            </div>

            {/* Performance Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b print-border border-(--line)">
              <div className="print-card rounded-xl p-3 bg-white/5 border border-(--line)">
                <div className="font-display text-2xl sm:text-3xl font-bold text-paper print-title">50+</div>
                <div className="text-xs text-mist-1 print-muted font-mono-tight uppercase">Projects Delivered</div>
              </div>
              <div className="print-card rounded-xl p-3 bg-white/5 border border-(--line)">
                <div className="font-display text-2xl sm:text-3xl font-bold text-secondary print-accent">20+</div>
                <div className="text-xs text-mist-1 print-muted font-mono-tight uppercase">Happy Global Clients</div>
              </div>
              <div className="print-card rounded-xl p-3 bg-white/5 border border-(--line)">
                <div className="font-display text-2xl sm:text-3xl font-bold text-primary print-accent">5+</div>
                <div className="text-xs text-mist-1 print-muted font-mono-tight uppercase">Years Experience</div>
              </div>
              <div className="print-card rounded-xl p-3 bg-white/5 border border-(--line)">
                <div className="font-display text-2xl sm:text-3xl font-bold text-paper print-title">100%</div>
                <div className="text-xs text-mist-1 print-muted font-mono-tight uppercase">Client Retention</div>
              </div>
            </div>

            {/* Core Competencies Matrix */}
            <div className="py-6 border-b print-border border-(--line)">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-secondary mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-secondary" />
                <span>Core Technical & Design Competencies</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="print-card rounded-xl p-4 bg-white/5 border border-(--line)">
                  <div className="font-semibold text-paper print-title text-sm mb-2 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-primary" />
                    <span>Product & UI/UX Design</span>
                  </div>
                  <ul className="text-xs text-mist-1 print-muted space-y-1.5 leading-relaxed">
                    <li>• User journey mapping & personas</li>
                    <li>• Interactive Figma prototypes</li>
                    <li>• Multi-brand design token systems</li>
                    <li>• CRO & high-converting funnels</li>
                  </ul>
                </div>

                <div className="print-card rounded-xl p-4 bg-white/5 border border-(--line)">
                  <div className="font-semibold text-paper print-title text-sm mb-2 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-secondary" />
                    <span>Full-Stack Web Engineering</span>
                  </div>
                  <ul className="text-xs text-mist-1 print-muted space-y-1.5 leading-relaxed">
                    <li>• Next.js 16 (App Router / Turbopack)</li>
                    <li>• React 19 & strict TypeScript</li>
                    <li>• Tailwind CSS v4 design systems</li>
                    <li>• Supabase & PostgreSQL with RLS</li>
                  </ul>
                </div>

                <div className="print-card rounded-xl p-4 bg-white/5 border border-(--line)">
                  <div className="font-semibold text-paper print-title text-sm mb-2 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span>Explainable AI (XAI) UI</span>
                  </div>
                  <ul className="text-xs text-mist-1 print-muted space-y-1.5 leading-relaxed">
                    <li>• Transparent AI decision interfaces</li>
                    <li>• LLM agent workflows & chat</li>
                    <li>• Confidence scoring & audit cards</li>
                    <li>• Contextual search & embeddings</li>
                  </ul>
                </div>

                <div className="print-card rounded-xl p-4 bg-white/5 border border-(--line)">
                  <div className="font-semibold text-paper print-title text-sm mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-secondary" />
                    <span>Brand Systems & Collateral</span>
                  </div>
                  <ul className="text-xs text-mist-1 print-muted space-y-1.5 leading-relaxed">
                    <li>• Visual identities & style manuals</li>
                    <li>• Investor pitch decks & whitepapers</li>
                    <li>• Marketing collateral & social suites</li>
                    <li>• Typography & color architectures</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Featured Past Performance / Case Studies */}
            <div className="py-6 border-b print-border border-(--line)">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-secondary mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-secondary" />
                <span>Verified Past Performance & Proof of Work</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="print-card rounded-xl p-4 bg-white/5 border border-(--line)">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-paper print-title">TrustLayer</span>
                    <span className="text-[10px] font-mono-tight px-1.5 py-0.5 rounded print-badge bg-primary/20 text-accent-soft">FinTech AI</span>
                  </div>
                  <p className="text-xs text-mist-1 print-muted mb-2">
                    Transparent AI banking and algorithmic risk interface.
                  </p>
                  <div className="text-xs text-secondary font-mono-tight font-semibold">
                    +89% comprehension • -42% disputes
                  </div>
                </div>

                <div className="print-card rounded-xl p-4 bg-white/5 border border-(--line)">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-paper print-title">CollectWise</span>
                    <span className="text-[10px] font-mono-tight px-1.5 py-0.5 rounded print-badge bg-secondary/20 text-secondary">B2B SaaS</span>
                  </div>
                  <p className="text-xs text-mist-1 print-muted mb-2">
                    Unified accounts-receivable platform with automated triggers.
                  </p>
                  <div className="text-xs text-secondary font-mono-tight font-semibold">
                    -35% dispute cycle • &lt;3 min onboarding
                  </div>
                </div>

                <div className="print-card rounded-xl p-4 bg-white/5 border border-(--line)">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-paper print-title">FlavorEase</span>
                    <span className="text-[10px] font-mono-tight px-1.5 py-0.5 rounded print-badge bg-primary/20 text-accent-soft">Mobile UX</span>
                  </div>
                  <p className="text-xs text-mist-1 print-muted mb-2">
                    On-demand mobile food discovery and streamlined checkout.
                  </p>
                  <div className="text-xs text-secondary font-mono-tight font-semibold">
                    +28% checkout completion rate
                  </div>
                </div>
              </div>
            </div>

            {/* Differentiators & Engagement Models */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b print-border border-(--line)">
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>Why Work With Rayida Tech?</span>
                </h3>
                <ul className="text-xs text-mist-1 print-muted space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Designer & Engineer in One:</strong> No handoff tax. Designs are architected with full knowledge of Next.js & Tailwind constraints.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Speed Without Sloppiness:</strong> Battle-tested design tokens and starter architectures turn 8-week builds into 2-week sprints.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span><strong>Explainable AI Focus:</strong> We design human-in-the-loop interfaces that convert AI skepticism into authentic user confidence.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>Flexible Engagement Models</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="print-card rounded-lg p-2.5 bg-white/5 border border-(--line)">
                    <span className="font-semibold text-paper print-title">1. Fixed-Scope MVP / Project:</span>
                    <span className="text-mist-1 print-muted ml-1.5">Milestone-based delivery with clear timeline and 30-day post-launch warranty.</span>
                  </div>
                  <div className="print-card rounded-lg p-2.5 bg-white/5 border border-(--line)">
                    <span className="font-semibold text-paper print-title">2. Dedicated Sprint Retainer:</span>
                    <span className="text-mist-1 print-muted ml-1.5">20 or 40 hours/week dedicated capacity with direct Slack/WhatsApp channel access.</span>
                  </div>
                  <div className="print-card rounded-lg p-2.5 bg-white/5 border border-(--line)">
                    <span className="font-semibold text-paper print-title">3. White-Label Agency Partnership:</span>
                    <span className="text-mist-1 print-muted ml-1.5">Confidential ghost development under your NDA; your agency retains 100% margin.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Matrix Tags */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 text-mist-2 print-muted font-mono-tight">
                <span className="text-paper print-title font-semibold">Tech Stack:</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">Next.js 16</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">React 19</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">TypeScript</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">Tailwind CSS v4</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">Supabase / SQL</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">Figma</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">Vitest</span>
                <span className="print-badge px-2 py-0.5 rounded bg-white/5 border border-(--line)">Resend</span>
              </div>

              <div className="no-print flex items-center gap-3">
                <a
                  href="https://wa.link/tlezg8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Book a Sprint Call</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-paper font-medium text-xs transition-colors"
                >
                  <span>Send Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            MODE 2: INTERACTIVE PITCH DECK (10 SLIDES)
            ══════════════════════════════════════════════════════════════════ */}
        {activeMode === 'deck' && (
          <div className="relative">
            {/* Slide Header & Controls */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-tight px-2.5 py-1 rounded-full bg-primary/20 text-accent-soft border border-primary/30">
                  Slide {currentSlide + 1} of {DECK_SLIDES.length}
                </span>
                <span className="text-xs font-mono-tight text-secondary uppercase tracking-wider">
                  {slide.tag}
                </span>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="p-2 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  disabled={currentSlide === DECK_SLIDES.length - 1}
                  className="p-2 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / DECK_SLIDES.length) * 100}%` }}
              />
            </div>

            {/* Slide Viewport Card */}
            <div className="glass-strong rounded-3xl border border-(--line) p-8 sm:p-12 md:p-16 min-h-[460px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Background watermark */}
              <div className="pointer-events-none absolute right-4 bottom-4 opacity-5 text-8xl font-black font-display select-none">
                0{slide.id}
              </div>

              {/* Slide Title */}
              <div>
                <span className="text-xs font-mono-tight text-secondary uppercase tracking-wider">
                  {slide.subtitle}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-paper mt-1 mb-8 max-w-3xl">
                  {slide.title}
                </h2>

                {/* SLIDE CONTENT VARIATIONS */}

                {/* 1. Cover Slide */}
                {slide.content.type === 'cover' && (
                  <div className="space-y-6 max-w-2xl">
                    <p className="text-mist-1 text-base sm:text-lg leading-relaxed">
                      {slide.content.description}
                    </p>
                    <div className="space-y-2.5 pt-2">
                      {slide.content.highlights?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-sm text-paper">
                          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Problem Cards */}
                {slide.content.type === 'cards' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {slide.content.cards?.map((card, idx) => (
                      <div key={idx} className="rounded-2xl bg-white/5 border border-(--line) p-5 relative">
                        <span className="text-[10px] font-mono-tight uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 absolute top-4 right-4">
                          {card.badge}
                        </span>
                        <h3 className="font-display text-base font-semibold text-paper mb-2">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-mist-1 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Solution Pillars */}
                {slide.content.type === 'pillars' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {slide.content.pillars?.map((pillar, idx) => {
                      const Icon = pillar.icon;
                      return (
                        <div key={idx} className="rounded-2xl bg-white/5 border border-(--line) p-5">
                          <div className="w-9 h-9 rounded-xl bg-primary/20 text-accent-soft flex items-center justify-center mb-4">
                            <Icon className="w-4 h-4 text-secondary" />
                          </div>
                          <h3 className="font-display text-base font-semibold text-paper mb-2">
                            {pillar.title}
                          </h3>
                          <p className="text-xs text-mist-1 leading-relaxed">
                            {pillar.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 4. Capabilities Matrix */}
                {slide.content.type === 'matrix' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {slide.content.items?.map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-white/5 border border-(--line) p-5 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-mono-tight text-secondary uppercase tracking-wider mb-1">
                            {item.metric}
                          </div>
                          <h3 className="font-display text-base font-semibold text-paper mb-3">
                            {item.title}
                          </h3>
                          <ul className="text-xs text-mist-1 space-y-1.5">
                            {item.skills.map((s, sIdx) => (
                              <li key={sIdx}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. Case Studies */}
                {slide.content.type === 'case-study' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-2xl bg-white/5 border border-(--line) p-5">
                        <span className="text-xs font-mono-tight text-mist-2 uppercase">The Challenge</span>
                        <p className="text-sm text-mist-1 mt-2 leading-relaxed">
                          {slide.content.challenge}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/5 border border-(--line) p-5">
                        <span className="text-xs font-mono-tight text-secondary uppercase">The Rayida Tech Solution</span>
                        <p className="text-sm text-paper mt-2 leading-relaxed">
                          {slide.content.solution}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      {slide.content.metrics?.map((m, mIdx) => (
                        <div key={mIdx} className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
                          <div className="font-display text-2xl sm:text-3xl font-bold text-secondary">
                            {m.value}
                          </div>
                          <div className="text-xs font-medium text-paper mt-1">{m.label}</div>
                          <div className="text-[10px] text-mist-2 font-mono-tight">{m.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Technical Specs */}
                {slide.content.type === 'tech-specs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {slide.content.specs?.map((spec, idx) => (
                      <div key={idx} className="rounded-2xl bg-white/5 border border-(--line) p-5">
                        <h3 className="font-display text-base font-semibold text-secondary mb-2">
                          {spec.category}
                        </h3>
                        <p className="text-sm text-mist-1 leading-relaxed">
                          {spec.details}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. Models */}
                {slide.content.type === 'models' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {slide.content.models?.map((model, idx) => (
                      <div key={idx} className="rounded-2xl bg-white/5 border border-(--line) p-5">
                        <span className="text-[10px] font-mono-tight text-secondary uppercase tracking-wider">
                          {model.focus}
                        </span>
                        <h3 className="font-display text-base font-semibold text-paper mt-1 mb-3">
                          {model.title}
                        </h3>
                        <ul className="text-xs text-mist-1 space-y-2">
                          {model.points.map((p, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2">
                              <span className="text-secondary">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* 8. Workflow */}
                {slide.content.type === 'workflow' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {slide.content.zones?.map((z, idx) => (
                        <div key={idx} className="rounded-2xl bg-white/5 border border-(--line) p-4">
                          <h3 className="font-semibold text-sm text-paper mb-1">{z.region}</h3>
                          <div className="text-xs text-secondary font-mono-tight mb-2">{z.overlap}</div>
                          <p className="text-xs text-mist-1 leading-relaxed">{z.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-(--line) p-4">
                      <span className="text-xs font-mono-tight text-secondary uppercase mb-2 block">
                        Collaboration Standards
                      </span>
                      <ul className="text-xs text-mist-1 space-y-1.5">
                        {slide.content.rhythm?.map((r, rIdx) => (
                          <li key={rIdx}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 9. CTA */}
                {slide.content.type === 'cta' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {slide.content.steps?.map((step, idx) => (
                        <div key={idx} className="rounded-2xl bg-white/5 border border-(--line) p-5">
                          <span className="text-xl font-display font-bold text-secondary">{step.num}</span>
                          <h3 className="font-display text-base font-semibold text-paper mt-2 mb-1">{step.title}</h3>
                          <p className="text-xs text-mist-1 leading-relaxed">{step.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <a
                        href={slide.content.contacts?.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat Directly on WhatsApp</span>
                      </a>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-paper font-medium text-sm transition-colors"
                      >
                        <Mail className="w-4 h-4 text-secondary" />
                        <span>Book 20-Min Discovery Call</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Deck Navigation Bar */}
              <div className="pt-8 border-t border-(--line) flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                  {DECK_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-8 bg-secondary' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Jump to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-mist-2 font-mono-tight hidden sm:inline">
                    Use &larr; &rarr; keys or Space to advance
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveMode('statement')}
                    className="text-xs text-secondary hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>View Printable 1-Pager</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
