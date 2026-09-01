import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { Project } from '@/types/project';
import type { Service } from '@/types/service';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import ProjectsFilter from '@/components/sections/ProjectsFilter';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore a curated portfolio of design and engineering projects by Raymond Gaius — fintech, product design, and AI solutions.',
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
    <main>
      <Section>
        <Container size="wide">
          <Reveal>
            <div>
              <p>
                Portfolio
              </p>
              <h1>
                My <span>Projects</span>
              </h1>
              <p>
                Each project tells a story. Here are some of the products and
                experiences I&apos;ve designed.
              </p>
            </div>
          </Reveal>

          {projects.length === 0 ? (
            <div>
              <p>No projects yet. Check back soon!</p>
            </div>
          ) : (
            <ProjectsFilter projects={projects} services={services} />
          )}
        </Container>
      </Section>
    </main>
  );
}
