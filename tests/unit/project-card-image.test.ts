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
  resolveActiveProjectMedia,
  getProjectCardPreviewStatus,
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

  describe('getProjectHeroBanner', () => {
    it('prioritizes direct cover_image for case study hero view', () => {
      const project = {
        cover_image: 'https://example.com/panoramic-banner.png',
        card_image: 'https://example.com/portrait-card.png',
      };
      expect(getProjectHeroBanner(project)).toBe('https://example.com/panoramic-banner.png');
    });

    it('falls back to case_study embedded banner images', () => {
      const project = {
        case_study: {
          cover_image: 'https://example.com/cs-banner.png',
        },
      };
      expect(getProjectHeroBanner(project)).toBe('https://example.com/cs-banner.png');
    });

    it('returns provided fallback or null when no hero banner exists', () => {
      expect(getProjectHeroBanner(null)).toBe(null);
      expect(getProjectHeroBanner({}, '/fallback.png')).toBe('/fallback.png');
    });
  });

  describe('isDedicatedCardImageProvided', () => {
    it('returns true when card_image differs from cover_image', () => {
      const project = {
        cover_image: 'https://example.com/banner.png',
        card_image: 'https://example.com/card.png',
      };
      expect(isDedicatedCardImageProvided(project)).toBe(true);
    });

    it('returns false when card_image equals cover_image', () => {
      const project = {
        cover_image: 'https://example.com/same.png',
        card_image: 'https://example.com/same.png',
      };
      expect(isDedicatedCardImageProvided(project)).toBe(false);
    });

    it('returns false when card_image is not provided', () => {
      const project = {
        cover_image: 'https://example.com/banner.png',
      };
      expect(isDedicatedCardImageProvided(project)).toBe(false);
    });
  });

  describe('getCardImageAspectHint', () => {
    it('returns portrait hint when dedicated card image is present', () => {
      const project = {
        cover_image: 'https://example.com/banner.png',
        card_image: 'https://example.com/portrait.png',
      };
      expect(getCardImageAspectHint(project)).toBe('3:4 Portrait (Optimized for Cards)');
    });

    it('returns cover fallback hint when only cover_image is present', () => {
      const project = {
        cover_image: 'https://example.com/banner.png',
      };
      expect(getCardImageAspectHint(project)).toBe('Cover Fallback (16:9 Banner)');
    });

    it('returns default placeholder when empty', () => {
      expect(getCardImageAspectHint(null)).toBe('Default Placeholder');
    });
  });

  describe('formatCardImageAlt', () => {
    it('formats accessible alt text with project title', () => {
      expect(formatCardImageAlt('Luxe by Sey')).toBe('Luxe by Sey portfolio card cover');
      expect(formatCardImageAlt('')).toBe('Project portfolio card cover');
      expect(formatCardImageAlt(null)).toBe('Project portfolio card cover');
    });
  });

  describe('resolveDualCoverPayload', () => {
    it('prepares dual cover payload with JSONB fallback embedding', () => {
      const result = resolveDualCoverPayload(
        'https://example.com/banner.png',
        'https://example.com/card.png',
        { overview: 'Test' }
      );

      expect(result.cover_image).toBe('https://example.com/banner.png');
      expect(result.card_image).toBe('https://example.com/card.png');
      expect(result.case_study.card_image).toBe('https://example.com/card.png');
      expect(result.case_study.overview).toBe('Test');
    });

    it('defaults card_image to cover_image if card_image is blank', () => {
      const result = resolveDualCoverPayload('https://example.com/banner.png', '');
      expect(result.card_image).toBe('https://example.com/banner.png');
      expect(result.case_study.card_image).toBe('https://example.com/banner.png');
    });
  });

  describe('Luxe by Sey Dual Cover Live Scenario', () => {
    it('properly resolves distinct portrait card cover and landscape hero banner', () => {
      const horizontalBanner =
        'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/1794001704654-luxe-purple-bubble-beauty-logo.png';
      const portraitCardCover = '/projects/luxe-by-sey-portrait-cover.png';

      const luxeProject = {
        id: 'luxe-by-sey-1',
        title: 'Luxe by Sey',
        slug: 'luxe-by-sey',
        cover_image: horizontalBanner,
        card_image: portraitCardCover,
        case_study: {
          client: 'Sey Hair Care Ltd',
        },
      };

      // 1. Portfolio card uses portrait mockup (solving image 1 stretching/mismatch)
      expect(getProjectCardImage(luxeProject)).toBe(portraitCardCover);

      // 2. Case study hero banner retains wide horizontal banner (matching image 2)
      expect(getProjectHeroBanner(luxeProject)).toBe(horizontalBanner);

      // 3. Flags dedicated card as active
      expect(isDedicatedCardImageProvided(luxeProject)).toBe(true);

      // 4. Returns portrait aspect hint
      expect(getCardImageAspectHint(luxeProject)).toBe('3:4 Portrait (Optimized for Cards)');

      // 5. Dual cover payload persists both with JSONB fallback
      const payload = resolveDualCoverPayload(
        luxeProject.cover_image,
        luxeProject.card_image,
        luxeProject.case_study
      );
      expect(payload.cover_image).toBe(horizontalBanner);
      expect(payload.card_image).toBe(portraitCardCover);
      expect(payload.case_study.card_image).toBe(portraitCardCover);
    });
  });

  describe('resolveActiveProjectMedia', () => {
    it('returns structured media breakdown for a project with dual covers', () => {
      const project = {
        cover_image: 'https://example.com/banner.png',
        card_image: 'https://example.com/card.png',
      };
      const breakdown = resolveActiveProjectMedia(project);
      expect(breakdown.cardImage).toBe('https://example.com/card.png');
      expect(breakdown.heroBanner).toBe('https://example.com/banner.png');
      expect(breakdown.hasDedicatedCard).toBe(true);
      expect(breakdown.aspectHint).toBe('3:4 Portrait (Optimized for Cards)');
    });

    it('returns fallback breakdown for project without dedicated card', () => {
      const project = {
        cover_image: 'https://example.com/banner.png',
      };
      const breakdown = resolveActiveProjectMedia(project);
      expect(breakdown.cardImage).toBe('https://example.com/banner.png');
      expect(breakdown.heroBanner).toBe('https://example.com/banner.png');
      expect(breakdown.hasDedicatedCard).toBe(false);
      expect(breakdown.aspectHint).toBe('Cover Fallback (16:9 Banner)');
    });
  });

  describe('getProjectCardPreviewStatus', () => {
    it('returns dedicated active status when dedicated card is provided', () => {
      const status = getProjectCardPreviewStatus({
        cover_image: 'https://example.com/banner.png',
        card_image: 'https://example.com/card.png',
      });
      expect(status.isDedicated).toBe(true);
      expect(status.label).toBe('Dedicated Card Active');
      expect(status.badgeColor).toContain('secondary');
    });

    it('returns synced status when falling back to cover_image', () => {
      const status = getProjectCardPreviewStatus({
        cover_image: 'https://example.com/banner.png',
      });
      expect(status.isDedicated).toBe(false);
      expect(status.label).toBe('Synced with Hero Banner');
    });

    it('returns placeholder status when neither is provided', () => {
      const status = getProjectCardPreviewStatus(null);
      expect(status.isDedicated).toBe(false);
      expect(status.label).toBe('Using Placeholder');
      expect(status.badgeColor).toContain('amber');
    });
  });
});






