'use client';

import { useState } from 'react';
import type {
  BrandIdentityCaseStudy,
  BrandColor,
  BrandTypography,
  BrandApplication,
  BrandGalleryItem,
  BrandApplicationCategory,
  BrandApplicationLayout,
  BrandGalleryLayout,
  BrandColorClassification,
  BrandFontRole,
} from '@/types/project';
import { BRAND_APPLICATION_CATEGORIES } from '@/types/project';
import ImageUploadField from '@/components/admin/ImageUploadField';
import {
  Sparkles,
  ChevronDown,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Eye,
  EyeOff,
  Palette,
  Type,
  Layers,
  Package,
  Image as ImageIcon,
  Award,
  Compass,
  Check,
  AlertCircle,
} from 'lucide-react';

interface BrandIdentityFieldsProps {
  value: Partial<BrandIdentityCaseStudy>;
  onChange: (value: BrandIdentityCaseStudy) => void;
}

function hexToRgb(hex: string): string {
  const clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? '' : `rgb(${r}, ${g}, ${b})`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? '' : `rgb(${r}, ${g}, ${b})`;
  }
  return '';
}

function SectionCard({
  title,
  stepNumber,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  badge,
}: {
  title: string;
  stepNumber: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="rounded-2xl border border-(--line) bg-white/[0.02] overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-tight text-secondary uppercase tracking-widest">
                {stepNumber}
              </span>
              {badge && (
                <span className="text-[10px] font-mono-tight px-2 py-0.2 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                  {badge}
                </span>
              )}
            </div>
            <h3 className="font-display text-base sm:text-lg font-semibold text-paper truncate mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-mist-2 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {isOpen && <div className="p-4 sm:p-6 border-t border-(--line) space-y-5 animate-fade-in">{children}</div>}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm text-mist-1">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        {helperText && <span className="text-[11px] font-mono-tight text-mist-2">{helperText}</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
  helperText?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm text-mist-1">{label}</label>
        {helperText && <span className="text-[11px] font-mono-tight text-mist-2">{helperText}</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none leading-relaxed"
      />
    </div>
  );
}

export default function BrandIdentityFields({ value, onChange }: BrandIdentityFieldsProps) {
  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    strategy: false,
    logo: true,
    colors: true,
    typography: false,
    graphic: false,
    applications: true,
    gallery: false,
    outcome: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
</div></div>);
}