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
  filterVisibleBrandApplications,
  normalizeBrandApplications,
  getEffectiveApplicationLayout,
  isBrandApplicationsSectionVisible,
  normalizeBrandGalleryItems,
  normalizeBrandOutcomeDetails,
  formatApplicationDeliverableSummary,
  getBrandColorCssVariable,
  getTypographyFontFamily,
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

    it('filters out invisible or empty-image brand applications', () => {
      const apps = [
        { id: '1', title: 'Packaging Box', image_url: '/img/box.png', is_visible: true },
        { id: '2', title: 'Shopping Bag', image_url: '', is_visible: true },
        { id: '3', title: 'Ribbon', image_url: '/img/ribbon.png', is_visible: false },
        { id: '4', title: 'Business Card', image_url: '/img/card.png' },
      ]
      const visible = filterVisibleBrandApplications(apps as any)
      expect(visible.length).toBe(2)
      expect(visible.map((a) => a.id)).toEqual(['1', '4'])
    })

    it('derives slugified CSS variable names from brand color titles', () => {
      const color = { name: 'Royal Velvet Purple', hex: '#8000ff' }
      const res = getBrandColorCssVariable(color as any)
      expect(res.variableName).toBe('--brand-royal-velvet-purple')
      expect(res.cssValue).toBe('#8000ff')
    })

    it('generates fallback font stacks based on brand typography roles', () => {
      expect(getTypographyFontFamily({ role: 'display', font_family: 'Playfair Display' } as any)).toContain('Playfair Display')
      expect(getTypographyFontFamily({ role: 'accent', font_family: 'Cormorant' } as any)).toContain('serif')
      expect(getTypographyFontFamily({ role: 'body', font_family: 'Inter' } as any)).toContain('Inter')
    })
  })

  describe('Brand Applications Normalization & Visibility (Section 7)', () => {
    it('normalizes applications from brand_applications key (Section 7)', () => {
      const caseStudy = {
        brand_applications: [
          {
            id: 'app-1',
            title: 'Product Packaging Mockup',
            category: 'Product Packaging',
            primary_image: 'https://supabase.co/storage/v1/object/public/hero-slides/projects/luxe-jar.png',
            layout_preference: 'centered',
            description: 'High-resolution tactile application mockup showcase',
            is_visible: true,
            display_order: 1,
          },
        ],
      }

      const apps = normalizeBrandApplications(caseStudy)
      expect(apps.length).toBe(1)
      expect(apps[0].title).toBe('Product Packaging Mockup')
      expect(apps[0].category).toBe('Product Packaging')
      expect(apps[0].layout_preference).toBe('centered')
      expect(apps[0].primary_image).toContain('luxe-jar.png')
    })

    it('falls back to legacy applications and deliverables keys seamlessly', () => {
      const fromApps = normalizeBrandApplications({
        applications: [
          {
            title: 'Shopping Bag',
            primary_image: '/img/bag.png',
            category: 'Shopping Bag',
          },
        ],
      })
      expect(fromApps.length).toBe(1)
      expect(fromApps[0].title).toBe('Shopping Bag')

      const fromDeliverables = normalizeBrandApplications({
        deliverables: [
          {
            name: 'Polo Shirt',
            image: '/img/polo.png',
          },
        ],
      })
      expect(fromDeliverables.length).toBe(1)
      expect(fromDeliverables[0].title).toBe('Polo Shirt')
      expect(fromDeliverables[0].primary_image).toBe('/img/polo.png')

      expect(normalizeBrandApplications(null)).toEqual([])
      expect(normalizeBrandApplications({})).toEqual([])
      expect(normalizeBrandApplications({ brand_applications: [] })).toEqual([])
    })
  })
})


