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
  };

  // Safe normalized state
  const data: BrandIdentityCaseStudy = {
    case_study_type: 'Brand Identity',
    brand_introduction: value.brand_introduction || '',
    brand_positioning: value.brand_positioning || '',
    industry: value.industry || '',
    target_audience: value.target_audience || '',
    brand_personality: value.brand_personality || '',
    brand_objectives: value.brand_objectives || '',
    brand_story: value.brand_story || '',
    overview_image: value.overview_image || '',

    brand_challenge: value.brand_challenge || '',
    creative_objectives: value.creative_objectives || '',
    creative_direction: value.creative_direction || '',
    visual_inspiration: value.visual_inspiration || '',
    brand_attributes: value.brand_attributes || '',
    strategy_gallery: value.strategy_gallery || [],

    primary_logo: value.primary_logo || '',
    logo_symbol: value.logo_symbol || '',
    secondary_logo: value.secondary_logo || '',
    horizontal_logo: value.horizontal_logo || '',
    monochrome_logo: value.monochrome_logo || '',
    logo_concept_description: value.logo_concept_description || '',
    logo_variations_gallery: value.logo_variations_gallery || [],

    color_palette: value.color_palette || [],
    typography_system: value.typography_system || [],

    graphic_elements_description: value.graphic_elements_description || '',
    brand_patterns: value.brand_patterns || [],
    decorative_elements: value.decorative_elements || [],
    gradient_treatments: value.gradient_treatments || [],
    photography_direction: value.photography_direction || '',
    graphic_elements_gallery: value.graphic_elements_gallery || [],

    brand_applications: value.brand_applications || [],
    brand_gallery: value.brand_gallery || [],
    gallery_layout: value.gallery_layout || 'Editorial Grid',

    design_outcome: value.design_outcome || '',
    project_impact: value.project_impact || '',
    key_learnings: value.key_learnings || '',
    personal_reflection: value.personal_reflection || '',
    closing_image: value.closing_image || '',

    next_project_slug: value.next_project_slug || '',
  };

  const update = <K extends keyof BrandIdentityCaseStudy>(key: K, val: BrandIdentityCaseStudy[K]) => {
    onChange({ ...data, [key]: val });
  };

  /* ─────────────────────────────────────────────────────────────
     COLOR PALETTE HELPERS
     ───────────────────────────────────────────────────────────── */
  const addColor = () => {
    const newColor: BrandColor = {
      id: `col_${Date.now()}`,
      name: 'New Brand Color',
      hex: '#8000FF',
      rgb: 'rgb(128, 0, 255)',
      classification: 'Primary',
      usage: 'Primary brand touchpoints',
    };
    update('color_palette', [...data.color_palette, newColor]);
  };

  const updateColor = (id: string, patch: Partial<BrandColor>) => {
    const updated = data.color_palette.map((c) => {
      if (c.id !== id) return c;
      const merged = { ...c, ...patch };
      if (patch.hex) {
        merged.rgb = hexToRgb(patch.hex);
      }
      return merged;
    });
    update('color_palette', updated);
  };

  const removeColor = (id: string) => {
    update('color_palette', data.color_palette.filter((c) => c.id !== id));
  };

  const moveColor = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= data.color_palette.length) return;
    const items = [...data.color_palette];
    const temp = items[idx];
    items[idx] = items[targetIdx];
    items[targetIdx] = temp;
    update('color_palette', items);
  };

  /* ─────────────────────────────────────────────────────────────
     TYPOGRAPHY SYSTEM HELPERS
     ───────────────────────────────────────────────────────────── */
  const addTypography = () => {
    const newFont: BrandTypography = {
      id: `typ_${Date.now()}`,
      font_name: 'Cormorant Garamond',
      font_role: 'Heading',
      weight: 'Bold 700',
      usage: 'Luxury headline titles and packaging crests',
      specimen_image: '',
    };
    update('typography_system', [...data.typography_system, newFont]);
  };

  const updateTypography = (id: string, patch: Partial<BrandTypography>) => {
    update(
      'typography_system',
      data.typography_system.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  };

  const removeTypography = (id: string) => {
    update('typography_system', data.typography_system.filter((t) => t.id !== id));
  };

  /* ─────────────────────────────────────────────────────────────
     BRAND APPLICATIONS HELPERS
     ───────────────────────────────────────────────────────────── */
  const addApplication = (cat?: BrandApplicationCategory) => {
    const newApp: BrandApplication = {
      id: `app_${Date.now()}`,
      title: cat ? `${cat} Mockup` : 'Product Packaging Jar',
      category: cat || 'Product Packaging',
      description: 'High-resolution tactile application mockup showcasing brand consistency.',
      primary_image: '',
      additional_images: [],
      layout_preference: 'hero',
      display_order: data.brand_applications.length + 1,
      is_visible: true,
    };
    update('brand_applications', [...data.brand_applications, newApp]);
  };

  const updateApplication = (id: string, patch: Partial<BrandApplication>) => {
    update(
      'brand_applications',
      data.brand_applications.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  const removeApplication = (id: string) => {
    update('brand_applications', data.brand_applications.filter((a) => a.id !== id));
  };

  const duplicateApplication = (id: string) => {
    const target = data.brand_applications.find((a) => a.id === id);
    if (!target) return;
    const clone: BrandApplication = {
      ...target,
      id: `app_${Date.now()}`,
      title: `${target.title} (Copy)`,
      display_order: data.brand_applications.length + 1,
    };
    update('brand_applications', [...data.brand_applications, clone]);
  };

  const moveApplication = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= data.brand_applications.length) return;
    const items = [...data.brand_applications];
    const temp = items[idx];
    items[idx] = items[targetIdx];
    items[targetIdx] = temp;
    // re-assign display orders
    items.forEach((item, i) => {
      item.display_order = i + 1;
    });
    update('brand_applications', items);
  };

  /* ─────────────────────────────────────────────────────────────
     GALLERY HELPERS
     ───────────────────────────────────────────────────────────── */
  const addGalleryItem = () => {
    const newItem: BrandGalleryItem = {
      id: `gal_${Date.now()}`,
      image_url: '',
      caption: '',
      description: '',
      display_order: data.brand_gallery.length + 1,
    };
    update('brand_gallery', [...data.brand_gallery, newItem]);
  };

  const updateGalleryItem = (id: string, patch: Partial<BrandGalleryItem>) => {
    update(
      'brand_gallery',
      data.brand_gallery.map((g) => (g.id === id ? { ...g, ...patch } : g))
    );
  };

  const removeGalleryItem = (id: string) => {
    update('brand_gallery', data.brand_gallery.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Indicator Pill Banner */}
      <div className="p-4 sm:p-5 rounded-2xl glass border border-secondary/30 bg-secondary/5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-secondary/20 text-secondary border border-secondary/30 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-base font-semibold text-paper">
              Brand Identity Case Study Architecture
            </h4>
            <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
              Production Template
            </span>
          </div>
          <p className="text-xs text-mist-1 mt-1 leading-relaxed">
            Tailored specifically for branding, luxury product packaging, logo marks, tactile collateral, color psychology, and custom merchandising mockups.
          </p>
        </div>
      </div>

      {/* ── SECTION 1 — BRAND OVERVIEW ── */}
      <SectionCard
        title="Section 1 — Brand Overview & Positioning"
        stepNumber="01 / Foundation"
        icon={Compass}
        isOpen={openSections.overview}
        onToggle={() => toggleSection('overview')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <TextArea
              label="Brand Introduction"
              value={data.brand_introduction || ''}
              onChange={(val) => update('brand_introduction', val)}
              placeholder="Provide a comprehensive introduction to the brand, its origin, and industry stature..."
              rows={4}
              helperText="Markdown / Rich text supported"
            />
          </div>

          <TextInput
            label="Brand Positioning Statement"
            value={data.brand_positioning || ''}
            onChange={(val) => update('brand_positioning', val)}
            placeholder="e.g. Ultra-luxury organic hair care for discerning modern women"
          />

          <TextInput
            label="Industry / Domain"
            value={data.industry || ''}
            onChange={(val) => update('industry', val)}
            placeholder="e.g. Hair & Beauty, Luxury Cosmetics"
          />

          <TextInput
            label="Brand Personality"
            value={data.brand_personality || ''}
            onChange={(val) => update('brand_personality', val)}
            placeholder="e.g. Premium, Elegant, Modern, Feminine"
          />

          <TextInput
            label="Target Audience"
            value={data.target_audience || ''}
            onChange={(val) => update('target_audience', val)}
            placeholder="e.g. Affluent women seeking clean, high-performance hair care"
          />

          <div className="sm:col-span-2">
            <TextArea
              label="Brand Objectives & Vision"
              value={data.brand_objectives || ''}
              onChange={(val) => update('brand_objectives', val)}
              placeholder="What core commercial, aesthetic, or market goals was this brand built to accomplish?"
              rows={3}
</div></div>);
}