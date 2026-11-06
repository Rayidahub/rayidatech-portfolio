// lib/project-classification.ts
import { ProjectType } from '@/types/project'

/**
 * Returns a concise, human-readable summary of project classification.
 */
export function formatClassificationSummary(
  projectType?: string | null,
  category?: string | null
): string {
  const type = (projectType || 'UI/UX Design').trim()
  const cat = (category || 'Unassigned Category').trim()
  return `${type} • ${cat}`
}

/**
 * Verifies whether both project type and service category have been assigned.
 */
export function isClassificationConfigured(
  projectType?: string | null,
  category?: string | null
): boolean {
  return Boolean(projectType && projectType.trim() && category && category.trim())
}

/**
 * Returns Tailwind badge classes according to the selected project type.
 */
export function getClassificationBadgeClass(projectType?: string | null): string {
  const norm = (projectType || '').toLowerCase()
  if (norm.includes('brand')) {
    return 'bg-primary/15 text-accent-soft border-primary/30'
  }
  if (norm.includes('web') || norm.includes('development')) {
    return 'bg-secondary/15 text-secondary border-secondary/30'
  }
  if (norm.includes('ui') || norm.includes('ux') || norm.includes('design')) {
    return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
  }
  return 'bg-white/5 text-mist-1 border-(--line)'
}

/**
 * Returns a contextual explanation for how project type affects case studies.
 */
export function getClassificationHelpText(projectType?: string | null): string {
  const norm = (projectType || '').toLowerCase()
  if (norm.includes('brand')) {
    return 'Switches form to Brand Identity: logo marks, color tokens, typography, merch & packaging.'
  }
  if (norm.includes('web') || norm.includes('development')) {
    return 'Switches form to Web Development: architecture, tech stack, APIs, deployment & performance.'
  }
  return 'Switches form to UI/UX Design: user flows, wireframes, design systems & mockups.'
}

/**
 * Returns an accessible ARIA label describing the collapsible classification section state.
 */
export function getClassificationAriaLabel(isOpen: boolean, projectType?: string | null): string {
  const type = projectType || 'UI/UX Design'
  return isOpen
    ? `Collapse Project Architecture & Classification settings for ${type}`
    : `Expand Project Architecture & Classification settings for ${type}`
}

/**
 * Checks whether the given project type string corresponds to Brand Identity.
 */
export function isBrandIdentityType(projectType?: string | null): boolean {
  if (!projectType) return false
  return projectType.trim().toLowerCase() === 'brand identity'
}

/**
 * Checks whether the given project type string corresponds to UI/UX Design.
 */
export function isUIUXType(projectType?: string | null): boolean {
  if (!projectType) return false
  const norm = projectType.trim().toLowerCase()
  return norm === 'ui/ux design' || norm === 'ui/ux' || norm === 'product design'
}

/**
 * Checks whether the given project type string corresponds to Web Development.
 */
export function isWebDevType(projectType?: string | null): boolean {
  if (!projectType) return false
  const norm = projectType.trim().toLowerCase()
  return norm === 'web development' || norm === 'web dev' || norm === 'development'
}

/**
 * Returns a short tooltip string describing the toggle action.
 */
export function getClassificationToggleTooltip(isOpen: boolean): string {
  return isOpen
    ? 'Click to collapse architecture settings'
    : 'Click to expand architecture settings'
}

/**
 * Returns formatted badge configuration with clean display text and styling.
 */
export function formatClassificationBadge(projectType?: string | null): {
  text: string
  className: string
} {
  const type = (projectType || 'UI/UX Design').trim()
  return {
    text: type,
    className: getClassificationBadgeClass(type),
  }
}
