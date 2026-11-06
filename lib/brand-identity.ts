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

/**
 * Calculates whether black or white text has higher contrast against a hex background.
 */
export function getContrastTextColor(hex: string): 'light' | 'dark' {
  if (!isValidHex(hex)) return 'light'
  const clean = hex.replace('#', '').trim()
  let r = 0, g = 0, b = 0
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else {
    r = parseInt(clean.slice(0, 2), 16)
    g = parseInt(clean.slice(2, 4), 16)
    b = parseInt(clean.slice(4, 6), 16)
  }
  // YIQ equation
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'dark' : 'light'
}

/**
 * Returns human-friendly label for brand color classification.
 */
export function formatColorClassification(classification?: string): string {
  switch (classification) {
    case 'primary':
      return 'Primary'
    case 'secondary':
      return 'Secondary'
    case 'accent':
      return 'Accent'
    case 'neutral-dark':
      return 'Dark Neutral'
    case 'neutral-light':
      return 'Light Neutral'
    case 'background':
      return 'Background'
    default:
      return classification || 'Custom'
  }
}
