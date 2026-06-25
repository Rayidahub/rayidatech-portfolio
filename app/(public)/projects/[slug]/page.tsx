// app/(public)/projects/[slug]/page.tsx
import { supabase } from '@/lib/supabase/client';
import type { CaseStudy, Project } from '@/types/project';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { SERVICE_CATEGORIES } from '@/lib/data/services';

export const revalidate = 3600;

async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

async function getNextProject(slug?: string): Promise<Project | null> {
  if (!slug) return null;
  return getProject(slug);
}

export async function generateStaticParams() {
  const { data } = await supabase.from('projects').select('slug');

  if (!data) return [];

  return data.map((project) => ({
    slug: project.slug,
  }));
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function getProjectType(project: Project): string {
  const knownTitles = new Set<string>(SERVICE_CATEGORIES);
  return project.tags?.find((t) => knownTitles.has(t)) || '';
}

function CaseStudyImage({
  src,
  alt,
  aspect = 'aspect-video',
}: {
  src?: string;
  alt: string;
  aspect?: string;
}) {
  if (!src) return null;
  return (
    <GlassCard className="overflow-hidden p-0" hover={false}>
      <div className={`relative w-full ${aspect}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    </GlassCard>
  );
}

function CaseStudySection({
  title,
  children,
  image,
  imageAlt,
  imageAspect,
  flipped = false,
}: {
  title?: string;
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imageAspect?: string;
  flipped?: boolean;
}) {
  const imageNode = image ? (
    <CaseStudyImage src={image} alt={imageAlt || title || 'Project image'} aspect={imageAspect} />
  ) : null;

  return (
    <Reveal>
      <div className="mb-20">
        {title && (
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8 text-paper">
            {title}
          </h2>
        )}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
            flipped ? 'lg:flex-row-reverse' : ''
          }`}
        >
          <div className={`space-y-6 ${flipped ? 'lg:order-2' : 'lg:order-1'}`}>
            {children}
          </div>
          {imageNode && (
            <div className={flipped ? 'lg:order-1' : 'lg:order-2'}>{imageNode}</div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function ProseBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-invert max-w-none text-mist-1 whitespace-pre-wrap">
      {children}
    </div>
  );
}

function SimpleProjectPage({ project }: { project: Project }) {
  return (
    <>
      <Reveal>
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-5">
            {project.featured && (
              <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="glass text-mist-1 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 text-paper">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-mist-2 text-sm">
            {project.role && (
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary" />
                {project.role}
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                {project.duration}
              </span>
            )}
            {project.created_at && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <GlassCard className="overflow-hidden mb-10 p-0" hover={false}>
          {project.cover_image ? (
            <div className="relative aspect-video w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-mist-2">No cover image</span>
            </div>
          )}
        </GlassCard>
      </Reveal>

      <Reveal>
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold mb-4 text-paper">
            Overview
          </h2>
          <p className="text-mist-1 leading-relaxed text-lg">
            {project.description}
          </p>
        </div>
      </Reveal>

      {project.content && (
        <Reveal>
          <div className="mb-10">
            <h2 className="font-display text-2xl font-semibold mb-4 text-paper">
              Project Details
            </h2>
            <ProseBlock>{project.content}</ProseBlock>
          </div>
        </Reveal>
      )}

      {project.link && (
        <Reveal>
          <div className="mb-12">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-paper font-medium px-6 py-3 rounded-full transition-colors"
            >
              View Live Project
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      )}
    </>
  );
}

function CaseStudyProjectPage({
  project,
  nextProject,
}: {
  project: Project;
  nextProject: Project | null;
}) {
  const cs = project.case_study as CaseStudy;
  const projectType = getProjectType(project);

  return (
    <>
      {/* Hero */}
      <Reveal>
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {project.featured && (
              <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            {projectType && (
              <span className="glass text-secondary text-xs px-3 py-1 rounded-full font-medium">
                {projectType}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 text-paper">
            {project.title}
          </h1>

          <p className="text-mist-1 text-lg md:text-xl max-w-3xl mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-6 text-mist-2 text-sm">
            {project.role && (
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary" />
                {project.role}
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                {project.duration}
              </span>
            )}
            {project.created_at && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <GlassCard className="overflow-hidden mb-24 p-0" hover={false}>
          {project.cover_image ? (
            <div className="relative aspect-[16/9] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-mist-2">No hero mockup</span>
            </div>
          )}
        </GlassCard>
      </Reveal>

      {/* Overview */}
      <CaseStudySection
        title="Project Overview"
        image={cs.overview_image}
        imageAlt={`${project.title} overview`}
      >
        {cs.client && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-2 mb-2">
              Client / Business
            </h3>
            <p className="text-paper text-lg">{cs.client}</p>
          </div>
        )}
        {cs.objective && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-2 mb-2">
              Objective
            </h3>
            <ProseBlock>{cs.objective}</ProseBlock>
          </div>
        )}
        {cs.target_audience && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-2 mb-2">
              Target Audience
            </h3>
            <ProseBlock>{cs.target_audience}</ProseBlock>
          </div>
        )}
      </CaseStudySection>

      <div className="section-separator mb-20" />

      {/* Problem & Goals */}
      <CaseStudySection
        title="Problem & Goals"
        image={cs.problem_image}
        imageAlt={`${project.title} problem`}
        flipped
      >
        {cs.problem && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-2 mb-2">
              The Challenge
            </h3>
            <ProseBlock>{cs.problem}</ProseBlock>
          </div>
        )}
        {cs.business_goals && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-2 mb-2">
              Business Goals
            </h3>
            <ProseBlock>{cs.business_goals}</ProseBlock>
          </div>
        )}
        {cs.user_goals && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-2 mb-2">
              User Goals
            </h3>
            <ProseBlock>{cs.user_goals}</ProseBlock>
          </div>
        )}
      </CaseStudySection>

      <div className="section-separator mb-20" />

      {/* Research & Strategy */}
      <CaseStudySection
        title="Research & Strategy"
        image={cs.research_image}
        imageAlt={`${project.title} research`}
      >
        {cs.research ? (
          <ProseBlock>{cs.research}</ProseBlock>
        ) : (
          <p className="text-mist-2">No research notes provided.</p>
        )}
      </CaseStudySection>

      <div className="section-separator mb-20" />

      {/* Design Process */}
      <CaseStudySection
        title="Design Process"
        image={cs.design_process_image}
        imageAlt={`${project.title} design process`}
        flipped
      >
        {cs.design_process ? (
          <ProseBlock>{cs.design_process}</ProseBlock>
        ) : (
          <p className="text-mist-2">No design process notes provided.</p>
        )}
      </CaseStudySection>

      <div className="section-separator mb-20" />

      {/* Design System */}
      <CaseStudySection
        title="Design System"
        image={cs.design_system_image}
        imageAlt={`${project.title} design system`}
      >
        {cs.design_system ? (
          <ProseBlock>{cs.design_system}</ProseBlock>
        ) : (
          <p className="text-mist-2">No design system notes provided.</p>
        )}
      </CaseStudySection>

      <div className="section-separator mb-20" />

      {/* Final Solution */}
      <Reveal>
        <div className="mb-20">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8 text-paper">
            Final Solution
          </h2>
          {cs.final_solution && (
            <div className="mb-8">
              <ProseBlock>{cs.final_solution}</ProseBlock>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cs.final_mobile_image && (
              <GlassCard className="overflow-hidden p-0" hover={false}>
                <div className="relative aspect-[9/16] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.final_mobile_image}
                    alt={`${project.title} mobile screens`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </GlassCard>
            )}
            {cs.final_desktop_image && (
              <GlassCard className="overflow-hidden p-0" hover={false}>
                <div className="relative aspect-video w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.final_desktop_image}
                    alt={`${project.title} desktop screens`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </Reveal>

      <div className="section-separator mb-20" />

      {/* Key Features */}
      <CaseStudySection
        title="Key Features"
        image={cs.key_features_image}
        imageAlt={`${project.title} key features`}
        flipped
      >
        {cs.key_features && cs.key_features.length > 0 ? (
          <ul className="space-y-4">
            {cs.key_features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-mist-1">{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-mist-2">No key features listed.</p>
        )}
      </CaseStudySection>

      <div className="section-separator mb-20" />

      {/* Results & Impact */}
      <CaseStudySection
        title="Results & Impact"
        image={cs.results_image}
        imageAlt={`${project.title} results`}
      >
        {cs.results ? (
          <ProseBlock>{cs.results}</ProseBlock>
        ) : (
          <p className="text-mist-2">No results provided.</p>
        )}
      </CaseStudySection>

      <div className="section-separator mb-20" />

      {/* Reflection */}
      <CaseStudySection
        title="Reflection & Learnings"
        image={cs.reflection_image}
        imageAlt={`${project.title} reflection`}
        flipped
      >
        {cs.reflection ? (
          <ProseBlock>{cs.reflection}</ProseBlock>
        ) : (
          <p className="text-mist-2">No reflection provided.</p>
        )}
      </CaseStudySection>

      {/* Next Project CTA */}
      <Reveal>
        <div className="mt-24">
          {nextProject ? (
            <Link href={`/projects/${nextProject.slug}`} className="group block">
              <GlassCard className="p-8 md:p-10 hover:border-(--line-strong)">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <p className="font-mono-tight text-xs uppercase tracking-widest text-secondary mb-2">
                      Next Project
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-semibold text-paper group-hover:text-secondary transition-colors">
                      {nextProject.title}
                    </h3>
                    <p className="text-mist-1 mt-2 max-w-xl line-clamp-2">
                      {nextProject.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-paper transition-colors shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </GlassCard>
            </Link>
          ) : (
            <GlassCard className="p-8 md:p-10 text-center">
              <p className="font-mono-tight text-xs uppercase tracking-widest text-secondary mb-2">
                Let&apos;s work together
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-paper mb-4">
                Have a project in mind?
              </h3>
              <p className="text-mist-1 mb-6 max-w-lg mx-auto">
                I help businesses design products and experiences people can trust.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-paper font-medium px-6 py-3 rounded-full transition-colors"
              >
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          )}
        </div>
      </Reveal>
    </>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const hasCaseStudy =
    !!project.case_study && Object.keys(project.case_study).length > 0;
  const nextProject = hasCaseStudy
    ? await getNextProject(project.case_study?.next_project_slug)
    : null;

  return (
    <main className="min-h-screen">
      <Section spacing="tight">
        <Container size="wide">
          {/* Back Button */}
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-mist-2 hover:text-secondary transition-colors mb-8 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </Reveal>

          {hasCaseStudy ? (
            <CaseStudyProjectPage project={project} nextProject={nextProject} />
          ) : (
            <SimpleProjectPage project={project} />
          )}

          {/* Bottom Navigation */}
          <Reveal>
            <div className="pt-12 border-t border-(--line) mt-16">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-mist-2 hover:text-secondary transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all projects
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
