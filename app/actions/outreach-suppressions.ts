'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import { verifyUnsubscribeToken } from '@/lib/email/outreach-service';
import type { EmailSuppression } from '@/types/outreach';

export async function getEmailSuppressions(): Promise<EmailSuppression[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('email_suppressions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as EmailSuppression[];
  } catch (err: unknown) {
    console.error('getEmailSuppressions error:', err);
    return [];
  }
}

export async function addEmailSuppression(
  email: string,
  reason: 'unsubscribed' | 'bounced' | 'complained' | 'manual',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.from('email_suppressions').upsert(
      {
        email: cleanEmail,
        reason,
        notes: notes || 'Manually added by administrator',
        created_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    if (error) throw error;

    // Update outreach_contacts status to Unsubscribed
    await supabase
      .from('outreach_contacts')
      .update({ outreach_status: 'Unsubscribed', updated_at: new Date().toISOString() })
      .ilike('email', cleanEmail);

    revalidatePath('/admin/outreach/suppressions');
    revalidatePath('/admin/outreach/contacts');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function removeEmailSuppression(id: string): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('email_suppressions').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/outreach/suppressions');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Public action executed when a recipient clicks the unsubscribe link in an email.
 */
export async function processPublicUnsubscribe(email: string, token: string, campaignId?: string): Promise<{
  success: boolean;
  message: string;
}> {
  if (!email || !token) {
    return { success: false, message: 'Invalid or missing unsubscribe credentials.' };
  }

  const isValid = verifyUnsubscribeToken(email, token);
  if (!isValid) {
    return { success: false, message: 'Security token mismatch. The unsubscribe link may be expired or altered.' };
  }

  try {
    const supabase = await createClient();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Add to suppressions table
    await supabase.from('email_suppressions').upsert(
      {
        email: cleanEmail,
        reason: 'unsubscribed',
        source_campaign_id: campaignId || null,
        notes: 'Unsubscribed via 1-click email link',
      },
      { onConflict: 'email' }
    );

    // 2. Update outreach_contacts
    await supabase
      .from('outreach_contacts')
      .update({
        outreach_status: 'Unsubscribed',
        updated_at: new Date().toISOString(),
      })
      .ilike('email', cleanEmail);

    // 3. Update campaign_recipients if campaignId provided
    if (campaignId) {
      await supabase
        .from('campaign_recipients')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('campaign_id', campaignId)
        .ilike('email', cleanEmail);

      // Increment campaign unsubscribed_count
      const { data: camp } = await supabase
        .from('email_campaigns')
        .select('unsubscribed_count')
        .eq('id', campaignId)
        .single();

      if (camp) {
        await supabase
          .from('email_campaigns')
          .update({ unsubscribed_count: (camp.unsubscribed_count || 0) + 1 })
          .eq('id', campaignId);
      }
    }

    return {
      success: true,
      message: `You have been successfully removed from future outreach notes for ${cleanEmail}.`,
    };
  } catch (err: unknown) {
    console.error('processPublicUnsubscribe error:', err);
    return {
      success: false,
      message: 'Failed to process unsubscribe request. Please contact support.',
    };
  }
}

