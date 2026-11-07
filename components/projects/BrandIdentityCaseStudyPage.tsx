'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Project, BrandIdentityCaseStudy, BrandApplication } from '@/types/project';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Sun,
  Moon,
  Layers,
  Palette,
  Type,
  Package,
  Award,
  Compass,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import BrandLogoVariationCard from '@/components/projects/BrandLogoVariationCard';
import {
  getLogoStageBackgroundClass,
  getLogoFormatBadge,
} from '@/lib/brand-logo-showcase';
import {
  parsePillList,
  clampLightboxIndex,
  formatColorClassification,
  filterVisibleBrandApplications,
  normalizeBrandApplications,
  normalizeBrandGalleryItems,
  normalizeBrandOutcomeDetails,
  getEffectiveApplicationLayout,
} from '@/lib/brand-identity';


interface BrandIdentityCaseStudyPageProps {
  project: Project;
  nextProject?: Project | null;
}

export default function BrandIdentityCaseStudyPage({
  project,
  nextProject,
}: BrandIdentityCaseStudyPageProps) {
  const brandData = (project.case_study || {}) as any;

  // State for Logo Dark/Light toggle
  const [logoMode, setLogoMode] = useState<'dark' | 'light'>('dark');

  // State for Click-to-copy HEX feedback
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // State for Lightbox Modal
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // State for Logo Asset Lightbox Inspection
  const [inspectingLogo, setInspectingLogo] = useState<{
    url: string;
    title: string;
    role: string;
  } | null>(null);
  const [modalStage, setModalStage] = useState<'dark' | 'light' | 'checkerboard'>('dark');
  const [copiedLogoUrl, setCopiedLogoUrl] = useState(false);

  // Normalized color palette
  const colors = (brandData.color_palette || brandData.colors || []).map((c: any) => ({
    name: c.name || 'Brand Color',
    hex: c.hex || c.hex_code || '#8000ff',
    rgb: c.rgb || c.rgb_value || '',
    classification: c.classification || 'Primary',
    usage: c.usage || '',
  }));

  // Normalized typography
  const typography = (brandData.typography_system || brandData.typography || []).map((t: any) => ({
    font_name: t.font_name || 'Primary Font',
    font_role: t.font_role || t.role || 'Heading',
    weight: t.weight || 'Regular',
    usage: t.usage || '',
    specimen_image: t.specimen_image || '',
  }));

  // Normalized applications (Section 7) & gallery items (Section 8)
  const applications: BrandApplication[] = normalizeBrandApplications(brandData);
  const galleryItems = normalizeBrandGalleryItems(brandData);

  // Normalized strategy image
  const strategyImage =
    (brandData.strategy_gallery && brandData.strategy_gallery[0]) ||
    brandData.strategy_image;

  // Normalized logo concept
  const logoConcept = brandData.logo_concept_description || brandData.logo_concept;

  // Normalized pills
  const personalityTraits = parsePillList(brandData.brand_personality);
  const attributePills = parsePillList(brandData.brand_attributes);

  // Normalized conclusion (Section 9)
  const { outcomeDesc, impactDesc, reflectionDesc } = normalizeBrandOutcomeDetails(brandData);
  const closingImage = brandData.closing_image;


  const allLightboxImages = [
    ...(brandData.overview_image ? [{ url: brandData.overview_image, title: 'Brand Overview' }] : []),
    ...(strategyImage ? [{ url: strategyImage, title: 'Strategic Direction' }] : []),
    ...(brandData.primary_logo ? [{ url: brandData.primary_logo, title: 'Primary Brandmark' }] : []),
    ...applications.flatMap((app: BrandApplication) => [
      {
        url: app.primary_image,
        title: app.title,
        desc: app.description,
      },
      ...(app.additional_images || []).map((extraUrl: string, eIdx: number) => ({
        url: extraUrl,
        title: `${app.title} (View ${eIdx + 2})`,
        desc: app.description,
      })),
    ]),

    ...galleryItems.map((g: any) => ({
      url: g.image_url || g,
      title: g.caption || 'Brand Gallery Asset',
    })),
    ...(closingImage ? [{ url: closingImage, title: 'Brand Showcase' }] : []),
  ].filter((item) => Boolean(item.url));

  const copyToClipboard = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  }, []);

  const openDeliverableLightbox = useCallback(
    (imgUrl: string) => {
      if (!imgUrl) return;
      const index = allLightboxImages.findIndex((item) => item.url === imgUrl);
      if (index !== -1) {
        setLightboxIndex(index);
      }
    },
    [allLightboxImages]
  );


  // Keyboard navigation for Lightbox and Logo Inspection
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        setInspectingLogo(null);
      }
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null && prev < allLightboxImages.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : allLightboxImages.length - 1
        );
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allLightboxImages.length]);

  const yearDisplay = brandData.year || new Date(project.created_at).getFullYear().toString();
  const tagline = brandData.brand_tagline || project.description;

  return (
    <div className="space-y-24 md:space-y-36">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1 — HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-6">
        <Reveal>
          {/* Top Breadcrumb & Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono-tight text-mist-2 hover:text-paper transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-secondary" />
              <span>Back to projects</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-xs font-mono-tight font-medium">
                <Sparkles className="w-3 h-3" />
                Brand Identity Case Study
              </span>
              {brandData.industry && (
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-white/5 text-mist-1 border border-(--line) text-xs font-mono-tight">
                  {brandData.industry}
                </span>
              )}
            </div>
          </div>

          {/* Project Title & Tagline */}
          <div className="max-w-4xl space-y-4 mb-10">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-paper tracking-tight leading-[1.08]">
              {project.title}
            </h1>
            {tagline && (
              <p className="font-display text-xl sm:text-2xl text-accent-soft font-light italic">
                &ldquo;{tagline}&rdquo;
              </p>
            )}
          </div>

          {/* Project Meta Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-12">
            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 text-xs font-mono-tight mb-1.5">
                <Briefcase className="w-3.5 h-3.5 text-secondary" />
                <span>Client / Brand</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-paper truncate">
                {brandData.client || 'Private Client'}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 text-xs font-mono-tight mb-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>My Role</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-paper truncate">
                {project.role || brandData.role || 'Lead Brand Designer'}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 text-xs font-mono-tight mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Year</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-paper">
                {yearDisplay}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 md:p-5 border border-(--line)">
              <div className="flex items-center gap-2 text-mist-2 text-xs font-mono-tight mb-1.5">
                <Clock className="w-3.5 h-3.5 text-accent-soft" />
                <span>Duration</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-paper">
                {project.duration || brandData.duration || '4 weeks'}
              </p>
            </div>
          </div>

          {/* Hero Banner Showcase */}
          {project.cover_image && (
            <div className="relative rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-2xl group">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black/40">
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          )}
        </Reveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2 — BRAND OVERVIEW & POSITIONING
          ───────────────────────────────────────────────────────────── */}
      <section className="relative">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-secondary" />
            <span className="font-mono-tight text-xs uppercase tracking-widest text-secondary">
              01 / Foundation
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-10">
            Brand Overview & Market Positioning
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <GlassCard hover={false} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-mono-tight uppercase text-mist-2 tracking-wider mb-2">
                    Brand Introduction
                  </h3>
                  <p className="text-paper text-base sm:text-lg leading-relaxed font-light">
                    {brandData.brand_introduction || project.description}
                  </p>
                </div>

                {brandData.brand_story && (
                  <div className="pt-6 border-t border-(--line)">
                    <h3 className="text-xs font-mono-tight uppercase text-mist-2 tracking-wider mb-2">
                      Brand Story & Heritage
                    </h3>
                    <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                      {brandData.brand_story}
                    </p>
                  </div>
                )}

                {brandData.brand_objectives && (
                  <div className="pt-6 border-t border-(--line)">
                    <h3 className="text-xs font-mono-tight uppercase text-mist-2 tracking-wider mb-2">
                      Core Brand Objectives
                    </h3>
                    <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                      {brandData.brand_objectives}
                    </p>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Right Column: Strategic Parameters */}
            <div className="lg:col-span-5 space-y-6">
              <GlassCard hover={false} className="p-6 sm:p-8 space-y-6">
                {brandData.brand_positioning && (
                  <div>
                    <h3 className="text-xs font-mono-tight uppercase text-mist-2 tracking-wider mb-2">
                      Market Positioning
                    </h3>
                    <p className="text-paper font-medium text-base">
                      {brandData.brand_positioning}
                    </p>
                  </div>
                )}

                {brandData.target_audience && (
                  <div className="pt-6 border-t border-(--line)">
                    <h3 className="text-xs font-mono-tight uppercase text-mist-2 tracking-wider mb-2">
                      Target Audience
                    </h3>
                    <p className="text-mist-1 text-sm leading-relaxed">
                      {brandData.target_audience}
                    </p>
                  </div>
                )}

                {personalityTraits.length > 0 && (
                  <div className="pt-6 border-t border-(--line)">
                    <h3 className="text-xs font-mono-tight uppercase text-mist-2 tracking-wider mb-3">
                      Brand Personality & Archetype
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalityTraits.map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-mono-tight bg-primary/15 text-accent-soft border border-primary/25"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>

              {brandData.overview_image && (
                <div className="rounded-2xl overflow-hidden glass border border-(--line) p-2">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/30">
                    <Image
                      src={brandData.overview_image}
                      alt="Brand Overview Showcase"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 — BRAND STRATEGY & CREATIVE DIRECTION
          ───────────────────────────────────────────────────────────── */}
      {(brandData.brand_challenge ||
        brandData.creative_direction ||
        brandData.creative_objectives ||
        strategyImage) && (
        <section className="relative">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-primary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-accent-soft">
                02 / Vision
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-10">
              Brand Strategy & Creative Direction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {brandData.brand_challenge && (
                <GlassCard hover={false} className="p-6 sm:p-8 space-y-3">
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-secondary">
                    The Strategic Challenge
                  </span>
                  <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                    {brandData.brand_challenge}
                  </p>
                </GlassCard>
              )}

              {brandData.creative_direction && (
                <GlassCard hover={false} className="p-6 sm:p-8 space-y-3">
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-accent-soft">
                    Creative Direction & Aesthetic
                  </span>
                  <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                    {brandData.creative_direction}
                  </p>
                </GlassCard>
              )}
            </div>

            {attributePills.length > 0 && (
              <div className="p-6 rounded-2xl glass border border-(--line) flex flex-wrap items-center gap-3 mb-8">
                <span className="text-xs font-mono-tight uppercase text-mist-2 mr-2">
                  Key Attributes:
                </span>
                {attributePills.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-(--line) text-paper"
                  >
                    ✦ {attr}
                  </span>
                ))}
              </div>
            )}

            {strategyImage && (
              <div className="rounded-3xl overflow-hidden glass border border-(--line) p-2">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/30">
                  <Image
                    src={strategyImage}
                    alt="Creative Direction & Inspiration Board"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </Reveal>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4 — LOGO IDENTITY SUITE
          ───────────────────────────────────────────────────────────── */}
      {(brandData.primary_logo ||
        brandData.logo_symbol ||
        brandData.secondary_logo ||
        brandData.horizontal_logo ||
        brandData.monochrome_logo) && (
        <section className="relative">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-secondary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-secondary">
                03 / Mark
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper">
                  Logo Identity Suite
                </h2>
                <p className="text-xs sm:text-sm text-mist-2 mt-1">
                  Core mark, responsive orientations, and symbol architecture
                </p>
              </div>

              {/* Interactive Dark/Light Canvas Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-(--line)">
                <button
                  type="button"
                  onClick={() => setLogoMode('dark')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    logoMode === 'dark'
                      ? 'bg-ink text-secondary shadow-md border border-secondary/30'
                      : 'text-mist-2 hover:text-paper'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Canvas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLogoMode('light')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    logoMode === 'light'
                      ? 'bg-white text-ink shadow-md font-semibold'
                      : 'text-mist-2 hover:text-paper'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Canvas</span>
                </button>
              </div>
            </div>

            {/* Primary Logo Showcase Card */}
            {brandData.primary_logo && (
              <div
                className={`rounded-3xl border transition-all duration-500 p-8 sm:p-14 mb-8 flex flex-col items-center justify-center text-center ${
                  logoMode === 'dark'
                    ? 'bg-[#121222] border-(--line) shadow-2xl'
                    : 'bg-[#fafafa] border-white/60 shadow-2xl text-slate-900'
                }`}
              >
                <div
                  onClick={() => {
                    setInspectingLogo({
                      url: brandData.primary_logo,
                      title: 'Primary Brandmark',
                      role: 'Master Lockup',
                    });
                    setModalStage(logoMode);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Inspect Primary Brandmark"
                  className="group relative w-full max-w-md h-48 sm:h-64 flex items-center justify-center cursor-zoom-in rounded-2xl transition-all"
                >
                  <Image
                    src={brandData.primary_logo}
                    alt="Primary Logo"
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-mono-tight border border-white/20 shadow-md">
                      <ZoomIn className="w-3 h-3 text-secondary" />
                      <span>Inspect Master Lockup</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 max-w-lg">
                  <span
                    className={`text-[11px] font-mono-tight uppercase tracking-wider px-3 py-1 rounded-full border ${
                      logoMode === 'dark'
                        ? 'bg-secondary/10 text-secondary border-secondary/25'
                        : 'bg-black/5 text-slate-800 border-black/10'
                    }`}
                  >
                    Primary Brandmark
                  </span>
                  {logoConcept && (
                    <p
                      className={`text-sm sm:text-base mt-4 leading-relaxed ${
                        logoMode === 'dark' ? 'text-mist-1' : 'text-slate-700'
                      }`}
                    >
                      {logoConcept}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Logo Variations Grid with Smart Stage Framing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {brandData.logo_symbol && (
                <BrandLogoVariationCard
                  type="symbol"
                  imageUrl={brandData.logo_symbol}
                  globalMode={logoMode}
                  onInspect={(url, title, role) => {
                    setInspectingLogo({ url, title, role });
                    setModalStage('light');
                  }}
                />
              )}

              {brandData.secondary_logo && (
                <BrandLogoVariationCard
                  type="secondary"
                  imageUrl={brandData.secondary_logo}
                  globalMode={logoMode}
                  onInspect={(url, title, role) => {
                    setInspectingLogo({ url, title, role });
                    setModalStage('light');
                  }}
                />
              )}

              {brandData.horizontal_logo && (
                <BrandLogoVariationCard
                  type="horizontal"
                  imageUrl={brandData.horizontal_logo}
                  globalMode={logoMode}
                  onInspect={(url, title, role) => {
                    setInspectingLogo({ url, title, role });
                    setModalStage('dark');
                  }}
                />
              )}

              {brandData.monochrome_logo && (
                <BrandLogoVariationCard
                  type="monochrome"
                  imageUrl={brandData.monochrome_logo}
                  globalMode={logoMode}
                  onInspect={(url, title, role) => {
                    setInspectingLogo({ url, title, role });
                    setModalStage('light');
                  }}
                />
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 — BRAND COLOR PALETTE
          ───────────────────────────────────────────────────────────── */}
      {colors.length > 0 && (
        <section className="relative">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-primary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-accent-soft">
                04 / Chromatics
              </span>
            </div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper">
                  Brand Color Palette
                </h2>
                <p className="text-xs sm:text-sm text-mist-2 mt-1">
                  Click any HEX code to copy to clipboard
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {colors.map((color: any, idx: number) => {
                const isCopied = copiedHex === color.hex;

                return (
                  <div
                    key={idx}
                    className="glass rounded-2xl overflow-hidden border border-(--line) group hover:border-primary/40 transition-all flex flex-col justify-between"
                  >
                    {/* Swatch Block */}
                    <div
                      className="h-36 sm:h-40 w-full relative transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="absolute top-3 left-3 text-[10px] font-mono-tight uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
                        {color.classification || 'Color'}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-display text-base font-semibold text-paper">
                          {color.name}
                        </h3>
                        {color.usage && (
                          <p className="text-xs text-mist-2 mt-1 line-clamp-2">
                            {color.usage}
                          </p>
                        )}
                      </div>

                      {/* HEX & RGB Click-to-Copy */}
                      <div className="space-y-1.5 pt-3 border-t border-(--line)">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(color.hex)}
                          className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group/btn"
                        >
                          <span className="text-xs font-mono-tight text-paper font-semibold">
                            {color.hex.toUpperCase()}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono-tight text-mist-2 group-hover/btn:text-secondary">
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </span>
                        </button>

                        {color.rgb && (
                          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono-tight text-mist-2">
                            <span>RGB</span>
                            <span>{color.rgb}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6 — TYPOGRAPHY SYSTEM
          ───────────────────────────────────────────────────────────── */}
      {typography.length > 0 && (
        <section className="relative">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-secondary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-secondary">
                05 / Type
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-10">
              Typography Hierarchy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {typography.map((font: any, idx: number) => (
                <GlassCard key={idx} hover={false} className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono-tight uppercase tracking-wider text-secondary">
                        {font.font_role}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-paper mt-1">
                        {font.font_name}
                      </h3>
                    </div>
                    {font.weight && (
                      <span className="text-xs font-mono-tight px-3 py-1 rounded-full bg-white/5 border border-(--line) text-mist-1">
                        {font.weight}
                      </span>
                    )}
                  </div>

                  {/* Visual Type Specimen Box */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-(--line) space-y-3">
                    <p className="text-2xl sm:text-3xl font-display text-paper tracking-tight">
                      Aa Bb Cc Dd Ee Ff Gg 0123
                    </p>
                    <p className="text-xs font-mono-tight text-mist-2 truncate">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ • 0123456789
                    </p>
                  </div>

                  {font.usage && (
                    <p className="text-sm text-mist-1 leading-relaxed">
                      {font.usage}
                    </p>
                  )}

                  {font.specimen_image && (
                    <div className="rounded-xl overflow-hidden glass border border-(--line) p-2">
                      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-black/40">
                        <Image
                          src={font.specimen_image}
                          alt={`${font.font_name} specimen`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7 — GRAPHIC ELEMENTS & PATTERNS
          ───────────────────────────────────────────────────────────── */}
      {(brandData.graphic_elements_description || brandData.art_direction) && (
        <section className="relative">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-primary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-accent-soft">
                06 / Motifs
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-10">
              Graphic Elements & Art Direction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brandData.graphic_elements_description && (
                <GlassCard hover={false} className="p-6 sm:p-8 space-y-3">
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-secondary">
                    Patterns, Motifs & Iconography
                  </span>
                  <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                    {brandData.graphic_elements_description}
                  </p>
                </GlassCard>
              )}

              {brandData.art_direction && (
                <GlassCard hover={false} className="p-6 sm:p-8 space-y-3">
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-accent-soft">
                    Photography & Visual Mood
                  </span>
                  <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                    {brandData.art_direction}
                  </p>
                </GlassCard>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7 — BRAND APPLICATIONS & REAL-WORLD DELIVERABLES
          ───────────────────────────────────────────────────────────── */}
      {applications.length > 0 && (
        <section id="brand-applications" className="relative space-y-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-secondary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-secondary">
                07 / Deliverables
              </span>
            </div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper">
                    Brand Applications & Collateral
                  </h2>
                  <span className="text-[11px] font-mono-tight px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                    {applications.length} Deliverables
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-mist-2 mt-1">
                  Packaging, merchandise, vehicle livery, outdoor signage & digital assets
                </p>
              </div>
            </div>
          </Reveal>

          {applications.map((app, idx) => {
            const layout = getEffectiveApplicationLayout(app.layout_preference);


            return (
              <Reveal key={idx}>
                {layout === 'hero' && (
                  /* Hero Layout: Full-Width Cinematic */
                  <div className="space-y-4">
                    <div
                      onClick={() => openDeliverableLightbox(app.primary_image)}
                      title="Click to view deliverable in fullscreen"
                      className="rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-2xl group cursor-zoom-in"
                    >
                      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black/40">
                        <Image
                          src={app.primary_image}
                          alt={app.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                      <div>
                        <span className="text-xs font-mono-tight uppercase text-secondary">
                          {app.category}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-semibold text-paper mt-0.5">
                          {app.title}
                        </h3>
                      </div>
                      {app.description && (
                        <p className="text-sm text-mist-1 max-w-xl">
                          {app.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {layout === 'split' && (
                  /* Split Layout: 50/50 Editorial */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div
                        onClick={() => openDeliverableLightbox(app.primary_image)}
                        title="Click to view deliverable in fullscreen"
                        className="rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-xl group cursor-zoom-in"
                      >
                        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/40">
                          <Image
                            src={app.primary_image}
                            alt={app.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={`lg:col-span-5 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <span className="inline-flex px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/25 text-xs font-mono-tight">
                        {app.category}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-paper">
                        {app.title}
                      </h3>
                      {app.description && (
                        <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                          {app.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {layout === 'centered' && (
                  /* Centered Layout: Focused Spotlight */
                  <div className="max-w-4xl mx-auto space-y-6 text-center">
                    <div
                      onClick={() => openDeliverableLightbox(app.primary_image)}
                      title="Click to view deliverable in fullscreen"
                      className="rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-2xl group cursor-zoom-in"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/40">
                        <Image
                          src={app.primary_image}
                          alt={app.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-mono-tight uppercase text-secondary">
                        {app.category}
                      </span>
                      <h3 className="font-display text-2xl font-semibold text-paper mt-1">
                        {app.title}
                      </h3>
                      {app.description && (
                        <p className="text-sm text-mist-1 max-w-xl mx-auto mt-2">
                          {app.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {layout === 'editorial' && (
                  /* Editorial Layout: Asymmetric */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                    <div className="lg:col-span-8">
                      <div
                        onClick={() => openDeliverableLightbox(app.primary_image)}
                        title="Click to view deliverable in fullscreen"
                        className="rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-xl group cursor-zoom-in"
                      >
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40">
                          <Image
                            src={app.primary_image}
                            alt={app.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-4 glass rounded-2xl p-6 sm:p-8 border border-(--line) space-y-3">
                      <span className="text-xs font-mono-tight uppercase text-secondary">
                        {app.category}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-paper">
                        {app.title}
                      </h3>
                      {app.description && (
                        <p className="text-sm text-mist-1 leading-relaxed">
                          {app.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {layout === 'wide' && (
                  /* Wide Layout: Expansive */
                  <div className="space-y-4">
                    <div
                      onClick={() => openDeliverableLightbox(app.primary_image)}
                      title="Click to view deliverable in fullscreen"
                      className="rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-2xl group cursor-zoom-in"
                    >
                      <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black/40">
                        <Image
                          src={app.primary_image}
                          alt={app.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <h3 className="font-display text-xl font-semibold text-paper">
                        {app.title}
                      </h3>
                      <span className="text-xs font-mono-tight uppercase text-secondary">
                        {app.category}
                      </span>
                    </div>
                  </div>
                )}

                      <span className="text-xs font-mono-tight text-mist-2">
                        {app.category}
                      </span>
                    </div>
                  </div>
                )}
              </Reveal>
            );
          })}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9 — CURATED BRAND GALLERY & LIGHTBOX
          ───────────────────────────────────────────────────────────── */}
      {galleryItems.length > 0 && (
        <section className="relative">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-primary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-accent-soft">
                08 / Showcase
              </span>
            </div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper">
                  Curated Brand Gallery
                </h2>
                <p className="text-xs sm:text-sm text-mist-2 mt-1">
                  Click any image to view in high-resolution full screen
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item: any, idx: number) => {
                const imgUrl = item.image_url || item;
                const caption = item.caption || 'Brand Gallery Asset';

                return (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className="rounded-2xl overflow-hidden glass border border-(--line) p-2 group cursor-pointer hover:border-primary/50 transition-all shadow-lg"
                  >
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/40">
                      <Image
                        src={imgUrl}
                        alt={caption}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-xs text-paper font-medium truncate">
                            {caption}
                          </p>
                          <Maximize2 className="w-4 h-4 text-secondary shrink-0 ml-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 10 — OUTCOME, IMPACT & REFLECTION
          ───────────────────────────────────────────────────────────── */}
      {(outcomeDesc || impactDesc || reflectionDesc || closingImage) && (
        <section className="relative">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-secondary" />
              <span className="font-mono-tight text-xs uppercase tracking-widest text-secondary">
                09 / Conclusion
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-10">
              Design Outcome & Impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {outcomeDesc && (
                <GlassCard hover={false} className="p-6 sm:p-8 space-y-3">
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-secondary">
                    Deliverable Outcome
                  </span>
                  <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                    {outcomeDesc}
                  </p>
                </GlassCard>
              )}

              {impactDesc && (
                <GlassCard hover={false} className="p-6 sm:p-8 space-y-3">
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-emerald-400">
                    Reception & Strategic Impact
                  </span>
                  <p className="text-mist-1 text-sm sm:text-base leading-relaxed">
                    {impactDesc}
                  </p>
                </GlassCard>
              )}
            </div>

            {reflectionDesc && (
              <GlassCard hover={false} className="p-6 sm:p-8 space-y-3 mb-8">
                <span className="text-xs font-mono-tight uppercase tracking-wider text-accent-soft">
                  Designer Reflection
                </span>
                <p className="text-mist-1 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;{reflectionDesc}&rdquo;
                </p>
              </GlassCard>
            )}

            {closingImage && (
              <div className="rounded-3xl overflow-hidden glass border border-(--line) p-2 shadow-2xl">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40">
                  <Image
                    src={closingImage}
                    alt="Brand Showcase"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </Reveal>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 11 — NEXT PROJECT NAVIGATION & CALL TO ACTION
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 border-t border-(--line)">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Next Project Teaser */}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="glass rounded-2xl p-6 sm:p-8 border border-(--line) hover:border-secondary/50 transition-all group block"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono-tight uppercase text-mist-2">
                    Next Project →
                  </span>
                  <ArrowRight className="w-4 h-4 text-secondary transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-paper group-hover:text-secondary transition-colors">
                  {nextProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-mist-1 line-clamp-2 mt-1">
                  {nextProject.description}
                </p>
              </Link>
            ) : (
              <div className="glass rounded-2xl p-6 sm:p-8 border border-(--line)">
                <span className="text-xs font-mono-tight uppercase text-mist-2 block mb-2">
                  Portfolio Showcase
                </span>
                <h3 className="font-display text-xl font-semibold text-paper">
                  Explore More Projects
                </h3>
                <Link
                  href="/projects"
                  className="text-xs font-mono-tight text-secondary hover:underline mt-2 inline-block"
                >
                  View full archive →
                </Link>
              </div>
            )}

            {/* Direct Commission CTA */}
            <div className="glass rounded-2xl p-6 sm:p-8 border border-(--line) bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono-tight uppercase text-accent-soft block mb-1">
                  Ready to elevate your brand?
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-paper">
                  Let&apos;s build an iconic visual identity
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-xs sm:text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.link/tlezg8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-paper text-xs sm:text-sm font-medium border border-(--line) transition-colors"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 text-mist-2" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FULLSCREEN LIGHTBOX MODAL
          ───────────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && allLightboxImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous image */}
          {allLightboxImages.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setLightboxIndex((prev) =>
                  clampLightboxIndex(prev ?? 0, allLightboxImages.length, -1)
                );
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer hidden sm:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next image */}
          {allLightboxImages.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setLightboxIndex((prev) =>
                  clampLightboxIndex(prev ?? 0, allLightboxImages.length, 1)
                );
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer hidden sm:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image Display */}
          <div className="relative max-w-6xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[75vh]">
              <Image
                src={allLightboxImages[lightboxIndex].url}
                alt={allLightboxImages[lightboxIndex].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-paper text-sm sm:text-base font-medium">
                {allLightboxImages[lightboxIndex].title}
              </p>
              <span className="text-xs font-mono-tight text-mist-2">
                {lightboxIndex + 1} of {allLightboxImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LOGO ASSET INSPECTION LIGHTBOX MODAL
          ───────────────────────────────────────────────────────────── */}
      {inspectingLogo && (
        <div
          data-testid="logo-inspection-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setInspectingLogo(null)}
        >
          {/* Modal Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between gap-4 py-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono-tight bg-secondary/15 text-secondary border border-secondary/25">
                {inspectingLogo.role}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tight bg-white/10 text-mist-1 border border-white/10 uppercase">
                {getLogoFormatBadge(inspectingLogo.url)}
              </span>
              <h3 className="font-display text-base sm:text-lg font-semibold text-white">
                {inspectingLogo.title}
              </h3>
            </div>

            {/* Stage Selector in Modal */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setModalStage('light')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-tight transition-colors cursor-pointer ${
                    modalStage === 'light'
                      ? 'bg-white text-slate-900 font-medium'
                      : 'text-mist-2 hover:text-white'
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setModalStage('dark')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-tight transition-colors cursor-pointer ${
                    modalStage === 'dark'
                      ? 'bg-ink text-secondary font-medium'
                      : 'text-mist-2 hover:text-white'
                  }`}
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setModalStage('checkerboard')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-tight transition-colors cursor-pointer ${
                    modalStage === 'checkerboard'
                      ? 'bg-primary text-white font-medium'
                      : 'text-mist-2 hover:text-white'
                  }`}
                >
                  Grid
                </button>
              </div>

              <button
                type="button"
                onClick={() => setInspectingLogo(null)}
                className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Close inspection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Central Canvas */}
          <div
            className="w-full max-w-4xl flex-1 flex items-center justify-center my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative w-full h-[55vh] sm:h-[65vh] rounded-3xl border flex items-center justify-center p-8 transition-all duration-300 shadow-2xl ${getLogoStageBackgroundClass(
                modalStage
              )}`}
            >
              <div className="relative w-full h-full max-w-xl max-h-96">
                <Image
                  src={inspectingLogo.url}
                  alt={inspectingLogo.title}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
          </div>

          {/* Modal Bottom Actions */}
          <div
            className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-mono-tight text-mist-2">
              Viewing in full resolution • Original aspect ratio preserved
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inspectingLogo.url);
                    setCopiedLogoUrl(true);
                    setTimeout(() => setCopiedLogoUrl(false), 2000);
                  } catch {}
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono-tight transition-colors cursor-pointer"
              >
                {copiedLogoUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Asset URL</span>
                  </>
                )}
              </button>

              <a
                href={inspectingLogo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-mono-tight transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open File</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
