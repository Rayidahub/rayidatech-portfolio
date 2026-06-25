import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import type { Service } from '@/types/service';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import ProjectsFilter from '@/components/sections/ProjectsFilter';

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
    <main className="min-h-screen">
      <Section spacing="tight">
        <Container size="wide">
          <Reveal>
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                My <span className="gradient-text">Projects</span>
              </h1>
              <p className="text-mist-1 text-lg max-w-2xl">
                Each project tells a story. Here are some of the products and
                experiences I&apos;ve designed.
              </p>
            </div>
          </Reveal>

          {projects.length === 0 ? (
            <div className="text-center py-20">
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
