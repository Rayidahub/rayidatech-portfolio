// lib/project-thumbnail.ts
import { Project } from '@/types/project'

/**
 * Validates whether a candidate string is a usable image URL or data URI.
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false

  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  )
}

/**
 * Resolves the most appropriate cover image for a project with resilient fallbacks.
 * Checks in order:
 * 1. project.cover_image
 * 2. project.case_study.overview_image
 * 3. project.case_study.primary_logo
 * 4. project.case_study.cover_image
 */
export function getProjectCoverImage(project?: Partial<Project> | null): string | null {
  if (!project) return null

  // 1. Direct cover_image column
  if (typeof project.cover_image === 'string' && isValidImageUrl(project.cover_image)) {
    return project.cover_image.trim()
  }

  // 2. Case study embedded fallbacks
  const cs = project.case_study
  if (cs && typeof cs === 'object') {
    if (typeof cs.overview_image === 'string' && isValidImageUrl(cs.overview_image)) {
      return cs.overview_image.trim()
    }
    if (typeof cs.primary_logo === 'string' && isValidImageUrl(cs.primary_logo)) {
      return cs.primary_logo.trim()
    }
    if (typeof cs.cover_image === 'string' && isValidImageUrl(cs.cover_image)) {
      return cs.cover_image.trim()
    }
    if (typeof (cs as any).hero_image === 'string' && isValidImageUrl((cs as any).hero_image)) {
      return (cs as any).hero_image.trim()
    }
  }

  return null
}

/**
 * Formats a clean, accessible alt text for a project cover image.
 */
export function formatCoverImageAlt(title?: string | null): string {
  const safeTitle = (title || 'Project').trim()
  return `${safeTitle} cover preview`
}

/**
 * Checks whether an image candidate is a base64 encoded data URI.
 */
export function isDataImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  return url.trim().startsWith('data:image/')
}
