'use server';

import { revalidatePath } from 'next/cache';
import { saveContactSettings } from '@/lib/data/contact-settings';
import type { ContactSettings } from '@/types/contact-settings';

export async function updateContactSettingsAction(
  settings: ContactSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await saveContactSettings(settings);

    revalidatePath('/contact');
    revalidatePath('/admin/contacts');
    revalidatePath('/admin/contacts/settings');

    return result;
  } catch (err: any) {
    console.error('Failed to update contact settings:', err);
    return {
      success: false,
      error: err?.message || 'Failed to update contact settings',
    };
  }
}
