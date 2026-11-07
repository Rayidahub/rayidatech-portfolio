import { describe, it, expect } from 'vitest'
import {
  getProjectDetailsAriaLabel,
  getProjectDetailsToggleTooltip,
  getCoverSummaryStatus,
  getProjectDetailsCompletionScore,
  formatProjectDetailsSubtitle,
  truncateDetailsPreview,
  hasCoverImageSet,
  isCoreMetaEmpty,
  getFeaturedStatusBadge,
  getProjectDetailsCardState,
  isAllSectionsCollapsed,
  toggleAllSectionStates,
  getSectionCollapseTooltip,
  formatSectionStepNumber,
} from '@/lib/project-details-card'







describe('Project Details Card - Accessibility & Tooltips', () => {
  describe('getProjectDetailsAriaLabel', () => {
    it('generates collapse label when card is open with project title', () => {
      const label = getProjectDetailsAriaLabel(true, 'Luxe by Sey')
      expect(label).toBe('Collapse project details and media settings for "Luxe by Sey"')
    })

    it('generates expand label when card is collapsed with project title', () => {
      const label = getProjectDetailsAriaLabel(false, 'Luxe by Sey')
      expect(label).toBe('Expand project details and media settings for "Luxe by Sey"')
    })

    it('falls back gracefully to "Project Details" when title is empty, null, or whitespace', () => {
      expect(getProjectDetailsAriaLabel(true, '')).toBe(
        'Collapse project details and media settings for "Project Details"'
      )
      expect(getProjectDetailsAriaLabel(false, null)).toBe(
        'Expand project details and media settings for "Project Details"'
      )
      expect(getProjectDetailsAriaLabel(false, '   ')).toBe(
        'Expand project details and media settings for "Project Details"'
      )
    })
  })

  describe('getProjectDetailsToggleTooltip', () => {
    it('returns collapse instruction when open', () => {
      expect(getProjectDetailsToggleTooltip(true)).toBe(
        'Click to collapse project details & media'
      )
    })

    it('returns expand instruction when collapsed', () => {
      expect(getProjectDetailsToggleTooltip(false)).toBe(
        'Click to expand project details & media'
      )
    })
  })

  describe('getCoverSummaryStatus', () => {
    it('detects dual covers when both card_image and cover_image are set', () => {
      const result = getCoverSummaryStatus(
        'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/luxe-card.png',
        'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/luxe-banner.png'
      )
      expect(result.status).toBe('dual')
      expect(result.label).toBe('Dual Covers (Card + Banner)')
      expect(result.badgeClass).toContain('text-emerald-300')
    })

    it('detects card_only when only card_image is populated', () => {
      const result = getCoverSummaryStatus('/projects/luxe-by-sey-portrait-cover.png', '')
      expect(result.status).toBe('card_only')
      expect(result.label).toBe('Card Cover (3:4)')
      expect(result.badgeClass).toContain('text-secondary')
    })

    it('detects banner_only when only cover_image is populated', () => {
      const result = getCoverSummaryStatus(
        null,
        'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/banner.png'
      )
      expect(result.status).toBe('banner_only')
      expect(result.label).toBe('Banner Only (16:9)')
      expect(result.badgeClass).toContain('text-accent-soft')
    })

    it('returns none when neither cover image is populated', () => {
      const result = getCoverSummaryStatus('', undefined)
      expect(result.status).toBe('none')
      expect(result.label).toBe('No Cover Media')
      expect(result.badgeClass).toContain('text-mist-2')
    })

    it('ignores empty whitespace strings properly', () => {
      const result = getCoverSummaryStatus('   ', '   ')
      expect(result.status).toBe('none')
    })
  })

  describe('getProjectDetailsCompletionScore', () => {
    it('identifies missing required fields in empty form', () => {
      const result = getProjectDetailsCompletionScore({})
      expect(result.hasRequired).toBe(false)
      expect(result.isComplete).toBe(false)
      expect(result.score).toBe(0)
      expect(result.percentage).toBe(0)
      expect(result.missingRequired).toEqual(['Title', 'Slug', 'Description'])
    })

    it('validates a fully populated form as complete with 100% score', () => {
      const result = getProjectDetailsCompletionScore({
        title: 'Luxe by Sey',
        slug: 'luxe-by-sey',
        description: 'Luxury beauty and cosmetic branding',
        card_image: '/projects/luxe-card.png',
        cover_image: '/projects/luxe-hero.png',
        role: 'Brand Designer',
        duration: '4 Days',
      })
      expect(result.hasRequired).toBe(true)
      expect(result.isComplete).toBe(true)
      expect(result.score).toBe(7)
      expect(result.percentage).toBe(100)
      expect(result.missingRequired).toEqual([])
    })

    it('calculates partial scores accurately when some fields are filled', () => {
      const result = getProjectDetailsCompletionScore({
        title: 'Luxe by Sey',
        slug: 'luxe-by-sey',
        description: 'Brand identity',
      })
      expect(result.hasRequired).toBe(true)
      expect(result.score).toBe(3)
      expect(result.percentage).toBe(43)
      expect(result.missingRequired).toEqual([])
    })
  })

  describe('formatProjectDetailsSubtitle', () => {
    it('combines title, role, and duration with bullet dividers', () => {
      const formatted = formatProjectDetailsSubtitle('Luxe by Sey', 'Brand Designer', '4 Days')
      expect(formatted).toBe('Luxe by Sey • Brand Designer • 4 Days')
    })

    it('falls back to "Untitled Project" when title is absent', () => {
      expect(formatProjectDetailsSubtitle('', 'Brand Designer')).toBe('Untitled Project • Brand Designer')
      expect(formatProjectDetailsSubtitle(null, null, null)).toBe('Untitled Project')
    })

    it('trims extra whitespace from inputs', () => {
      const formatted = formatProjectDetailsSubtitle('  Luxe by Sey  ', ' Lead Designer ', ' 1 Week ')
      expect(formatted).toBe('Luxe by Sey • Lead Designer • 1 Week')
    })
  })

  describe('truncateDetailsPreview', () => {
    it('returns short text unchanged', () => {
      expect(truncateDetailsPreview('Short note', 20)).toBe('Short note')
    })

    it('truncates long text and appends ellipsis', () => {
      const truncated = truncateDetailsPreview(
        'A luxury hair and beauty brand identity designed to communicate elegance',
        30
      )
      expect(truncated).toBe('A luxury hair and beauty brand…')
      expect(truncated.length).toBeLessThanOrEqual(31)
    })

    it('handles null, undefined, and empty string gracefully', () => {
      expect(truncateDetailsPreview('')).toBe('')
      expect(truncateDetailsPreview(null)).toBe('')
      expect(truncateDetailsPreview(undefined)).toBe('')
    })
  })

  describe('hasCoverImageSet', () => {
    it('returns true if card_image is set', () => {
      expect(hasCoverImageSet('/path/to/card.png', '')).toBe(true)
    })

    it('returns true if cover_image is set', () => {
      expect(hasCoverImageSet('', '/path/to/cover.png')).toBe(true)
    })

    it('returns false if both are empty or whitespace', () => {
      expect(hasCoverImageSet('', '')).toBe(false)
      expect(hasCoverImageSet('   ', null)).toBe(false)
    })
  })

  describe('isCoreMetaEmpty', () => {
    it('returns true for null or empty object', () => {
      expect(isCoreMetaEmpty(null)).toBe(true)
      expect(isCoreMetaEmpty({})).toBe(true)
    })

    it('returns false if title is provided', () => {
      expect(isCoreMetaEmpty({ title: 'Luxe by Sey' })).toBe(false)
    })

    it('returns false if card_image is provided', () => {
      expect(isCoreMetaEmpty({ card_image: '/card.png' })).toBe(false)
    })

    it('returns false if featured is true', () => {
      expect(isCoreMetaEmpty({ featured: true })).toBe(false)
    })
  })

  describe('getFeaturedStatusBadge', () => {
    it('returns featured badge for truthy values', () => {
      const badge = getFeaturedStatusBadge(true)
      expect(badge.isFeatured).toBe(true)
      expect(badge.label).toBe('Featured on Home')
      expect(badge.badgeClass).toContain('text-accent-soft')
    })

    it('returns standard project badge for falsy or null values', () => {
      const badge = getFeaturedStatusBadge(false)
      expect(badge.isFeatured).toBe(false)
      expect(badge.label).toBe('Standard Project')
      expect(badge.badgeClass).toContain('text-mist-2')

      expect(getFeaturedStatusBadge(null).isFeatured).toBe(false)
    })
  })

  describe('getProjectDetailsCardState', () => {
    it('returns "open" when true', () => {
      expect(getProjectDetailsCardState(true)).toBe('open')
    })

    it('returns "collapsed" when false', () => {
      expect(getProjectDetailsCardState(false)).toBe('collapsed')
    })
  })

  describe('Multi-Section Collapsed State Helpers', () => {
    it('isAllSectionsCollapsed returns true when all sections are false', () => {
      expect(
        isAllSectionsCollapsed({
          overview: false,
          strategy: false,
          logo: false,
          colors: false,
        })
      ).toBe(true)
    })

    it('isAllSectionsCollapsed returns false if any section is true', () => {
      expect(
        isAllSectionsCollapsed({
          overview: false,
          strategy: true,
          logo: false,
        })
      ).toBe(false)
    })

    it('toggleAllSectionStates expands all when all were collapsed', () => {
      const initial = { secA: false, secB: false }
      const toggled = toggleAllSectionStates(initial)
      expect(toggled).toEqual({ secA: true, secB: true })
    })

    it('toggleAllSectionStates collapses all when at least one was expanded', () => {
      const initial = { secA: true, secB: false }
      const toggled = toggleAllSectionStates(initial)
      expect(toggled).toEqual({ secA: false, secB: false })
    })

    it('toggleAllSectionStates respects explicit forceOpen parameter', () => {
      const initial = { secA: true, secB: true }
      expect(toggleAllSectionStates(initial, true)).toEqual({ secA: true, secB: true })
      expect(toggleAllSectionStates(initial, false)).toEqual({ secA: false, secB: false })
    })
  })

  describe('Section Formatting & Tooltip Helpers', () => {
    it('getSectionCollapseTooltip returns appropriate instruction', () => {
      expect(getSectionCollapseTooltip(true, 'Overview')).toBe('Click to collapse Overview')
      expect(getSectionCollapseTooltip(false, 'Overview')).toBe('Click to expand Overview')
    })

    it('formatSectionStepNumber pads single digit numbers with leading zero', () => {
      expect(formatSectionStepNumber(1)).toBe('01')
      expect(formatSectionStepNumber(7)).toBe('07')
      expect(formatSectionStepNumber(10)).toBe('10')
      expect(formatSectionStepNumber(15)).toBe('15')
    })
  })
})






