import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import type { SiteSettings, ThemeMode } from '@/types/site-settings';

export const defaultSiteSettings: SiteSettings = {
  id: 'default',
  default_theme: 'dark',
  allow_user_toggle: true,
  theme_version: 1,
};

const LOCAL_SETTINGS_FILE = path.join(process.cwd(), 'lib/data/site-settings.json');

function readLocalSettings(): SiteSettings | null {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_FILE)) {
      const raw = fs.readFileSync(LOCAL_SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed reading local site settings:', err);
  }
  return null;
}

function writeLocalSettings(data: SiteSettings): void {
  try {
    const dir = path.dirname(LOCAL_SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local site settings:', err);
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const local = readLocalSettings();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data) {
      return {
        ...defaultSiteSettings,
        ...data,
      };
    }
  } catch {
    // Supabase query error fallback
  }

  if (local) {
    return {
      ...defaultSiteSettings,
      ...local,
    };
  }

  writeLocalSettings(defaultSiteSettings);
  return defaultSiteSettings;
}

export async function saveSiteSettings(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string; settings?: SiteSettings }> {
  const current = await getSiteSettings();
  const updatedSettings: SiteSettings = {
    ...current,
    ...settings,
    id: 'default',
    updated_at: new Date().toISOString(),
  };

  // 1. Write locally
  writeLocalSettings(updatedSettings);

  // 2. Sync to Supabase
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: 'default',
          default_theme: updatedSettings.default_theme,
          allow_user_toggle: updatedSettings.allow_user_toggle,
          theme_version: updatedSettings.theme_version,
          updated_at: updatedSettings.updated_at,
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Could not sync site settings to Supabase (table may not exist yet, local fallback used):', error.message);
    }
  } catch (err) {
    console.warn('Supabase sync skipped, local file updated:', err);
  }

  return { success: true, settings: updatedSettings };
}

