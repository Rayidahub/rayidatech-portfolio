import { createClient } from '@/lib/supabase/server';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { ArrowRight, Briefcase, Calendar, Sparkles, Tag } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import PremiumCard from '@/components/ui/PremiumCard';
import Reveal from '@/components/ui/Reveal';
import { normalizeSlug } from '@/lib/slug';

async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return data || [];
}

export default async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  if (projects.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container size="wide">
        <Reveal>
          <div>
            <div>
              <h2>
                Featured <span>Projects</span>
              </h2>
              <p>
                Some of my best work — handpicked for you.
              </p>
            </div>
            <Link href="/projects">
              View All Projects
              <ArrowRight />
            </Link>
          </div>
        </Reveal>

        <div>
          {projects.map((project) => {
            const firstTag = project.tags?.[0];
            const badgeLabel = project.featured ? 'Featured' : firstTag || 'Project';

            return (
              <Reveal key={project.id}>
                <Link href={`/projects/${normalizeSlug(project.slug)}`}>
                  <PremiumCard
                    imageSrc={project.cover_image}
                    imageAlt={project.title}
                    badge={badgeLabel}
                    title={project.title}
                    subtitle={project.role}
                    description={project.description}
                    primaryMetric={project.duration || 'View →'}
                    bottomSpecs={[
                      {
                        icon: <Briefcase />,
                        label: project.role || 'Product Design',
                      },
                      {
                        icon: <Calendar />,
                        label: project.duration || '—',
                      },
                      {
                        icon: <Tag />,
                        label: firstTag || 'Project',
                      },
                    ]}
                    hoverBadge={{
                      icon: <Sparkles />,
                      label: firstTag || 'Project',
                    }}
                    hoverMetrics={[
                      {
                        icon: <Calendar />,
                        label: project.duration || '—',
                      },
                      {
                        icon: <Briefcase />,
                        label: project.role || 'Product Design',
                      },
                      {
                        icon: <Tag />,
                        label: firstTag
                          ? `${project.tags?.length || 0} tags`
                          : 'Project',
                      },
                    ]}
                    tags={project.tags || []}
                    ctaLabel="View Project"
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
