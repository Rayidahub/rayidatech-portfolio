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

  describe('getProjectCardImage', () => {
    it('prioritizes dedicated card_image over cover_image', () => {
      const project = {
        cover_image: 'https://example.com/wide-banner.png',
        card_image: 'https://example.com/portrait-card.png',
      };
      expect(getProjectCardImage(project)).toBe('https://example.com/portrait-card.png');
    });

    it('falls back to case_study.card_image if direct card_image is missing', () => {
      const project = {
        cover_image: 'https://example.com/wide-banner.png',
        case_study: {
          card_image: 'https://example.com/embedded-card.png',
        },
      };
      expect(getProjectCardImage(project)).toBe('https://example.com/embedded-card.png');
    });

    it('falls back to cover_image if no card_image is defined anywhere', () => {
      const project = {
        cover_image: 'https://example.com/wide-banner.png',
      };
      expect(getProjectCardImage(project)).toBe('https://example.com/wide-banner.png');
    });

    it('falls back to case_study media if cover_image is also absent', () => {
      const project1 = {
        case_study: { overview_image: 'https://example.com/overview.png' },
      };
      expect(getProjectCardImage(project1)).toBe('https://example.com/overview.png');

      const project2 = {
        case_study: { primary_logo: 'https://example.com/logo.png' },
      };
      expect(getProjectCardImage(project2)).toBe('https://example.com/logo.png');

      const project3 = {
        case_study: { cover_image: 'https://example.com/cs-cover.png' },
      };
      expect(getProjectCardImage(project3)).toBe('https://example.com/cs-cover.png');
    });

    it('falls back to DEFAULT_CARD_COVER when no valid images exist', () => {
      expect(getProjectCardImage(null)).toBe(DEFAULT_CARD_COVER);
      expect(getProjectCardImage({})).toBe(DEFAULT_CARD_COVER);
      expect(getProjectCardImage({ cover_image: '' })).toBe(DEFAULT_CARD_COVER);
    });
  });
});

