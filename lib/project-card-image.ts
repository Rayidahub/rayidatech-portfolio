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
