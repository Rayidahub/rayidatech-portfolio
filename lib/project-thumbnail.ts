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

/**
 * Checks whether an image candidate is a remote external URL.
 */
export function isExternalImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
}

/**
 * Checks whether an image candidate is a local public asset path.
 */
export function isLocalImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  return (trimmed.startsWith('/') || trimmed.startsWith('./')) && !trimmed.startsWith('//')
}

/**
 * Sanitizes and strips unsafe protocols (javascript:, data:text/html, etc.) from image URLs.
 */
export function sanitizeCoverImageUrl(url?: string | null): string | null {
  if (!isValidImageUrl(url)) return null
  return url ? url.trim() : null
}

/**
 * Returns a human-readable placeholder label when no cover image is uploaded.
 */
export function getCoverImagePlaceholderTitle(title?: string | null): string {
  const safeTitle = (title || 'Project').trim()
  return `No cover image set for "${safeTitle}". Click to add one.`
}

/**
 * Returns the Tailwind CSS aspect ratio utility class for project thumbnails.
 */
export function getThumbnailAspectRatioClass(
  ratio: '16/10' | '16/9' | '4/3' | '1/1' = '16/10'
): string {
  switch (ratio) {
    case '16/9':
      return 'aspect-video'
    case '4/3':
      return 'aspect-[4/3]'
    case '1/1':
      return 'aspect-square'
    case '16/10':
    default:
      return 'aspect-[16/10]'
  }
}

/**
 * Extracts a human-friendly filename from an image URL or path.
 */
export function getImageFileName(url?: string | null): string {
  if (!url || typeof url !== 'string') return 'image.jpg'
  const clean = url.split('?')[0].split('#')[0]
  const segments = clean.split('/')
  const filename = segments[segments.length - 1] || 'image.jpg'
  return filename.length > 32 ? `${filename.slice(0, 29)}...` : filename
}

/**
 * Formats image width and height into a clean resolution tag (e.g., '1920×1080').
 */
export function formatImageResolutionLabel(width?: number, height?: number): string | null {
  if (!width || !height || width <= 0 || height <= 0) return null
  return `${Math.round(width)}×${Math.round(height)}`
}
