import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import { Briefcase, Calendar, Sparkles, Tag } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import PremiumCard from '@/components/ui/PremiumCard';
import Link from 'next/link';

async function getProjects(): Promise<Project[]> {
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

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen">
      <Section spacing="tight">
        <Container size="wide">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-mist-1 text-lg max-w-2xl">
              Each project tells a story. Here are some of the products and experiences I&apos;ve designed.
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mist-2">No projects yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                const firstTag = project.tags?.[0];
                const badgeLabel = project.featured ? 'Featured' : firstTag || 'Project';

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
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
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
