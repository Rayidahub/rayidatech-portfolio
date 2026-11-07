// lib/project-details-card.ts

export interface ProjectCoreMetaCandidate {
  title?: string | null
  slug?: string | null
  description?: string | null
  content?: string | null
  card_image?: string | null
  cover_image?: string | null
  role?: string | null
  duration?: string | null
  link?: string | null
  tags?: string | null
  featured?: boolean | null
}

/**
 * Returns an accessible ARIA label describing the collapsible project details card state.
 */
export function getProjectDetailsAriaLabel(isOpen: boolean, title?: string | null): string {
  const displayTitle = (title && title.trim()) ? title.trim() : 'Project Details'
  return isOpen
    ? `Collapse project details and media settings for "${displayTitle}"`
    : `Expand project details and media settings for "${displayTitle}"`
}

/**
 * Returns a short tooltip string describing the toggle button action.
 */
export function getProjectDetailsToggleTooltip(isOpen: boolean): string {
  return isOpen
    ? 'Click to collapse project details & media'
    : 'Click to expand project details & media'
}

export type CoverSummaryStatusType = 'dual' | 'card_only' | 'banner_only' | 'none'

export interface CoverSummaryStatus {
  status: CoverSummaryStatusType
  label: string
  badgeClass: string
}

/**
 * Returns a summary status object describing which cover images have been uploaded.
 */
export function getCoverSummaryStatus(
  cardImage?: string | null,
  coverImage?: string | null
): CoverSummaryStatus {
  const hasCard = Boolean(cardImage && cardImage.trim())
  const hasBanner = Boolean(coverImage && coverImage.trim())

  if (hasCard && hasBanner) {
    return {
      status: 'dual',
      label: 'Dual Covers (Card + Banner)',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    }
  }

  if (hasCard) {
    return {
      status: 'card_only',
      label: 'Card Cover (3:4)',
      badgeClass: 'bg-secondary/15 text-secondary border-secondary/30',
    }
  }

  if (hasBanner) {
    return {
      status: 'banner_only',
      label: 'Banner Only (16:9)',
      badgeClass: 'bg-accent-soft/15 text-accent-soft border-primary/30',
    }
  }

  return {
    status: 'none',
    label: 'No Cover Media',
    badgeClass: 'bg-white/5 text-mist-2 border-(--line)',
  }
}

export interface DetailsCompletionResult {
  score: number
  total: number
  percentage: number
  isComplete: boolean
  hasRequired: boolean
  missingRequired: string[]
}

/**
 * Calculates a completion score and checks required fields for project details.
 */
export function getProjectDetailsCompletionScore(
  form: ProjectCoreMetaCandidate
): DetailsCompletionResult {
  const missingRequired: string[] = []

  if (!form.title || !form.title.trim()) missingRequired.push('Title')
  if (!form.slug || !form.slug.trim()) missingRequired.push('Slug')
  if (!form.description || !form.description.trim()) missingRequired.push('Description')

  const total = 7
  let score = 0

  if (form.title && form.title.trim()) score += 1
  if (form.slug && form.slug.trim()) score += 1
  if (form.description && form.description.trim()) score += 1
  if (form.cover_image && form.cover_image.trim()) score += 1
  if (form.card_image && form.card_image.trim()) score += 1
  if (form.role && form.role.trim()) score += 1
  if (form.duration && form.duration.trim()) score += 1

  const hasRequired = missingRequired.length === 0
  const percentage = Math.round((score / total) * 100)

  return {
    score,
    total,
    percentage,
    isComplete: hasRequired && score >= 5,
    hasRequired,
    missingRequired,
  }
}

/**
 * Truncates a preview text string to a given maximum length with an ellipsis.
 */
export function truncateDetailsPreview(text?: string | null, maxLength = 45): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength).trimEnd()}…`
}

/**
 * Formats a clean, readable one-line summary for the collapsed project details header.
 */
export function formatProjectDetailsSubtitle(
  title?: string | null,
  role?: string | null,
  duration?: string | null
): string {
  const parts: string[] = []
  const displayTitle = (title && title.trim()) ? title.trim() : 'Untitled Project'
  parts.push(displayTitle)

  if (role && role.trim()) {
    parts.push(role.trim())
  }
  if (duration && duration.trim()) {
    parts.push(duration.trim())
  }

  return parts.join(' • ')
}

/**
 * Checks whether at least one cover image (portrait card or landscape banner) is provided.
 */
export function hasCoverImageSet(
  cardImage?: string | null,
  coverImage?: string | null
): boolean {
  return Boolean((cardImage && cardImage.trim()) || (coverImage && coverImage.trim()))
}

/**
 * Checks whether all core project metadata fields are completely blank.
 */
export function isCoreMetaEmpty(form?: ProjectCoreMetaCandidate | null): boolean {
  if (!form) return true
  const hasText = Boolean(
    (form.title && form.title.trim()) ||
    (form.slug && form.slug.trim()) ||
    (form.description && form.description.trim()) ||
    (form.content && form.content.trim()) ||
    (form.role && form.role.trim()) ||
    (form.duration && form.duration.trim()) ||
    (form.link && form.link.trim()) ||
    (form.tags && form.tags.trim())
  )
  const hasMedia = hasCoverImageSet(form.card_image, form.cover_image)
  const hasFeatured = Boolean(form.featured)

  return !hasText && !hasMedia && !hasFeatured
}

/**
 * Returns badge styling and label for the featured homepage status.
 */
export function getFeaturedStatusBadge(featured?: boolean | null): {
  isFeatured: boolean
  label: string
  badgeClass: string
} {
  const isFeatured = Boolean(featured)
  return isFeatured
    ? {
        isFeatured: true,
        label: 'Featured on Home',
        badgeClass: 'bg-primary/20 text-accent-soft border-primary/35',
      }
    : {
        isFeatured: false,
        label: 'Standard Project',
        badgeClass: 'bg-white/5 text-mist-2 border-(--line)',
      }
}

/**
 * Returns the data-state attribute string for DOM and testing inspection.
 */
export function getProjectDetailsCardState(isOpen: boolean): 'open' | 'collapsed' {
  return isOpen ? 'open' : 'collapsed'
}






