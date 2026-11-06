// tests/unit/brand-logo-showcase.test.ts
import { describe, it, expect } from 'vitest'
import {
  getLogoVariationConfig,
  getLogoStageBackgroundClass,
  getLogoStageBorderClass,
  resolveEffectiveStageMode,
  getLogoRoleBadgeColor,
  getLogoStageOptionLabel,
  hasValidLogoUrl,
} from '@/lib/brand-logo-showcase'

describe('Brand Logo Showcase Utilities', () => {
  describe('getLogoVariationConfig', () => {
    it('returns proper metadata for Brand Symbol / Icon', () => {
      const cfg = getLogoVariationConfig('symbol')
      expect(cfg.title).toBe('Brand Symbol / Icon')
      expect(cfg.role).toBe('Icon Mark')
      expect(cfg.useCase).toBe('Favicon & App Icon')
      expect(cfg.defaultStage).toBe('light')
      expect(cfg.indexLabel).toBe('01 / Symbol')
    })

    it('returns proper metadata for Secondary Lockup', () => {
      const cfg = getLogoVariationConfig('secondary')
      expect(cfg.title).toBe('Secondary Lockup')
      expect(cfg.defaultStage).toBe('light')
      expect(cfg.indexLabel).toBe('02 / Secondary')
    })

    it('returns proper metadata for Horizontal Wordmark', () => {
      const cfg = getLogoVariationConfig('horizontal')
      expect(cfg.title).toBe('Horizontal Wordmark')
      expect(cfg.defaultStage).toBe('dark')
      expect(cfg.indexLabel).toBe('03 / Wordmark')
    })

    it('returns proper metadata for Monochrome / 1-Color', () => {
      const cfg = getLogoVariationConfig('monochrome')
      expect(cfg.title).toBe('Monochrome / 1-Color')
      expect(cfg.defaultStage).toBe('light')
      expect(cfg.indexLabel).toBe('04 / Monochrome')
    })

    it('falls back to Primary Brandmark for unknown types', () => {
      const cfg = getLogoVariationConfig('primary')
      expect(cfg.title).toBe('Primary Brandmark')
      expect(cfg.indexLabel).toBe('00 / Master')
    })
  })

  describe('getLogoStageBackgroundClass', () => {
    it('returns crisp white classes for light stage', () => {
      const cls = getLogoStageBackgroundClass('light')
      expect(cls).toContain('bg-white')
      expect(cls).toContain('text-slate-900')
    })

    it('returns deep ink classes for dark stage', () => {
      const cls = getLogoStageBackgroundClass('dark')
      expect(cls).toContain('bg-[#0e0e1a]')
      expect(cls).toContain('text-white')
    })

    it('returns checkerboard transparency classes for grid stage', () => {
      const cls = getLogoStageBackgroundClass('checkerboard')
      expect(cls).toContain('background-image')
    })
  })

  describe('getLogoStageBorderClass', () => {
    it('returns black/10 for light stage', () => {
      expect(getLogoStageBorderClass('light')).toBe('border-black/10')
    })

    it('returns white/10 for dark and checkerboard stages', () => {
      expect(getLogoStageBorderClass('dark')).toBe('border-white/10')
      expect(getLogoStageBorderClass('checkerboard')).toBe('border-white/10')
    })
  })

  describe('resolveEffectiveStageMode', () => {
    it('honors card override when explicitly provided', () => {
      expect(resolveEffectiveStageMode('dark', 'light', 'light')).toBe('dark')
      expect(resolveEffectiveStageMode('checkerboard', 'dark', 'dark')).toBe('checkerboard')
    })

    it('falls back to light when globalMode is light and override is auto', () => {
      expect(resolveEffectiveStageMode('auto', 'dark', 'light')).toBe('light')
      expect(resolveEffectiveStageMode(undefined, 'dark', 'light')).toBe('light')
    })

    it('uses defaultStage when globalMode is dark and no card override is given', () => {
      expect(resolveEffectiveStageMode(undefined, 'light', 'dark')).toBe('light')
      expect(resolveEffectiveStageMode('auto', 'dark', 'dark')).toBe('dark')
    })
  })

  describe('getLogoRoleBadgeColor', () => {
    it('returns theme colors for each variation', () => {
      expect(getLogoRoleBadgeColor('symbol')).toContain('secondary')
      expect(getLogoRoleBadgeColor('secondary')).toContain('purple')
      expect(getLogoRoleBadgeColor('horizontal')).toContain('primary')
      expect(getLogoRoleBadgeColor('monochrome')).toContain('emerald')
    })
  })

  describe('getLogoStageOptionLabel', () => {
    it('returns human-friendly names for stage modes', () => {
      expect(getLogoStageOptionLabel('light')).toBe('Light')
      expect(getLogoStageOptionLabel('dark')).toBe('Dark')
      expect(getLogoStageOptionLabel('checkerboard')).toBe('Grid')
      expect(getLogoStageOptionLabel('auto')).toBe('Auto')
    })
  })

  describe('hasValidLogoUrl', () => {
    it('validates proper logo URLs', () => {
      expect(hasValidLogoUrl('https://example.com/logo.svg')).toBe(true)
      expect(hasValidLogoUrl('/img/logo.png')).toBe(true)
    })

    it('rejects empty or dangerous URLs', () => {
      expect(hasValidLogoUrl('')).toBe(false)
      expect(hasValidLogoUrl(null)).toBe(false)
      expect(hasValidLogoUrl('javascript:alert(1)')).toBe(false)
    })
  })
})
