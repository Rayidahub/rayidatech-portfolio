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
import BrandApplicationCardPreview from '@/components/admin/BrandApplicationCardPreview';
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
import { hexToRgb, isValidHex } from '@/lib/brand-identity';

interface BrandIdentityFieldsProps {
  value: Partial<BrandIdentityCaseStudy>;
  onChange: (value: BrandIdentityCaseStudy) => void;
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
        merged.rgb = hexToRgb(patch.hex) ?? undefined;
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
            />
          </div>

          <div className="sm:col-span-2">
            <TextArea
              label="Brand Story"
              value={data.brand_story || ''}
              onChange={(val) => update('brand_story', val)}
              placeholder="The founder's journey, heritage inspiration, or unique origin narrative..."
              rows={3}
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Brand Overview Hero Visual"
              value={data.overview_image || ''}
              onChange={(url) => update('overview_image', url)}
              folder="projects"
              description="High-resolution visual banner introducing the brand atmosphere"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── SECTION 2 — BRAND STRATEGY ── */}
      <SectionCard
        title="Section 2 — Brand Strategy & Creative Direction"
        stepNumber="02 / Strategy"
        icon={Layers}
        isOpen={openSections.strategy}
        onToggle={() => toggleSection('strategy')}
      >
        <div className="space-y-4">
          <TextArea
            label="The Brand Challenge"
            value={data.brand_challenge || ''}
            onChange={(val) => update('brand_challenge', val)}
            placeholder="What aesthetic clutter, market competition, or branding hurdle needed solving?"
            rows={3}
          />

          <TextArea
            label="Creative Objectives"
            value={data.creative_objectives || ''}
            onChange={(val) => update('creative_objectives', val)}
            placeholder="Specific design milestones to elevate brand trust and consumer perception..."
            rows={3}
          />

          <TextArea
            label="Creative Direction & Art Direction"
            value={data.creative_direction || ''}
            onChange={(val) => update('creative_direction', val)}
            placeholder="Art direction mood, compositional rules, lighting style, and architectural balance..."
            rows={3}
          />

          <TextInput
            label="Visual Inspiration & Moodboard Notes"
            value={data.visual_inspiration || ''}
            onChange={(val) => update('visual_inspiration', val)}
            placeholder="e.g. Modernist French cosmetics packaging fused with sculptural African botanical textures"
          />

          <TextInput
            label="Core Brand Attributes (comma-separated)"
            value={data.brand_attributes || ''}
            onChange={(val) => update('brand_attributes', val)}
            placeholder="e.g. Regal, Minimalist, Radiant, Organic, Unapologetic"
          />
        </div>
      </SectionCard>

      {/* ── SECTION 3 — LOGO IDENTITY ── */}
      <SectionCard
        title="Section 3 — Logo Identity System"
        stepNumber="03 / Mark"
        icon={Sparkles}
        badge="Core Identity"
        isOpen={openSections.logo}
        onToggle={() => toggleSection('logo')}
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-(--line) space-y-4">
            <ImageUploadField
              label="Primary Brand Logo *"
              value={data.primary_logo || ''}
              onChange={(url) => update('primary_logo', url)}
              folder="projects"
              description="Master logo lockup (SVG, PNG with transparent background, or high-res JPG)"
            />

            {data.primary_logo && (
              <div className="p-4 rounded-xl border border-(--line) bg-ink/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-paper">Primary Logo Armed</p>
                    <p className="text-[11px] text-mist-2">Original proportions preserved</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                    <img src={data.primary_logo} alt="Dark preview" className="max-h-8 max-w-24 object-contain" />
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-black/10 flex items-center justify-center">
                    <img src={data.primary_logo} alt="Light preview" className="max-h-8 max-w-24 object-contain" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadField
              label="Logo Symbol / Monogram"
              value={data.logo_symbol || ''}
              onChange={(url) => update('logo_symbol', url)}
              folder="projects"
              description="Standalone icon, crest, or monogram mark"
            />

            <ImageUploadField
              label="Secondary / Stacked Logo"
              value={data.secondary_logo || ''}
              onChange={(url) => update('secondary_logo', url)}
              folder="projects"
              description="Alternative vertical or badge layout"
            />

            <ImageUploadField
              label="Horizontal Logo"
              value={data.horizontal_logo || ''}
              onChange={(url) => update('horizontal_logo', url)}
              folder="projects"
              description="Wide horizontal lockup for website headers and signage"
            />

            <ImageUploadField
              label="Monochrome / Watermark Logo"
              value={data.monochrome_logo || ''}
              onChange={(url) => update('monochrome_logo', url)}
              folder="projects"
              description="Single-color black/white version for stamping and embossing"
            />
          </div>

          <TextArea
            label="Logo Concept Description & Symbology"
            value={data.logo_concept_description || ''}
            onChange={(val) => update('logo_concept_description', val)}
            placeholder="Describe the geometric construction, typography customization, and hidden brand symbology in the mark..."
            rows={4}
          />
        </div>
      </SectionCard>

      {/* ── SECTION 4 — BRAND COLOR PALETTE ── */}
      <SectionCard
        title={`Section 4 — Brand Color Palette (${data.color_palette.length} Colors)`}
        stepNumber="04 / Color"
        icon={Palette}
        isOpen={openSections.colors}
        onToggle={() => toggleSection('colors')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-mist-2">
              Add colors with HEX codes. RGB is automatically derived with live contrast preview.
            </p>
            <button
              type="button"
              onClick={addColor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Brand Color</span>
            </button>
          </div>

          {data.color_palette.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-(--line) text-center space-y-2">
              <Palette className="w-8 h-8 text-mist-2 mx-auto" />
              <p className="text-xs text-mist-1">No brand colors added yet.</p>
              <button
                type="button"
                onClick={addColor}
                className="text-xs text-secondary hover:underline cursor-pointer"
              >
                + Add your first brand swatch
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {data.color_palette.map((color, idx) => (
                <div
                  key={color.id}
                  className="p-4 rounded-xl border border-(--line) bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Swatch preview */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl border border-white/20 shadow-md shrink-0 flex items-center justify-center text-xs font-mono font-bold"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="space-y-1 min-w-0">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => updateColor(color.id, { name: e.target.value })}
                        placeholder="Color Name"
                        className="bg-transparent font-semibold text-sm text-paper focus:outline-none focus:underline"
                      />
                      <div className="flex items-center gap-2 text-[11px] font-mono-tight text-mist-2">
                        <span>{color.hex.toUpperCase()}</span>
                        <span>•</span>
                        <span>{color.rgb || hexToRgb(color.hex)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 md:max-w-xl">
                    <input
                      type="text"
                      value={color.hex}
                      onChange={(e) => updateColor(color.id, { hex: e.target.value })}
                      placeholder="#8000FF"
                      className="bg-white/5 border border-(--line) rounded-lg px-2.5 py-1.5 text-xs text-paper font-mono-tight focus:outline-none focus:border-primary/50"
                    />

                    <select
                      value={color.classification}
                      onChange={(e) =>
                        updateColor(color.id, {
                          classification: e.target.value as BrandColorClassification,
                        })
                      }
                      className="bg-[#16162a] border border-(--line) rounded-lg px-2.5 py-1.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                    >
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Accent">Accent</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Background">Background</option>
                    </select>

                    <input
                      type="text"
                      value={color.usage || ''}
                      onChange={(e) => updateColor(color.id, { usage: e.target.value })}
                      placeholder="e.g. Jars, logo, primary button"
                      className="bg-white/5 border border-(--line) rounded-lg px-2.5 py-1.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  {/* Ordering & deletion */}
                  <div className="flex items-center gap-1 shrink-0 justify-end">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveColor(idx, -1)}
                      className="p-1.5 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.color_palette.length - 1}
                      onClick={() => moveColor(idx, 1)}
                      className="p-1.5 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeColor(color.id)}
                      className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Color"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── SECTION 5 — TYPOGRAPHY SYSTEM ── */}
      <SectionCard
        title={`Section 5 — Typography System (${data.typography_system.length} Typefaces)`}
        stepNumber="05 / Typography"
        icon={Type}
        isOpen={openSections.typography}
        onToggle={() => toggleSection('typography')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-mist-2">
              Define primary display, editorial serif, or body typefaces with roles and specimen sheets.
            </p>
            <button
              type="button"
              onClick={addTypography}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Typeface</span>
            </button>
          </div>

          {data.typography_system.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-(--line) text-center space-y-2">
              <Type className="w-8 h-8 text-mist-2 mx-auto" />
              <p className="text-xs text-mist-1">No typography specimens added yet.</p>
              <button
                type="button"
                onClick={addTypography}
                className="text-xs text-secondary hover:underline cursor-pointer"
              >
                + Add primary typeface
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.typography_system.map((font) => (
                <div
                  key={font.id}
                  className="p-4 sm:p-5 rounded-2xl border border-(--line) bg-white/[0.02] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tight text-secondary uppercase">
                      {font.font_role} Font
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTypography(font.id)}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <TextInput
                      label="Font Name"
                      value={font.font_name}
                      onChange={(val) => updateTypography(font.id, { font_name: val })}
                      placeholder="e.g. Cormorant Garamond"
                    />

                    <div>
                      <label className="block text-sm text-mist-1 mb-1.5">Font Role</label>
                      <select
                        value={font.font_role}
                        onChange={(e) =>
                          updateTypography(font.id, { font_role: e.target.value as BrandFontRole })
                        }
                        className="w-full bg-[#16162a] border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper focus:outline-none focus:border-primary/50"
                      >
                        <option value="Display">Display</option>
                        <option value="Heading">Heading</option>
                        <option value="Body">Body</option>
                        <option value="Accent">Accent</option>
                        <option value="Monospace">Monospace</option>
                      </select>
                    </div>

                    <TextInput
                      label="Weight / Style"
                      value={font.weight}
                      onChange={(val) => updateTypography(font.id, { weight: val })}
                      placeholder="e.g. Bold 700 / Italic"
                    />
                  </div>

                  <TextInput
                    label="Usage Description"
                    value={font.usage || ''}
                    onChange={(val) => updateTypography(font.id, { usage: val })}
                    placeholder="e.g. Master logo typography, perfume bottle labels, packaging titles"
                  />

                  <ImageUploadField
                    label="Typography Specimen Image"
                    value={font.specimen_image || ''}
                    onChange={(url) => updateTypography(font.id, { specimen_image: url })}
                    folder="projects"
                    description="Upload alphabet character specimen or font specimen card"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── SECTION 6 — GRAPHIC ELEMENTS ── */}
      <SectionCard
        title="Section 6 — Graphic Elements, Patterns & Art Direction"
        stepNumber="06 / Assets"
        icon={Layers}
        isOpen={openSections.graphic}
        onToggle={() => toggleSection('graphic')}
      >
        <div className="space-y-4">
          <TextArea
            label="Graphic Elements Narrative"
            value={data.graphic_elements_description || ''}
            onChange={(val) => update('graphic_elements_description', val)}
            placeholder="Describe the secondary visual motifs, geometric accents, foils, or embossing textures..."
            rows={3}
          />

          <TextArea
            label="Photography Direction"
            value={data.photography_direction || ''}
            onChange={(val) => update('photography_direction', val)}
            placeholder="Editorial lighting, clean studio backdrops, macro product shots, skin texture warmth..."
            rows={3}
          />
        </div>
      </SectionCard>

      {/* ── SECTION 7 — BRAND APPLICATIONS (REPEATABLE) ── */}
      <SectionCard
        title={`Section 7 — Brand Applications (${data.brand_applications.length} Deliverables)`}
        stepNumber="07 / Mockups"
        icon={Package}
        badge="Repeatable"
        isOpen={openSections.applications}
        onToggle={() => toggleSection('applications')}
      >
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-(--line)">
            <div>
              <h4 className="text-sm font-semibold text-paper">Dynamic Deliverable Suite</h4>
              <p className="text-xs text-mist-2">
                Add packaging jars, shopping bags, polo shirts, motorcycles, billboards, and social templates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => addApplication('Product Packaging')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper text-xs border border-(--line) cursor-pointer"
              >
                + Packaging
              </button>
              <button
                type="button"
                onClick={() => addApplication('Shopping Bags')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper text-xs border border-(--line) cursor-pointer"
              >
                + Shopping Bag
              </button>
              <button
                type="button"
                onClick={() => addApplication('Merchandise')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper text-xs border border-(--line) cursor-pointer"
              >
                + Polo / Apparel
              </button>
              <button
                type="button"
                onClick={() => addApplication('Transportation')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper text-xs border border-(--line) cursor-pointer"
              >
                + Transport
              </button>
              <button
                type="button"
                onClick={() => addApplication('Outdoor Advertising')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper text-xs border border-(--line) cursor-pointer"
              >
                + Billboard
              </button>
              <button
                type="button"
                onClick={() => addApplication('Digital Advertising')}
                className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-xs cursor-pointer"
              >
                + Custom Mockup
              </button>
            </div>
          </div>

          {data.brand_applications.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-(--line) text-center space-y-3">
              <Package className="w-10 h-10 text-mist-2 mx-auto" />
              <h4 className="text-sm font-semibold text-paper">No Brand Applications Added Yet</h4>
              <p className="text-xs text-mist-2 max-w-md mx-auto">
                Brand applications bring the identity to life across packaging, shopping bags, polo shirts, delivery vehicles, and city billboards.
              </p>
              <button
                type="button"
                onClick={() => addApplication('Product Packaging')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Brand Deliverable</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.brand_applications.map((app, idx) => (
                <div
                  key={app.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    app.is_visible
                      ? 'border-(--line) bg-white/[0.02]'
                      : 'border-white/5 bg-white/[0.005] opacity-60'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-(--line)/50 mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20 text-secondary text-xs font-mono font-bold shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-paper truncate">
                        {app.title || 'Untitled Application'}
                      </span>
                      <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-white/5 text-mist-2 border border-white/5">
                        {app.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateApplication(app.id, { is_visible: !app.is_visible })}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          app.is_visible
                            ? 'border-(--line) text-secondary bg-secondary/10'
                            : 'border-white/5 text-mist-2 hover:text-paper'
                        }`}
                        title={app.is_visible ? 'Visible on public site' : 'Hidden from public'}
                      >
                        {app.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => duplicateApplication(app.id)}
                        className="p-1.5 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
                        title="Duplicate Application"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveApplication(idx, -1)}
                        className="p-1.5 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/5 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === data.brand_applications.length - 1}
                        onClick={() => moveApplication(idx, 1)}
                        className="p-1.5 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/5 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeApplication(app.id)}
                        className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Application Title *"
                      value={app.title}
                      onChange={(val) => updateApplication(app.id, { title: val })}
                      placeholder="e.g. Hair Care Cream Jar Luxury Mockup"
                    />

                    <div>
                      <label className="block text-sm text-mist-1 mb-1.5">Deliverable Category</label>
                      <select
                        value={app.category}
                        onChange={(e) =>
                          updateApplication(app.id, {
                            category: e.target.value as BrandApplicationCategory,
                          })
                        }
                        className="w-full bg-[#16162a] border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper focus:outline-none focus:border-primary/50"
                      >
                        {BRAND_APPLICATION_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-mist-1 mb-1.5">Layout Style on Public Page</label>
                      <select
                        value={app.layout_preference}
                        onChange={(e) =>
                          updateApplication(app.id, {
                            layout_preference: e.target.value as BrandApplicationLayout,
                          })
                        }
                        className="w-full bg-[#16162a] border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper focus:outline-none focus:border-primary/50"
                      >
                        <option value="hero">Hero (Full-width showcase)</option>
                        <option value="split">Split (Two columns with text)</option>
                        <option value="centered">Centered (Large focused product)</option>
                        <option value="editorial">Editorial (Magazine layout)</option>
                        <option value="wide">Wide (Cinematic landscape)</option>
                      </select>
                    </div>

                    <TextInput
                      label="Short Context Note"
                      value={app.description || ''}
                      onChange={(val) => updateApplication(app.id, { description: val })}
                      placeholder="e.g. Custom purple glass finish with gold foil logo crest"
                    />

                    <div className="sm:col-span-2">
                      <ImageUploadField
                        label="Primary Deliverable Mockup Image *"
                        value={app.primary_image}
                        onChange={(url) => updateApplication(app.id, { primary_image: url })}
                        folder="projects"
                        description="Upload high-res mockup render from device or paste direct URL"
                      />
                    </div>

                    {/* Live Public Page Deliverable Preview */}
                    <div className="sm:col-span-2">
                      <BrandApplicationCardPreview
                        title={app.title}
                        category={app.category}
                        layout={app.layout_preference || 'split'}
                        description={app.description}
                        imageUrl={app.primary_image}
                        onLayoutChange={(newLayout) =>
                          updateApplication(app.id, { layout_preference: newLayout })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── SECTION 8 — BRAND GALLERY ── */}
      <SectionCard
        title={`Section 8 — Brand Curated Gallery (${data.brand_gallery.length} Images)`}
        stepNumber="08 / Gallery"
        icon={ImageIcon}
        isOpen={openSections.gallery}
        onToggle={() => toggleSection('gallery')}
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-mono-tight text-mist-2 uppercase mb-1">
                Gallery Layout
              </label>
              <select
                value={data.gallery_layout}
                onChange={(e) => update('gallery_layout', e.target.value as BrandGalleryLayout)}
                className="bg-[#16162a] border border-(--line) rounded-lg px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-primary/50"
              >
                <option value="Editorial Grid">Editorial Grid</option>
                <option value="Masonry">Masonry</option>
                <option value="Two Columns">Two Columns</option>
                <option value="Full Width">Full Width</option>
              </select>
            </div>

            <button
              type="button"
              onClick={addGalleryItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Gallery Image</span>
            </button>
          </div>

          {data.brand_gallery.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-(--line) text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-mist-2 mx-auto" />
              <p className="text-xs text-mist-1">No additional gallery images added.</p>
              <button
                type="button"
                onClick={addGalleryItem}
                className="text-xs text-secondary hover:underline cursor-pointer"
              >
                + Add first gallery image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.brand_gallery.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-(--line) bg-white/[0.02] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono-tight text-secondary">
                      Slide 0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(item.id)}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <ImageUploadField
                    label="Gallery Image"
                    value={item.image_url}
                    onChange={(url) => updateGalleryItem(item.id, { image_url: url })}
                    folder="projects"
                    description="Upload photo or paste URL"
                  />

                  <TextInput
                    label="Caption"
                    value={item.caption || ''}
                    onChange={(val) => updateGalleryItem(item.id, { caption: val })}
                    placeholder="e.g. Unboxing presentation"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── SECTION 9 — OUTCOME & REFLECTION ── */}
      <SectionCard
        title="Section 9 — Design Outcome & Reflection"
        stepNumber="09 / Reflection"
        icon={Award}
        isOpen={openSections.outcome}
        onToggle={() => toggleSection('outcome')}
      >
        <div className="space-y-4">
          <TextArea
            label="Design Outcome"
            value={data.design_outcome || ''}
            onChange={(val) => update('design_outcome', val)}
            placeholder="Authentic outcome achieved (e.g. A cohesive, high-end visual language deployed across packaging, apparel, and digital advertising)..."
            rows={4}
          />

          <TextArea
            label="Project Impact & Brand Reception"
            value={data.project_impact || ''}
            onChange={(val) => update('project_impact', val)}
            placeholder="Client feedback and brand recognition unlocked..."
            rows={3}
          />

          <TextArea
            label="Key Learnings & Creative Takeaways"
            value={data.key_learnings || ''}
            onChange={(val) => update('key_learnings', val)}
            placeholder="Lessons learned in color separation, gold foil stamping, and packaging substrates..."
            rows={3}
          />

          <TextArea
            label="Personal Reflection"
            value={data.personal_reflection || ''}
            onChange={(val) => update('personal_reflection', val)}
            placeholder="Designer's reflection on crafting an enduring luxury aesthetic..."
            rows={3}
          />

          <ImageUploadField
            label="Closing Visual / Signature Mockup"
            value={data.closing_image || ''}
            onChange={(url) => update('closing_image', url)}
            folder="projects"
            description="Final hero image closing the case study"
          />

          <TextInput
            label="Next Project Slug Link"
            value={data.next_project_slug || ''}
            onChange={(val) => update('next_project_slug', val)}
            placeholder="e.g. flavorease"
            helperText="Slug of the next project to suggest at the bottom"
          />
        </div>
      </SectionCard>
    </div>
  );
}

