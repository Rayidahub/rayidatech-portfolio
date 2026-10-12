import type {
  HeroGradientSettings,
  GradientThemeSettings,
  MobileGradientSettings,
  HeroGradientBlurSettings,
} from '@/types/hero-settings';

export const defaultHeroGradientSettings: HeroGradientSettings = {
  enabled: true,
  dark: {
    enabled: true,
    color: '#0A0C18',
    opacity: 85,
    width: 65,
    direction: 'left-to-right',
    stops: {
      start: 0,
      solidUntil: 35,
      fadeStart: 60,
      end: 100,
    },
  },
  light: {
    enabled: true,
    color: '#FFFFFF',
    opacity: 90,
    width: 65,
    direction: 'left-to-right',
    stops: {
      start: 0,
      solidUntil: 35,
      fadeStart: 60,
      end: 100,
    },
  },
  mobile: {
    enabled: true,
    opacity: 88,
    direction: 'top-to-bottom',
    fadeStart: 60,
  },
  blur: {
    enabled: false,
    amount: 0,
  },
};

export function isValidHex(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false;
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
}

export function hexToRgb(hex: string, fallback = { r: 10, g: 12, b: 24 }): { r: number; g: number; b: number } {
  if (!hex || typeof hex !== 'string') return fallback;
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  } else if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  }
  return fallback;
}

function roundTo(num: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function mergeHeroGradientSettings(
  partial?: Partial<HeroGradientSettings> | null
): HeroGradientSettings {
  if (!partial || typeof partial !== 'object') {
    return defaultHeroGradientSettings;
  }

  const dark: GradientThemeSettings = {
    ...defaultHeroGradientSettings.dark,
    ...(partial.dark || {}),
    stops: {
      ...defaultHeroGradientSettings.dark.stops,
      ...(partial.dark?.stops || {}),
    },
  };

  const light: GradientThemeSettings = {
    ...defaultHeroGradientSettings.light,
    ...(partial.light || {}),
    stops: {
      ...defaultHeroGradientSettings.light.stops,
      ...(partial.light?.stops || {}),
    },
  };

  const mobile: MobileGradientSettings = {
    ...defaultHeroGradientSettings.mobile,
    ...(partial.mobile || {}),
  };

  const blur: HeroGradientBlurSettings = {
    ...defaultHeroGradientSettings.blur,
    ...(partial.blur || {}),
  };

  return {
    enabled: partial.enabled !== false,
    dark,
    light,
    mobile,
    blur,
  };
}

export function buildHeroGradientCss(
  gradientSettings?: HeroGradientSettings | null,
  theme: 'dark' | 'light' = 'dark',
  isMobile = false
): string {
  const settings = mergeHeroGradientSettings(gradientSettings);

  if (!settings.enabled) {
    return 'none';
  }

  const themeConfig = theme === 'light' ? settings.light : settings.dark;
  const fallbackRgb = theme === 'light' ? { r: 255, g: 255, b: 255 } : { r: 10, g: 12, b: 24 };
  const { r, g, b } = hexToRgb(themeConfig.color, fallbackRgb);

  if (isMobile) {
    if (!settings.mobile.enabled || settings.mobile.opacity <= 0) {
      return 'none';
    }

    let angle = '180deg';
    if (settings.mobile.direction === 'bottom-to-top') angle = '0deg';
    if (settings.mobile.direction === 'left-to-right') angle = '90deg';

    const maxAlpha = Math.max(0, Math.min(1, settings.mobile.opacity / 100));
    const fadeStart = Math.max(10, Math.min(100, settings.mobile.fadeStart || 60));
    const midPos = Math.round(fadeStart * 0.55);

    const a1 = roundTo(maxAlpha);
    const a2 = roundTo(maxAlpha * 0.92);
    const a3 = roundTo(maxAlpha * 0.68);
    const a4 = roundTo(maxAlpha * 0.22);

    return `linear-gradient(${angle}, rgba(${r}, ${g}, ${b}, ${a1}) 0%, rgba(${r}, ${g}, ${b}, ${a2}) ${midPos}%, rgba(${r}, ${g}, ${b}, ${a3}) ${fadeStart}%, rgba(${r}, ${g}, ${b}, ${a4}) 100%)`;
  }

  // Desktop Gradient
  if (!themeConfig.enabled || themeConfig.opacity <= 0 || themeConfig.width <= 0) {
    return 'none';
  }

  const angle = themeConfig.direction === 'right-to-left' ? '270deg' : '90deg';
  const maxAlpha = Math.max(0, Math.min(1, themeConfig.opacity / 100));
  const widthRatio = Math.max(0.01, Math.min(1, themeConfig.width / 100));

  const solidPos = Math.max(1, Math.round((themeConfig.stops.solidUntil || 35) * widthRatio));
  const fadePos = Math.max(solidPos + 1, Math.round((themeConfig.stops.fadeStart || 60) * widthRatio));
  const reachPos = Math.max(fadePos + 1, Math.round(themeConfig.width));
  const endPos = Math.min(100, reachPos + 10);

  const a1 = roundTo(maxAlpha);
  const a2 = roundTo(maxAlpha * 0.85);
  const a3 = roundTo(maxAlpha * 0.47);
  const a4 = roundTo(maxAlpha * 0.08);

  if (reachPos >= 100) {
    return `linear-gradient(${angle}, rgba(${r}, ${g}, ${b}, ${a1}) 0%, rgba(${r}, ${g}, ${b}, ${a2}) ${solidPos}%, rgba(${r}, ${g}, ${b}, ${a3}) ${fadePos}%, rgba(${r}, ${g}, ${b}, ${a4}) 100%)`;
  }

  return `linear-gradient(${angle}, rgba(${r}, ${g}, ${b}, ${a1}) 0%, rgba(${r}, ${g}, ${b}, ${a2}) ${solidPos}%, rgba(${r}, ${g}, ${b}, ${a3}) ${fadePos}%, rgba(${r}, ${g}, ${b}, ${a4}) ${reachPos}%, rgba(${r}, ${g}, ${b}, 0) ${endPos}%)`;
}
