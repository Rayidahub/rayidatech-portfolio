// components/sections/FeaturedProjects.tsx
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Featured <span className="text-teal-400">Projects</span>
            </h2>
            <p className="text-gray-400">
              Some of my best work — handpicked for you.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors mt-4 sm:mt-0"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-teal-500/30 transition-all hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="aspect-video bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center">
                {project.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">No image</span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {project.tags && project.tags.length > 0 && (
                    <span className="bg-white/5 text-gray-400 text-xs px-2 py-1 rounded-full">
                      {project.tags[0]}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-1 group-hover:text-teal-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm line-clamp-2">
                  {project.description}
                </p>

                {project.role && (
                  <p className="text-gray-500 text-xs mt-2">
                    {project.role}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}