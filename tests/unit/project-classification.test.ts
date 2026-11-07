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
  normalizeClassificationValues,
  getClassificationAccentColor,
  formatClassificationPillLabel,
  isClassificationValid,
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

  describe('isWebDevType', () => {
    it('returns true for web development variants', () => {
      expect(isWebDevType('Web Development')).toBe(true)
      expect(isWebDevType('web dev')).toBe(true)
      expect(isWebDevType('development')).toBe(true)
    })

    it('returns false for other types or null', () => {
      expect(isWebDevType('Brand Identity')).toBe(false)
      expect(isWebDevType('UI/UX Design')).toBe(false)
      expect(isWebDevType(null)).toBe(false)
    })
  })

  describe('getClassificationToggleTooltip', () => {
    it('returns collapse tooltip when panel is currently open', () => {
      expect(getClassificationToggleTooltip(true)).toBe(
        'Click to collapse architecture settings'
      )
    })

    it('returns expand tooltip when panel is currently closed', () => {
      expect(getClassificationToggleTooltip(false)).toBe(
        'Click to expand architecture settings'
      )
    })
  })

  describe('formatClassificationBadge', () => {
    it('returns formatted object with text and css classes', () => {
      const res = formatClassificationBadge('Brand Identity')
      expect(res.text).toBe('Brand Identity')
      expect(res.className).toContain('bg-primary/15')
    })

    it('defaults gracefully to UI/UX Design when null', () => {
      const res = formatClassificationBadge(null)
      expect(res.text).toBe('UI/UX Design')
    })
  })

  describe('normalizeClassificationValues', () => {
    it('normalizes type strings into valid ProjectType unions', () => {
      expect(normalizeClassificationValues('brand', 'Design').projectType).toBe('Brand Identity')
      expect(normalizeClassificationValues('web app', 'API').projectType).toBe('Web Development')
      expect(normalizeClassificationValues('other stuff', '').projectType).toBe('Other / General')
      expect(normalizeClassificationValues(null, null).projectType).toBe('UI/UX Design')
    })
  })

  describe('getClassificationAccentColor', () => {
    it('returns brand violet for Brand Identity', () => {
      expect(getClassificationAccentColor('Brand Identity')).toBe('#8000ff')
    })

    it('returns cyan for Web Development', () => {
      expect(getClassificationAccentColor('Web Development')).toBe('#00d1ff')
    })

    it('returns soft accent for UI/UX Design', () => {
      expect(getClassificationAccentColor('UI/UX Design')).toBe('#ccccff')
    })
  })

  describe('formatClassificationPillLabel', () => {
    it('returns short labels for badges', () => {
      expect(formatClassificationPillLabel('Brand Identity')).toBe('Brand')
      expect(formatClassificationPillLabel('Web Development')).toBe('Web')
      expect(formatClassificationPillLabel('UI/UX Design')).toBe('UI/UX')
      expect(formatClassificationPillLabel('Other')).toBe('Other')
    })
  })

  describe('isClassificationValid', () => {
    it('returns true when both fields are non-empty', () => {
      expect(isClassificationValid('Brand Identity', 'Graphic Design')).toBe(true)
    })

    it('returns false when either field is empty or missing', () => {
      expect(isClassificationValid('', 'Graphic Design')).toBe(false)
      expect(isClassificationValid('Brand Identity', '')).toBe(false)
      expect(isClassificationValid(null, null)).toBe(false)
    })
  })

  describe('Default Collapsed State Consistency', () => {
    it('generates expand ARIA label and tooltip when default collapsed (isOpen = false)', () => {
      const ariaLabel = getClassificationAriaLabel(false, 'Brand Identity')
      expect(ariaLabel).toBe('Expand Project Architecture & Classification settings for Brand Identity')

      const tooltip = getClassificationToggleTooltip(false)
      expect(tooltip).toBe('Click to expand architecture settings')
    })

    it('generates collapse ARIA label and tooltip when toggled open (isOpen = true)', () => {
      const ariaLabel = getClassificationAriaLabel(true, 'Brand Identity')
      expect(ariaLabel).toBe('Collapse Project Architecture & Classification settings for Brand Identity')

      const tooltip = getClassificationToggleTooltip(true)
      expect(tooltip).toBe('Click to collapse architecture settings')
    })
  })
})

