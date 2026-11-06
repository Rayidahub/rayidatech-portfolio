// tests/unit/brand-application-preview.test.ts
import { describe, it, expect } from 'vitest'
import {
  getLayoutDisplayName,
  getLayoutDescription,
  getLayoutAspectRatioClass,
  getLayoutBadgeColor,
  formatApplicationPreviewData,
  getRecommendedLayoutForCategory,
  isSplitLayout,
  isHeroLayout,
  isCenteredLayout,
  isEditorialLayout,
  isWideLayout,
  getLayoutIconIdentifier,
  isValidApplicationDeliverable,
  formatApplicationCategoryBadge,
  getLayoutColumnSpan,
  truncateContextNote,
  getApplicationPreviewCardTheme,
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

  describe('getRecommendedLayoutForCategory', () => {
    it('recommends wide for vehicle and transportation deliverables', () => {
      expect(getRecommendedLayoutForCategory('Transportation & Vehicle Wrap')).toBe('wide')
      expect(getRecommendedLayoutForCategory('Outdoor Billboard')).toBe('wide')
    })

    it('recommends editorial for stationery and print collateral', () => {
      expect(getRecommendedLayoutForCategory('Stationery & Business Cards')).toBe('editorial')
      expect(getRecommendedLayoutForCategory('Social Media Kit')).toBe('editorial')
    })

    it('recommends hero for flagship and storefront layouts', () => {
      expect(getRecommendedLayoutForCategory('Storefront Signage')).toBe('hero')
      expect(getRecommendedLayoutForCategory('Flagship Brand Assets')).toBe('hero')
    })

    it('recommends centered for bottles, jars, and cosmetic packaging', () => {
      expect(getRecommendedLayoutForCategory('Cosmetic Jar Packaging')).toBe('centered')
      expect(getRecommendedLayoutForCategory('Bottle Labeling')).toBe('centered')
    })

    it('defaults to split layout for standard product deliverables', () => {
      expect(getRecommendedLayoutForCategory('General Merchandise')).toBe('split')
      expect(getRecommendedLayoutForCategory(null)).toBe('split')
    })
  })

  describe('layout mode boolean predicate helpers', () => {
    it('isSplitLayout correctly identifies split mode', () => {
      expect(isSplitLayout('split')).toBe(true)
      expect(isSplitLayout('hero')).toBe(false)
      expect(isSplitLayout(null)).toBe(false)
    })

    it('isHeroLayout correctly identifies hero mode', () => {
      expect(isHeroLayout('hero')).toBe(true)
      expect(isHeroLayout('split')).toBe(false)
      expect(isHeroLayout(undefined)).toBe(false)
    })

    it('isCenteredLayout correctly identifies centered mode', () => {
      expect(isCenteredLayout('centered')).toBe(true)
      expect(isCenteredLayout('wide')).toBe(false)
    })

    it('isEditorialLayout correctly identifies editorial mode', () => {
      expect(isEditorialLayout('editorial')).toBe(true)
      expect(isEditorialLayout('split')).toBe(false)
      expect(isEditorialLayout(null)).toBe(false)
    })

    it('isWideLayout correctly identifies wide mode', () => {
      expect(isWideLayout('wide')).toBe(true)
      expect(isWideLayout('hero')).toBe(false)
      expect(isWideLayout(undefined)).toBe(false)
    })
  })

  describe('getLayoutIconIdentifier', () => {
    it('returns the designated icon name for all layouts', () => {
      expect(getLayoutIconIdentifier('split')).toBe('Columns')
      expect(getLayoutIconIdentifier('hero')).toBe('Maximize2')
      expect(getLayoutIconIdentifier('centered')).toBe('AlignCenter')
      expect(getLayoutIconIdentifier('editorial')).toBe('BookOpen')
      expect(getLayoutIconIdentifier('wide')).toBe('Tv')
    })

    it('falls back to Columns for null or unknown layout', () => {
      expect(getLayoutIconIdentifier(null)).toBe('Columns')
      expect(getLayoutIconIdentifier('unknown' as any)).toBe('Columns')
    })
  })

  describe('isValidApplicationDeliverable', () => {
    it('returns true when both title and primary image are provided', () => {
      expect(
        isValidApplicationDeliverable({
          title: 'Packaging Jar',
          primary_image: 'https://cdn.example.com/jar.png',
        })
      ).toBe(true)
    })

    it('returns false when title is blank or whitespace', () => {
      expect(
        isValidApplicationDeliverable({
          title: '   ',
          primary_image: 'https://cdn.example.com/jar.png',
        })
      ).toBe(false)
    })

    it('returns false when image is missing', () => {
      expect(
        isValidApplicationDeliverable({
          title: 'Packaging Jar',
          primary_image: '',
        })
      ).toBe(false)
    })

    it('returns false for null or undefined input', () => {
      expect(isValidApplicationDeliverable(null)).toBe(false)
      expect(isValidApplicationDeliverable(undefined)).toBe(false)
    })
  })

  describe('formatApplicationCategoryBadge', () => {
    it('returns formatted category string', () => {
      expect(formatApplicationCategoryBadge('Product Packaging')).toBe('Product Packaging')
      expect(formatApplicationCategoryBadge('Shopping Bags')).toBe('Shopping Bags')
    })

    it('returns Deliverable when empty or null', () => {
      expect(formatApplicationCategoryBadge('')).toBe('Deliverable')
      expect(formatApplicationCategoryBadge('   ')).toBe('Deliverable')
      expect(formatApplicationCategoryBadge(null)).toBe('Deliverable')
    })
  })

  describe('getLayoutColumnSpan', () => {
    it('returns 7/5 split for split mode', () => {
      const res = getLayoutColumnSpan('split')
      expect(res.imageSpan).toContain('md:col-span-7')
      expect(res.textSpan).toContain('md:col-span-5')
    })

    it('returns 8/4 split for editorial mode', () => {
      const res = getLayoutColumnSpan('editorial')
      expect(res.imageSpan).toContain('md:col-span-8')
      expect(res.textSpan).toContain('md:col-span-4')
    })

    it('returns full-width col-span-12 for hero, centered, and wide modes', () => {
      expect(getLayoutColumnSpan('hero').imageSpan).toBe('col-span-12')
      expect(getLayoutColumnSpan('centered').imageSpan).toBe('col-span-12')
      expect(getLayoutColumnSpan('wide').imageSpan).toBe('col-span-12')
    })
  })

  describe('truncateContextNote', () => {
    it('preserves short context notes without truncation', () => {
      expect(truncateContextNote('Short note', 50)).toBe('Short note')
    })

    it('truncates at word boundary with ellipsis', () => {
      const long = 'This is an expansive description for the brand deliverable application mockup'
      const truncated = truncateContextNote(long, 30)
      expect(truncated.endsWith('…')).toBe(true)
      expect(truncated.length).toBeLessThanOrEqual(31)
    })

    it('returns empty string for null or empty input', () => {
      expect(truncateContextNote(null)).toBe('')
      expect(truncateContextNote('')).toBe('')
      expect(truncateContextNote('   ')).toBe('')
    })
  })

  describe('getApplicationPreviewCardTheme', () => {
    it('returns purple theme tokens for hero layout', () => {
      const theme = getApplicationPreviewCardTheme('hero')
      expect(theme.containerBorder).toContain('purple')
      expect(theme.accentColor).toBe('#a855f7')
    })

    it('returns cyan theme tokens for centered layout', () => {
      const theme = getApplicationPreviewCardTheme('centered')
      expect(theme.containerBorder).toContain('cyan')
      expect(theme.accentColor).toBe('#06b6d4')
    })

    it('returns emerald theme tokens for editorial layout', () => {
      const theme = getApplicationPreviewCardTheme('editorial')
      expect(theme.containerBorder).toContain('emerald')
      expect(theme.accentColor).toBe('#10b981')
    })

    it('returns sky theme tokens for wide layout', () => {
      const theme = getApplicationPreviewCardTheme('wide')
      expect(theme.containerBorder).toContain('sky')
      expect(theme.accentColor).toBe('#0284c7')
    })

    it('returns primary violet theme tokens for split layout and default', () => {
      const theme = getApplicationPreviewCardTheme('split')
      expect(theme.containerBorder).toContain('primary')
      expect(theme.accentColor).toBe('#8000ff')

      const defTheme = getApplicationPreviewCardTheme(null)
      expect(defTheme.accentColor).toBe('#8000ff')
    })
  })

  describe('Brand Application Deliverable End-to-End Simulation', () => {
    it('accurately resolves Luxe by Sey hair cream packaging mockup deliverable', () => {
      const packagingApp = {
        title: 'Product Packaging Mockup',
        category: 'Product Packaging',
        layout_preference: 'split',
        description: 'High-resolution tactile application mockup on marble pedestal',
        primary_image:
          'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/luxe-by-sey-jar.png',
      }

      // 1. Deliverable validation
      expect(isValidApplicationDeliverable(packagingApp)).toBe(true)

      // 2. Data payload formatting
      const preview = formatApplicationPreviewData(packagingApp as any)
      expect(preview.title).toBe('Product Packaging Mockup')
      expect(preview.hasImage).toBe(true)
      expect(preview.layout).toBe('split')

      // 3. Layout aspect ratio and grid column definitions
      expect(getLayoutAspectRatioClass(preview.layout)).toBe('aspect-[4/3] sm:aspect-[16/10]')
      expect(getLayoutColumnSpan(preview.layout).imageSpan).toContain('md:col-span-7')
      expect(getLayoutColumnSpan(preview.layout).textSpan).toContain('md:col-span-5')

      // 4. Recommendation for category
      expect(getRecommendedLayoutForCategory(preview.category)).toBe('split')

      // 5. Context note truncation
      expect(truncateContextNote(preview.description, 40)).toBe(
        'High-resolution tactile application…'
      )
    })
  })
})
