'use server';

import { revalidatePath } from 'next/cache';
import { saveBlogSettings } from '@/lib/data/blog-settings';
import { fallbackPosts } from '@/lib/data/posts';
import { createClient } from '@/lib/supabase/server';
import type { BlogSettings } from '@/types/blog-settings';

export async function updateBlogSettingsAction(
  settings: BlogSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await saveBlogSettings(settings);

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    revalidatePath('/admin/blog/settings');

    return result;
  } catch (err: any) {
    console.error('Failed to update blog settings:', err);
    return {
      success: false,
      error: err?.message || 'Failed to update blog settings',
    };
  }
}

export async function seedSamplePostsAction(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Check existing posts by slug
    const { data: existing } = await supabase.from('posts').select('slug');
    const existingSlugs = new Set((existing || []).map((p) => p.slug));

    const toInsert = fallbackPosts.filter((p) => !existingSlugs.has(p.slug));

    if (toInsert.length === 0) {
      return { success: true, count: 0 };
    }

    const { error } = await supabase.from('posts').insert(
      toInsert.map((p) => ({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        cover_image: p.cover_image,
        published: true,
        tags: p.tags,
      }))
    );

    if (error) {
      throw error;
    }

    revalidatePath('/blog');
    revalidatePath('/admin/blog');

    return { success: true, count: toInsert.length };
  } catch (err: any) {
    console.error('Failed to seed sample posts:', err);
    return {
      success: false,
      error: err?.message || 'Failed to seed sample posts',
    };
  }
}

