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
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';

interface BrandIdentityCaseStudyPageProps {
  project: Project;
  nextProject?: Project | null;
}

function parsePills(val?: string | string[]): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val
    .split(/[,•\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
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

  // Normalized applications & gallery items
  const applications: BrandApplication[] = (brandData.applications || []).filter(
    (app: any) => app && app.is_visible !== false && app.primary_image
  );
  const galleryItems = brandData.gallery_items || brandData.curated_gallery || [];

  // Normalized strategy image
  const strategyImage =
    (brandData.strategy_gallery && brandData.strategy_gallery[0]) ||
    brandData.strategy_image;

  // Normalized logo concept
  const logoConcept = brandData.logo_concept_description || brandData.logo_concept;

  // Normalized pills
  const personalityTraits = parsePills(brandData.brand_personality);
  const attributePills = parsePills(brandData.brand_attributes);

  // Normalized conclusion
  const outcomeDesc = brandData.outcome_description || brandData.outcome;
  const impactDesc = brandData.impact_description || brandData.impact;
  const reflectionDesc = brandData.personal_reflection || brandData.reflection;
  const closingImage = brandData.closing_image;

  const allLightboxImages = [
    ...(brandData.overview_image ? [{ url: brandData.overview_image, title: 'Brand Overview' }] : []),
    ...(strategyImage ? [{ url: strategyImage, title: 'Strategic Direction' }] : []),
    ...(brandData.primary_logo ? [{ url: brandData.primary_logo, title: 'Primary Brandmark' }] : []),
    ...applications.map((app: BrandApplication) => ({
      url: app.primary_image,
      title: app.title,
      desc: app.description,
    })),
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

  // Keyboard navigation for Lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
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
</div>);
}