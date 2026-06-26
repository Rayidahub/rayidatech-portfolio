import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import type { Service } from '@/types/service';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import ProjectsFilter from '@/components/sections/ProjectsFilter';

export const revalidate = 3600;

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

async function getServices(): Promise<Service[]> {
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
    <main className="min-h-screen bg-ink">
      <Section spacing="tight" className="pt-32">
        <Container size="wide">
          <Reveal>
            <div className="mb-12">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
                Portfolio
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4 text-paper">
                My <span className="gradient-text">Projects</span>
              </h1>
              <p className="text-mist-1 text-lg max-w-2xl">
                Each project tells a story. Here are some of the products and
                experiences I&apos;ve designed.
              </p>
            </div>
          </Reveal>

          {projects.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl">
              <p className="text-mist-2">No projects yet. Check back soon!</p>
            </div>
          ) : (
            <ProjectsFilter projects={projects} services={services} />
          )}
        </Container>
      </Section>
    </main>
  );
}
