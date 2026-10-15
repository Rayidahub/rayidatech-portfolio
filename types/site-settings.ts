export type ThemeMode = 'dark' | 'light';

export interface SiteSettings {
  id: string;
  default_theme: ThemeMode;
  allow_user_toggle: boolean;
  theme_version: number;
  updated_at?: string;
}

