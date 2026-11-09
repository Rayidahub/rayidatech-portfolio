'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ProductInput, EcosystemProduct } from '@/types/ecosystem-product';
import { defaultEcosystemProducts } from '@/lib/data/products';
import { normalizeProduct } from '@/lib/products';

interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function requireAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Admin session required');
  }

  return { supabase, user };
}

/**
 * Creates a new ecosystem product.
 * Falls back resiliently to core columns if extended schema columns are not yet applied.
 */
export async function createProductAction(data: ProductInput): Promise<ActionResponse<EcosystemProduct>> {
  try {
    const { supabase } = await requireAdminSession();

    const name = data.name.trim();
    const emoji = (data.emoji || '🚀').trim();
    const description = data.description.trim();
    const status = data.status || 'coming_soon';
    const sort_order = Number.isFinite(data.sort_order) ? Number(data.sort_order) : 0;
    const is_active = data.is_active !== false;
    const launch_date = data.launch_date ? data.launch_date.slice(0, 10) : null;

    const extendedPayload: Record<string, unknown> = {
      name,
      emoji,
      description,
      status,
      sort_order,
      is_active,
      launch_date,
      tagline: data.tagline?.trim() || null,
      slug: data.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category: data.category?.trim() || 'AI & Intelligence',
      image: data.image?.trim() || null,
      website_url: data.website_url?.trim() || null,
      waitlist_url: data.waitlist_url?.trim() || null,
      features: Array.isArray(data.features) ? data.features.filter(Boolean) : [],
      badge: data.badge?.trim() || null,
      metadata: data.metadata || {},
    };

    let { data: inserted, error } = await supabase
      .from('ecosystem_products')
      .insert(extendedPayload)
      .select()
      .single();

    // Fallback if extended columns are not yet in Supabase schema
    if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
      const corePayload = {
        name,
        emoji,
        description,
        status,
        sort_order,
        is_active,
        launch_date,
      };

      const retry = await supabase
        .from('ecosystem_products')
        .insert(corePayload)
        .select()
        .single();

      if (retry.error) {
        return { success: false, error: retry.error.message };
      }
      inserted = retry.data;
    } else if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/coming-soon');

    return { success: true, data: normalizeProduct(inserted) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

/**
 * Updates an existing ecosystem product.
 */
export async function updateProductAction(
  id: string,
  data: Partial<ProductInput>
): Promise<ActionResponse<EcosystemProduct>> {
  try {
    const { supabase } = await requireAdminSession();

    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.emoji !== undefined) payload.emoji = data.emoji.trim();
    if (data.description !== undefined) payload.description = data.description.trim();
    if (data.status !== undefined) payload.status = data.status;
    if (data.sort_order !== undefined) payload.sort_order = Number(data.sort_order);
    if (data.is_active !== undefined) payload.is_active = Boolean(data.is_active);
    if (data.launch_date !== undefined) payload.launch_date = data.launch_date ? data.launch_date.slice(0, 10) : null;
    if (data.tagline !== undefined) payload.tagline = data.tagline?.trim() || null;
    if (data.slug !== undefined) payload.slug = data.slug?.trim() || null;
    if (data.category !== undefined) payload.category = data.category?.trim() || null;
    if (data.image !== undefined) payload.image = data.image?.trim() || null;
    if (data.website_url !== undefined) payload.website_url = data.website_url?.trim() || null;
    if (data.waitlist_url !== undefined) payload.waitlist_url = data.waitlist_url?.trim() || null;
    if (data.features !== undefined) payload.features = Array.isArray(data.features) ? data.features.filter(Boolean) : [];
    if (data.badge !== undefined) payload.badge = data.badge?.trim() || null;
    if (data.metadata !== undefined) payload.metadata = data.metadata;
    payload.updated_at = new Date().toISOString();

    let { data: updated, error } = await supabase
      .from('ecosystem_products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    // Fallback if extended columns are rejected
    if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
      const coreOnly: Record<string, unknown> = {};
      const coreKeys = ['name', 'emoji', 'description', 'status', 'sort_order', 'is_active', 'launch_date', 'updated_at'];
      for (const k of coreKeys) {
        if (payload[k] !== undefined) coreOnly[k] = payload[k];
      }

      const retry = await supabase
        .from('ecosystem_products')
        .update(coreOnly)
        .eq('id', id)
        .select()
        .single();

      if (retry.error) {
        return { success: false, error: retry.error.message };
      }
      updated = retry.data;
    } else if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/coming-soon');

    return { success: true, data: normalizeProduct(updated) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update product' };
  }
}

/**
 * Deletes a product by ID.
 */
export async function deleteProductAction(id: string): Promise<ActionResponse<{ id: string }>> {
  try {
    const { supabase } = await requireAdminSession();

    const { error } = await supabase.from('ecosystem_products').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/coming-soon');

    return { success: true, data: { id } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}

/**
 * Toggles product active state.
 */
export async function toggleProductActiveAction(
  id: string,
  is_active: boolean
): Promise<ActionResponse<{ id: string; is_active: boolean }>> {
  try {
    const { supabase } = await requireAdminSession();

    const { error } = await supabase
      .from('ecosystem_products')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/coming-soon');

    return { success: true, data: { id, is_active } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to toggle product status' };
  }
}

/**
 * Toggles product status (e.g. coming_soon <-> live).
 */
export async function toggleProductStatusAction(
  id: string,
  status: string
): Promise<ActionResponse<{ id: string; status: string }>> {
  try {
    const { supabase } = await requireAdminSession();

    const { error } = await supabase
      .from('ecosystem_products')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/coming-soon');

    return { success: true, data: { id, status } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to toggle status' };
  }
}

/**
 * Seeds default ecosystem products if table is empty.
 */
export async function seedProductsAction(): Promise<ActionResponse<{ count: number }>> {
  try {
    const { supabase } = await requireAdminSession();

    // Check count first
    const { count, error: countErr } = await supabase
      .from('ecosystem_products')
      .select('id', { count: 'exact', head: true });

    if (countErr) {
      return { success: false, error: countErr.message };
    }

    if (count && count > 0) {
      return { success: true, data: { count } };
    }

    const payload = defaultEcosystemProducts.map((p) => ({
      name: p.name,
      emoji: p.emoji,
      description: p.description,
      status: p.status,
      launch_date: p.launch_date,
      sort_order: p.sort_order,
      is_active: p.is_active,
      tagline: p.tagline,
      slug: p.slug,
      category: p.category,
      features: p.features,
      badge: p.badge,
    }));

    const { error: insertErr } = await supabase.from('ecosystem_products').insert(payload);

    if (insertErr) {
      // Retry core only
      const coreOnly = defaultEcosystemProducts.map((p) => ({
        name: p.name,
        emoji: p.emoji,
        description: p.description,
        status: p.status,
        launch_date: p.launch_date,
        sort_order: p.sort_order,
        is_active: p.is_active,
      }));
      const retry = await supabase.from('ecosystem_products').insert(coreOnly);
      if (retry.error) {
        return { success: false, error: retry.error.message };
      }
    }

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/coming-soon');

    return { success: true, data: { count: defaultEcosystemProducts.length } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to seed products' };
  }
}
