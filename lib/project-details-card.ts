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


