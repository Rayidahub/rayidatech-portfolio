'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { defaultServices } from '@/lib/data/services';
import type { Service } from '@/types/service';

export interface ServiceInput {
  title: string;
  slug: string;
  headline?: string;
  description: string;
  content?: string;
  features: string[];
  icon_name: string;
  image_url?: string | null;
  order: number;
}

export async function createServiceAction(data: ServiceInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required' };
    }

    const payload: Record<string, unknown> = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      headline: data.headline?.trim() || null,
      description: data.description.trim(),
      content: data.content?.trim() || null,
      features: data.features,
      icon_name: data.icon_name || 'Palette',
      image_url: data.image_url?.trim() || null,
      order: data.order ?? 0,
    };

    let { data: inserted, error } = await supabase
      .from('services')
      .insert(payload)
      .select()
      .single();

    // If image_url column doesn't exist in Supabase yet, retry with embedded image tag in content
    if (error && error.message?.includes('image_url')) {
      const fallbackContent = data.image_url
        ? `<!--image:${data.image_url.trim()}-->\n${data.content?.trim() || ''}`
        : data.content?.trim() || null;

      delete payload.image_url;
      payload.content = fallbackContent;

      const retry = await supabase
        .from('services')
        .insert(payload)
        .select()
        .single();

      inserted = retry.data;
      error = retry.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');
    revalidatePath('/');

    return { success: true, service: inserted };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create service';
    return { success: false, error: message };
  }
}

export async function updateServiceAction(id: string, data: ServiceInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required' };
    }

    const payload: Record<string, unknown> = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      headline: data.headline?.trim() || null,
      description: data.description.trim(),
      content: data.content?.trim() || null,
      features: data.features,
      icon_name: data.icon_name || 'Palette',
      image_url: data.image_url?.trim() || null,
      order: data.order ?? 0,
      updated_at: new Date().toISOString(),
    };

    let { data: updated, error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    // If image_url column doesn't exist in Supabase yet, retry with embedded image tag in content
    if (error && error.message?.includes('image_url')) {
      const fallbackContent = data.image_url
        ? `<!--image:${data.image_url.trim()}-->\n${(data.content || '').replace(/<!--image:(.*?)-->\n?/g, '').trim()}`
        : (data.content || '').replace(/<!--image:(.*?)-->\n?/g, '').trim() || null;

      delete payload.image_url;
      payload.content = fallbackContent;

      const retry = await supabase
        .from('services')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      updated = retry.data;
      error = retry.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');
    revalidatePath('/');

    return { success: true, service: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update service';
    return { success: false, error: message };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required' };
    }

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete service';
    return { success: false, error: message };
  }
}

export async function seedInitialServicesAction() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required' };
    }

    // Check if services already exist
    const { data: existing } = await supabase.from('services').select('id').limit(1);

    if (existing && existing.length > 0) {
      return { success: true, count: 0, message: 'Services already exist in database' };
    }

    // Prepare rows
    const rows = defaultServices.map((s) => ({
      title: s.title,
      slug: s.slug,
      headline: s.headline,
      description: s.description,
      content: s.content,
      features: s.features,
      icon_name: s.icon_name,
      image_url: s.image_url,
      order: s.order,
    }));

    let { error } = await supabase.from('services').insert(rows);

    if (error && error.message?.includes('image_url')) {
      const fallbackRows = defaultServices.map((s) => ({
        title: s.title,
        slug: s.slug,
        headline: s.headline,
        description: s.description,
        content: s.image_url ? `<!--image:${s.image_url}-->\n${s.content}` : s.content,
        features: s.features,
        icon_name: s.icon_name,
        order: s.order,
      }));
      const retry = await supabase.from('services').insert(fallbackRows);
      error = retry.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');
    revalidatePath('/');

    return {
      success: true,
      count: rows.length,
      message: `Successfully seeded ${rows.length} initial services with visual images`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to seed services';
    return { success: false, error: message };
  }
}
