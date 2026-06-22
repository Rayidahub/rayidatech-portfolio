import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';

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
    <main className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-teal-400">Projects</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Each project tells a story. Here are some of the products and experiences Ive designed.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-teal-500/30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02]"
              >
                {/* Cover Image */}
                <div className="aspect-video bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                  {project.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">No image</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {project.featured && (
                      <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <span className="inline-flex items-center gap-1 bg-white/5 text-gray-400 text-xs px-2 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        {project.tags[0]}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors duration-300">
                    {project.title}
                  </h2>

                  <p className="text-gray-400 text-sm line-clamp-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:line-clamp-4">
                    {project.description}
                  </p>

                  {/* Revealed on hover */}
                  <div className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] max-h-0 group-hover:max-h-40 opacity-0 group-hover:opacity-100">
                    {(project.tags && project.tags.length > 1) && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tags.slice(1).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.role && (
                      <p className="text-gray-500 text-xs mt-3">
                        Role: <span className="text-gray-400">{project.role}</span>
                      </p>
                    )}

                    {project.duration && (
                      <p className="text-gray-500 text-xs mt-1">{project.duration}</p>
                    )}

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-400 mt-3 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      View project <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
