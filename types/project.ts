// types/project.ts

export const PROJECT_TYPES = [
  'UI/UX Design',
  'Brand Identity',
  'Web Development',
  'Other / General',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

/* ─────────────────────────────────────────────────────────────
   UI/UX & PRODUCT CASE STUDY SCHEMA (PRESERVED)
   ───────────────────────────────────────────────────────────── */
export interface CaseStudy {
  client?: string;
  objective?: string;
  target_audience?: string;
  overview_image?: string;

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
export interface CaseStudy { [key: string]: any; }
