// lib/brand-logo-showcase.ts

export type LogoVariationType =
  | 'primary'
  | 'symbol'
  | 'secondary'
  | 'horizontal'
  | 'monochrome'
  | 'custom';

export type LogoStageMode = 'auto' | 'light' | 'dark' | 'checkerboard';

export interface LogoVariationConfig {
  type: LogoVariationType;
  title: string;
  role: string;
  useCase: string;
  defaultStage: 'light' | 'dark' | 'checkerboard';
  recommendedBg: string;
  indexLabel: string;
}

/**
 * Returns curated presentation configuration for a logo variation type.
 */
export function getLogoVariationConfig(type: LogoVariationType): LogoVariationConfig {
  switch (type) {
    case 'symbol':
      return {
        type: 'symbol',
        title: 'Brand Symbol / Icon',
        role: 'Icon Mark',
        useCase: 'Favicon & App Icon',
        defaultStage: 'light',
        recommendedBg: 'Light & High-Contrast UI',
        indexLabel: '01 / Symbol',
      };
    case 'secondary':
      return {
        type: 'secondary',
        title: 'Secondary Lockup',
        role: 'Vertical Stack',
        useCase: 'Vertical / Compact Formats',
        defaultStage: 'light',
        recommendedBg: 'Clean Light Surfaces',
        indexLabel: '02 / Secondary',
      };
    case 'horizontal':
      return {
        type: 'horizontal',
        title: 'Horizontal Wordmark',
        role: 'Wordmark Banner',
        useCase: 'Navbars & Letterheads',
        defaultStage: 'dark',
        recommendedBg: 'Dark & Editorial Headers',
        indexLabel: '03 / Wordmark',
      };
    case 'monochrome':
      return {
        type: 'monochrome',
        title: 'Monochrome / 1-Color',
        role: 'Single-Ink Mark',
        useCase: 'Embroidery & Stamping',
        defaultStage: 'light',
        recommendedBg: 'High-Contrast Solid Canvas',
        indexLabel: '04 / Monochrome',
      };
    case 'primary':
    default:
      return {
        type: 'primary',
        title: 'Primary Brandmark',
        role: 'Master Lockup',
        useCase: 'Hero & Primary Branding',
        defaultStage: 'dark',
        recommendedBg: 'Universal Core Mark',
        indexLabel: '00 / Master',
      };
  }
}

/**
 * Returns Tailwind CSS background classes for the logo stage surface.
 */
export function getLogoStageBackgroundClass(
  stage: 'light' | 'dark' | 'checkerboard' | string
): string {
  switch (stage) {
    case 'light':
      return 'bg-white border-black/10 shadow-xs text-slate-900';
    case 'checkerboard':
      return 'bg-[#181828] [background-image:linear-gradient(45deg,#232338_25%,transparent_25%),linear-gradient(-45deg,#232338_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#232338_75%),linear-gradient(-45deg,transparent_75%,#232338_75%)] [background-size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0] border-white/10 shadow-inner text-white';
    case 'dark':
    default:
      return 'bg-[#0e0e1a] border-white/10 shadow-inner text-white';
  }
}

/**
 * Returns stage border styling class for high-DPI contrast.
 */
export function getLogoStageBorderClass(stage: 'light' | 'dark' | 'checkerboard' | string): string {
  switch (stage) {
    case 'light':
      return 'border-black/10';
    case 'checkerboard':
      return 'border-white/10';
    case 'dark':
    default:
      return 'border-white/10';
  }
}

/**
 * Resolves the effective stage mode given an optional card-level override,
 * the card's default recommendation, and the global case-study theme toggle.
 */
export function resolveEffectiveStageMode(
  cardOverride: LogoStageMode | undefined,
  defaultStage: 'light' | 'dark' | 'checkerboard',
  globalMode: 'dark' | 'light'
): 'light' | 'dark' | 'checkerboard' {
  if (cardOverride && cardOverride !== 'auto') {
    return cardOverride;
  }
  if (globalMode === 'light') {
    return 'light';
  }
  return defaultStage;
}

/**
 * Returns role badge theme accent styling.
 */
export function getLogoRoleBadgeColor(type: LogoVariationType): string {
  switch (type) {
    case 'symbol':
      return 'bg-secondary/15 text-secondary border-secondary/25';
    case 'secondary':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/25';
    case 'horizontal':
      return 'bg-primary/15 text-accent-soft border-primary/25';
    case 'monochrome':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25';
    case 'primary':
    default:
      return 'bg-secondary/10 text-secondary border-secondary/20';
  }
}

/**
 * Returns human-friendly label for stage mode switcher.
 */
export function getLogoStageOptionLabel(stage: LogoStageMode): string {
  switch (stage) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'checkerboard':
      return 'Grid';
    case 'auto':
    default:
      return 'Auto';
  }
}

/**
 * Returns recommended aspect ratio and display orientation hint for a logo variation type.
 */
export function getLogoAspectRecommendation(type: LogoVariationType): string {
  switch (type) {
    case 'symbol':
      return '1:1 Square';
    case 'secondary':
      return '3:4 Vertical';
    case 'horizontal':
      return '3:1 Banner';
    case 'monochrome':
      return '1:1 Vector';
    case 'primary':
    default:
      return '16:9 Showcase';
  }
}

/**
 * Checks if a particular stage option is currently active.
 */
export function isStageActive(
  targetStage: 'light' | 'dark' | 'checkerboard',
  currentStage: 'light' | 'dark' | 'checkerboard'
): boolean {
  return targetStage === currentStage;
}

/**
 * Resolves the visual file format badge (e.g. SVG, PNG, WEBP, JPEG) from a URL.
 */
export function getLogoFormatBadge(imageUrl?: string | null): string {
  if (!imageUrl) return 'ASSET';
  const cleanUrl = imageUrl.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.svg')) return 'SVG';
  if (cleanUrl.endsWith('.png')) return 'PNG';
  if (cleanUrl.endsWith('.webp')) return 'WEBP';
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'JPEG';
  return 'ASSET';
}

/**
 * Validates that a logo image URL string is non-empty and well-formed.
 */
export function hasValidLogoUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.length > 0 && !trimmed.startsWith('javascript:');
}
