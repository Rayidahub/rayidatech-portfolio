// app/(public)/projects/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Project } from '@/types/project';
import type { Service } from '@/types/service';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import GlassCard from '@/components/ui/GlassCard';
import StatusPill from '@/components/ui/StatusPill';
import ProjectsFilter from '@/components/sections/ProjectsFilter';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects & Case Studies',
  description:
    'Explore a curated portfolio of product design, AI engineering, and fintech projects by Raymond Gaius at Rayida Tech.',
};

async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data || [];
}

export default async function ProjectsPage() {
  const [projects, services] = await Promise.all([
    getProjects(),
    getServices(),
  ]);

  return (
    <main className="relative min-h-screen bg-ink pt-28 pb-20 overflow-hidden">
      {/* ── Background Decorative Ambient Glows ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top ambient glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full opacity-35 blur-[130px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 75%)',
          }}
        />
        {/* Subtle mid-page glow */}
        <div
          className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px]"
          style={{
            background:
              'radial-gradient(circle, rgba(var(--secondary-rgb), 0.25) 0%, transparent 70%)',
          }}
        />
        {/* Top accent light beam */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-60"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)',
          }}
        />
      </div>

      <Container size="wide" className="relative z-10">
        {/* ── Hero Header ── */}
        <Reveal>
          <div className="max-w-3xl mb-12 md:mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tight uppercase tracking-wider bg-primary/10 border border-primary/20 text-secondary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selected Portfolio</span>
              </span>
              <StatusPill available text="Available for projects" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-paper mb-5 leading-[1.08]">
              Featured <span className="gradient-text">Works</span>
            </h1>

            <p className="text-mist-1 text-base sm:text-lg leading-relaxed max-w-2xl">
              Each project tells a story of problem solving, deep user research, and technical craft. Explore product design, fintech systems, and mobile applications built to drive real impact.
            </p>
          </div>
        </Reveal>

        {/* ── Projects Filter & Showcase Grid ── */}
        <ProjectsFilter projects={projects} services={services} />

        {/* ── Bottom Project CTA ── */}
        <Reveal>
          <div className="mt-20 pt-16 border-t border-(--line)">
            <GlassCard
              hover={false}
              className="p-8 md:p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-ink to-secondary/10 border-primary/20 space-y-4"
            >
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
                Have a concept in mind?
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper">
                Ready to Build Something Extraordinary?
              </h2>
              <p className="text-sm sm:text-base text-mist-1 max-w-xl mx-auto leading-relaxed">
                I collaborate with founders, startups, and product teams to design intuitive digital experiences that people can trust.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.link/tlezg8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass border border-(--line) hover:border-secondary/40 text-paper font-medium text-xs transition-all"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
