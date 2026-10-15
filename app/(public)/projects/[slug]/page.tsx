// app/(public)/projects/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';
import type { CaseStudy, Project } from '@/types/project';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  Layers,
  Palette,
  Search,
  Sparkles,
  Target,
  Bookmark,
  TrendingUp,
  AlertCircle,
  Smartphone,
  Laptop,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import StatusPill from '@/components/ui/StatusPill';
import CaseStudyImageViewer from '@/components/projects/CaseStudyImageViewer';
import ColorSwatch from '@/components/projects/ColorSwatch';
import { SERVICE_CATEGORIES } from '@/lib/data/services';
import { normalizeSlug } from '@/lib/slug';

export const revalidate = 3600;

/* ─────────────────────────────────────────────────────────────
   DATA FETCHING
   ───────────────────────────────────────────────────────────── */

async function getProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();

  // Try exact canonical match first
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (data) return data;

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching project:', error);
  }

  // Fallback: match normalized slugs
  const normalizedSlug = normalizeSlug(slug);
  const { data: allProjects, error: listError } = await supabase
    .from('projects')
    .select('*');

  if (listError) {
    console.error('Error fetching projects:', listError);
    return null;
  }

  return (
    allProjects?.find(
      (project) =>
        normalizeSlug(project.slug) === normalizedSlug ||
        normalizeSlug(project.title) === normalizedSlug
    ) || null
  );
}

async function getNextProject(currentId: string, slug?: string): Promise<Project | null> {
  const supabase = await createClient();

  if (slug && slug.toLowerCase() !== 'start a project') {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    if (data && data.id !== currentId) return data;
  }

  // Find another project in the database
  const { data: otherProjects } = await supabase
    .from('projects')
    .select('*')
    .neq('id', currentId)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1);

  return otherProjects?.[0] || null;
}

export async function generateStaticParams() {
  const { data } = await supabase.from('projects').select('slug');
  if (!data) return [];

  const seen = new Set<string>();
  return data
    .map((project) => ({
      slug: normalizeSlug(project.slug),
    }))
    .filter((item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function getProjectType(project: Project): string {
  const knownTitles = new Set<string>(SERVICE_CATEGORIES);
  return project.tags?.find((t) => knownTitles.has(t)) || project.tags?.[0] || 'Product Design';
}

/* ─────────────────────────────────────────────────────────────
   TEXT & CONTENT PARSERS
   ───────────────────────────────────────────────────────────── */

function cleanBulletText(text: string): string {
  return text
    .replace(/^[-*•]\s*/, '')
    .replace(/^\*\*\s*/, '')
    .replace(/\*\*$/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function parseList(text?: string): { intro?: string; items: string[] } {
  if (!text) return { items: [] };
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { items: [] };

  const firstLine = lines[0];
  const hasExplicitIntro =
    firstLine.endsWith(':') ||
    firstLine.toLowerCase().includes('designed for') ||
    firstLine.toLowerCase().includes('experience:');

  const intro = hasExplicitIntro ? firstLine.replace(/^[-*•]\s*/, '') : undefined;
  const rawItems = hasExplicitIntro ? lines.slice(1) : lines;

  const items = rawItems.map(cleanBulletText).filter(Boolean);
  return { intro, items };
}

interface AudiencePersona {
  emoji?: string;
  title: string;
  desc: string;
}

function parseAudience(text?: string): { intro?: string; personas: AudiencePersona[] } {
  if (!text) return { personas: [] };
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { personas: [] };

  let intro = '';
  const personas: AudiencePersona[] = [];

  for (const line of lines) {
    if (line.includes('**')) {
      const boldMatch = line.match(/\*\*(.*?)\*\*/);
      if (boldMatch) {
        const title = boldMatch[1].trim();
        const beforeBold = line
          .slice(0, line.indexOf('**'))
          .replace(/^[-*•\s]+/, '')
          .trim();
        let desc = line.slice(line.indexOf('**') + boldMatch[0].length).trim();
        if (desc.startsWith(':') || desc.startsWith('-')) {
          desc = desc.slice(1).trim();
        }
        personas.push({ emoji: beforeBold || undefined, title, desc });
        continue;
      }
    }

    if (!intro && (line.endsWith(':') || line.toLowerCase().includes('designed for'))) {
      intro = line.replace(/^[-*•\s]+/, '');
    } else {
      personas.push({ title: cleanBulletText(line), desc: '' });
    }
  }

  return { intro, personas };
}

interface ParsedDesignSystem {
  colors: { name: string; hex: string }[];
  heading?: string;
  body?: string;
  components: string[];
}

function parseDesignSystem(raw?: string): ParsedDesignSystem | null {
  if (!raw) return null;

  const colorMatches = [
    ...raw.matchAll(/(Primary|Secondary|Accent|Background|Surface)?[:\s]*?(#[0-9a-fA-F]{3,8})/gi),
  ];
  const colors = colorMatches.map((m) => ({
    name: m[1] || 'Color',
    hex: m[2],
  }));

  const headingMatch = raw.match(/Heading[:\s]+([^\n]+)/i);
  const bodyMatch = raw.match(/Body[:\s]+([^\n]+)/i);

  const compSection = raw.split(/Components[:\s]*/i)[1];
  const components = compSection
    ? compSection
        .split('\n')
        .map((c) => c.trim())
        .filter(
          (c) =>
            c &&
            !c.startsWith('#') &&
            !c.toLowerCase().includes('colors') &&
            !c.toLowerCase().includes('typography')
        )
    : [];

  return {
    colors,
    heading: headingMatch?.[1]?.trim(),
    body: bodyMatch?.[1]?.trim(),
    components,
  };
}

interface ParsedDesignProcess {
  userJourney: string[];
  wireframeItems: string[];
  iterationItems: string[];
}

function parseDesignProcess(raw?: string): ParsedDesignProcess {
  if (!raw) return { userJourney: [], wireframeItems: [], iterationItems: [] };

  const journeyMatch = raw.match(/([A-Za-z0-9\s]+(?:\s*→\s*[A-Za-z0-9\s]+)+)/);
  const userJourney = journeyMatch
    ? journeyMatch[1].split('→').map((s) => s.trim())
    : [];

  const wireframesSection = raw.split(/### Wireframes/i)[1]?.split(/### Iterations/i)[0];
  const iterationsSection = raw.split(/### Iterations/i)[1]?.split(/###/i)[0];

  const wireframeItems = wireframesSection ? parseList(wireframesSection).items : [];
  const iterationItems = iterationsSection ? parseList(iterationsSection).items : [];

  return { userJourney, wireframeItems, iterationItems };
}

interface FeatureCard {
  title: string;
  description: string;
  iconName: string;
}

function parseKeyFeatures(features?: string[]): FeatureCard[] {
  if (!features || !Array.isArray(features)) return [];
  const cleaned = features.filter((f) => !f.toLowerCase().includes('image placeholder'));

  const icons = ['search', 'sparkles', 'bookmark', 'flame', 'compass', 'layers'];
  const cards: FeatureCard[] = [];

  for (let i = 0; i < cleaned.length; i += 2) {
    if (i + 1 < cleaned.length) {
      cards.push({
        title: cleaned[i],
        description: cleaned[i + 1],
        iconName: icons[Math.floor(i / 2) % icons.length],
      });
    } else {
      cards.push({
        title: cleaned[i],
        description: '',
        iconName: icons[Math.floor(i / 2) % icons.length],
      });
    }
  }

  return cards;
}

function parseResults(raw?: string): { achievements: string[]; outcomes: string[] } {
  if (!raw) return { achievements: [], outcomes: [] };
  const parts = raw.split(/User Experience Outcomes/i);
  const achievementsRaw = parts[0]?.replace(/Achievements/i, '') || '';
  const outcomesRaw = parts[1] || '';

  const achievements = parseList(achievementsRaw).items;
  const outcomes = parseList(outcomesRaw).items;

  return { achievements, outcomes };
}

function parseReflection(raw?: string): { reflectionText: string; roadmapItems: string[] } {
  if (!raw) return { reflectionText: '', roadmapItems: [] };

  const parts = raw.split(/Future improvements could include/i);
  const reflectionText = parts[0].trim();

  const roadmapItems = parts[1]
    ? parts[1]
        .split(/[,\n]/)
        .map((s) => s.replace(/^and\s+/i, '').replace(/\.$/, '').trim())
        .filter(Boolean)
    : [];

  return { reflectionText, roadmapItems };
}

/* ─────────────────────────────────────────────────────────────
   FEATURE ICON RENDERER
   ───────────────────────────────────────────────────────────── */

function renderFeatureIcon(name: string) {
  switch (name) {
    case 'search':
      return <Search className="w-5 h-5 text-secondary" />;
    case 'sparkles':
      return <Sparkles className="w-5 h-5 text-primary" />;
    case 'bookmark':
      return <Bookmark className="w-5 h-5 text-secondary" />;
    case 'flame':
      return <Flame className="w-5 h-5 text-primary" />;
    case 'compass':
      return <Compass className="w-5 h-5 text-secondary" />;
    default:
      return <Layers className="w-5 h-5 text-primary" />;
  }
}

/* ─────────────────────────────────────────────────────────────
   CASE STUDY PROJECT PAGE (RICH FULL LAYOUT)
   ───────────────────────────────────────────────────────────── */

function CaseStudyProjectPage({
  project,
  nextProject,
}: {
  project: Project;
  nextProject: Project | null;
}) {
  const cs = project.case_study as CaseStudy;
  const projectType = getProjectType(project);

  const audience = parseAudience(cs.target_audience);
  const problemData = parseList(cs.problem);
  const businessGoals = parseList(cs.business_goals);
  const userGoals = parseList(cs.user_goals);
  const researchData = parseList(cs.research);
  const designProcessData = parseDesignProcess(cs.design_process);
  const designSystemData = parseDesignSystem(cs.design_system);
  const featureCards = parseKeyFeatures(cs.key_features);
  const resultsData = parseResults(cs.results);
  const reflectionData = parseReflection(cs.reflection);

  const heroDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : '2026';

  return (
    <div className="space-y-20 md:space-y-32">
      {/* ── 1. HERO HEADER & META SPECS ── */}
      <Reveal>
        <div className="relative">
          {/* Subtle ambient beam */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 rounded-full opacity-20 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse, rgba(var(--primary-rgb), 0.3) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 80%)',
            }}
            aria-hidden="true"
          />

          {/* Breadcrumb & Tags Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-(--line) text-xs font-mono-tight text-mist-1 hover:text-paper hover:border-primary/40 hover:-translate-x-0.5 transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-secondary" />
              <span>Back to Projects</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {project.featured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/25">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-mono-tight text-mist-2 glass border border-(--line)"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project Title */}
          <div className="max-w-4xl">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
              {projectType} • Case Study
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-paper mb-6">
              {project.title}{' '}
              <span className="gradient-text">Case Study</span>
            </h1>
            <p className="text-lg sm:text-xl text-mist-1 leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* Metadata Specs Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 mb-1.5">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="font-mono-tight text-xs uppercase tracking-wider">Role</span>
              </div>
              <p className="font-medium text-paper text-sm md:text-base">
                {project.role || 'Lead Product Designer'}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 mb-1.5">
                <Target className="w-4 h-4 text-secondary" />
                <span className="font-mono-tight text-xs uppercase tracking-wider">Client</span>
              </div>
              <p className="font-medium text-paper text-sm md:text-base">
                {cs.client || 'Concept Project'}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 mb-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono-tight text-xs uppercase tracking-wider">Timeline</span>
              </div>
              <p className="font-medium text-paper text-sm md:text-base">
                {project.duration || '4 Weeks'}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 mb-1.5">
                <Calendar className="w-4 h-4 text-secondary" />
                <span className="font-mono-tight text-xs uppercase tracking-wider">Date</span>
              </div>
              <p className="font-medium text-paper text-sm md:text-base">{heroDate}</p>
            </div>
          </div>

          {/* Action Row */}
          {project.link && (
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                <span>View Prototype / Assets</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-(--line) hover:border-secondary/40 text-paper font-medium text-sm transition-all group"
              >
                <span>Start Similar Project</span>
                <ArrowRight className="w-4 h-4 text-secondary transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </Reveal>

      {/* ── 2. HERO COVER IMAGE SHOWCASE ── */}
      {project.cover_image && (
        <Reveal>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.2) 60%, transparent 80%)',
              }}
              aria-hidden="true"
            />
            <div className="relative rounded-3xl overflow-hidden glass border border-(--line) p-2 md:p-4 shadow-2xl">
              <CaseStudyImageViewer
                src={project.cover_image}
                alt={`${project.title} Hero Showcase`}
                caption={`${project.title} — Main Interface Mockup`}
                priority
              />
            </div>
          </div>
        </Reveal>
      )}

      {/* ── 3. OVERVIEW & TARGET AUDIENCE ── */}
      <Reveal>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
              01 / Context & Audience
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
            Project Overview & Target Audience
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Objective Narrative */}
            <div className={`${cs.overview_image ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
              <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-paper">The Objective</h3>
                </div>
                <div className="text-mist-1 leading-relaxed space-y-4 text-base sm:text-lg">
                  {cs.objective ? (
                    cs.objective.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
                  ) : (
                    <p>{project.description}</p>
                  )}
                </div>
              </GlassCard>

              {/* Target Audience Persona Cards */}
              {audience.personas.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <h3 className="font-display text-lg font-semibold text-paper">
                      Who It&apos;s Designed For
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {audience.personas.map((persona, idx) => (
                      <GlassCard
                        key={idx}
                        className="p-4 md:p-5 border border-(--line) space-y-2 hover:border-secondary/40"
                      >
                        <div className="flex items-center gap-2.5">
                          {persona.emoji && (
                            <span className="text-xl" role="img" aria-label={persona.title}>
                              {persona.emoji}
                            </span>
                          )}
                          <h4 className="font-medium text-paper text-sm sm:text-base">
                            {persona.title}
                          </h4>
                        </div>
                        {persona.desc && (
                          <p className="text-xs sm:text-sm text-mist-1 leading-relaxed">
                            {persona.desc}
                          </p>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Overview Visual Image */}
            {cs.overview_image && (
              <div className="lg:col-span-5">
                <CaseStudyImageViewer
                  src={cs.overview_image}
                  alt={`${project.title} Overview Visual`}
                  caption="Overview & Exploration Visuals"
                />
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ── 4. THE CHALLENGE & GOALS ALIGNMENT ── */}
      <Reveal>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-primary">
              02 / Problem Discovery
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
            The Problem & Strategic Goals
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Problem Statement & Pain Points */}
            <div className="lg:col-span-6 space-y-4">
              <GlassCard hover={false} className="p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-paper">The Challenge</h3>
                    <p className="font-mono-tight text-xs text-mist-2">User Pain Points Identified</p>
                  </div>
                </div>

                {problemData.intro && (
                  <p className="text-sm sm:text-base text-mist-1 leading-relaxed">
                    {problemData.intro}
                  </p>
                )}

                <div className="space-y-3 pt-2">
                  {problemData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-ink/60 border border-(--line) hover:border-red-500/30 transition-colors"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400 text-xs font-semibold">
                        !
                      </span>
                      <span className="text-sm text-paper leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {cs.problem_image && (
                <CaseStudyImageViewer
                  src={cs.problem_image}
                  alt={`${project.title} Challenge Mockup`}
                  caption="Problem Discovery & User Friction Points"
                />
              )}
            </div>

            {/* Right: Goals Alignment (User vs Business) */}
            <div className="lg:col-span-6 space-y-6">
              {/* User Goals */}
              <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-paper">User Goals</h3>
                    <p className="font-mono-tight text-xs text-mist-2">What Users Expect</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {userGoals.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-ink/50 border border-(--line)"
                    >
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-paper">{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Business Goals */}
              <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-paper">Business Goals</h3>
                    <p className="font-mono-tight text-xs text-mist-2">Platform Objectives</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {businessGoals.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-ink/50 border border-(--line)"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-paper">{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── 5. RESEARCH INSIGHTS & USER JOURNEY FLOW ── */}
      <Reveal>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
              03 / Strategy & Flow
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
            Research Insights & User Journey
          </h2>

          {/* Research Findings Cards */}
          {researchData.items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {researchData.items.map((item, idx) => (
                <GlassCard
                  key={idx}
                  className="p-4 md:p-5 border border-(--line) flex flex-col justify-between space-y-3 hover:border-primary/40"
                >
                  <span className="font-mono-tight text-xs text-secondary">Insight 0{idx + 1}</span>
                  <p className="font-medium text-sm sm:text-base text-paper">{item}</p>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Interactive User Journey Stepper */}
          {designProcessData.userJourney.length > 0 && (
            <GlassCard hover={false} className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl font-semibold text-paper">User Journey Flow</h3>
                  <p className="text-xs sm:text-sm text-mist-2">
                    Core interaction flow from launch to meal preparation
                  </p>
                </div>
                <span className="font-mono-tight text-xs text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                  Linear Navigation
                </span>
              </div>

              {/* Stepper Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {designProcessData.userJourney.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-center justify-between p-4 rounded-xl glass border border-(--line) group hover:border-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary font-mono-tight text-xs font-semibold">
                        0{idx + 1}
                      </span>
                      <span className="font-medium text-sm text-paper">{step}</span>
                    </div>
                    {idx < designProcessData.userJourney.length - 1 && (
                      <ArrowRight className="hidden lg:block w-4 h-4 text-mist-2 shrink-0 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Wireframes vs Iterations */}
          {(designProcessData.wireframeItems.length > 0 ||
            designProcessData.iterationItems.length > 0 ||
            cs.design_process_image) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-paper">
                      Wireframing & Architecture
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-mist-1">
                    Low-fidelity wireframes established structural foundations before visual styling.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {designProcessData.wireframeItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-sm text-paper">
                        <Check className="w-4 h-4 text-secondary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-paper">
                      Design Iterations
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-mist-1">
                    Continuous testing and refinements conducted during the sprint.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {designProcessData.iterationItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-sm text-paper">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {cs.design_process_image && (
                <div className="lg:col-span-6">
                  <CaseStudyImageViewer
                    src={cs.design_process_image}
                    alt={`${project.title} Wireframes & Process`}
                    caption="Wireframes, Information Architecture & Iterations"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Reveal>

      {/* ── 6. DESIGN SYSTEM & VISUAL ARCHITECTURE ── */}
      {designSystemData && (
        <Reveal>
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-primary">
                04 / Visual Architecture
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
              Design System & Brand Identity
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Palette & Typography */}
              <div className="lg:col-span-7 space-y-6">
                {/* Color Palette */}
                {designSystemData.colors.length > 0 && (
                  <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-semibold text-paper">
                            Color Palette
                          </h3>
                          <p className="font-mono-tight text-xs text-mist-2">
                            Click to copy hex values
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                      {designSystemData.colors.map((c, idx) => (
                        <ColorSwatch key={idx} name={c.name} hex={c.hex} />
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Typography Specimen */}
                <GlassCard hover={false} className="p-6 md:p-8 space-y-5">
                  <h3 className="font-display text-xl font-semibold text-paper">Typography Stack</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-ink/60 border border-(--line) space-y-2">
                      <span className="font-mono-tight text-xs text-primary">Headings</span>
                      <p className="font-display text-lg font-bold text-paper">
                        {designSystemData.heading || 'Poppins Bold'}
                      </p>
                      <p className="text-xs text-mist-2 font-mono-tight tracking-wider">
                        Aa Bb Cc 123 !@#
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-ink/60 border border-(--line) space-y-2">
                      <span className="font-mono-tight text-xs text-secondary">Body & UI</span>
                      <p className="text-base text-paper font-normal">
                        {designSystemData.body || 'Inter Regular'}
                      </p>
                      <p className="text-xs text-mist-2 font-mono-tight tracking-wider">
                        Aa Bb Cc 123 !@#
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Component Library Chips */}
                {designSystemData.components.length > 0 && (
                  <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                    <h3 className="font-display text-lg font-semibold text-paper">
                      Design System Components
                    </h3>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {designSystemData.components.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-full glass border border-(--line) text-xs font-medium text-paper hover:border-primary/40 transition-colors"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>

              {/* Design System Image Preview */}
              {cs.design_system_image && (
                <div className="lg:col-span-5">
                  <CaseStudyImageViewer
                    src={cs.design_system_image}
                    alt={`${project.title} Design System`}
                    caption="Component Library, Design Tokens & Style Guide"
                  />
                </div>
              )}
            </div>
          </div>
        </Reveal>
      )}

      {/* ── 7. KEY PRODUCT FEATURES ── */}
      {featureCards.length > 0 && (
        <Reveal>
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
                05 / Product Features
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
              Key Product Capabilities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((feat, idx) => (
                <GlassCard
                  key={idx}
                  className="p-6 border border-(--line) flex flex-col justify-between space-y-4 hover:border-primary/50 group"
                >
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-ink/70 border border-(--line) w-fit group-hover:scale-110 transition-transform">
                      {renderFeatureIcon(feat.iconName)}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-paper">{feat.title}</h3>
                    {feat.description && (
                      <p className="text-xs sm:text-sm text-mist-1 leading-relaxed">
                        {feat.description}
                      </p>
                    )}
                  </div>
                  <span className="font-mono-tight text-[11px] text-mist-2">0{idx + 1} / FEATURE</span>
                </GlassCard>
              ))}
            </div>

            {cs.key_features_image && (
              <div className="mt-6">
                <CaseStudyImageViewer
                  src={cs.key_features_image}
                  alt={`${project.title} Features Showcase`}
                  caption="Feature Highlights & Screen Walkthroughs"
                />
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* ── 8. FINAL SOLUTION & MOBILE EXPERIENCE ── */}
      <Reveal>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-primary">
              06 / Final Deliverable
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
            Final Solution & Experience
          </h2>

          {cs.final_solution && (
            <p className="text-base sm:text-lg text-mist-1 max-w-3xl leading-relaxed">
              {cs.final_solution}
            </p>
          )}

          {/* Screen Showcase Grid (Mobile & Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {cs.final_mobile_image && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-mist-2 px-1">
                  <Smartphone className="w-4 h-4 text-secondary" />
                  <span className="font-mono-tight text-xs uppercase tracking-wider">
                    Mobile Experience
                  </span>
                </div>
                <div className="p-2 md:p-3 rounded-3xl glass border border-(--line)">
                  <CaseStudyImageViewer
                    src={cs.final_mobile_image}
                    alt={`${project.title} Mobile Screens`}
                    caption="Mobile App UI & Flow"
                    aspect="portrait"
                  />
                </div>
              </div>
            )}

            {cs.final_desktop_image && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-mist-2 px-1">
                  <Laptop className="w-4 h-4 text-primary" />
                  <span className="font-mono-tight text-xs uppercase tracking-wider">
                    Tablet / Responsive Layout
                  </span>
                </div>
                <div className="p-2 md:p-3 rounded-3xl glass border border-(--line)">
                  <CaseStudyImageViewer
                    src={cs.final_desktop_image}
                    alt={`${project.title} Desktop & Tablet Screens`}
                    caption="Large Screen Adaptations & Layout"
                    aspect="auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ── 9. RESULTS, METRICS & UX OUTCOMES ── */}
      <Reveal>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
              07 / Impact & Metrics
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
            Results & Measurable Outcomes
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-6">
              {/* Product Achievements */}
              <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-paper">
                      Product Achievements
                    </h3>
                    <p className="font-mono-tight text-xs text-mist-2">Design Impact</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {resultsData.achievements.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-ink/60 border border-(--line)"
                    >
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      <span className="text-sm text-paper font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* UX Outcomes */}
              <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-paper">
                      User Experience Outcomes
                    </h3>
                    <p className="font-mono-tight text-xs text-mist-2">User Feedback</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {resultsData.outcomes.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-ink/60 border border-(--line)"
                    >
                      <Sparkles className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-paper font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {cs.results_image && (
              <div className="lg:col-span-6">
                <CaseStudyImageViewer
                  src={cs.results_image}
                  alt={`${project.title} Results Showcase`}
                  caption="Post-Launch Validation & Impact Highlights"
                />
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ── 10. REFLECTION & FUTURE ROADMAP ── */}
      <Reveal>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="font-mono-tight text-xs uppercase tracking-[0.25em] text-primary">
              08 / Reflection & Future
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
            Designer Takeaways & Roadmap
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-paper">
                    Key Learnings & Reflection
                  </h3>
                </div>

                <p className="text-base sm:text-lg text-mist-1 leading-relaxed">
                  {reflectionData.reflectionText ||
                    'Balancing aesthetics with usability requires rigorous testing and strong visual hierarchy.'}
                </p>
              </GlassCard>

              {/* Future Improvements Roadmap */}
              {reflectionData.roadmapItems.length > 0 && (
                <GlassCard hover={false} className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-paper">
                      Future Improvements Roadmap
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {reflectionData.roadmapItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-ink/60 border border-(--line) text-xs sm:text-sm text-paper font-medium"
                      >
                        <span className="font-mono-tight text-[10px] text-secondary block mb-1">
                          PHASE 0{idx + 2}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            {cs.reflection_image && (
              <div className="lg:col-span-5">
                <CaseStudyImageViewer
                  src={cs.reflection_image}
                  alt={`${project.title} Reflection Mockup`}
                  caption="Future Concepts & Continued Design Exploration"
                />
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ── 11. NEXT PROJECT / COLLABORATION CTA ── */}
      <Reveal>
        <div className="pt-8 border-t border-(--line)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next Project Card */}
            {nextProject ? (
              <Link
                href={`/projects/${normalizeSlug(nextProject.slug)}`}
                className="group block"
              >
                <GlassCard className="p-6 md:p-8 h-full flex flex-col justify-between hover:border-primary/50">
                  <div className="space-y-3">
                    <p className="font-mono-tight text-xs uppercase tracking-[0.2em] text-secondary">
                      Next Case Study
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-paper group-hover:text-primary transition-colors">
                      {nextProject.title}
                    </h3>
                    <p className="text-sm text-mist-1 line-clamp-2">
                      {nextProject.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary pt-6">
                    <span>Explore Project</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </GlassCard>
              </Link>
            ) : (
              <Link href="/projects" className="group block">
                <GlassCard className="p-6 md:p-8 h-full flex flex-col justify-between hover:border-primary/50">
                  <div className="space-y-3">
                    <p className="font-mono-tight text-xs uppercase tracking-[0.2em] text-secondary">
                      Portfolio
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-paper">
                      Explore All Projects
                    </h3>
                    <p className="text-sm text-mist-1">
                      Browse full product design, fintech, and engineering portfolio.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary pt-6">
                    <span>View Projects</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </GlassCard>
              </Link>
            )}

            {/* Start a Project Card */}
            <GlassCard
              hover={false}
              className="p-6 md:p-8 h-full flex flex-col justify-between bg-gradient-to-br from-primary/10 via-ink to-ink border-primary/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono-tight text-xs uppercase tracking-[0.2em] text-primary">
                    Let&apos;s Build Together
                  </p>
                  <StatusPill available text="Available" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-paper">
                  Have a Project in Mind?
                </h3>
                <p className="text-sm text-mist-1">
                  I help founders and brands design intuitive digital experiences that people can trust.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6">
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:brightness-110 transition-all shadow-md shadow-primary/20"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.link/tlezg8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-(--line) hover:border-secondary/40 text-paper font-medium text-xs transition-all"
                >
                  <span>Quick Chat on WhatsApp</span>
                </a>
              </div>
            </GlassCard>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SIMPLE PROJECT PAGE (FALLBACK FOR NON-CASE-STUDY PROJECTS)
   ───────────────────────────────────────────────────────────── */

function SimpleProjectPage({ project }: { project: Project }) {
  const projectType = getProjectType(project);
  const heroDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : '2026';

  return (
    <div className="space-y-16 md:space-y-24">
      <Reveal>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-(--line) text-xs font-mono-tight text-mist-1 hover:text-paper hover:border-primary/40 transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-secondary" />
              <span>Back to Projects</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {project.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/25">
                  Featured
                </span>
              )}
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-mono-tight text-mist-2 glass border border-(--line)"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
            {projectType}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-paper">
            {project.title}
          </h1>
          <p className="text-lg text-mist-1 max-w-3xl leading-relaxed">{project.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {project.role && (
              <div className="glass rounded-xl p-4 border border-(--line)">
                <span className="font-mono-tight text-xs text-mist-2 block mb-1">Role</span>
                <span className="text-sm font-medium text-paper">{project.role}</span>
              </div>
            )}
            {project.duration && (
              <div className="glass rounded-xl p-4 border border-(--line)">
                <span className="font-mono-tight text-xs text-mist-2 block mb-1">Duration</span>
                <span className="text-sm font-medium text-paper">{project.duration}</span>
              </div>
            )}
            <div className="glass rounded-xl p-4 border border-(--line)">
              <span className="font-mono-tight text-xs text-mist-2 block mb-1">Date</span>
              <span className="text-sm font-medium text-paper">{heroDate}</span>
            </div>
          </div>
        </div>
      </Reveal>

      {project.cover_image && (
        <Reveal>
          <div className="rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-2xl">
            <CaseStudyImageViewer
              src={project.cover_image}
              alt={project.title}
              caption={`${project.title} Cover`}
            />
          </div>
        </Reveal>
      )}

      {project.content && (
        <Reveal>
          <GlassCard hover={false} className="p-6 md:p-10 space-y-6">
            <h2 className="font-display text-2xl font-semibold text-paper">Project Details</h2>
            <div className="prose prose-invert max-w-none text-mist-1 leading-relaxed text-base">
              {project.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      )}

      {project.link && (
        <Reveal>
          <div className="flex items-center gap-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              <span>View Live Project</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE EXPORT
   ───────────────────────────────────────────────────────────── */

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Redirect legacy/non-canonical URLs to the canonical slug, but only once
  // the canonical slug itself has been cleaned up in the database.
  if (project.slug !== slug && project.slug === normalizeSlug(project.slug)) {
    redirect(`/projects/${project.slug}`);
  }

  const hasCaseStudy = !!project.case_study && Object.keys(project.case_study).length > 0;
  const nextProject = await getNextProject(project.id, project.case_study?.next_project_slug);

  return (
    <main className="relative min-h-screen bg-ink overflow-hidden py-12 md:py-20">
      {/* Background Ambient Glows */}
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[45rem] h-[30rem] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.3) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 right-10 w-[35rem] h-[25rem] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.25) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Section spacing="tight" className="relative z-10">
        <Container size="wide">
          {hasCaseStudy ? (
            <CaseStudyProjectPage project={project} nextProject={nextProject} />
          ) : (
            <SimpleProjectPage project={project} />
          )}

          {/* Bottom Back Nav */}
          <Reveal>
            <div className="mt-20 pt-8 border-t border-(--line) flex items-center justify-between">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-xs font-mono-tight text-mist-2 hover:text-paper transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-secondary" />
                <span>Back to all projects</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-mono-tight text-secondary hover:text-secondary/80 transition-colors group"
              >
                <span>Hire Raymond Gaius</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
