import { describe, it, expect } from 'vitest'
import { PROJECT_TYPES, type ProjectType, type Project } from '@/types/project'

/* ─────────────────────────────────────────────────────────────
   HEX TO RGB CONVERTER TEST (Matches BrandIdentityFields logic)
   ───────────────────────────────────────────────────────────── */
function hexToRgb(hex: string): string | null {
  const clean = hex.replace('#', '').trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null
    return `rgb(${r}, ${g}, ${b})`
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null
    return `rgb(${r}, ${g}, ${b})`
  }
  return null
}

/* ─────────────────────────────────────────────────────────────
   INFERRED PROJECT TYPE RESOLVER (Matches project pages logic)
   ───────────────────────────────────────────────────────────── */
function inferProjectType(project: Partial<Project>): ProjectType {
  if (project.project_type && PROJECT_TYPES.includes(project.project_type)) {
    return project.project_type
  }
  const cs = project.case_study as any
  if (cs?.case_study_type && PROJECT_TYPES.includes(cs.case_study_type)) {
    return cs.case_study_type
  }
  if (cs?.project_type && PROJECT_TYPES.includes(cs.project_type)) {
    return cs.project_type
  }
  if (Array.isArray(project.tags)) {
    if (project.tags.some((t) => t.toLowerCase() === 'brand identity')) {
      return 'Brand Identity'
    }
    if (project.tags.some((t) => t.toLowerCase() === 'web development')) {
      return 'Web Development'
    }
  }
  return 'UI/UX Design'
}

/* ─────────────────────────────────────────────────────────────
   PILL PARSER (Matches BrandIdentityCaseStudyPage logic)
   ───────────────────────────────────────────────────────────── */
function parsePills(val?: string | string[]): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean)
  return String(val)
    .split(/[,•\n]/)
    .map((s) => s.trim().replace(/^[•\-\*]\s*/, ''))
    .filter(Boolean)
}

describe('Brand Identity Architecture & Types', () => {
  it('defines the standard project types supported by the system', () => {
    expect(PROJECT_TYPES).toEqual([
      'UI/UX Design',
      'Brand Identity',
      'Web Development',
      'Other / General',
    ])
  })

  it('correctly converts 3-digit and 6-digit hex codes to RGB', () => {
    expect(hexToRgb('#8000ff')).toBe('rgb(128, 0, 255)')
    expect(hexToRgb('#00d1ff')).toBe('rgb(0, 209, 255)')
    expect(hexToRgb('#fff')).toBe('rgb(255, 255, 255)')
    expect(hexToRgb('1a1a2e')).toBe('rgb(26, 26, 46)')
    expect(hexToRgb('invalid')).toBeNull()
  })

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

  it('parses comma, bullet, and newline separated brand personality pills', () => {
    const commaSeparated = 'Sophisticated, Elegant, Modern, Feminine'
    expect(parsePills(commaSeparated)).toEqual([
      'Sophisticated',
      'Elegant',
      'Modern',
      'Feminine',
    ])

    const bulletSeparated = '• Luxury\n• Minimalist\n• Confident'
    expect(parsePills(bulletSeparated)).toEqual([
      'Luxury',
      'Minimalist',
      'Confident',
    ])

    const arrayInput = ['Timeless', 'Bold', 'Authentic']
    expect(parsePills(arrayInput)).toEqual(['Timeless', 'Bold', 'Authentic'])
  })
})
