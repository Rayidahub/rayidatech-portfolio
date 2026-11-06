// lib/brand-application-preview.ts
import { BrandApplication, BrandApplicationLayout, BrandApplicationPreviewData } from '@/types/project'

/**
 * Returns a human-friendly display name for a brand application layout.
 */
export function getLayoutDisplayName(layout?: string | null): string {
  switch (layout) {
    case 'hero':
      return 'Hero Showcase'
    case 'centered':
      return 'Focused Spotlight'
    case 'editorial':
      return 'Magazine Editorial'
    case 'wide':
      return 'Cinematic Panoramic'
    case 'split':
    default:
      return 'Split Columns'
  }
}

/**
 * Returns a short description of the layout presentation behavior on the public page.
 */
export function getLayoutDescription(layout?: string | null): string {
  switch (layout) {
    case 'hero':
      return 'Full-width cinematic banner with bottom title and context metadata.'
    case 'centered':
      return 'Spotlight presentation with centered product image and focused typography.'
    case 'editorial':
      return 'Asymmetrical magazine spread pairing large image with elevated glass card.'
    case 'wide':
      return 'Ultra-wide panoramic format (21:9) designed for expansive physical mockups.'
    case 'split':
    default:
      return 'Balanced 50/50 two-column layout alternating image and descriptive copy.'
  }
}

/**
 * Returns the Tailwind CSS aspect ratio class for the preview mockup container.
 */
export function getLayoutAspectRatioClass(layout?: string | null): string {
  switch (layout) {
    case 'hero':
      return 'aspect-[16/9] sm:aspect-[21/9]'
    case 'centered':
      return 'aspect-[16/10]'
    case 'editorial':
      return 'aspect-[16/9]'
    case 'wide':
      return 'aspect-[21/9]'
    case 'split':
    default:
      return 'aspect-[4/3] sm:aspect-[16/10]'
  }
}

/**
 * Returns Tailwind badge accent classes for the layout pill.
 */
export function getLayoutBadgeColor(layout?: string | null): string {
  switch (layout) {
    case 'hero':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    case 'centered':
      return 'bg-secondary/15 text-secondary border-secondary/30'
    case 'editorial':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    case 'wide':
      return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    case 'split':
    default:
      return 'bg-primary/15 text-accent-soft border-primary/30'
  }
}

/**
 * Normalizes a brand application into safe preview data with sensible defaults.
 */
export function formatApplicationPreviewData(
  app?: Partial<BrandApplication> | null
): BrandApplicationPreviewData {
  const title = (app?.title || 'Deliverable Mockup').trim()
  const category = (app?.category || 'Product Packaging').trim()
  const layout = (app?.layout_preference || 'split') as BrandApplicationLayout
  const description = (app?.description || 'Tactile luxury packaging and branded touchpoint.').trim()
  const imageUrl = (app?.primary_image || (app as any)?.image_url || '').trim()

  return {
    title,
    category,
    layout,
    description,
    imageUrl,
    hasImage: Boolean(imageUrl),
  }
}

/**
 * Suggests an optimal layout style based on deliverable category.
 */
export function getRecommendedLayoutForCategory(
  category?: string | null
): BrandApplicationLayout {
  const norm = (category || '').toLowerCase()
  if (norm.includes('vehicle') || norm.includes('transportation') || norm.includes('billboard') || norm.includes('outdoor')) {
    return 'wide'
  }
  if (norm.includes('stationery') || norm.includes('business card') || norm.includes('social')) {
    return 'editorial'
  }
  if (norm.includes('hero') || norm.includes('flagship') || norm.includes('storefront')) {
    return 'hero'
  }
  if (norm.includes('bottle') || norm.includes('cosmetic') || norm.includes('jar')) {
    return 'centered'
  }
  return 'split'
}

/**
 * Returns true if the layout mode is split columns.
 */
export function isSplitLayout(layout?: BrandApplicationLayout | string | null): boolean {
  return layout === 'split'
}

/**
 * Returns true if the layout mode is full-width hero banner.
 */
export function isHeroLayout(layout?: BrandApplicationLayout | string | null): boolean {
  return layout === 'hero'
}

/**
 * Returns true if the layout mode is focused center spotlight.
 */
export function isCenteredLayout(layout?: BrandApplicationLayout | string | null): boolean {
  return layout === 'centered'
}

/**
 * Returns true if the layout mode is magazine editorial spread.
 */
export function isEditorialLayout(layout?: BrandApplicationLayout | string | null): boolean {
  return layout === 'editorial'
}

/**
 * Returns true if the layout mode is cinematic panoramic landscape.
 */
export function isWideLayout(layout?: BrandApplicationLayout | string | null): boolean {
  return layout === 'wide'
}

/**
 * Returns the Lucide icon identifier string corresponding to a layout mode.
 */
export function getLayoutIconIdentifier(
  layout?: BrandApplicationLayout | string | null
): 'Columns' | 'Maximize2' | 'AlignCenter' | 'BookOpen' | 'Tv' {
  switch (layout) {
    case 'hero':
      return 'Maximize2'
    case 'centered':
      return 'AlignCenter'
    case 'editorial':
      return 'BookOpen'
    case 'wide':
      return 'Tv'
    case 'split':
    default:
      return 'Columns'
  }
}

/**
 * Checks if a brand application has the minimum required fields (title and primary image)
 * to be considered ready for public presentation.
 */
export function isValidApplicationDeliverable(app?: {
  title?: string | null
  primary_image?: string | null
  image_url?: string | null
} | null): boolean {
  if (!app) return false
  const hasTitle = Boolean(app.title && app.title.trim().length > 0)
  const hasImg = Boolean((app.primary_image || app.image_url || '').trim().length > 0)
  return hasTitle && hasImg
}

/**
 * Returns a clean, normalized badge label for deliverable category tags.
 */
export function formatApplicationCategoryBadge(
  category?: string | null
): string {
  if (!category || !category.trim()) {
    return 'Deliverable'
  }
  const clean = category.trim()
  return clean
}

/**
 * Returns the CSS grid column span split for image vs text content.
 */
export function getLayoutColumnSpan(layout?: BrandApplicationLayout | string | null): {
  imageSpan: string
  textSpan: string
} {
  switch (layout) {
    case 'hero':
    case 'wide':
      return { imageSpan: 'col-span-12', textSpan: 'col-span-12' }
    case 'editorial':
      return { imageSpan: 'col-span-12 md:col-span-8', textSpan: 'col-span-12 md:col-span-4' }
    case 'centered':
      return { imageSpan: 'col-span-12', textSpan: 'col-span-12' }
    case 'split':
    default:
      return { imageSpan: 'col-span-12 md:col-span-7', textSpan: 'col-span-12 md:col-span-5' }
  }
}

/**
 * Truncates long context notes gracefully to a maximum length while preserving word boundaries.
 */
export function truncateContextNote(note?: string | null, maxLength = 120): string {
  if (!note || !note.trim()) return ''
  const trimmed = note.trim()
  if (trimmed.length <= maxLength) return trimmed
  const truncated = trimmed.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…'
}
