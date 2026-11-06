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
  getImageFileName,
  formatImageResolutionLabel,
  getDominantColorPlaceholder,
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

  describe('isLocalImageUrl', () => {
    it('identifies local root-relative and dot-relative paths', () => {
      expect(isLocalImageUrl('/img/projects/luxe.jpg')).toBe(true)
      expect(isLocalImageUrl('./assets/banner.png')).toBe(true)
    })

    it('rejects protocol-relative and remote urls', () => {
      expect(isLocalImageUrl('//cdn.example.com/image.png')).toBe(false)
      expect(isLocalImageUrl('https://example.com/photo.jpg')).toBe(false)
    })
  })

  describe('sanitizeCoverImageUrl', () => {
    it('returns clean trimmed url for valid candidates', () => {
      expect(sanitizeCoverImageUrl('  https://example.com/cover.png  ')).toBe('https://example.com/cover.png')
      expect(sanitizeCoverImageUrl('  /img/luxe.jpg  ')).toBe('/img/luxe.jpg')
    })

    it('neutralizes invalid or harmful strings to null', () => {
      expect(sanitizeCoverImageUrl('javascript:alert("pwned")')).toBe(null)
      expect(sanitizeCoverImageUrl('')).toBe(null)
      expect(sanitizeCoverImageUrl(null)).toBe(null)
    })
  })

  describe('getCoverImagePlaceholderTitle', () => {
    it('formats a descriptive placeholder title with project name', () => {
      expect(getCoverImagePlaceholderTitle('Luxe by Sey')).toBe(
        'No cover image set for "Luxe by Sey". Click to add one.'
      )
    })

    it('falls back to "Project" when title is omitted', () => {
      expect(getCoverImagePlaceholderTitle(null)).toBe(
        'No cover image set for "Project". Click to add one.'
      )
    })
  })

  describe('getThumbnailAspectRatioClass', () => {
    it('returns correct Tailwind aspect ratio classes', () => {
      expect(getThumbnailAspectRatioClass('16/10')).toBe('aspect-[16/10]')
      expect(getThumbnailAspectRatioClass('16/9')).toBe('aspect-video')
      expect(getThumbnailAspectRatioClass('4/3')).toBe('aspect-[4/3]')
      expect(getThumbnailAspectRatioClass('1/1')).toBe('aspect-square')
    })
  })

  describe('getImageFileName', () => {
    it('extracts filename cleanly from simple paths', () => {
      expect(getImageFileName('/img/projects/cover.png')).toBe('cover.png')
      expect(getImageFileName('https://example.com/assets/banner.webp')).toBe('banner.webp')
    })

    it('strips query parameters and hashes from filename', () => {
      expect(getImageFileName('https://images.unsplash.com/photo-123?w=800&q=80')).toBe('photo-123')
    })

    it('returns default fallback when input is empty or invalid', () => {
      expect(getImageFileName(null)).toBe('image.jpg')
      expect(getImageFileName('')).toBe('image.jpg')
    })
  })

  describe('formatImageResolutionLabel', () => {
    it('formats valid positive dimensions cleanly', () => {
      expect(formatImageResolutionLabel(1920, 1080)).toBe('1920×1080')
      expect(formatImageResolutionLabel(800.4, 600.2)).toBe('800×600')
    })

    it('returns null for missing, zero, or negative dimensions', () => {
      expect(formatImageResolutionLabel(0, 100)).toBe(null)
      expect(formatImageResolutionLabel(100, 0)).toBe(null)
      expect(formatImageResolutionLabel(-50, 100)).toBe(null)
      expect(formatImageResolutionLabel(undefined, undefined)).toBe(null)
    })
  })

  describe('getDominantColorPlaceholder', () => {
    it('returns violet token for Brand Identity', () => {
      expect(getDominantColorPlaceholder('Brand Identity')).toBe('#8000ff')
      expect(getDominantColorPlaceholder('brand')).toBe('#8000ff')
    })

    it('returns cyan token for Web Development', () => {
      expect(getDominantColorPlaceholder('Web Development')).toBe('#00d1ff')
    })

    it('returns soft accent token for UI/UX Design', () => {
      expect(getDominantColorPlaceholder('UI/UX Design')).toBe('#ccccff')
    })

    it('returns ink background token for other categories', () => {
      expect(getDominantColorPlaceholder('Other / General')).toBe('#1a1a2e')
      expect(getDominantColorPlaceholder(null)).toBe('#1a1a2e')
    })
  })
})
