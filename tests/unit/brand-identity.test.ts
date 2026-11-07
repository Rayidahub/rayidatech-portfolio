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
  formatDeliverableCategoryBadge,
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

    it('sorts deliverables by display_order ascending and ignores invisible or empty-image items', () => {
      const caseStudy = {
        brand_applications: [
          {
            id: 'app-3',
            title: 'Third Item',
            primary_image: '/img/3.png',
            display_order: 3,
            is_visible: true,
          },
          {
            id: 'app-1',
            title: 'First Item',
            primary_image: '/img/1.png',
            display_order: 1,
            is_visible: true,
          },
          {
            id: 'app-hidden',
            title: 'Hidden Item',
            primary_image: '/img/hidden.png',
            is_visible: false,
          },
          {
            id: 'app-empty-img',
            title: 'Empty Img',
            primary_image: '   ',
            is_visible: true,
          },
        ],
      }

      const apps = normalizeBrandApplications(caseStudy)
      expect(apps.length).toBe(2)
      expect(apps[0].id).toBe('app-1')
      expect(apps[1].id).toBe('app-3')
    })
  })

  describe('getEffectiveApplicationLayout', () => {
    it('normalizes valid layouts case-insensitively', () => {
      expect(getEffectiveApplicationLayout('hero')).toBe('hero')
      expect(getEffectiveApplicationLayout('HERO')).toBe('hero')
      expect(getEffectiveApplicationLayout('centered')).toBe('centered')
      expect(getEffectiveApplicationLayout('Centered ')).toBe('centered')
      expect(getEffectiveApplicationLayout('split')).toBe('split')
      expect(getEffectiveApplicationLayout('editorial')).toBe('editorial')
      expect(getEffectiveApplicationLayout('wide')).toBe('wide')
    })

    it('falls back to "split" for invalid or missing layout strings', () => {
      expect(getEffectiveApplicationLayout(null)).toBe('split')
      expect(getEffectiveApplicationLayout(undefined)).toBe('split')
      expect(getEffectiveApplicationLayout('')).toBe('split')
      expect(getEffectiveApplicationLayout('random-layout')).toBe('split')
    })
  })

  describe('isBrandApplicationsSectionVisible', () => {
    it('returns true when at least one visible deliverable with an image is present', () => {
      const caseStudy = {
        brand_applications: [
          {
            title: 'Packaging Jar',
            primary_image: '/img/jar.png',
            is_visible: true,
          },
        ],
      }
      expect(isBrandApplicationsSectionVisible(caseStudy)).toBe(true)
    })

    it('returns false when no applications or only empty-image applications exist', () => {
      expect(isBrandApplicationsSectionVisible({})).toBe(false)
      expect(isBrandApplicationsSectionVisible(null)).toBe(false)
      expect(
        isBrandApplicationsSectionVisible({
          brand_applications: [
            { title: 'Packaging Jar', primary_image: '', is_visible: true },
          ],
        })
      ).toBe(false)
      expect(
        isBrandApplicationsSectionVisible({
          brand_applications: [
            { title: 'Packaging Jar', primary_image: '/img/jar.png', is_visible: false },
          ],
        })
      ).toBe(false)
    })
  })

  describe('normalizeBrandGalleryItems', () => {
    it('normalizes gallery items across brand_gallery and gallery_items', () => {
      const caseStudy = {
        brand_gallery: [
          {
            id: 'g-1',
            image_url: '/img/gallery-1.png',
            caption: 'Luxury Storefront Mockup',
            display_order: 1,
          },
        ],
      }
      const gallery = normalizeBrandGalleryItems(caseStudy)
      expect(gallery.length).toBe(1)
      expect(gallery[0].image_url).toBe('/img/gallery-1.png')
      expect(gallery[0].caption).toBe('Luxury Storefront Mockup')
    })

    it('handles string array representations gracefully', () => {
      const caseStudy = {
        gallery_items: ['/img/a.png', '/img/b.png'],
      }
      const gallery = normalizeBrandGalleryItems(caseStudy)
      expect(gallery.length).toBe(2)
      expect(gallery[0].image_url).toBe('/img/a.png')
      expect(gallery[1].image_url).toBe('/img/b.png')
    })
  })

  describe('normalizeBrandOutcomeDetails', () => {
    it('normalizes outcome, impact, and reflection across direct and description keys', () => {
      const caseStudy = {
        design_outcome: 'Established luxury market presence.',
        project_impact: '+180% premium perceived value in Q3.',
        personal_reflection: 'Deep exploration of tactile foil and dark amethyst finishes.',
      }
      const outcome = normalizeBrandOutcomeDetails(caseStudy)
      expect(outcome.hasConclusion).toBe(true)
      expect(outcome.outcomeDesc).toBe('Established luxury market presence.')
      expect(outcome.impactDesc).toBe('+180% premium perceived value in Q3.')
      expect(outcome.reflectionDesc).toBe(
        'Deep exploration of tactile foil and dark amethyst finishes.'
      )
    })

    it('returns empty conclusion when no outcome fields are populated', () => {
      const outcome = normalizeBrandOutcomeDetails({})
      expect(outcome.hasConclusion).toBe(false)
      expect(outcome.outcomeDesc).toBe('')
      expect(outcome.impactDesc).toBe('')
      expect(outcome.reflectionDesc).toBe('')
    })
  })

  describe('formatApplicationDeliverableSummary', () => {
    it('formats category and uppercase layout mode', () => {
      const app = {
        id: '1',
        title: 'Packaging Jar',
        category: 'Product Packaging' as const,
        primary_image: '/img/jar.png',
        layout_preference: 'centered' as const,
        display_order: 1,
        is_visible: true,
      }
      expect(formatApplicationDeliverableSummary(app)).toBe(
        'Product Packaging • CENTERED Mode'
      )
    })
  })

  describe('formatDeliverableCategoryBadge', () => {
    it('returns trimmed category name when provided', () => {
      expect(formatDeliverableCategoryBadge('Product Packaging')).toBe('Product Packaging')
      expect(formatDeliverableCategoryBadge('  Shopping Bag  ')).toBe('Shopping Bag')
    })

    it('falls back to "Brand Application" when missing or blank', () => {
      expect(formatDeliverableCategoryBadge('')).toBe('Brand Application')
      expect(formatDeliverableCategoryBadge(null)).toBe('Brand Application')
      expect(formatDeliverableCategoryBadge('   ')).toBe('Brand Application')
    })
  })


  describe('Luxe by Sey Deliverables Suite Real-World Integration (Section 7)', () => {
    it('properly resolves all 5 brand application deliverables from case study JSONB', () => {
      const luxeCaseStudy = {
        case_study_type: 'Brand Identity',
        brand_applications: [
          {
            id: 'app-packaging',
            title: 'Product Packaging Mockup',
            category: 'Product Packaging',
            primary_image:
              'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/1793980693018-luxurious-purple-skincare-jar.png',
            layout_preference: 'centered',
            description: 'High-resolution tactile application mockup showcase',
            display_order: 1,
            is_visible: true,
          },
          {
            id: 'app-bag',
            title: 'Luxury Shopping Bag',
            category: 'Shopping Bag',
            primary_image:
              'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/shopping-bag.png',
            layout_preference: 'split',
            description: 'Matte black shopping tote with embossed gold monogram',
            display_order: 2,
            is_visible: true,
          },
          {
            id: 'app-apparel',
            title: 'Staff Polo & Uniforms',
            category: 'Polo / Apparel',
            primary_image:
              'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/polo.png',
            layout_preference: 'editorial',
            description: 'Embroidered salon team uniform',
            display_order: 3,
            is_visible: true,
          },
          {
            id: 'app-transport',
            title: 'Delivery Van Livery',
            category: 'Transport & Fleet',
            primary_image:
              'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/van.png',
            layout_preference: 'wide',
            description: 'Full vehicle wrap for product dispatch',
            display_order: 4,
            is_visible: true,
          },
          {
            id: 'app-billboard',
            title: 'City Center Billboard',
            category: 'Billboard & OOH',
            primary_image:
              'https://grtvnrqzmbndbjljramm.supabase.co/storage/v1/object/public/hero-slides/projects/billboard.png',
            layout_preference: 'hero',
            description: 'Airport arrival corridor digital billboard',
            display_order: 5,
            is_visible: true,
          },
        ],
      }

      const visible = isBrandApplicationsSectionVisible(luxeCaseStudy)
      expect(visible).toBe(true)

      const apps = normalizeBrandApplications(luxeCaseStudy)
      expect(apps.length).toBe(5)

      // Verifying item 1 (matching user screenshot)
      expect(apps[0].id).toBe('app-packaging')
      expect(apps[0].title).toBe('Product Packaging Mockup')
      expect(apps[0].category).toBe('Product Packaging')
      expect(apps[0].layout_preference).toBe('centered')
      expect(apps[0].primary_image).toContain('1793980693018')

      // Verifying layout preferences are preserved
      expect(apps.map((a) => a.layout_preference)).toEqual([
        'centered',
        'split',
        'editorial',
        'wide',
        'hero',
      ])
    })
  })
})









