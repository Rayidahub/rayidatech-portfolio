// types/project.ts

export const PROJECT_TYPES = [
  'UI/UX Design',
  'Brand Identity',
  'Web Development',
  'Other / General',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type ProjectStatus = 'draft' | 'published';

/* ─────────────────────────────────────────────────────────────
   UI/UX & PRODUCT CASE STUDY SCHEMA (PRESERVED)
   ───────────────────────────────────────────────────────────── */
export interface CaseStudy {
  client?: string;
  objective?: string;
  target_audience?: string;
  overview_image?: string;
  card_image?: string | null;

  problem?: string;
  business_goals?: string;
  user_goals?: string;
  problem_image?: string;

  research?: string;
  research_image?: string;

  design_process?: string;
  design_process_image?: string;

  design_system?: string;
  design_system_image?: string;

  final_solution?: string;
  final_mobile_image?: string;
  final_desktop_image?: string;

  key_features?: string[];
  key_features_image?: string;

  results?: string;
  results_image?: string;

  reflection?: string;
  reflection_image?: string;

  next_project_slug?: string;
  [key: string]: any;
}

/* ─────────────────────────────────────────────────────────────
   BRAND IDENTITY CASE STUDY SCHEMA (PHASE 3)
   ───────────────────────────────────────────────────────────── */

export type BrandColorClassification =
  | 'Primary'
  | 'Secondary'
  | 'Accent'
  | 'Neutral'
  | 'Background';

export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  rgb?: string;
  classification: BrandColorClassification;
  usage?: string;
}

export type BrandFontRole =
  | 'Display'
  | 'Heading'
  | 'Body'
  | 'Accent'
  | 'Monospace';

export interface BrandTypography {
  id: string;
  font_name: string;
  font_role: BrandFontRole;
  weight: string;
  usage?: string;
  specimen_image?: string;
}

export const BRAND_APPLICATION_CATEGORIES = [
  'Product Packaging',
  'Shopping Bags',
  'Merchandise',
  'Stationery',
  'Transportation',
  'Outdoor Advertising',
  'Digital Advertising',
  'Social Media',
  'Environmental Branding',
  'Other',
] as const;

export type BrandApplicationCategory = (typeof BRAND_APPLICATION_CATEGORIES)[number];

export type BrandApplicationLayout =
  | 'hero'       // full-width prominent showcase
  | 'split'      // two-column image and description
  | 'centered'   // large centered product presentation
  | 'editorial'  // alternating magazine spread
  | 'wide';      // wide cinematic landscape banner

export interface BrandApplication {
  id: string;
  title: string;
  category: BrandApplicationCategory;
  description?: string;
  primary_image: string;
  additional_images?: string[];
  layout_preference: BrandApplicationLayout;
  display_order: number;
  is_visible: boolean;
}

export interface BrandApplicationPreviewData {
  title: string;
  category: string;
  layout: BrandApplicationLayout;
  description: string;
  imageUrl: string;
  hasImage: boolean;
}

export type BrandGalleryLayout =
  | 'Editorial Grid'
  | 'Masonry'
  | 'Full Width'
  | 'Two Columns';

export interface BrandGalleryItem {
  id: string;
  image_url: string;
  caption?: string;
  description?: string;
  display_order: number;
}

export interface BrandIdentityCaseStudy {
  case_study_type: 'Brand Identity';

  // Section 1 — Brand Overview
  brand_introduction?: string;
  brand_positioning?: string;
  industry?: string;
  target_audience?: string;
  brand_personality?: string;
  brand_objectives?: string;
  brand_story?: string;
  overview_image?: string;
  card_image?: string | null;

  // Section 2 — Brand Strategy
  brand_challenge?: string;
  creative_objectives?: string;
  creative_direction?: string;
  visual_inspiration?: string;
  brand_attributes?: string;
  strategy_gallery?: string[];

  // Section 3 — Logo Identity
  primary_logo?: string;
  logo_symbol?: string;
  secondary_logo?: string;
  horizontal_logo?: string;
  monochrome_logo?: string;
  logo_concept_description?: string;
  logo_variations_gallery?: string[];

  // Section 4 — Brand Color Palette
  color_palette: BrandColor[];

  // Section 5 — Typography System
  typography_system: BrandTypography[];

  // Section 6 — Graphic Elements
  graphic_elements_description?: string;
  brand_patterns?: string[];
  decorative_elements?: string[];
  gradient_treatments?: string[];
  photography_direction?: string;
  graphic_elements_gallery?: string[];

  // Section 7 — Brand Applications (Dynamic & Repeatable)
  brand_applications: BrandApplication[];
  applications?: BrandApplication[];
  deliverables?: BrandApplication[];


  // Section 8 — Brand Gallery
  brand_gallery: BrandGalleryItem[];
  gallery_layout: BrandGalleryLayout;

  // Section 9 — Outcome & Reflection
  design_outcome?: string;
  project_impact?: string;
  key_learnings?: string;
  personal_reflection?: string;
  closing_image?: string;

  // Shared meta fields
  client?: string;
  year?: string;
  next_project_slug?: string;
  [key: string]: any;
}

/* ─────────────────────────────────────────────────────────────
   PROJECT ENVELOPE
   ───────────────────────────────────────────────────────────── */
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string;
  card_image?: string | null;
  featured: boolean;
  created_at: string;
  tags?: string[];
  role?: string;
  duration?: string;
  link?: string;
  project_type?: ProjectType;
  service_category?: string;
  client?: string;
  year?: string;
  published?: boolean;
  status?: ProjectStatus;
  case_study?: CaseStudy | BrandIdentityCaseStudy | any;
}

export interface ProjectCoverPreviewProps {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  cardImage?: string | null;
  projectType?: string;
  status?: ProjectStatus;
  isPublished?: boolean;
}

export interface ProjectClassificationSummary {
  projectType: ProjectType;
  category: string;
  isConfigured: boolean;
  summaryText: string;
}
