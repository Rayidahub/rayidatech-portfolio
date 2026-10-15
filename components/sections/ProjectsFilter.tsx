'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Briefcase, Calendar, Sparkles, Tag, X, FolderSearch, ArrowRight } from 'lucide-react';
import type { Project } from '@/types/project';
import type { Service } from '@/types/service';
import { SERVICE_CATEGORIES } from '@/lib/data/services';
import PremiumCard from '@/components/ui/PremiumCard';
import Reveal from '@/components/ui/Reveal';
import GlassCard from '@/components/ui/GlassCard';
import { normalizeSlug } from '@/lib/slug';

const FALLBACK_CATEGORIES = [...SERVICE_CATEGORIES];

interface ProjectsFilterProps {
  projects: Project[];
  services: Service[];
}

function cleanImageUrl(url?: string): string {
  if (!url) return '/img/card1.png';
  return url.replace(/\?w=\d+/, '');
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
    <div className="space-y-8">
      {/* ── Search & Filter Controls Bar ── */}
      <Reveal>
        <div className="glass rounded-2xl p-4 md:p-5 border border-(--line) space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6 shadow-xl">
          {/* Category Filter Pills (Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/25 border border-primary scale-[1.02]'
                      : 'glass border border-(--line) text-mist-1 hover:text-paper hover:border-primary/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, roles, tags..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-ink/60 border border-(--line) text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </Reveal>

      {/* ── Meta Results Row ── */}
      <div className="flex items-center justify-between px-1">
        <p className="font-mono-tight text-xs text-mist-2">
          Showing <span className="text-paper font-semibold">{filteredProjects.length}</span>{' '}
          {filteredProjects.length === 1 ? 'project' : 'projects'}
          {category !== 'All' ? ` in ${category}` : ''}
          {query ? ` matching "${query}"` : ''}
        </p>

        {(query || category !== 'All') && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-mono-tight text-secondary hover:text-secondary/80 transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* ── Grid or Empty State ── */}
      {filteredProjects.length === 0 ? (
        <Reveal>
          <GlassCard
            hover={false}
            className="p-12 md:p-16 text-center space-y-4 max-w-xl mx-auto my-12 border border-(--line)"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary mx-auto shadow-inner">
              <FolderSearch className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-paper">
              No Projects Found
            </h3>
            <p className="text-sm text-mist-1 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any projects matching your current search or category filter. Try clearing filters or using different keywords.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={clearFilters}
                className="btn-glow inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-medium hover:brightness-110 transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project, index) => {
            const firstTag = project.tags?.[0];
            const badgeLabel = project.featured
              ? 'Featured'
              : firstTag || 'Project';

            const cleanCover = cleanImageUrl(project.cover_image);

            return (
              <Reveal key={project.id} index={index}>
                <Link
                  href={`/projects/${normalizeSlug(project.slug)}`}
                  className="group block h-full"
                >
                  <PremiumCard
                    imageSrc={cleanCover}
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
                    ctaLabel="View Case Study"
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
