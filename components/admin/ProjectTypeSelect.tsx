'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Palette,
  Sparkles,
  Code2,
  Layers,
} from 'lucide-react';
import { PROJECT_TYPES, type ProjectType } from '@/types/project';

interface ProjectTypeSelectProps {
  value: ProjectType;
  onChange: (value: ProjectType) => void;
  className?: string;
}

const TYPE_CONFIG: Record<
  ProjectType,
  {
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    accent: string;
    bgAccent: string;
  }
> = {
  'Brand Identity': {
    icon: Sparkles,
    description: 'Logo suite, color system, typography, merch, packaging & visual identity',
    accent: 'text-secondary',
    bgAccent: 'bg-secondary/15 border-secondary/30',
  },
  'UI/UX Design': {
    icon: Palette,
    description: 'User flows, wireframes, component design systems & interactive screens',
    accent: 'text-primary',
    bgAccent: 'bg-primary/15 border-primary/30',
  },
  'Web Development': {
    icon: Code2,
    description: 'Full-stack engineering, APIs, database architecture & frontend builds',
    accent: 'text-cyan-400',
    bgAccent: 'bg-cyan-500/15 border-cyan-500/30',
  },
  'Other / General': {
    icon: Layers,
    description: 'Multidisciplinary case studies, marketing assets & custom deliverables',
    accent: 'text-mist-1',
    bgAccent: 'bg-white/10 border-white/20',
  },
};

export default function ProjectTypeSelect({
  value,
  onChange,
  className = '',
}: ProjectTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const activeType: ProjectType =
    PROJECT_TYPES.find((t) => t.toLowerCase() === (value || '').toLowerCase()) ||
    'UI/UX Design';
  const config = TYPE_CONFIG[activeType] || TYPE_CONFIG['UI/UX Design'];
  const ActiveIcon = config.icon;

  function handleSelect(type: ProjectType) {
    onChange(type);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full bg-[#16162a]/90 backdrop-blur-md border rounded-xl px-3.5 py-3 text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${
          isOpen
            ? 'border-secondary ring-2 ring-secondary/20 shadow-lg shadow-secondary/10'
            : 'border-(--line) hover:border-secondary/40 hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${config.bgAccent} ${config.accent}`}
          >
            <ActiveIcon className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-paper tracking-wide">
                {activeType}
              </span>
              <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-white/5 border border-(--line) text-mist-2">
                Template Mode
              </span>
            </div>
            <p className="text-[11px] text-mist-2 truncate leading-tight mt-0.5">
              {config.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-mist-2 transition-transform duration-200 group-hover:text-paper ${
              isOpen ? 'rotate-180 text-secondary' : ''
            }`}
          />
        </div>
      </button>

      {/* Custom Dark Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#16162a] border border-(--line) p-2 shadow-2xl shadow-black/80 backdrop-blur-xl animate-fade-in space-y-1"
        >
          <div className="px-3 py-1.5 text-[11px] font-mono-tight uppercase tracking-wider text-mist-2 border-b border-(--line) mb-1 flex items-center justify-between">
            <span>Select Project Type & Form</span>
            <span className="text-[10px] text-secondary">Adapts case study layout</span>
          </div>

          {PROJECT_TYPES.map((type) => {
            const isSelected = activeType === type;
            const itemConfig = TYPE_CONFIG[type];
            const Icon = itemConfig.icon;

            return (
              <button
                key={type}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(type)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isSelected
                    ? 'bg-secondary/15 border border-secondary/40 text-paper shadow-sm'
                    : 'border border-transparent text-mist-1 hover:text-paper hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-secondary text-ink border-secondary'
                        : 'bg-white/5 text-mist-2 border-white/5 group-hover:text-secondary group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug transition-colors ${
                        isSelected ? 'text-paper font-semibold' : 'text-paper/90 group-hover:text-paper'
                      }`}
                    >
                      {type}
                    </p>
                    <p className="text-[11px] text-mist-2 truncate leading-tight mt-0.5">
                      {itemConfig.description}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-[10px] text-mist-2 opacity-0 group-hover:opacity-100 transition-opacity font-mono-tight">
                    Switch →
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

