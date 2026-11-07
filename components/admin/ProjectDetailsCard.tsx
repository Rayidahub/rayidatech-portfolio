'use client';

import { useState } from 'react';
import {
  FileText,
  ChevronDown,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { getCoverAspectBadge } from '@/lib/project-card-image';
import {
  getProjectDetailsAriaLabel,
  getProjectDetailsToggleTooltip,
  getCoverSummaryStatus,
  getFeaturedStatusBadge,
  getProjectDetailsCompletionScore,
  truncateDetailsPreview,
  ProjectCoreMetaCandidate,
} from '@/lib/project-details-card';


export interface ProjectDetailsCardFormValues {
  title: string;
  slug: string;
  description: string;
  content?: string;
  card_image?: string | null;
  cover_image?: string | null;
  role?: string;
  duration?: string;
  link?: string;
  tags?: string;
  featured?: boolean;
}

export interface ProjectDetailsCardProps {
  form: ProjectDetailsCardFormValues;
  onChange: <K extends keyof ProjectDetailsCardFormValues>(
    field: K,
    value: ProjectDetailsCardFormValues[K]
  ) => void;
  onTitleChange?: (title: string) => void;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function ProjectDetailsCard({
  form,
  onChange,
  onTitleChange,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  className = '',
}: ProjectDetailsCardProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const coverStatus = getCoverSummaryStatus(form.card_image, form.cover_image);
  const featuredStatus = getFeaturedStatusBadge(form.featured);
  const completion = getProjectDetailsCompletionScore(form);


  const handleTitleInput = (value: string) => {
    if (onTitleChange) {
      onTitleChange(value);
    } else {
      onChange('title', value);
    }
  };

  return (
    <div
      data-testid="project-details-card"
      data-state={isOpen ? 'open' : 'collapsed'}
      className={`rounded-xl bg-white/[0.02] border border-(--line) overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Collapsible Header Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}

        aria-controls="project-details-panel"
        aria-label={getProjectDetailsAriaLabel(isOpen, form.title)}
        title={getProjectDetailsToggleTooltip(isOpen)}
        className="w-full group flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus:bg-white/[0.03] cursor-pointer"
      >

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
            <FileText className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono-tight uppercase tracking-wider text-mist-1 font-medium">
                Project Details &amp; Cover Media
              </span>

              {/* Live Summary Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {form.title ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-white/5 border border-(--line) text-paper truncate max-w-[180px]">
                    {truncateDetailsPreview(form.title, 25)}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-white/5 border border-dashed border-mist-2/40 text-mist-2">
                    Untitled
                  </span>
                )}

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tight border transition-colors ${coverStatus.badgeClass}`}
                >
                  {coverStatus.label}
                </span>

                {completion.hasRequired ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ Core Ready
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Needs {completion.missingRequired.join(', ')}
                  </span>
                )}


                {featuredStatus.isFeatured && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tight border ${featuredStatus.badgeClass}`}
                  >
                    ✦ Featured
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-mist-2 mt-0.5 truncate">
              Title, slug, description, markdown content, portrait card cover, hero banner, and meta tags.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-[10px] font-mono-tight text-mist-2 hidden sm:inline-block">
            {isOpen ? 'Click to collapse' : 'Click to expand'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-mist-2 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </div>
      </button>

      {/* Expandable Form Panel */}
      {isOpen && (
        <div
          id="project-details-panel"
          className="p-4 sm:p-6 border-t border-(--line) space-y-4 animate-fade-in"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-mist-1 mb-1.5">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleInput(e.target.value)}
                required
                placeholder="e.g. LUXE BY SEY — Brand Identity & Visual Design"
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-mist-1 mb-1.5">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => onChange('slug', e.target.value)}
                required
                placeholder="luxe-by-sey"
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-mist-1 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => onChange('description', e.target.value)}
                required
                rows={2}
                placeholder="Brief summary of the project challenge, scope, and visual execution."
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-mist-1 mb-1.5">Content (Markdown / Notes)</label>
              <textarea
                value={form.content || ''}
                onChange={(e) => onChange('content', e.target.value)}
                rows={6}
                placeholder="Extended case study notes, background, client briefs, or supplementary markdown."
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
              />
            </div>

            {/* Dual Cover Media Architecture */}
            <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-(--line)">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono-tight text-secondary uppercase tracking-wider font-semibold">
                    ✦ Portfolio Card Cover (Portrait)
                  </span>
                  <span
                    className={`text-[10px] font-mono-tight px-2 py-0.5 rounded-full border ${
                      getCoverAspectBadge('card').color
                    }`}
                  >
                    {getCoverAspectBadge('card').ratio}
                  </span>
                </div>
                <ImageUploadField
                  label="Card Cover Image (Used on Portfolio Grids)"
                  value={form.card_image || ''}
                  onChange={(url) => onChange('card_image', url)}
                  folder="projects"
                  description="Vertical orientation image displayed on public portfolio cards & home page teaser. If empty, falls back to hero banner."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono-tight text-accent-soft uppercase tracking-wider font-semibold">
                    ✦ Case Study Hero Banner (Landscape)
                  </span>
                  <span
                    className={`text-[10px] font-mono-tight px-2 py-0.5 rounded-full border ${
                      getCoverAspectBadge('banner').color
                    }`}
                  >
                    {getCoverAspectBadge('banner').ratio}
                  </span>
                </div>
                <ImageUploadField
                  label="Case Study Hero Banner"
                  value={form.cover_image || ''}
                  onChange={(url) => onChange('cover_image', url)}
                  folder="projects"
                  description="Wide panoramic header banner displayed at the top of the project detail case study view."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-mist-1 mb-1.5">Role</label>
              <input
                type="text"
                value={form.role || ''}
                onChange={(e) => onChange('role', e.target.value)}
                placeholder="e.g. Lead Brand Designer"
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-mist-1 mb-1.5">Duration</label>
              <input
                type="text"
                value={form.duration || ''}
                onChange={(e) => onChange('duration', e.target.value)}
                placeholder="e.g. 4 Days or 2 Weeks"
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-mist-1 mb-1.5">Live Link</label>
              <input
                type="url"
                value={form.link || ''}
                onChange={(e) => onChange('link', e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-mist-1 mb-1.5">
                Additional Tags (comma-separated)
              </label>
              <input
                type="text"
                value={form.tags || ''}
                onChange={(e) => onChange('tags', e.target.value)}
                placeholder="Brand Identity, Packaging, Typography"
                className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(e) => onChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-(--line) bg-white/5 text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-mist-1">Featured project on homepage</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
