'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import { testProviderConnection } from '@/lib/email/outreach-service';
import type { EmailTemplate, EmailSettings, EmailProvider } from '@/types/outreach';

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as EmailTemplate[];
  } catch (err: unknown) {
    console.error('getEmailTemplates error:', err);
    return [];
  }
}

export async function saveEmailTemplate(template: Partial<EmailTemplate>): Promise<{
  success: boolean;
  template?: EmailTemplate;
  error?: string;
}> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const payload = {
      name: template.name?.trim() || 'Untitled Template',
      subject: template.subject?.trim() || 'No Subject',
      body: template.body || '',
      description: template.description?.trim() || null,
      category: template.category || 'outreach',
      variables: template.variables || [
        'business_name',
        'contact_name',
        'business_type',
        'location',
        'website',
        'sender_name',
        'company_name',
      ],
      is_default: Boolean(template.is_default),
      updated_at: new Date().toISOString(),
    };

    if (template.id) {
      const { data, error } = await supabase
        .from('email_templates')
        .update(payload)
        .eq('id', template.id)
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/admin/outreach/templates');
      return { success: true, template: data as EmailTemplate };
    }

    const { data, error } = await supabase
      .from('email_templates')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/admin/outreach/templates');
    return { success: true, template: data as EmailTemplate };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function deleteEmailTemplate(id: string): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('email_templates').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/outreach/templates');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function getEmailSettings(): Promise<EmailSettings> {
  const defaults: EmailSettings = {
    default_provider: 'resend',
    sender_name: 'Raymond Gaius',
    sender_email: 'info@rayidatech.name.ng',
    reply_to: 'info@rayidatech.name.ng',
    test_recipient_email: 'rayidagaius@gmail.com',
    company_name: 'Rayida Tech',
    company_address: 'Abuja, Nigeria',
    zoho_host: 'smtppro.zoho.com',
    zoho_port: 465,
    zoho_secure: true,
    zoho_username: 'info@rayidatech.name.ng',
    resend_rate_limit_per_sec: 5,
    zoho_rate_limit_per_min: 30,
  };

  try {
    const supabase = await createClient();
    const { data } = await supabase.from('email_settings').select('*').limit(1).maybeSingle();
    if (data) {
      return { ...defaults, ...data };
    }
    return defaults;
  } catch {
    return defaults;
  }
}

export async function saveEmailSettings(settings: Partial<EmailSettings>): Promise<{
  success: boolean;
  error?: string;
}> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const current = await getEmailSettings();
    const payload = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('email_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    revalidatePath('/admin/outreach');
    revalidatePath('/admin/outreach/settings');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function testProviderConnectionAction(provider: EmailProvider) {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { connected: false, mode: 'simulated' as const, provider, message: auth.error || 'Unauthorized' };

  return testProviderConnection(provider);
}

