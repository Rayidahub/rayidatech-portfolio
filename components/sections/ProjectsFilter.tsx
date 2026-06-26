'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Briefcase, Calendar, Sparkles, Tag, X } from 'lucide-react';
import type { Project } from '@/types/project';
import type { Service } from '@/types/service';
import { SERVICE_CATEGORIES } from '@/lib/data/services';
import PremiumCard from '@/components/ui/PremiumCard';
import Reveal from '@/components/ui/Reveal';
import { normalizeSlug } from '@/lib/slug';

const FALLBACK_CATEGORIES = [...SERVICE_CATEGORIES];

interface ProjectsFilterProps {
  projects: Project[];
  services: Service[];
}

export default function ProjectsFilter({
  projects,
  services,
}: ProjectsFilterProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => {
    const fromServices = services.map((s) => s.title);
    const titles = fromServices.length > 0 ? fromServices : FALLBACK_CATEGORIES;
    return ['All', 'Featured', ...titles];
  }, [services]);

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (category === 'Featured') {
      result = result.filter((p) => p.featured);
    } else if (category !== 'All') {
      result = result.filter((p) =>
        p.tags?.some(
          (tag) => tag.toLowerCase() === category.toLowerCase()
        )
      );
    }

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.role?.toLowerCase().includes(q) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [projects, category, query]);

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <div>
      {/* Search + category filters */}
      <div className="mb-10 space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name, role, or tag..."
            className="w-full glass rounded-full pl-11 pr-10 py-3 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mist-2 hover:text-paper transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-primary text-paper shadow-lg shadow-primary/20'
                  : 'glass text-mist-1 hover:text-paper hover:border-(--line-strong)'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-mist-2 text-sm mb-6">
        {filteredProjects.length}{' '}
        {filteredProjects.length === 1 ? 'project' : 'projects'} found
      </p>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-mist-1 mb-3">No projects match your filters.</p>
          <button
            onClick={clearFilters}
            className="text-secondary hover:text-secondary/80 text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const firstTag = project.tags?.[0];
            const badgeLabel = project.featured
              ? 'Featured'
              : firstTag || 'Project';

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
      )}
    </div>
  );
}
