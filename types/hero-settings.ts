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

  updated_at?: string;
}

