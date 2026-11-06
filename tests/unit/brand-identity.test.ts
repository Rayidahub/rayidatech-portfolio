import { describe, it, expect } from 'vitest'
import { PROJECT_TYPES, type Project } from '@/types/project'
import {
  isValidHex,
  hexToRgb,
  getContrastTextColor,
  formatColorClassification,
  inferProjectType,
  parsePillList,
  clampLightboxIndex,
  getBrandApplicationLayoutClasses,
  normalizeBrandCaseStudy,
  validateBrandCaseStudy,
  isBrandIdentityCaseStudy,
} from '@/lib/brand-identity'

describe('Brand Identity Architecture & Types', () => {
  it('defines the standard project types supported by the system', () => {
    expect(PROJECT_TYPES).toEqual([
      'UI/UX Design',
      'Brand Identity',
      'Web Development',
      'Other / General',
    ])
  })

  describe('Color Manipulation & Validation', () => {
    it('validates 3-digit and 6-digit hex color strings', () => {
      expect(isValidHex('#8000ff')).toBe(true)
      expect(isValidHex('8000ff')).toBe(true)
      expect(isValidHex('#fff')).toBe(true)
      expect(isValidHex('000')).toBe(true)
      expect(isValidHex('')).toBe(false)
      expect(isValidHex('#12345')).toBe(false)
      expect(isValidHex('#1234567')).toBe(false)
      expect(isValidHex('not-a-color')).toBe(false)
    })

    it('correctly converts valid hex codes to standard RGB format', () => {
      expect(hexToRgb('#8000ff')).toBe('rgb(128, 0, 255)')
      expect(hexToRgb('#00d1ff')).toBe('rgb(0, 209, 255)')
      expect(hexToRgb('#fff')).toBe('rgb(255, 255, 255)')
      expect(hexToRgb('#000')).toBe('rgb(0, 0, 0)')
      expect(hexToRgb('1a1a2e')).toBe('rgb(26, 26, 46)')
      expect(hexToRgb('invalid')).toBeNull()
    })

    it('calculates optimal text contrast for light vs dark backgrounds', () => {
      expect(getContrastTextColor('#ffffff')).toBe('dark')
      expect(getContrastTextColor('#f2f2f2')).toBe('dark')
      expect(getContrastTextColor('#000000')).toBe('light')
      expect(getContrastTextColor('#1a1a2e')).toBe('light')
      expect(getContrastTextColor('#8000ff')).toBe('light')
    })

    it('formats brand color classification labels cleanly', () => {
      expect(formatColorClassification('primary')).toBe('Primary')
      expect(formatColorClassification('secondary')).toBe('Secondary')
      expect(formatColorClassification('accent')).toBe('Accent')
      expect(formatColorClassification('neutral-dark')).toBe('Dark Neutral')
      expect(formatColorClassification('neutral-light')).toBe('Light Neutral')
      expect(formatColorClassification('background')).toBe('Background')
      expect(formatColorClassification(undefined)).toBe('Custom')
    })
  })

  describe('Project Type Inference', () => {
    it('infers project type from top-level column when present', () => {
      const project: Partial<Project> = {
        project_type: 'Brand Identity',
        tags: ['Branding'],
      }
      expect(inferProjectType(project)).toBe('Brand Identity')
    })

    it('infers project type from case_study JSONB when top-level column is absent', () => {
      const project: Partial<Project> = {
        tags: ['Design'],
        case_study: {
          case_study_type: 'Brand Identity',
          brand_overview: { industry: 'Hair & Beauty' },
        },
      }
      expect(inferProjectType(project)).toBe('Brand Identity')
    })

    it('infers project type from tags when case_study type is not specified', () => {
      const project: Partial<Project> = {
        tags: ['Hair & Beauty', 'Brand Identity', 'Packaging'],
      }
      expect(inferProjectType(project)).toBe('Brand Identity')
    })

    it('defaults to UI/UX Design when no project type hint exists', () => {
      const project: Partial<Project> = {
        tags: ['Mobile', 'Dashboard'],
      }
      expect(inferProjectType(project)).toBe('UI/UX Design')
    })
  })

  describe('Token & Text Extraction', () => {
    it('parses comma, bullet, and newline separated brand personality pills', () => {
      const commaSeparated = 'Sophisticated, Elegant, Modern, Feminine'
      expect(parsePillList(commaSeparated)).toEqual([
        'Sophisticated',
        'Elegant',
        'Modern',
        'Feminine',
      ])

      const bulletSeparated = '• Luxury\n• Minimalist\n• Confident'
      expect(parsePillList(bulletSeparated)).toEqual([
        'Luxury',
        'Minimalist',
        'Confident',
      ])

      const arrayInput = ['Timeless', 'Bold', 'Authentic']
      expect(parsePillList(arrayInput)).toEqual(['Timeless', 'Bold', 'Authentic'])
    })
  })

  describe('Lightbox & Presentation Utilities', () => {
    it('clamps lightbox navigation index with seamless wrap-around', () => {
      // 5 items total (indices 0, 1, 2, 3, 4)
      expect(clampLightboxIndex(0, 5, 1)).toBe(1)
      expect(clampLightboxIndex(4, 5, 1)).toBe(0) // wraps to start
      expect(clampLightboxIndex(0, 5, -1)).toBe(4) // wraps to end
      expect(clampLightboxIndex(0, 0, 1)).toBe(0) // empty gallery safe
    })

    it('returns appropriate layout classes for brand applications', () => {
      expect(getBrandApplicationLayoutClasses('hero').container).toContain('col-span-12')
      expect(getBrandApplicationLayoutClasses('split').container).toContain('md:col-span-6')
      expect(getBrandApplicationLayoutClasses('editorial').container).toContain('md:col-span-8')
      expect(getBrandApplicationLayoutClasses('wide').grid).toContain('md:grid-cols-2')
      expect(getBrandApplicationLayoutClasses('centered').container).toContain('lg:col-span-4')
    })
  })

  describe('Payload Normalization & Validation', () => {
    it('normalizes undefined or empty case study objects safely', () => {
      const normalized = normalizeBrandCaseStudy(null)
      expect(normalized.case_study_type).toBe('Brand Identity')
      expect(normalized.color_palette).toEqual([])
      expect(normalized.typography_system).toEqual([])
      expect(normalized.brand_applications).toEqual([])
    })

    it('validates color palettes and flags invalid hex codes', () => {
      const invalidCaseStudy = {
        color_palette: [
          { name: 'Royal Purple', hex: '#8000ff' },
          { name: 'Bad Color', hex: 'not-hex' },
        ],
      }
      const result = validateBrandCaseStudy(invalidCaseStudy)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBe(1)
      expect(result.errors[0]).toContain('invalid hex code')
    })

    it('approves a fully valid color palette', () => {
      const validCaseStudy = {
        color_palette: [
          { name: 'Royal Purple', hex: '#8000ff' },
          { name: 'Pure White', hex: '#ffffff' },
        ],
      }
      const result = validateBrandCaseStudy(validCaseStudy)
      expect(result.isValid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('identifies BrandIdentityCaseStudy shapes using isBrandIdentityCaseStudy', () => {
      expect(isBrandIdentityCaseStudy({ case_study_type: 'Brand Identity' })).toBe(true)
      expect(isBrandIdentityCaseStudy({ color_palette: [] })).toBe(true)
      expect(isBrandIdentityCaseStudy({ brand_applications: [] })).toBe(true)
      expect(isBrandIdentityCaseStudy({ case_study_type: 'UI/UX Design', wireframes: [] })).toBe(false)
      expect(isBrandIdentityCaseStudy(null)).toBe(false)
      expect(isBrandIdentityCaseStudy(undefined)).toBe(false)
      expect(isBrandIdentityCaseStudy('string')).toBe(false)
    })
  })
})
