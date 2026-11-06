// tests/unit/project-action-bar.test.ts
import { describe, it, expect } from 'vitest'
import {
  getDraftButtonLabel,
  getPublishButtonLabel,
  getStatusToggleLabel,
  getStatusToggleClasses,
  getStatusPillClasses,
  isPublishedStatus,
  getProjectStatusBadge,
  getDraftShortcutHint,
} from '@/lib/project-action-bar'

describe('Project Action Bar Utilities', () => {
  describe('getDraftButtonLabel', () => {
    it('returns Saving... when saving is true', () => {
      expect(getDraftButtonLabel('new', 'draft', true)).toBe('Saving...')
      expect(getDraftButtonLabel('edit', 'published', true)).toBe('Saving...')
    })

    it('returns Save as Draft when creating a new project', () => {
      expect(getDraftButtonLabel('new', 'draft', false)).toBe('Save as Draft')
      expect(getDraftButtonLabel('new', 'published', false)).toBe('Save as Draft')
    })

    it('returns Update Draft when editing an existing draft project', () => {
      expect(getDraftButtonLabel('edit', 'draft', false)).toBe('Update Draft')
    })

    it('returns Switch to Draft when editing an existing published project', () => {
      expect(getDraftButtonLabel('edit', 'published', false)).toBe('Switch to Draft')
    })
  })

  describe('getPublishButtonLabel', () => {
    it('returns Publishing... when saving is true', () => {
      expect(getPublishButtonLabel('new', 'draft', true)).toBe('Publishing...')
      expect(getPublishButtonLabel('edit', 'published', true)).toBe('Publishing...')
    })

    it('returns Publish Project when creating a new project', () => {
      expect(getPublishButtonLabel('new', 'draft', false)).toBe('Publish Project')
    })

    it('returns Save Changes when editing a currently published project', () => {
      expect(getPublishButtonLabel('edit', 'published', false)).toBe('Save Changes')
    })

    it('returns Publish Project when editing an existing draft project', () => {
      expect(getPublishButtonLabel('edit', 'draft', false)).toBe('Publish Project')
    })
  })
})
