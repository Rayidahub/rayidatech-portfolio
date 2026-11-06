// lib/project-status.ts
import type { Project, ProjectStatus } from '@/types/project'

/**
 * Determines whether a project is published and visible on the public website.
 * Backward-compatible: existing records without an explicit draft status default to true.
 */
export function isProjectPublished(project: Partial<Project> | null | undefined): boolean {
  if (!project) return false

  // 1. Explicit top-level published boolean check
  if (typeof project.published === 'boolean') {
    return project.published
  }

  // 2. Explicit top-level status string check
  if (project.status === 'draft') return false
  if (project.status === 'published') return true

  // 3. JSONB case_study published boolean check
  const cs = project.case_study as any
  if (cs && typeof cs.published === 'boolean') {
    return cs.published
  }

  // 4. JSONB case_study status check
  if (cs && cs.status === 'draft') return false
  if (cs && cs.status === 'published') return true

  // 5. Default safe fallback for existing legacy projects
  return true
}

/**
 * Returns normalized ProjectStatus string ('draft' | 'published').
 */
export function getProjectStatus(project: Partial<Project> | null | undefined): ProjectStatus {
  return isProjectPublished(project) ? 'published' : 'draft'
}

/**
 * Returns Tailwind badge styling metadata for display in admin panels.
 */
export function getProjectStatusBadge(status: ProjectStatus): {
  label: string
  badgeClass: string
  dotClass: string
} {
  if (status === 'draft') {
    return {
      label: 'Draft',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dotClass: 'bg-amber-400',
    }
  }

  return {
    label: 'Published',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  }
}

/**
 * Prepares the status payload object to embed in case_study.
 */
export function buildStatusPayload(isDraft: boolean): {
  published: boolean
  status: ProjectStatus
} {
  return {
    published: !isDraft,
    status: isDraft ? 'draft' : 'published',
  }
}

/**
 * Filters a collection of projects returning only those published.
 */
export function filterPublishedProjects<T extends Partial<Project>>(
  projects?: T[] | null
): T[] {
  if (!Array.isArray(projects)) return []
  return projects.filter(isProjectPublished)
}
