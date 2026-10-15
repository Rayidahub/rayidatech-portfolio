'use server';

import { revalidatePath } from 'next/cache';
import { saveSiteSettings, getSiteSettings } from '@/lib/data/site-settings';
import type { SiteSettings, ThemeMode } from '@/types/site-settings';

export async function updateSiteSettingsAction(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string; settings?: SiteSettings }> {
  try {
    const result = await saveSiteSettings(settings);

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return result;
  } catch (err: any) {
    console.error('Failed to update site settings:', err);
    return {
      success: false,
      error: err?.message || 'Failed to update site settings',
    };
  }
}

export async function quickToggleDefaultThemeAction(): Promise<{
  success: boolean;
  default_theme?: ThemeMode;
  error?: string;
}> {
  try {
    const current = await getSiteSettings();
    const nextTheme: ThemeMode = current.default_theme === 'dark' ? 'light' : 'dark';
    const result = await saveSiteSettings({
      default_theme: nextTheme,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return { success: true, default_theme: nextTheme };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to toggle default theme' };
  }
}

export async function resetVisitorThemePreferencesAction(): Promise<{
  success: boolean;
  new_version?: number;
  error?: string;
}> {
  try {
    const current = await getSiteSettings();
    const nextVersion = (current.theme_version || 1) + 1;
    await saveSiteSettings({
      theme_version: nextVersion,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return { success: true, new_version: nextVersion };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to reset preferences' };
  }
}

