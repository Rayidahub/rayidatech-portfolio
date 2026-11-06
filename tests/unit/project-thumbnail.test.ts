// tests/unit/project-thumbnail.test.ts
import { describe, it, expect } from 'vitest'
import {
  isValidImageUrl,
  getProjectCoverImage,
  formatCoverImageAlt,
  isDataImageUrl,
  isExternalImageUrl,
  isLocalImageUrl,
  sanitizeCoverImageUrl,
  getCoverImagePlaceholderTitle,
  getThumbnailAspectRatioClass,
} from '@/lib/project-thumbnail'

describe('Project Cover Image & Thumbnail Utilities', () => {
  describe('isValidImageUrl', () => {
    it('accepts valid absolute web URLs with http or https', () => {
      expect(isValidImageUrl('https://images.unsplash.com/photo-123')).toBe(true)
      expect(isValidImageUrl('http://example.com/cover.png')).toBe(true)
    })

    it('accepts valid relative paths', () => {
      expect(isValidImageUrl('/img/projects/luxe.jpg')).toBe(true)
      expect(isValidImageUrl('./assets/preview.webp')).toBe(true)
    })

    it('accepts data URLs', () => {
      expect(isValidImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA')).toBe(true)
    })

    it('rejects null, undefined, or empty strings', () => {
      expect(isValidImageUrl(null)).toBe(false)
      expect(isValidImageUrl(undefined)).toBe(false)
      expect(isValidImageUrl('')).toBe(false)
      expect(isValidImageUrl('   ')).toBe(false)
    })

    it('rejects invalid schemes or non-image strings', () => {
      expect(isValidImageUrl('javascript:alert(1)')).toBe(false)
      expect(isValidImageUrl('file:///etc/passwd')).toBe(false)
      expect(isValidImageUrl('ftp://example.com/image.png')).toBe(false)
    })
  })

  describe('getProjectCoverImage', () => {
    it('returns cover_image directly when present', () => {
      const project = {
        title: 'Luxe by Sey',
        cover_image: 'https://images.unsplash.com/photo-1522337360788',
      }
      expect(getProjectCoverImage(project as any)).toBe(
        'https://images.unsplash.com/photo-1522337360788'
      )
    })

    it('falls back to case_study.overview_image when cover_image is missing', () => {
      const project = {
        title: 'Luxe by Sey',
        cover_image: null,
        case_study: {
          overview_image: '/img/luxe-overview.jpg',
        },
      }
      expect(getProjectCoverImage(project as any)).toBe('/img/luxe-overview.jpg')
    })

    it('falls back to case_study.primary_logo when both cover_image and overview_image are missing', () => {
      const project = {
        title: 'Luxe by Sey',
        cover_image: '',
        case_study: {
          primary_logo: '/img/luxe-logo.svg',
        },
      }
      expect(getProjectCoverImage(project as any)).toBe('/img/luxe-logo.svg')
    })

    it('falls back to case_study.hero_image when present', () => {
      const project = {
        title: 'Fintech App',
        case_study: {
          hero_image: '/img/hero.png',
        },
      }
      expect(getProjectCoverImage(project as any)).toBe('/img/hero.png')
    })

    it('returns null when project is null or has no valid image fields', () => {
      expect(getProjectCoverImage(null)).toBe(null)
      expect(getProjectCoverImage(undefined)).toBe(null)
      expect(getProjectCoverImage({ title: 'Untitled' } as any)).toBe(null)
      expect(
        getProjectCoverImage({
          cover_image: '   ',
          case_study: { overview_image: '' },
        } as any)
      ).toBe(null)
    })
  })

  describe('formatCoverImageAlt', () => {
    it('formats a clean alt text based on project title', () => {
      expect(formatCoverImageAlt('Luxe by Sey')).toBe('Luxe by Sey cover preview')
      expect(formatCoverImageAlt('PayFlex')).toBe('PayFlex cover preview')
    })

    it('handles empty or missing title gracefully', () => {
      expect(formatCoverImageAlt(null)).toBe('Project cover preview')
      expect(formatCoverImageAlt('')).toBe('Project cover preview')
    })
  })

  describe('isDataImageUrl', () => {
    it('identifies valid data URLs correctly', () => {
      expect(isDataImageUrl('data:image/png;base64,abc123==')).toBe(true)
      expect(isDataImageUrl('data:image/jpeg;base64,xyz789==')).toBe(true)
    })

    it('rejects non-data URLs and invalid inputs', () => {
      expect(isDataImageUrl('https://example.com/img.jpg')).toBe(false)
      expect(isDataImageUrl('/img/local.png')).toBe(false)
      expect(isDataImageUrl(null)).toBe(false)
      expect(isDataImageUrl(undefined)).toBe(false)
    })
  })

  describe('isExternalImageUrl', () => {
    it('identifies http and https URLs correctly', () => {
      expect(isExternalImageUrl('https://images.unsplash.com/photo')).toBe(true)
      expect(isExternalImageUrl('http://example.com/hero.jpg')).toBe(true)
    })

    it('rejects relative paths and null values', () => {
      expect(isExternalImageUrl('/img/projects/cover.png')).toBe(false)
      expect(isExternalImageUrl(null)).toBe(false)
    })
  })
})
