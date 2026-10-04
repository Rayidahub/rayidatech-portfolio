'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { saveHeroSettings } from '@/lib/data/hero-settings';
import { defaultHeroSlides } from '@/lib/data/hero-slides';
import type { HeroSettings } from '@/types/hero-settings';

export async function updateHeroSettingsAction(
  settings: HeroSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await saveHeroSettings(settings);

    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/hero');
      revalidatePath('/admin/hero/settings');
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to update hero settings.',
    };
  }
}

export async function seedDefaultHeroSlidesAction(): Promise<{
  success: boolean;
  count: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Check existing slides
    const { data: existing, error: checkError } = await supabase
      .from('hero_slides')
      .select('id, label');

    if (checkError) {
      return {
        success: false,
        count: 0,
        error: checkError.message,
      };
    }

    const existingLabels = new Set((existing || []).map((s) => s.label.toLowerCase()));
    const toInsert = defaultHeroSlides
      .filter((s) => !existingLabels.has(s.label.toLowerCase()))
      .map((s, index) => ({
        label: s.label,
        words: s.words,
        body: s.body,
        image: s.image,
        sort_order: (existing?.length || 0) + index,
        is_active: true,
      }));

    if (toInsert.length === 0) {
      return {
        success: true,
        count: 0,
      };
    }

    const { error: insertError } = await supabase.from('hero_slides').insert(toInsert);

    if (insertError) {
      return {
        success: false,
        count: 0,
        error: insertError.message,
      };
    }

    revalidatePath('/');
    revalidatePath('/admin/hero');

    return {
      success: true,
      count: toInsert.length,
    };
  } catch (err: any) {
    return {
      success: false,
      count: 0,
      error: err?.message || 'Failed to seed default hero slides.',
    };
  }
}

