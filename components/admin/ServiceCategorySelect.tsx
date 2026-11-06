'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Palette,
  Package,
  Sparkles,
  PenTool,
  Globe,
  GraduationCap,
  Share2,
} from 'lucide-react';
import { SERVICE_CATEGORIES, type ServiceCategory } from '@/lib/data/services';
import { getCaseStudyConfig } from '@/lib/data/case-study-templates';

interface ServiceCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const CATEGORY_ICONS: Record<ServiceCategory, React.ComponentType<{ className?: string }>> = {
  'UI/UX Design': Palette,
  'Product Design': Package,
  'Brand Identity': Sparkles,
  'Graphic Design': PenTool,
  'Website Design': Globe,
  'Tech Education': GraduationCap,
  'Social Media Management': Share2,
};

export default function ServiceCategorySelect({
  value,
  onChange,
  required = false,
  className = '',
}: ServiceCategorySelectProps) {
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

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedCategory = (SERVICE_CATEGORIES as readonly string[]).find(
    (c) => c.toLowerCase() === (value || '').toLowerCase()
  ) as ServiceCategory | undefined;

  const ActiveIcon = selectedCategory ? CATEGORY_ICONS[selectedCategory] : null;
  const activeConfig = selectedCategory ? getCaseStudyConfig(selectedCategory) : null;

  function handleSelect(category: ServiceCategory) {
    onChange(category);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden native select for form validation & accessibility */}
      <select
        aria-hidden="true"
        tabIndex={-1}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      >
        <option value="" disabled>
          Select a service category
        </option>
        {SERVICE_CATEGORIES.map((category) => (
          <option
            key={category}
            value={category}
            style={{ backgroundColor: '#1a1a2e', color: '#f2f2f2' }}
          >
            {category}
          </option>
        ))}
      </select>

      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full bg-[#16162a]/90 backdrop-blur-md border rounded-xl px-3.5 py-3 text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${
          isOpen
            ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10'
            : 'border-(--line) hover:border-primary/40 hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              ActiveIcon
                ? 'bg-primary/20 text-secondary border border-primary/30'
                : 'bg-white/5 text-mist-2 border border-white/5'
            }`}
          >
            {ActiveIcon ? (
              <ActiveIcon className="w-4 h-4" />
            ) : (
              <Palette className="w-4 h-4 opacity-50" />
            )}
          </div>

          <div className="min-w-0">
            {selectedCategory ? (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-paper tracking-wide">
                  {selectedCategory}
                </span>
                {activeConfig && (
                  <span className="text-[11px] text-mist-2 truncate">
                    {activeConfig.tagline}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-mist-2">Select a service category</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedCategory && (
            <span className="hidden sm:inline-flex text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
              Active Form
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-mist-2 transition-transform duration-200 group-hover:text-paper ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </div>
      </button>

      {/* Custom Dark Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#16162a] border border-(--line) p-2 shadow-2xl shadow-black/80 backdrop-blur-xl animate-fade-in max-h-84 overflow-y-auto space-y-1"
        >
          <div className="px-3 py-1.5 text-[11px] font-mono-tight uppercase tracking-wider text-mist-2 border-b border-(--line) mb-1 flex items-center justify-between">
            <span>Choose Project Category</span>
            <span className="text-[10px] text-secondary">Adapts case study form</span>
          </div>

          {SERVICE_CATEGORIES.map((category) => {
            const isSelected =
              selectedCategory?.toLowerCase() === category.toLowerCase();
            const Icon = CATEGORY_ICONS[category];
            const cfg = getCaseStudyConfig(category);

            return (
              <button
                key={category}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(category)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isSelected
                    ? 'bg-primary/20 border border-primary/40 text-paper shadow-sm'
                    : 'border border-transparent text-mist-1 hover:text-paper hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                        : 'bg-white/5 text-mist-2 group-hover:text-secondary group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug transition-colors ${
                        isSelected ? 'text-paper' : 'text-paper/90 group-hover:text-paper'
                      }`}
                    >
                      {category}
                    </p>
                    <p className="text-[11px] text-mist-2 truncate leading-tight mt-0.5">
                      {cfg.tagline}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-[10px] text-mist-2 opacity-0 group-hover:opacity-100 transition-opacity font-mono-tight">
                    Select →
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

