import { describe, it, expect } from 'vitest'
import {
  isProjectPublished,
  getProjectStatus,
  getProjectStatusBadge,
  buildStatusPayload,
} from '@/lib/project-status'
import type { Project } from '@/types/project'

describe('Project Status & Draft System', () => {
  describe('isProjectPublished', () => {
    it('returns false when top-level published is false', () => {
      const project: Partial<Project> = {
        title: 'Draft Mobile App',
        published: false,
      }
      expect(isProjectPublished(project)).toBe(false)
    })

    it('returns true when top-level published is true', () => {
      const project: Partial<Project> = {
        title: 'Live Mobile App',
        published: true,
      }
      expect(isProjectPublished(project)).toBe(true)
    })

    it('returns false when top-level status is draft', () => {
      const project: Partial<Project> = {
        title: 'Draft In Progress',
        status: 'draft',
      }
      expect(isProjectPublished(project)).toBe(false)
    })

    it('returns true when top-level status is published', () => {
      const project: Partial<Project> = {
        title: 'Published Case Study',
        status: 'published',
      }
      expect(isProjectPublished(project)).toBe(true)
    })

    it('returns false when case_study JSONB specifies published: false', () => {
      const project: Partial<Project> = {
        title: 'Brand Identity Project',
        case_study: {
          case_study_type: 'Brand Identity',
          published: false,
        },
      }
      expect(isProjectPublished(project)).toBe(false)
    })

    it('returns false when case_study JSONB specifies status: draft', () => {
      const project: Partial<Project> = {
        title: 'Brand Identity Project',
        case_study: {
          case_study_type: 'Brand Identity',
          status: 'draft',
        },
      }
      expect(isProjectPublished(project)).toBe(false)
    })

    it('returns true when case_study JSONB specifies published: true', () => {
      const project: Partial<Project> = {
        title: 'Brand Identity Project',
        case_study: {
          case_study_type: 'Brand Identity',
          published: true,
        },
      }
      expect(isProjectPublished(project)).toBe(true)
    })

    it('defaults to true for legacy records with no status set to keep portfolio intact', () => {
      const legacyProject: Partial<Project> = {
        title: 'Legacy FinTech Project',
        case_study: { client: 'Acme Bank' },
      }
      expect(isProjectPublished(legacyProject)).toBe(true)
    })

    it('prioritizes top-level published over JSONB case study if both exist', () => {
      const project: Partial<Project> = {
        published: false,
        case_study: { published: true, status: 'published' },
      }
      expect(isProjectPublished(project)).toBe(false)
    })

    it('correctly filters an array of projects leaving only published items', () => {
      const list: Partial<Project>[] = [
        { id: '1', title: 'P1', published: true },
        { id: '2', title: 'P2', published: false },
        { id: '3', title: 'P3', case_study: { status: 'draft' } },
        { id: '4', title: 'P4' }, // legacy default
      ]
      const visible = list.filter(isProjectPublished)
      expect(visible.map((p) => p.id)).toEqual(['1', '4'])
    })

    it('returns false when project is null or undefined', () => {
      expect(isProjectPublished(null)).toBe(false)
      expect(isProjectPublished(undefined)).toBe(false)
    })
  })

  describe('getProjectStatus', () => {
    it('returns draft for unpublished projects', () => {
      expect(getProjectStatus({ published: false })).toBe('draft')
      expect(getProjectStatus({ case_study: { status: 'draft' } })).toBe('draft')
    })

    it('returns published for active projects', () => {
      expect(getProjectStatus({ published: true })).toBe('published')
      expect(getProjectStatus({ title: 'Legacy' })).toBe('published')
    })
  })

  describe('getProjectStatusBadge', () => {
    it('returns amber styling for draft status', () => {
      const badge = getProjectStatusBadge('draft')
      expect(badge.label).toBe('Draft')
      expect(badge.badgeClass).toContain('amber')
      expect(badge.dotClass).toContain('amber')
    })

    it('returns emerald styling for published status', () => {
      const badge = getProjectStatusBadge('published')
      expect(badge.label).toBe('Published')
      expect(badge.badgeClass).toContain('emerald')
      expect(badge.dotClass).toContain('emerald')
    })
  })

  describe('buildStatusPayload', () => {
    it('builds draft payload when isDraft is true', () => {
      expect(buildStatusPayload(true)).toEqual({
        published: false,
        status: 'draft',
      })
    })

    it('builds published payload when isDraft is false', () => {
      expect(buildStatusPayload(false)).toEqual({
        published: true,
        status: 'published',
      })
    })
  })
})
