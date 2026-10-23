'use server';

import { revalidatePath } from 'next/cache';
import { saveSiteSettings, getSiteSettings } from '@/lib/data/site-settings';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import type { SiteSettings, ThemeMode } from '@/types/site-settings';

export async function updateSiteSettingsAction(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string; settings?: SiteSettings }> {
  try {
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || 'Unauthorized' };
    }

    // Strict validation to prevent injection vectors
    const sanitized: Partial<SiteSettings> = {};
    if (settings.default_theme !== undefined) {
      if (settings.default_theme !== 'dark' && settings.default_theme !== 'light') {
        return { success: false, error: 'Invalid default theme: must be "dark" or "light"' };
      }
      sanitized.default_theme = settings.default_theme;
    }

    if (settings.allow_user_toggle !== undefined) {
      sanitized.allow_user_toggle = Boolean(settings.allow_user_toggle);
    }

    if (settings.theme_version !== undefined) {
      sanitized.theme_version = Math.max(1, Math.floor(Number(settings.theme_version) || 1));
    }

    const result = await saveSiteSettings(sanitized);

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update site settings';
    console.error('Failed to update site settings:', err);
    return {
      success: false,
      error: msg,
    };
  }
}

export async function quickToggleDefaultThemeAction(): Promise<{
  success: boolean;
  default_theme?: ThemeMode;
  error?: string;
}> {
  try {
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || 'Unauthorized' };
    }

    const current = await getSiteSettings();
    const nextTheme: ThemeMode = current.default_theme === 'dark' ? 'light' : 'dark';
    const result = await saveSiteSettings({
      default_theme: nextTheme,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return { success: true, default_theme: nextTheme };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to toggle default theme';
    return { success: false, error: msg };
  }
}

export async function resetVisitorThemePreferencesAction(): Promise<{
  success: boolean;
  new_version?: number;
  error?: string;
}> {
  try {
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || 'Unauthorized' };
    }

    const current = await getSiteSettings();
    const nextVersion = (current.theme_version || 1) + 1;
    await saveSiteSettings({
      theme_version: nextVersion,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return { success: true, new_version: nextVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to reset preferences';
    return { success: false, error: msg };
  }
}
