// tests/unit/brand-application-preview.test.ts
import { describe, it, expect } from 'vitest'
import {
  getLayoutDisplayName,
  getLayoutDescription,
  getLayoutAspectRatioClass,
  getLayoutBadgeColor,
  formatApplicationPreviewData,
} from '@/lib/brand-application-preview'

describe('Brand Application Preview Utilities', () => {
  describe('getLayoutDisplayName', () => {
    it('returns human-friendly names for all 5 layout preferences', () => {
      expect(getLayoutDisplayName('hero')).toBe('Hero Showcase')
      expect(getLayoutDisplayName('split')).toBe('Split Columns')
      expect(getLayoutDisplayName('centered')).toBe('Focused Spotlight')
      expect(getLayoutDisplayName('editorial')).toBe('Magazine Editorial')
      expect(getLayoutDisplayName('wide')).toBe('Cinematic Panoramic')
    })

    it('defaults gracefully to Split Columns when unknown or null', () => {
      expect(getLayoutDisplayName(null)).toBe('Split Columns')
      expect(getLayoutDisplayName('unknown')).toBe('Split Columns')
    })
  })

  describe('getLayoutDescription', () => {
    it('returns concise descriptions for layout behavior', () => {
      expect(getLayoutDescription('hero')).toContain('cinematic')
      expect(getLayoutDescription('split')).toContain('50/50')
      expect(getLayoutDescription('centered')).toContain('Spotlight')
      expect(getLayoutDescription('editorial')).toContain('magazine')
      expect(getLayoutDescription('wide')).toContain('21:9')
    })

    it('defaults to split description when null', () => {
      expect(getLayoutDescription(null)).toContain('50/50')
    })
  })

  describe('getLayoutAspectRatioClass', () => {
    it('returns proper aspect ratio classes for each mode', () => {
      expect(getLayoutAspectRatioClass('hero')).toBe('aspect-[16/9] sm:aspect-[21/9]')
      expect(getLayoutAspectRatioClass('split')).toBe('aspect-[4/3] sm:aspect-[16/10]')
      expect(getLayoutAspectRatioClass('centered')).toBe('aspect-[16/10]')
      expect(getLayoutAspectRatioClass('editorial')).toBe('aspect-[16/9]')
      expect(getLayoutAspectRatioClass('wide')).toBe('aspect-[21/9]')
    })

    it('defaults to split aspect ratio when null', () => {
      expect(getLayoutAspectRatioClass(null)).toBe('aspect-[4/3] sm:aspect-[16/10]')
    })
  })

  describe('getLayoutBadgeColor', () => {
    it('returns theme accent classes for layout pills', () => {
      expect(getLayoutBadgeColor('hero')).toContain('purple')
      expect(getLayoutBadgeColor('centered')).toContain('secondary')
      expect(getLayoutBadgeColor('editorial')).toContain('emerald')
      expect(getLayoutBadgeColor('wide')).toContain('cyan')
      expect(getLayoutBadgeColor('split')).toContain('primary')
    })
  })

  describe('formatApplicationPreviewData', () => {
    it('normalizes valid application payload', () => {
      const app = {
        title: 'Product Packaging Mockup',
        category: 'Product Packaging' as any,
        layout_preference: 'split' as any,
        description: 'High-resolution tactile application',
        primary_image: 'https://example.com/jar.jpg',
      }
      const res = formatApplicationPreviewData(app)
      expect(res.title).toBe('Product Packaging Mockup')
      expect(res.category).toBe('Product Packaging')
      expect(res.layout).toBe('split')
      expect(res.description).toBe('High-resolution tactile application')
      expect(res.imageUrl).toBe('https://example.com/jar.jpg')
      expect(res.hasImage).toBe(true)
    })

    it('applies fallback defaults when fields are missing or empty', () => {
      const res = formatApplicationPreviewData(null)
      expect(res.title).toBe('Deliverable Mockup')
      expect(res.category).toBe('Product Packaging')
      expect(res.layout).toBe('split')
      expect(res.hasImage).toBe(false)
    })
  })
})
