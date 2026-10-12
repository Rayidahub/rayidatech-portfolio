import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import type { HeroSettings } from '@/types/hero-settings';
import { defaultHeroGradientSettings, mergeHeroGradientSettings } from '@/lib/hero-gradient';

export const defaultHeroSettings: HeroSettings = {
  id: 'default',
  show_status_pill: true,
  status_pill_text: 'Available for projects',
  status_pill_link: '/contact',
  status_pill_available: true,

  primary_cta_label: 'Start Your Project',
  primary_cta_link: '/contact',
  secondary_cta_label: 'View My Work',
  secondary_cta_link: '/projects',

  show_floating_stat: true,
  floating_stat_value: '98%',
  floating_stat_label: 'Client Satisfaction',

  autoplay_enabled: true,
  autoplay_interval: 5,

  gradient: defaultHeroGradientSettings,
};

const LOCAL_SETTINGS_FILE = path.join(process.cwd(), 'lib/data/hero-settings.json');

function readLocalSettings(): HeroSettings | null {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_FILE)) {
      const raw = fs.readFileSync(LOCAL_SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed reading local hero settings:', err);
  }
  return null;
}

function writeLocalSettings(data: HeroSettings): void {
  try {
    const dir = path.dirname(LOCAL_SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local hero settings:', err);
  }
}

export async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('hero_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data) {
      return {
        ...defaultHeroSettings,
        ...data,
        gradient: mergeHeroGradientSettings(data.gradient),
      };
    }
  } catch {
    // Supabase query error fallback
  }

  const local = readLocalSettings();
  if (local) {
    return {
      ...defaultHeroSettings,
      ...local,
      gradient: mergeHeroGradientSettings(local.gradient),
    };
  }

  writeLocalSettings(defaultHeroSettings);
  return defaultHeroSettings;
}

export async function saveHeroSettings(
  settings: HeroSettings
): Promise<{ success: boolean; error?: string }> {
  const updatedSettings: HeroSettings = {
    ...settings,
    id: 'default',
    gradient: mergeHeroGradientSettings(settings.gradient),
    updated_at: new Date().toISOString(),
  };

  writeLocalSettings(updatedSettings);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('hero_settings').upsert(updatedSettings);

    if (error) {
      console.warn('Supabase hero_settings upsert error (local JSON saved):', error.message);
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase hero_settings connection error (local JSON saved):', err?.message);
    return { success: true };
  }
}
