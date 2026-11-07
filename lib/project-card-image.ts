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

/**
 * Resolves the wide landscape hero banner image for project detail case study views.
 */
export function getProjectHeroBanner(
  project?: Partial<Project> | null,
  fallback: string | null = null
): string | null {
  if (!project) return fallback;

  // 1. Direct cover_image column
  if (typeof project.cover_image === 'string' && isValidCardImageUrl(project.cover_image)) {
    return project.cover_image.trim();
  }

  // 2. Case study embedded cover fallbacks
  const cs = project.case_study;
  if (cs && typeof cs === 'object') {
    if (typeof cs.cover_image === 'string' && isValidCardImageUrl(cs.cover_image)) {
      return cs.cover_image.trim();
    }
    if (typeof cs.overview_image === 'string' && isValidCardImageUrl(cs.overview_image)) {
      return cs.overview_image.trim();
    }
    if (typeof (cs as any).hero_image === 'string' && isValidCardImageUrl((cs as any).hero_image)) {
      return (cs as any).hero_image.trim();
    }
  }

  return fallback;
}

/**
 * Checks whether a project has a dedicated card image defined that is separate from cover_image.
 */
export function isDedicatedCardImageProvided(project?: Partial<Project> | null): boolean {
  if (!project) return false;
  const directCard = project.card_image?.trim();
  const csCard = project.case_study?.card_image?.trim();
  const activeCard = directCard || csCard;

  if (!activeCard || !isValidCardImageUrl(activeCard)) return false;
  const cover = project.cover_image?.trim();
  return activeCard !== cover;
}

/**
 * Returns a human-friendly aspect ratio description for card image vs cover image.
 */
export function getCardImageAspectHint(project?: Partial<Project> | null): string {
  if (!project) return 'Default Placeholder';
  if (isDedicatedCardImageProvided(project)) {
    return '3:4 Portrait (Optimized for Cards)';
  }
  if (project.cover_image && isValidCardImageUrl(project.cover_image)) {
    return 'Cover Fallback (16:9 Banner)';
  }
  return 'Default Placeholder';
}

/**
 * Generates an accessible alt text for a project's card image.
 */
export function formatCardImageAlt(title?: string | null): string {
  const safeTitle = (title || 'Project').trim();
  return `${safeTitle} portfolio card cover`;
}

/**
 * Prepares the dual cover payload for Supabase insertion or updating,
 * embedding card_image into case_study JSONB for resilient schema compatibility.
 */
export function resolveDualCoverPayload(
  coverImage: string,
  cardImage: string,
  existingCaseStudy?: Record<string, any> | null
): {
  cover_image: string;
  card_image: string;
  case_study: Record<string, any>;
} {
  const cleanCover = (coverImage || '').trim();
  const cleanCard = (cardImage || '').trim();
  const effectiveCard = cleanCard || cleanCover;

  return {
    cover_image: cleanCover,
    card_image: effectiveCard,
    case_study: {
      ...(existingCaseStudy || {}),
      card_image: effectiveCard,
    },
  };
}

export interface ProjectMediaBreakdown {
  cardImage: string;
  heroBanner: string | null;
  hasDedicatedCard: boolean;
  aspectHint: string;
}

/**
 * Returns a comprehensive media resolution breakdown for a project.
 */
export function resolveActiveProjectMedia(
  project?: Partial<Project> | null
): ProjectMediaBreakdown {
  return {
    cardImage: getProjectCardImage(project),
    heroBanner: getProjectHeroBanner(project),
    hasDedicatedCard: isDedicatedCardImageProvided(project),
    aspectHint: getCardImageAspectHint(project),
  };
}



