'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import { isValidEmailAddress } from '@/lib/email/outreach-service';
import type { OutreachContact, OutreachStatus } from '@/types/outreach';

export async function getOutreachContacts(params?: {
  search?: string;
  status?: string;
  businessType?: string;
  location?: string;
  page?: number;
  limit?: number;
}): Promise<{
  contacts: OutreachContact[];
  total: number;
  locations: string[];
  businessTypes: string[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('outreach_contacts')
      .select('*', { count: 'exact' });

    if (params?.search) {
      const s = params.search.trim();
      query = query.or(
        `business_name.ilike.%${s}%,contact_name.ilike.%${s}%,email.ilike.%${s}%,notes.ilike.%${s}%`
      );
    }

    if (params?.status && params.status !== 'All') {
      query = query.eq('outreach_status', params.status);
    }

    if (params?.businessType && params.businessType !== 'All') {
      query = query.eq('business_type', params.businessType);
    }

    if (params?.location && params.location !== 'All') {
      query = query.eq('location', params.location);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Fetch distinct locations & business types for filter dropdowns
    const { data: filterData } = await supabase
      .from('outreach_contacts')
      .select('location, business_type');

    const locationsSet = new Set<string>();
    const typesSet = new Set<string>();

    (filterData || []).forEach((r) => {
      if (r.location && r.location.trim()) locationsSet.add(r.location.trim());
      if (r.business_type && r.business_type.trim()) typesSet.add(r.business_type.trim());
    });

    return {
      contacts: (data || []) as OutreachContact[],
      total: count || 0,
      locations: Array.from(locationsSet).sort(),
      businessTypes: Array.from(typesSet).sort(),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('getOutreachContacts error:', msg);
    return { contacts: [], total: 0, locations: [], businessTypes: [], error: msg };
  }
}

export async function getOutreachStats(): Promise<{
  total: number;
  readyToContact: number;
  emailSent: number;
  replied: number;
  unsubscribed: number;
  missingEmail: number;
  bounced: number;
  interested: number;
}> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('outreach_contacts')
      .select('outreach_status');

    const stats = {
      total: data?.length || 0,
      readyToContact: 0,
      emailSent: 0,
      replied: 0,
      unsubscribed: 0,
      missingEmail: 0,
      bounced: 0,
      interested: 0,
    };

    (data || []).forEach((row) => {
      const st = row.outreach_status as OutreachStatus;
      if (st === 'Ready to Contact' || st === 'New') stats.readyToContact++;
      if (st === 'Email Sent') stats.emailSent++;
      if (st === 'Replied') stats.replied++;
      if (st === 'Unsubscribed') stats.unsubscribed++;
      if (st === 'Missing Email' || st === 'Invalid Email') stats.missingEmail++;
      if (st === 'Bounced') stats.bounced++;
      if (st === 'Interested') stats.interested++;
    });

    return stats;
  } catch {
    return {
      total: 0,
      readyToContact: 0,
      emailSent: 0,
      replied: 0,
      unsubscribed: 0,
      missingEmail: 0,
      bounced: 0,
      interested: 0,
    };
  }
}

export async function saveOutreachContact(contact: Partial<OutreachContact>): Promise<{
  success: boolean;
  contact?: OutreachContact;
  error?: string;
}> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();

    const cleanEmail = contact.email ? contact.email.trim().toLowerCase() : null;
    let computedStatus: OutreachStatus = contact.outreach_status || 'New';

    if (!cleanEmail) {
      computedStatus = 'Missing Email';
    } else if (!isValidEmailAddress(cleanEmail)) {
      computedStatus = 'Invalid Email';
    }

    const payload = {
      business_name: contact.business_name?.trim() || 'Untitled Business',
      contact_name: contact.contact_name?.trim() || null,
      email: cleanEmail,
      business_type: contact.business_type?.trim() || null,
      location: contact.location?.trim() || null,
      website: contact.website?.trim() || null,
      instagram: contact.instagram?.trim() || null,
      phone: contact.phone?.trim() || null,
      notes: contact.notes?.trim() || null,
      outreach_status: computedStatus,
      tags: contact.tags || [],
      updated_at: new Date().toISOString(),
    };

    if (contact.id) {
      const { data, error } = await supabase
        .from('outreach_contacts')
        .update(payload)
        .eq('id', contact.id)
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/admin/outreach');
      revalidatePath('/admin/outreach/contacts');
      return { success: true, contact: data as OutreachContact };
    }

    const { data, error } = await supabase
      .from('outreach_contacts')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/admin/outreach');
    revalidatePath('/admin/outreach/contacts');
    return { success: true, contact: data as OutreachContact };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function deleteOutreachContact(id: string): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('outreach_contacts').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/outreach');
    revalidatePath('/admin/outreach/contacts');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function batchImportContacts(rows: Partial<OutreachContact>[]): Promise<{
  success: boolean;
  inserted: number;
  skipped: number;
  error?: string;
}> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, inserted: 0, skipped: 0, error: auth.error };

  if (!rows || rows.length === 0) {
    return { success: true, inserted: 0, skipped: 0 };
  }

  try {
    const supabase = await createClient();

    // 1. Fetch suppression list to auto-mark suppressed emails
    const { data: suppressions } = await supabase.from('email_suppressions').select('email');
    const suppressedSet = new Set((suppressions || []).map((s) => s.email.toLowerCase()));

    // 2. Fetch existing contact emails in database to prevent duplicates
    const { data: existingContacts } = await supabase
      .from('outreach_contacts')
      .select('email')
      .not('email', 'is', null);

    const existingEmails = new Set(
      (existingContacts || []).map((c) => (c.email ? c.email.toLowerCase() : ''))
    );

    const toInsert: Array<{
      business_name: string;
      contact_name: string | null;
      email: string | null;
      business_type: string | null;
      location: string | null;
      website: string | null;
      instagram: string | null;
      phone: string | null;
      notes: string | null;
      outreach_status: OutreachStatus;
      tags: string[];
    }> = [];

    let skipped = 0;
    const seenInBatch = new Set<string>();

    for (const row of rows) {
      const rawEmail = row.email ? row.email.trim().toLowerCase() : '';
      const bName = row.business_name?.trim() || '';

      if (!bName && !rawEmail) {
        skipped++;
        continue;
      }

      // Check duplicate within file
      if (rawEmail && seenInBatch.has(rawEmail)) {
        skipped++;
        continue;
      }
      if (rawEmail) seenInBatch.add(rawEmail);

      // Check if already in DB
      if (rawEmail && existingEmails.has(rawEmail)) {
        skipped++;
        continue;
      }

      let status: OutreachStatus = 'New';
      if (!rawEmail) {
        status = 'Missing Email';
      } else if (!isValidEmailAddress(rawEmail)) {
        status = 'Invalid Email';
      } else if (suppressedSet.has(rawEmail)) {
        status = 'Unsubscribed';
      } else {
        status = 'Ready to Contact';
      }

      toInsert.push({
        business_name: bName || 'Unnamed Business',
        contact_name: row.contact_name?.trim() || null,
        email: rawEmail || null,
        business_type: row.business_type?.trim() || null,
        location: row.location?.trim() || null,
        website: row.website?.trim() || null,
        instagram: row.instagram?.trim() || null,
        phone: row.phone?.trim() || null,
        notes: row.notes?.trim() || null,
        outreach_status: status,
        tags: row.tags || [],
      });
    }

    if (toInsert.length > 0) {
      // Chunk insertions to avoid hitting PostgreSQL statement size limits
      const chunkSize = 200;
      for (let i = 0; i < toInsert.length; i += chunkSize) {
        const chunk = toInsert.slice(i, i + chunkSize);
        const { error } = await supabase.from('outreach_contacts').insert(chunk);
        if (error) throw error;
      }
    }

    revalidatePath('/admin/outreach');
    revalidatePath('/admin/outreach/contacts');

    return {
      success: true,
      inserted: toInsert.length,
      skipped,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, inserted: 0, skipped: 0, error: msg };
  }
}

