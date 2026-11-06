// lib/brand-identity.ts
import { PROJECT_TYPES, type ProjectType, type Project, type BrandIdentityCaseStudy } from '@/types/project'

/**
 * Validates whether a given string is a valid 3-digit or 6-digit hex color code.
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return false
  const clean = hex.replace('#', '').trim()
  return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)
}

/**
 * Converts a 3-digit or 6-digit hex color string into standard `rgb(r, g, b)` format.
 * Returns null if the hex code is invalid.
 */
export function hexToRgb(hex: string): string | null {
  if (!isValidHex(hex)) return null
  const clean = hex.replace('#', '').trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return `rgb(${r}, ${g}, ${b})`
  }
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
}
