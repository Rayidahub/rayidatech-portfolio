// tests/unit/project-card-image.test.ts
import { describe, it, expect } from 'vitest';
import {
  isValidCardImageUrl,
  getProjectCardImage,
  getProjectHeroBanner,
  isDedicatedCardImageProvided,
  getCardImageAspectHint,
  formatCardImageAlt,
  resolveDualCoverPayload,
  DEFAULT_CARD_COVER,
} from '@/lib/project-card-image';

describe('Project Dual Cover & Card Image Utilities', () => {
  describe('isValidCardImageUrl', () => {
    it('accepts valid URLs and data URIs', () => {
      expect(isValidCardImageUrl('https://example.com/mockup.png')).toBe(true);
      expect(isValidCardImageUrl('http://example.com/banner.jpg')).toBe(true);
      expect(isValidCardImageUrl('/img/card.png')).toBe(true);
      expect(isValidCardImageUrl('./assets/mockup.webp')).toBe(true);
      expect(isValidCardImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==')).toBe(true);
    });

    it('rejects invalid, empty, or dangerous URLs', () => {
      expect(isValidCardImageUrl('')).toBe(false);
      expect(isValidCardImageUrl('   ')).toBe(false);
      expect(isValidCardImageUrl(null)).toBe(false);
      expect(isValidCardImageUrl(undefined)).toBe(false);
      expect(isValidCardImageUrl('javascript:alert(1)')).toBe(false);
      expect(isValidCardImageUrl('ftp://example.com/test.png')).toBe(false);
    });
  });
});
