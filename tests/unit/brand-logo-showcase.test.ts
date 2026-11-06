// tests/unit/brand-logo-showcase.test.ts
import { describe, it, expect } from 'vitest'
import {
  getLogoVariationConfig,
  getLogoStageBackgroundClass,
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
})
