import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';

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
          {projects.map((project, index) => (
            <Reveal key={project.id} index={index}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <GlassCard className="overflow-hidden p-0 h-full transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                  {/* Cover Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                    {project.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-mist-2 text-sm">No image</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary/10 text-mist-1 font-mono-tight text-xs px-2 py-1 rounded-full">
                          {project.tags[0]}
                        </span>
                      </div>
                    )}

                    <h3 className="font-display text-lg font-semibold mb-1 text-paper group-hover:text-secondary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-mist-1 text-sm line-clamp-2">
                      {project.description}
                    </p>

                    {project.role && (
                      <p className="text-mist-2 text-xs mt-2">
                        {project.role}
                      </p>
                    )}
                  </div>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
