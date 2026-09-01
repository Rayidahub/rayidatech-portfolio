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
      <div>
        <div>
          <Search />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name, role, or tag..."
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X />
            </button>
          )}
        </div>

        <div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p>
        {filteredProjects.length}{' '}
        {filteredProjects.length === 1 ? 'project' : 'projects'} found
      </p>

      {filteredProjects.length === 0 ? (
        <div>
          <p>No projects match your filters.</p>
          <button onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div>
          {filteredProjects.map((project) => {
            const firstTag = project.tags?.[0];
            const badgeLabel = project.featured
              ? 'Featured'
              : firstTag || 'Project';

            return (
              <Reveal key={project.id}>
                <Link href={`/projects/${normalizeSlug(project.slug)}`}>
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
                        icon: <Briefcase />,
                        label: project.role || 'Product Design',
                      },
                      {
                        icon: <Calendar />,
                        label: project.duration || '—',
                      },
                      {
                        icon: <Tag />,
                        label: firstTag || 'Project',
                      },
                    ]}
                    hoverBadge={{
                      icon: <Sparkles />,
                      label: firstTag || 'Project',
                    }}
                    hoverMetrics={[
                      {
                        icon: <Calendar />,
                        label: project.duration || '—',
                      },
                      {
                        icon: <Briefcase />,
                        label: project.role || 'Product Design',
                      },
                      {
                        icon: <Tag />,
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
