'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import { formatWhatsAppPhoneNumber, isValidWhatsAppNumber, personalizeWhatsAppMessage } from '@/lib/whatsapp/whatsapp-utils';

export interface WhatsAppSendResult {
  contactId: string;
  name: string;
  phone: string;
  success: boolean;
  error?: string;
  simulated?: boolean;
}

/**
 * Marks a contact as contacted via WhatsApp and updates their activity timeline.
 */
export async function recordWhatsAppOutreachAction(
  contactId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const { data: contact, error: fetchErr } = await supabase
      .from('outreach_contacts')
      .select('notes, outreach_status')
      .eq('id', contactId)
      .single();

    if (fetchErr || !contact) {
      return { success: false, error: fetchErr?.message || 'Contact not found' };
    }

    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newNote = `[WhatsApp Outreach — ${timestamp}] ${notes || 'Personalized outreach link dispatched.'}`;
    const combinedNotes = contact.notes ? `${newNote}\n${contact.notes}` : newNote;

    const { error: updateErr } = await supabase
      .from('outreach_contacts')
      .update({
        outreach_status: 'Contacted via WhatsApp',
        notes: combinedNotes,
        last_contacted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', contactId);

    if (updateErr) {
      // In case DB check constraint hasn't been updated with 'Contacted via WhatsApp' yet
      const { error: fallbackErr } = await supabase
        .from('outreach_contacts')
        .update({
          outreach_status: 'Follow-Up Required',
          notes: combinedNotes,
          last_contacted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', contactId);

      if (fallbackErr) throw fallbackErr;
    }

    revalidatePath('/admin/outreach/contacts');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Automated bulk WhatsApp sender for API providers (e.g. Termii or Meta Cloud API).
 * If API keys are not yet configured in .env.local, provides simulated / guided response.
 */
export async function sendBulkWhatsAppApiAction(
  contactIds: string[],
  templateText: string
): Promise<{
  success: boolean;
  total: number;
  sent: number;
  failed: number;
  results: WhatsAppSendResult[];
  error?: string;
  apiConfigured: boolean;
}> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) {
    return {
      success: false,
      total: 0,
      sent: 0,
      failed: 0,
      results: [],
      error: auth.error || 'Unauthorized',
      apiConfigured: false,
    };
  }

  const termiiApiKey = process.env.TERMII_API_KEY;
  const metaToken = process.env.META_WHATSAPP_TOKEN;
  const isApiConfigured = Boolean(termiiApiKey || metaToken);

  try {
    const supabase = await createClient();
    const { data: contacts, error: fetchErr } = await supabase
      .from('outreach_contacts')
      .select('*')
      .in('id', contactIds);

    if (fetchErr || !contacts) {
      return {
        success: false,
        total: 0,
        sent: 0,
        failed: 0,
        results: [],
        error: fetchErr?.message || 'Failed to fetch contacts',
        apiConfigured: isApiConfigured,
      };
    }

    const results: WhatsAppSendResult[] = [];
    let sentCount = 0;
    let failedCount = 0;

    for (const c of contacts) {
      const cleanPhone = formatWhatsAppPhoneNumber(c.phone);

      if (!isValidWhatsAppNumber(cleanPhone)) {
        failedCount++;
        results.push({
          contactId: c.id,
          name: c.business_name,
          phone: c.phone || '(no phone)',
          success: false,
          error: 'Invalid or missing phone number.',
        });
        continue;
      }

      const personalized = personalizeWhatsAppMessage(templateText, c);

      // If Termii API is configured
      if (termiiApiKey) {
        try {
          const res = await fetch('https://api.ng.termii.com/api/sms/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: cleanPhone,
              from: process.env.TERMII_SENDER_ID || 'RayidaTech',
              sms: personalized,
              type: 'plain',
              channel: 'whatsapp',
              api_key: termiiApiKey,
            }),
          });

          if (res.ok) {
            sentCount++;
            results.push({
              contactId: c.id,
              name: c.business_name,
              phone: cleanPhone,
              success: true,
            });
          } else {
            failedCount++;
            const errTxt = await res.text();
            results.push({
              contactId: c.id,
              name: c.business_name,
              phone: cleanPhone,
              success: false,
              error: `Termii API Error: ${errTxt}`,
            });
          }
        } catch (apiErr: unknown) {
          failedCount++;
          results.push({
            contactId: c.id,
            name: c.business_name,
            phone: cleanPhone,
            success: false,
            error: String(apiErr),
          });
        }
      } else {
        // Simulated / Guided mode when no 3rd-party API key is present
        sentCount++;
        results.push({
          contactId: c.id,
          name: c.business_name,
          phone: cleanPhone,
          success: true,
          simulated: true,
        });
      }
    }

    revalidatePath('/admin/outreach/contacts');

    return {
      success: sentCount > 0,
      total: contacts.length,
      sent: sentCount,
      failed: failedCount,
      results,
      apiConfigured: isApiConfigured,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      total: 0,
      sent: 0,
      failed: 0,
      results: [],
      error: msg,
      apiConfigured: isApiConfigured,
    };
  }
}
