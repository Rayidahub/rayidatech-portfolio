// lib/brand-identity.ts
import {
  PROJECT_TYPES,
  type ProjectType,
  type Project,
  type BrandIdentityCaseStudy,
  type BrandApplication,
  type BrandApplicationLayout,
  type BrandGalleryItem,
  type BrandColor,
  type BrandTypography,

} from '@/types/project'


/**
 * Validates whether a given string is a valid 3-digit or 6-digit hex color code.
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return false
  const clean = hex.replace('#', '').trim()
  return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)
}

/**
 * Converts a 3-digit or 6-digit hex color string into standard `rgb(r, g, b)` format.
 * Returns null if the hex code is invalid.
 */
export function hexToRgb(hex: string): string | null {
  if (!isValidHex(hex)) return null
  const clean = hex.replace('#', '').trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return `rgb(${r}, ${g}, ${b})`
  }
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Calculates whether black or white text has higher contrast against a hex background.
 */
export function getContrastTextColor(hex: string): 'light' | 'dark' {
  if (!isValidHex(hex)) return 'light'
  const clean = hex.replace('#', '').trim()
  let r = 0, g = 0, b = 0
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else {
    r = parseInt(clean.slice(0, 2), 16)
    g = parseInt(clean.slice(2, 4), 16)
    b = parseInt(clean.slice(4, 6), 16)
  }
  // YIQ equation
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'dark' : 'light'
}

/**
 * Returns human-friendly label for brand color classification.
 */
export function formatColorClassification(classification?: string): string {
  const norm = classification?.toLowerCase()
  switch (norm) {
    case 'primary':
      return 'Primary'
    case 'secondary':
      return 'Secondary'
    case 'accent':
      return 'Accent'
    case 'neutral':
      return 'Neutral'
    case 'neutral-dark':
      return 'Dark Neutral'
    case 'neutral-light':
      return 'Light Neutral'
    case 'background':
      return 'Background'
    default:
      return classification || 'Custom'
  }
}

/**
 * Safely infers the ProjectType from any combination of top-level field,
 * JSONB case study, or tags array.
 */
export function inferProjectType(project: Partial<Project>): ProjectType {
  if (project.project_type && (PROJECT_TYPES as readonly string[]).includes(project.project_type)) {
    return project.project_type
  }
  const cs = project.case_study as any
  if (cs?.case_study_type && (PROJECT_TYPES as readonly string[]).includes(cs.case_study_type)) {
    return cs.case_study_type
  }
  if (cs?.project_type && (PROJECT_TYPES as readonly string[]).includes(cs.project_type)) {
    return cs.project_type
  }
  if (Array.isArray(project.tags)) {
    if (project.tags.some((t) => t.toLowerCase() === 'brand identity')) {
      return 'Brand Identity'
    }
    if (project.tags.some((t) => t.toLowerCase() === 'web development')) {
      return 'Web Development'
    }
  }
  return 'UI/UX Design'
}

/**
 * Parses comma, bullet, or newline separated strings into an array of clean pill tokens.
 */
export function parsePillList(val?: string | string[]): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean)
  return String(val)
    .split(/[,•\n]/)
    .map((s) => s.trim().replace(/^[•\-\*]\s*/, ''))
    .filter(Boolean)
}

/**
 * Loops or clamps a lightbox gallery index safely within range.
 */
export function clampLightboxIndex(current: number, total: number, delta: number): number {
  if (total <= 0) return 0
  const next = current + delta
  if (next < 0) return total - 1
  if (next >= total) return 0
  return next
}

/**
 * Returns Tailwind CSS layout classes for brand deliverable presentation modes.
 */
export function getBrandApplicationLayoutClasses(mode: string): {
  container: string
  grid: string
} {
  switch (mode) {
    case 'hero':
      return {
        container: 'col-span-12',
        grid: 'grid-cols-1',
      }
    case 'split':
      return {
        container: 'col-span-12 md:col-span-6',
        grid: 'grid-cols-1',
      }
    case 'editorial':
      return {
        container: 'col-span-12 md:col-span-8',
        grid: 'grid-cols-1',
      }
    case 'wide':
      return {
        container: 'col-span-12',
        grid: 'grid-cols-1 md:grid-cols-2',
      }
    case 'centered':
    default:
      return {
        container: 'col-span-12 sm:col-span-6 lg:col-span-4',
        grid: 'grid-cols-1',
      }
  }
}

/**
 * Normalizes a raw case_study object ensuring all brand identity arrays and sections exist.
 */
export function normalizeBrandCaseStudy(raw: any): Partial<BrandIdentityCaseStudy> {
  if (!raw || typeof raw !== 'object') {
    return {
      case_study_type: 'Brand Identity',
      color_palette: [],
      typography_system: [],
      brand_applications: [],
      brand_gallery: [],
    }
  }

  return {
    ...raw,
    case_study_type: 'Brand Identity',
    color_palette: Array.isArray(raw.color_palette) ? raw.color_palette : [],
    typography_system: Array.isArray(raw.typography_system) ? raw.typography_system : [],
    brand_applications: Array.isArray(raw.brand_applications) ? raw.brand_applications : [],
    brand_gallery: Array.isArray(raw.brand_gallery) ? raw.brand_gallery : [],
    gallery_layout: raw.gallery_layout || 'masonry',
  }
}

/**
 * Validates a brand case study payload for essential fields.
 */
export function validateBrandCaseStudy(data: Partial<BrandIdentityCaseStudy>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (data.color_palette && Array.isArray(data.color_palette)) {
    data.color_palette.forEach((color, idx) => {
      if (color.hex && !isValidHex(color.hex)) {
        errors.push(`Color #${idx + 1} (${color.name || 'Unnamed'}): invalid hex code '${color.hex}'`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Type guard to check if a case study object matches BrandIdentityCaseStudy.
 */
export function isBrandIdentityCaseStudy(
  caseStudy: any
): caseStudy is BrandIdentityCaseStudy {
  if (!caseStudy || typeof caseStudy !== 'object') return false
  return (
    caseStudy.case_study_type === 'Brand Identity' ||
    caseStudy.project_type === 'Brand Identity' ||
    Array.isArray(caseStudy.color_palette) ||
    Array.isArray(caseStudy.brand_applications)
  )
}

/**
 * Filters brand applications to only those marked as visible and containing an image.
 */
export function filterVisibleBrandApplications(
  apps?: (BrandApplication & { image_url?: string })[]
): BrandApplication[] {
  if (!Array.isArray(apps)) return []
  return apps.filter(
    (app) =>
      app &&
      app.is_visible !== false &&
      Boolean(app.primary_image || (app as any).image_url)
  )
}

/**
 * Normalizes brand application deliverables from various schema shapes
 * (brand_applications, applications, deliverables) into validated, sorted BrandApplication items.
 */
export function normalizeBrandApplications(caseStudy?: any): BrandApplication[] {
  if (!caseStudy || typeof caseStudy !== 'object') return []

  const raw =
    caseStudy.brand_applications ||
    caseStudy.applications ||
    caseStudy.deliverables ||
    []

  if (!Array.isArray(raw)) return []

  return raw
    .map((app: any, idx: number): BrandApplication => {
      const primaryImage = (
        app.primary_image ||
        app.image_url ||
        app.image ||
        ''
      ).trim()

      const rawLayout = (app.layout_preference || app.layout || 'split')
        .toString()
        .toLowerCase()
        .trim()
      const layoutPreference: BrandApplicationLayout = [
        'hero',
        'split',
        'centered',
        'editorial',
        'wide',
      ].includes(rawLayout)
        ? (rawLayout as BrandApplicationLayout)
        : 'split'

      return {
        id: app.id || `app-${idx + 1}`,
        title: (app.title || app.name || 'Brand Deliverable').trim(),
        category: app.category || 'Product Packaging',
        description: (app.description || app.context_note || '').trim(),
        primary_image: primaryImage,
        additional_images: Array.isArray(app.additional_images)
          ? app.additional_images
          : [],
        layout_preference: layoutPreference,
        display_order:
          typeof app.display_order === 'number' ? app.display_order : idx + 1,
        is_visible: app.is_visible !== false,
      }
    })
    .filter((app) => app.is_visible && Boolean(app.primary_image))
    .sort((a, b) => a.display_order - b.display_order)
}

/**
 * Safely resolves and validates a layout preference for brand applications.

 */
export function getEffectiveApplicationLayout(
  layout?: string | null
): BrandApplicationLayout {
  if (!layout) return 'split'
  const norm = layout.toLowerCase().trim()
  if (
    norm === 'hero' ||
    norm === 'split' ||
    norm === 'centered' ||
    norm === 'editorial' ||
    norm === 'wide'
  ) {
    return norm as BrandApplicationLayout
  }
  return 'split'
}

/**
 * Checks whether the Brand Applications section has any visible deliverables with images.
 */
export function isBrandApplicationsSectionVisible(caseStudy?: any): boolean {
  const apps = normalizeBrandApplications(caseStudy)
  return apps.length > 0
}

/**
 * Normalizes brand gallery items across schema keys (brand_gallery, gallery_items, curated_gallery).
 */
export function normalizeBrandGalleryItems(caseStudy?: any): BrandGalleryItem[] {
  if (!caseStudy || typeof caseStudy !== 'object') return []

  const raw =
    caseStudy.brand_gallery ||
    caseStudy.gallery_items ||
    caseStudy.curated_gallery ||
    []

  if (!Array.isArray(raw)) return []

  return raw
    .map((item: any, idx: number): BrandGalleryItem => {
      const imageUrl = (
        typeof item === 'string' ? item : item.image_url || item.url || ''
      ).trim()
      const caption =
        typeof item === 'object' && item ? item.caption || item.title : ''
      const description =
        typeof item === 'object' && item ? item.description : ''
      const displayOrder =
        typeof item === 'object' && item && typeof item.display_order === 'number'
          ? item.display_order
          : idx + 1

      return {
        id: (item && item.id) || `gallery-${idx + 1}`,
        image_url: imageUrl,
        caption,
        description,
        display_order: displayOrder,
      }
    })
    .filter((g) => Boolean(g.image_url))
    .sort((a, b) => a.display_order - b.display_order)
}

export interface BrandOutcomeDetails {
  outcomeDesc: string
  impactDesc: string
  reflectionDesc: string
  hasConclusion: boolean
}

/**
 * Normalizes outcome, impact, and reflection notes across various naming conventions.
 */
export function normalizeBrandOutcomeDetails(caseStudy?: any): BrandOutcomeDetails {
  if (!caseStudy || typeof caseStudy !== 'object') {
    return {
      outcomeDesc: '',
      impactDesc: '',
      reflectionDesc: '',
      hasConclusion: false,
    }
  }

  const outcomeDesc = (
    caseStudy.design_outcome ||
    caseStudy.outcome_description ||
    caseStudy.outcome ||
    ''
  ).trim()

  const impactDesc = (
    caseStudy.project_impact ||
    caseStudy.impact_description ||
    caseStudy.impact ||
    ''
  ).trim()

  const reflectionDesc = (
    caseStudy.personal_reflection ||
    caseStudy.key_learnings ||
    caseStudy.reflection ||
    ''
  ).trim()

  return {
    outcomeDesc,
    impactDesc,
    reflectionDesc,
    hasConclusion: Boolean(outcomeDesc || impactDesc || reflectionDesc),
  }
}

/**
 * Formats a clean category and layout summary for an application deliverable.
 */
export function formatApplicationDeliverableSummary(app: BrandApplication): string {
  const cat = (app.category || 'Deliverable').trim()
  const layout = (app.layout_preference || 'split').toUpperCase()
  return `${cat} • ${layout} Mode`
}







/**
 * Derives a clean CSS variable name and value from a brand color item.
 */
export function getBrandColorCssVariable(color: BrandColor): {
  variableName: string
  cssValue: string
} {
  const safeName = (color.name || 'brand-color')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return {
    variableName: `--brand-${safeName}`,
    cssValue: color.hex || '#ffffff',
  }
}

/**
 * Returns a fallback CSS font stack for a brand typography configuration.
 */
export function getTypographyFontFamily(
  font: BrandTypography & { font_family?: string; role?: string }
): string {
  const family = font.font_name || font.font_family
  const primaryName = family ? `"${family}"` : 'sans-serif'
  const role = (font.font_role || font.role || '').toLowerCase()
  switch (role) {
    case 'display':
    case 'heading':
    case 'headline':
      return `${primaryName}, system-ui, -apple-system, sans-serif`
    case 'accent':
      return `${primaryName}, Georgia, serif`
    case 'monospace':
      return `${primaryName}, "Geist Mono", monospace`
    case 'body':
    default:
      return `${primaryName}, Inter, system-ui, sans-serif`
  }
}
