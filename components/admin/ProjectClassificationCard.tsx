'use client';

import { useState } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  Palette,
  Code2,
  Layers,
} from 'lucide-react';
import ProjectTypeSelect from '@/components/admin/ProjectTypeSelect';
import ServiceCategorySelect from '@/components/admin/ServiceCategorySelect';
import { ProjectType } from '@/types/project';
import {
  getClassificationBadgeClass,
  getClassificationHelpText,
  getClassificationAriaLabel,
  getClassificationToggleTooltip,
} from '@/lib/project-classification';

interface ProjectClassificationCardProps {
  projectType: ProjectType;
  onProjectTypeChange: (type: ProjectType) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  defaultOpen?: boolean;
  className?: string;
}

export default function ProjectClassificationCard({
  projectType,
  onProjectTypeChange,
  category,
  onCategoryChange,
  defaultOpen = true,
  className = '',
}: ProjectClassificationCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const ActiveIcon =
    projectType === 'Brand Identity'
      ? Sparkles
      : projectType === 'Web Development'
      ? Code2
      : projectType === 'UI/UX Design'
      ? Palette
      : SlidersHorizontal;

  return (
    <div
      className={`rounded-xl bg-white/[0.02] border border-(--line) overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Collapsible Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="classification-panel"
        aria-label={getClassificationAriaLabel(isOpen, projectType)}
        title={getClassificationToggleTooltip(isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors focus:outline-none focus:bg-white/[0.03] cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
            <ActiveIcon className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono-tight uppercase tracking-wider text-mist-1 font-medium">
                Project Architecture &amp; Classification
              </span>

              {/* Active summary pills visible when collapsed or expanded */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tight border transition-colors ${getClassificationBadgeClass(
                    projectType
                  )}`}
                >
                  {projectType}
                </span>

                {category ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-secondary/15 text-secondary border border-secondary/25">
                    {category}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-white/5 text-mist-2 border border-(--line)">
                    No Category
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-mist-2 font-mono-tight mt-0.5 truncate hidden sm:block">
              {isOpen
                ? 'Determines Form & Public View'
                : 'Click to expand classification and service category'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-[11px] text-secondary font-mono-tight hidden md:inline-block">
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          <div className="p-1 rounded-md text-mist-2 hover:text-paper">
            <ChevronDown
              className={`w-4 h-4 text-mist-2 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-primary' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div
          id="classification-panel"
          className="p-4 sm:p-5 border-t border-(--line) space-y-4 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-paper mb-1.5">
                Project Type *
              </label>
              <ProjectTypeSelect
                value={projectType}
                onChange={onProjectTypeChange}
              />
              <p className="text-[11px] text-mist-2 mt-1">
                {getClassificationHelpText(projectType)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-paper mb-1.5">
                Service Category *
              </label>
              <ServiceCategorySelect
                value={category}
                onChange={onCategoryChange}
                required
              />
              <p className="text-[11px] text-mist-2 mt-1">
                Controls portfolio filtering tags and public taxonomy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
