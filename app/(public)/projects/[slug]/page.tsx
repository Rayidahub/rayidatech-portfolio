// app/(public)/projects/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
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
import { notFound, redirect } from 'next/navigation';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { SERVICE_CATEGORIES } from '@/lib/data/services';
import { normalizeSlug } from '@/lib/slug';

export const revalidate = 3600;

async function getProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();

  // Try an exact canonical match first.
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (data) return data;

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching project:', error);
  }

  // Fallback: tolerate legacy or manually-entered slugs with spaces/special
  // characters by normalizing both the requested slug and stored slugs.
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

async function getNextProject(slug?: string): Promise<Project | null> {
  if (!slug) return null;
  return getProject(slug);
}

export async function generateStaticParams() {
  const { data } = await supabase.from('projects').select('slug');

  if (!data) return [];

  // Generate static pages for normalized (URL-safe) slugs so legacy values
  // with spaces or special characters do not become unroutable paths.
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
  return project.tags?.find((t) => knownTitles.has(t)) || '';
}

function CaseStudyImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) return null;
  return (
    <GlassCard hover={false}>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
      </div>
    </GlassCard>
  );
}

function CaseStudySection({
  title,
  children,
  image,
  imageAlt,
}: {
  title?: string;
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
}) {
  const imageNode = image ? (
    <CaseStudyImage src={image} alt={imageAlt || title || 'Project image'} />
  ) : null;

  return (
    <Reveal>
      <div>
        {title && (
          <h2>
            {title}
          </h2>
        )}
        <div>
          <div>
            {children}
          </div>
          {imageNode && (
            <div>{imageNode}</div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function ProseBlock({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}

function SimpleProjectPage({ project }: { project: Project }) {
  return (
    <>
      <Reveal>
        <div>
          <div>
            {project.featured && (
              <span>
                Featured
              </span>
            )}
            {project.tags?.map((tag) => (
              <span key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <h1>
            {project.title}
          </h1>

          <div>
            {project.role && (
              <span>
                <Tag />
                {project.role}
              </span>
            )}
            {project.duration && (
              <span>
                <Clock />
                {project.duration}
              </span>
            )}
            {project.created_at && (
              <span>
                <Calendar />
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
        <GlassCard hover={false}>
          {project.cover_image ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover_image}
                alt={project.title}
              />
            </div>
          ) : (
            <div>
              <span>No cover image</span>
            </div>
          )}
        </GlassCard>
      </Reveal>

      <Reveal>
        <div>
          <h2>
            Overview
          </h2>
          <p>
            {project.description}
          </p>
        </div>
      </Reveal>

      {project.content && (
        <Reveal>
          <div>
            <h2>
              Project Details
            </h2>
            <ProseBlock>{project.content}</ProseBlock>
          </div>
        </Reveal>
      )}

      {project.link && (
        <Reveal>
          <div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Live Project
              <ExternalLink />
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
        <div>
          <div>
            {project.featured && (
              <span>
                Featured
              </span>
            )}
            {projectType && (
              <span>
                {projectType}
              </span>
            )}
          </div>

          <h1>
            {project.title}
          </h1>

          <p>
            {project.description}
          </p>

          <div>
            {project.role && (
              <span>
                <Tag />
                {project.role}
              </span>
            )}
            {project.duration && (
              <span>
                <Clock />
                {project.duration}
              </span>
            )}
            {project.created_at && (
              <span>
                <Calendar />
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
        <GlassCard hover={false}>
          {project.cover_image ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover_image}
                alt={project.title}
              />
            </div>
          ) : (
            <div>
              <span>No hero mockup</span>
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
            <h3>
              Client / Business
            </h3>
            <p>{cs.client}</p>
          </div>
        )}
        {cs.objective && (
          <div>
            <h3>
              Objective
            </h3>
            <ProseBlock>{cs.objective}</ProseBlock>
          </div>
        )}
        {cs.target_audience && (
          <div>
            <h3>
              Target Audience
            </h3>
            <ProseBlock>{cs.target_audience}</ProseBlock>
          </div>
        )}
      </CaseStudySection>

      {/* Problem & Goals */}
      <CaseStudySection
        title="Problem & Goals"
        image={cs.problem_image}
        imageAlt={`${project.title} problem`}
      >
        {cs.problem && (
          <div>
            <h3>
              The Challenge
            </h3>
            <ProseBlock>{cs.problem}</ProseBlock>
          </div>
        )}
        {cs.business_goals && (
          <div>
            <h3>
              Business Goals
            </h3>
            <ProseBlock>{cs.business_goals}</ProseBlock>
          </div>
        )}
        {cs.user_goals && (
          <div>
            <h3>
              User Goals
            </h3>
            <ProseBlock>{cs.user_goals}</ProseBlock>
          </div>
        )}
      </CaseStudySection>

      {/* Research & Strategy */}
      <CaseStudySection
        title="Research & Strategy"
        image={cs.research_image}
        imageAlt={`${project.title} research`}
      >
        {cs.research ? (
          <ProseBlock>{cs.research}</ProseBlock>
        ) : (
          <p>No research notes provided.</p>
        )}
      </CaseStudySection>

      {/* Design Process */}
      <CaseStudySection
        title="Design Process"
        image={cs.design_process_image}
        imageAlt={`${project.title} design process`}
      >
        {cs.design_process ? (
          <ProseBlock>{cs.design_process}</ProseBlock>
        ) : (
          <p>No design process notes provided.</p>
        )}
      </CaseStudySection>

      {/* Design System */}
      <CaseStudySection
        title="Design System"
        image={cs.design_system_image}
        imageAlt={`${project.title} design system`}
      >
        {cs.design_system ? (
          <ProseBlock>{cs.design_system}</ProseBlock>
        ) : (
          <p>No design system notes provided.</p>
        )}
      </CaseStudySection>

      {/* Final Solution */}
      <Reveal>
        <div>
          <h2>
            Final Solution
          </h2>
          {cs.final_solution && (
            <div>
              <ProseBlock>{cs.final_solution}</ProseBlock>
            </div>
          )}
          <div>
            {cs.final_mobile_image && (
              <GlassCard hover={false}>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.final_mobile_image}
                    alt={`${project.title} mobile screens`}
                  />
                </div>
              </GlassCard>
            )}
            {cs.final_desktop_image && (
              <GlassCard hover={false}>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.final_desktop_image}
                    alt={`${project.title} desktop screens`}
                  />
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </Reveal>

      {/* Key Features */}
      <CaseStudySection
        title="Key Features"
        image={cs.key_features_image}
        imageAlt={`${project.title} key features`}
      >
        {cs.key_features && cs.key_features.length > 0 ? (
          <ul>
            {cs.key_features.map((feature, index) => (
              <li key={index}>
                <span>
                  <Check />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No key features listed.</p>
        )}
      </CaseStudySection>

      {/* Results & Impact */}
      <CaseStudySection
        title="Results & Impact"
        image={cs.results_image}
        imageAlt={`${project.title} results`}
      >
        {cs.results ? (
          <ProseBlock>{cs.results}</ProseBlock>
        ) : (
          <p>No results provided.</p>
        )}
      </CaseStudySection>

      {/* Reflection */}
      <CaseStudySection
        title="Reflection & Learnings"
        image={cs.reflection_image}
        imageAlt={`${project.title} reflection`}
      >
        {cs.reflection ? (
          <ProseBlock>{cs.reflection}</ProseBlock>
        ) : (
          <p>No reflection provided.</p>
        )}
      </CaseStudySection>

      {/* Next Project CTA */}
      <Reveal>
        <div>
          {nextProject ? (
            <Link href={`/projects/${normalizeSlug(nextProject.slug)}`}>
              <GlassCard>
                <div>
                  <div>
                    <p>
                      Next Project
                    </p>
                    <h3>
                      {nextProject.title}
                    </h3>
                    <p>
                      {nextProject.description}
                    </p>
                  </div>
                  <span>
                    <ArrowRight />
                  </span>
                </div>
              </GlassCard>
            </Link>
          ) : (
            <GlassCard>
              <p>
                Let&apos;s work together
              </p>
              <h3>
                Have a project in mind?
              </h3>
              <p>
                I help businesses design products and experiences people can trust.
              </p>
              <Link href="/contact">
                Start a Project
                <ArrowRight />
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

  // Redirect legacy/non-canonical URLs to the canonical slug, but only once
  // the canonical slug itself has been cleaned up in the database.
  if (
    project.slug !== slug &&
    project.slug === normalizeSlug(project.slug)
  ) {
    redirect(`/projects/${project.slug}`);
  }

  const hasCaseStudy =
    !!project.case_study && Object.keys(project.case_study).length > 0;
  const nextProject = hasCaseStudy
    ? await getNextProject(project.case_study?.next_project_slug)
    : null;

  return (
    <main>
      <Section spacing="tight">
        <Container size="wide">
          {/* Back Button */}
          <Reveal>
            <Link href="/projects">
              <ArrowLeft />
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
            <div>
              <Link href="/projects">
                <ArrowLeft />
                Back to all projects
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
