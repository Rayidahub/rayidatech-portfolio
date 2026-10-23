'use server';

import { revalidatePath } from 'next/cache';
import { saveContactSettings } from '@/lib/data/contact-settings';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import type { ContactSettings } from '@/types/contact-settings';

export async function updateContactSettingsAction(
  settings: ContactSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || 'Unauthorized' };
    }

    const result = await saveContactSettings(settings);

    revalidatePath('/contact');
    revalidatePath('/admin/contacts');
    revalidatePath('/admin/contacts/settings');

    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update contact settings';
    console.error('Failed to update contact settings:', err);
    return {
      success: false,
      error: msg,
    };
  }
}
