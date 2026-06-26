import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { ArrowRight, Briefcase, Calendar, Sparkles, Tag } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import PremiumCard from '@/components/ui/PremiumCard';
import Reveal from '@/components/ui/Reveal';
import { normalizeSlug } from '@/lib/slug';

async function getFeaturedProjects(): Promise<Project[]> {
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-mist-1">
                Some of my best work — handpicked for you.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors mt-4 sm:mt-0 text-sm font-medium"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const firstTag = project.tags?.[0];
            const badgeLabel = project.featured ? 'Featured' : firstTag || 'Project';

            return (
              <Reveal key={project.id} index={index}>
                <Link
                  href={`/projects/${normalizeSlug(project.slug)}`}
                  className="group block"
                >
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
                        icon: <Briefcase className="w-3.5 h-3.5" />,
                        label: project.role || 'Product Design',
                      },
                      {
                        icon: <Calendar className="w-3.5 h-3.5" />,
                        label: project.duration || '—',
                      },
                      {
                        icon: <Tag className="w-3.5 h-3.5" />,
                        label: firstTag || 'Project',
                      },
                    ]}
                    hoverBadge={{
                      icon: <Sparkles className="w-3.5 h-3.5" />,
                      label: firstTag || 'Project',
                    }}
                    hoverMetrics={[
                      {
                        icon: <Calendar className="w-3.5 h-3.5" />,
                        label: project.duration || '—',
                      },
                      {
                        icon: <Briefcase className="w-3.5 h-3.5" />,
                        label: project.role || 'Product Design',
                      },
                      {
                        icon: <Tag className="w-3.5 h-3.5" />,
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
