import { describe, it, expect } from 'vitest'
import {
  getProjectDetailsAriaLabel,
  getProjectDetailsToggleTooltip,
  getCoverSummaryStatus,
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
})

