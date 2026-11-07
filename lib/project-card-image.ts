// lib/project-card-image.ts
import { Project } from '@/types/project';

/** Default fallback card cover when neither card_image nor cover_image is provided */
export const DEFAULT_CARD_COVER = '/img/card1.png';

/**
 * Validates whether a candidate string is a usable image URL or data URI.
 */
export function isValidCardImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith('javascript:')) return false;

  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  );
}

/**
 * Resolves the active image for public portfolio cards (PremiumCard),
 * prioritizing the dedicated portrait card_image before falling back to cover_image.
 */
export function getProjectCardImage(
  project?: Partial<Project> | null,
  fallback: string = DEFAULT_CARD_COVER
): string {
  if (!project) return fallback;

  // 1. Direct card_image column
  if (typeof project.card_image === 'string' && isValidCardImageUrl(project.card_image)) {
    return project.card_image.trim();
  }

  // 2. Case study embedded card_image
  const cs = project.case_study;
  if (cs && typeof cs === 'object') {
    if (typeof cs.card_image === 'string' && isValidCardImageUrl(cs.card_image)) {
      return cs.card_image.trim();
    }
  }

  // 3. Fallback to direct cover_image
  if (typeof project.cover_image === 'string' && isValidCardImageUrl(project.cover_image)) {
    return project.cover_image.trim();
  }

  // 4. Case study embedded cover fallbacks
  if (cs && typeof cs === 'object') {
    if (typeof cs.overview_image === 'string' && isValidCardImageUrl(cs.overview_image)) {
      return cs.overview_image.trim();
    }
    if (typeof cs.primary_logo === 'string' && isValidCardImageUrl(cs.primary_logo)) {
      return cs.primary_logo.trim();
    }
    if (typeof cs.cover_image === 'string' && isValidCardImageUrl(cs.cover_image)) {
      return cs.cover_image.trim();
    }
    if (typeof (cs as any).hero_image === 'string' && isValidCardImageUrl((cs as any).hero_image)) {
      return (cs as any).hero_image.trim();
    }
  }

  return fallback;
}

