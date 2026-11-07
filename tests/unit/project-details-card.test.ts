import { describe, it, expect } from 'vitest'
import {
  getProjectDetailsAriaLabel,
  getProjectDetailsToggleTooltip,
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
})
