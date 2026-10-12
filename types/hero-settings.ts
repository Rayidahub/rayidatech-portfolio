export interface GradientStops {
  start: number;       // 0-100%
  solidUntil: number;  // 0-100%
  fadeStart: number;   // 0-100%
  end: number;         // 0-100%
}

export type GradientDirection = 'left-to-right' | 'right-to-left';
export type MobileGradientDirection = 'top-to-bottom' | 'bottom-to-top' | 'left-to-right';

export interface GradientThemeSettings {
  enabled: boolean;
  color: string;         // HEX, e.g. '#0A0C18' or '#FFFFFF'
  opacity: number;       // 0-100%
  width: number;         // 0-100% (horizontal reach)
  direction: GradientDirection;
  stops: GradientStops;
}

export interface MobileGradientSettings {
  enabled: boolean;
  opacity: number;       // 0-100%
  direction: MobileGradientDirection;
  fadeStart: number;     // 0-100%
}

export interface HeroGradientBlurSettings {
  enabled: boolean;
  amount: number;        // 0-20px
}

export interface HeroGradientSettings {
  enabled: boolean;      // Master toggle
  dark: GradientThemeSettings;
  light: GradientThemeSettings;
  mobile: MobileGradientSettings;
  blur: HeroGradientBlurSettings;
}

export interface HeroSettings {
  id?: string;
  show_status_pill: boolean;
  status_pill_text: string;
  status_pill_link: string;
  status_pill_available: boolean;

  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;

  show_floating_stat: boolean;
  floating_stat_value: string;
  floating_stat_label: string;

  autoplay_enabled: boolean;
  autoplay_interval: number;

  gradient?: HeroGradientSettings;

  updated_at?: string;
}
