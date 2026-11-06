// tests/unit/project-classification.test.ts
import { describe, it, expect } from 'vitest'
import {
  formatClassificationSummary,
  isClassificationConfigured,
  getClassificationBadgeClass,
  getClassificationHelpText,
  getClassificationAriaLabel,
  isBrandIdentityType,
  isUIUXType,
  isWebDevType,
  getClassificationToggleTooltip,
  formatClassificationBadge,
} from '@/lib/project-classification'

describe('Project Classification Helpers', () => {
  describe('formatClassificationSummary', () => {
    it('formats type and category with bullet separator', () => {
      expect(formatClassificationSummary('Brand Identity', 'Graphic Design')).toBe(
        'Brand Identity • Graphic Design'
      )
    })

    it('falls back gracefully when arguments are missing or null', () => {
      expect(formatClassificationSummary(null, null)).toBe(
        'UI/UX Design • Unassigned Category'
      )
      expect(formatClassificationSummary('Web Development', '')).toBe(
        'Web Development • Unassigned Category'
      )
    })
  })

  describe('isClassificationConfigured', () => {
    it('returns true when both values are non-empty strings', () => {
      expect(isClassificationConfigured('Brand Identity', 'Graphic Design')).toBe(true)
    })

    it('returns false when either value is empty, null, or whitespace', () => {
      expect(isClassificationConfigured('Brand Identity', null)).toBe(false)
      expect(isClassificationConfigured(null, 'Graphic Design')).toBe(false)
      expect(isClassificationConfigured('   ', 'Graphic Design')).toBe(false)
      expect(isClassificationConfigured('Brand Identity', '  ')).toBe(false)
    })
  })

  describe('getClassificationBadgeClass', () => {
    it('returns violet token classes for Brand Identity', () => {
      const cls = getClassificationBadgeClass('Brand Identity')
      expect(cls).toContain('bg-primary/15')
      expect(cls).toContain('text-accent-soft')
    })

    it('returns secondary token classes for Web Development', () => {
      const cls = getClassificationBadgeClass('Web Development')
      expect(cls).toContain('text-secondary')
    })

    it('returns cyan classes for UI/UX Design', () => {
      const cls = getClassificationBadgeClass('UI/UX Design')
      expect(cls).toContain('text-cyan-300')
    })

    it('returns neutral glass classes for other categories', () => {
      const cls = getClassificationBadgeClass('Other / General')
      expect(cls).toContain('bg-white/5')
    })
  })

  describe('getClassificationHelpText', () => {
    it('returns Brand Identity specific description', () => {
      expect(getClassificationHelpText('Brand Identity')).toContain('logo marks')
    })

    it('returns Web Development specific description', () => {
      expect(getClassificationHelpText('Web Development')).toContain('tech stack')
    })

    it('defaults to UI/UX Design description', () => {
      expect(getClassificationHelpText('UI/UX Design')).toContain('user flows')
      expect(getClassificationHelpText(null)).toContain('user flows')
    })
  })

  describe('getClassificationAriaLabel', () => {
    it('generates collapse label when panel is open', () => {
      expect(getClassificationAriaLabel(true, 'Brand Identity')).toBe(
        'Collapse Project Architecture & Classification settings for Brand Identity'
      )
    })

    it('generates expand label when panel is closed', () => {
      expect(getClassificationAriaLabel(false, 'Web Development')).toBe(
        'Expand Project Architecture & Classification settings for Web Development'
      )
    })

    it('falls back to default type if project type is missing', () => {
      expect(getClassificationAriaLabel(true, null)).toBe(
        'Collapse Project Architecture & Classification settings for UI/UX Design'
      )
    })
  })

  describe('isBrandIdentityType', () => {
    it('returns true for exact or case-insensitive Brand Identity match', () => {
      expect(isBrandIdentityType('Brand Identity')).toBe(true)
      expect(isBrandIdentityType('brand identity')).toBe(true)
      expect(isBrandIdentityType('  Brand Identity  ')).toBe(true)
    })

    it('returns false for other types or null', () => {
      expect(isBrandIdentityType('UI/UX Design')).toBe(false)
      expect(isBrandIdentityType('Web Development')).toBe(false)
      expect(isBrandIdentityType(null)).toBe(false)
    })
  })

  describe('isUIUXType', () => {
    it('returns true for UI/UX variants', () => {
      expect(isUIUXType('UI/UX Design')).toBe(true)
      expect(isUIUXType('ui/ux')).toBe(true)
      expect(isUIUXType('Product Design')).toBe(true)
    })

    it('returns false for other types or null', () => {
      expect(isUIUXType('Brand Identity')).toBe(false)
      expect(isUIUXType('Web Development')).toBe(false)
      expect(isUIUXType(null)).toBe(false)
    })
  })
})
