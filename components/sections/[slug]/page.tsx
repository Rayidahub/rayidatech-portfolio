// app/projects/[slug]/page.tsx
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

// Fetch a single project by slug
async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

// Fetch all project slugs for static generation
export async function generateStaticParams() {
  const { data } = await supabase.from('projects').select('slug');

  if (!data) return [];

  return data.map((project) => ({
    slug: project.slug,
  }));
}

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project Hero */}
        <div className="mb-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.featured && (
              <span className="bg-teal-500/20 text-teal-400 text-xs px-3 py-1 rounded-full">
                Featured
              </span>
            )}
            {project.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-white/5 text-gray-400 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {project.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
            {project.role && (
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {project.role}
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {project.duration}
              </span>
            )}
            {project.created_at && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {project.cover_image ? (
          <div className="rounded-xl overflow-hidden mb-10 bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden mb-10 bg-gradient-to-br from-teal-500/20 to-purple-500/20 border border-white/5 h-64 flex items-center justify-center">
            <span className="text-gray-500">No cover image</span>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="text-gray-400 leading-relaxed">{project.description}</p>
        </div>

        {/* Full Content */}
        {project.content && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">Project Details</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
              {project.content}
            </p>
          </div>
        )}

        {/* Project Link (if exists) */}
        {project.link && (
          <div className="mt-10">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-all"
            >
              View Live Project →
            </a>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all projects
          </Link>
        </div>
      </div>
    </main>
  );
}