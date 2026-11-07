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

