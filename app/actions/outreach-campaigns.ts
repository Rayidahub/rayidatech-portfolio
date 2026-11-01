'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import {
  personalizeTemplate,
  buildHtmlEmail,
  sendOutreachEmail,
  getUnsubscribeUrl,
  isValidEmailAddress,
} from '@/lib/email/outreach-service';
import type {
  EmailCampaign,
  CampaignRecipient,
  EmailProvider,
  OutreachContact,
} from '@/types/outreach';

export async function getEmailCampaigns(): Promise<EmailCampaign[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as EmailCampaign[];
  } catch (err: unknown) {
    console.error('getEmailCampaigns error:', err);
    return [];
  }
}

export async function getEmailCampaignById(id: string): Promise<{
  campaign: EmailCampaign | null;
  recipients: CampaignRecipient[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: campaign, error: campErr } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (campErr || !campaign) {
      return { campaign: null, recipients: [], error: 'Campaign not found' };
    }

    const { data: recipients, error: recipErr } = await supabase
      .from('campaign_recipients')
      .select('*')
      .eq('campaign_id', id)
      .order('created_at', { ascending: true });

    if (recipErr) throw recipErr;

    return {
      campaign: campaign as EmailCampaign,
      recipients: (recipients || []) as CampaignRecipient[],
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { campaign: null, recipients: [], error: msg };
  }
}

export interface CreateCampaignInput {
  name: string;
  subject: string;
  body: string;
  provider: EmailProvider;
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  contactIds: string[];
  parentCampaignId?: string;
  followUpDelayDays?: number;
}

export async function createEmailCampaign(input: CreateCampaignInput): Promise<{
  success: boolean;
  campaignId?: string;
  recipientsCount?: number;
  skippedCount?: number;
  error?: string;
}> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  if (!input.name || !input.subject || !input.body) {
    return { success: false, error: 'Campaign name, subject, and body are required.' };
  }

  if (!input.contactIds || input.contactIds.length === 0) {
    return { success: false, error: 'At least one recipient must be selected.' };
  }

  try {
    const supabase = await createClient();

    // 1. Fetch suppressions
    const { data: suppressions } = await supabase.from('email_suppressions').select('email');
    const suppressedSet = new Set((suppressions || []).map((s) => s.email.toLowerCase()));

    // 2. Fetch selected contacts
    const { data: contacts, error: contactErr } = await supabase
      .from('outreach_contacts')
      .select('*')
      .in('id', input.contactIds);

    if (contactErr || !contacts || contacts.length === 0) {
      return { success: false, error: 'Could not find selected contacts in database.' };
    }

    // 3. Create campaign entry
    const { data: campaign, error: campErr } = await supabase
      .from('email_campaigns')
      .insert({
        name: input.name.trim(),
        subject: input.subject.trim(),
        body: input.body,
        provider: input.provider,
        sender_name: input.senderName.trim(),
        sender_email: input.senderEmail.trim(),
        reply_to: input.replyTo ? input.replyTo.trim() : null,
        status: 'draft',
        total_recipients: 0,
        parent_campaign_id: input.parentCampaignId || null,
        follow_up_delay_days: input.followUpDelayDays || 0,
      })
      .select()
      .single();

    if (campErr || !campaign) throw campErr || new Error('Failed to create campaign');

    // 4. Personalize and build recipient records
    const recipientsToInsert: Array<{
      campaign_id: string;
      contact_id: string;
      business_name: string;
      contact_name: string | null;
      email: string;
      personalized_subject: string;
      personalized_body: string;
      status: 'queued' | 'skipped';
      error_message?: string;
    }> = [];

    let skippedCount = 0;

    for (const contact of contacts as OutreachContact[]) {
      const email = contact.email ? contact.email.trim().toLowerCase() : '';

      // Skip missing, invalid, or suppressed emails
      if (!email || !isValidEmailAddress(email) || suppressedSet.has(email)) {
        skippedCount++;
        continue;
      }

      const unsubscribeUrl = getUnsubscribeUrl(email, campaign.id);
      const meta = {
        senderName: input.senderName,
        companyName: 'Rayida Tech',
        unsubscribeUrl,
      };

      const personalizedSubject = personalizeTemplate(input.subject, contact, meta);
      const personalizedBody = personalizeTemplate(input.body, contact, meta);

      recipientsToInsert.push({
        campaign_id: campaign.id,
        contact_id: contact.id,
        business_name: contact.business_name,
        contact_name: contact.contact_name || null,
        email,
        personalized_subject: personalizedSubject,
        personalized_body: personalizedBody,
        status: 'queued',
      });
    }

    if (recipientsToInsert.length === 0) {
      await supabase.from('email_campaigns').delete().eq('id', campaign.id);
      return {
        success: false,
        error: 'All selected contacts were skipped due to missing, invalid, or unsubscribed email addresses.',
      };
    }

    // Insert recipients in chunks
    const chunkSize = 150;
    for (let i = 0; i < recipientsToInsert.length; i += chunkSize) {
      const chunk = recipientsToInsert.slice(i, i + chunkSize);
      const { error: insErr } = await supabase.from('campaign_recipients').insert(chunk);
      if (insErr) throw insErr;
    }

    // Update campaign recipient count
    await supabase
      .from('email_campaigns')
      .update({ total_recipients: recipientsToInsert.length })
      .eq('id', campaign.id);

    // Update contacts outreach status to 'Campaign Queued'
    const queuedContactIds = recipientsToInsert.map((r) => r.contact_id);
    await supabase
      .from('outreach_contacts')
      .update({ outreach_status: 'Campaign Queued', updated_at: new Date().toISOString() })
      .in('id', queuedContactIds);

    revalidatePath('/admin/outreach');
    revalidatePath('/admin/outreach/campaigns');
    revalidatePath('/admin/outreach/contacts');

    return {
      success: true,
      campaignId: campaign.id,
      recipientsCount: recipientsToInsert.length,
      skippedCount,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Sends a test email to the admin's inbox with real personalization preview.
 */
export async function sendTestEmailAction(params: {
  provider: EmailProvider;
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  testRecipientEmail: string;
  subject: string;
  body: string;
  sampleContact?: Partial<OutreachContact>;
}): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  const testEmail = params.testRecipientEmail.trim().toLowerCase();
  if (!isValidEmailAddress(testEmail)) {
    return { success: false, error: 'Please enter a valid destination email address for the test.' };
  }

  const sample: Partial<OutreachContact> = params.sampleContact || {
    business_name: 'Pebbles Rentals & Events',
    contact_name: 'Amina Bello',
    business_type: 'Event Rentals & Luxury Decor',
    location: 'Wuse 2, Abuja',
    website: 'https://pebblesevents.example',
  };

  const unsubscribeUrl = getUnsubscribeUrl(testEmail);
  const meta = {
    senderName: params.senderName,
    companyName: 'Rayida Tech',
    unsubscribeUrl,
  };

  const personalizedSubject = `[TEST] ${personalizeTemplate(params.subject, sample, meta)}`;
  const personalizedBody = personalizeTemplate(params.body, sample, meta);

  const html = buildHtmlEmail({
    body: personalizedBody,
    businessName: sample.business_name || 'Valued Business',
    senderName: params.senderName,
    companyName: 'Rayida Tech',
    unsubscribeUrl,
  });

  return sendOutreachEmail({
    provider: params.provider,
    to: testEmail,
    subject: personalizedSubject,
    html,
    text: personalizedBody,
    senderName: params.senderName,
    senderEmail: params.senderEmail,
    replyTo: params.replyTo,
  });
}

/**
 * Processes the next batch of queued recipients for a campaign.
 * Controlled batching avoids timeout and respects provider rate limits.
 */
export async function launchCampaignBatch(
  campaignId: string,
  batchSize: number = 8
): Promise<{
  success: boolean;
  processed: number;
  sent: number;
  failed: number;
  remaining: number;
  completed: boolean;
  error?: string;
}> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) {
    return { success: false, processed: 0, sent: 0, failed: 0, remaining: 0, completed: false, error: auth.error };
  }

  try {
    const supabase = await createClient();

    // 1. Fetch campaign
    const { data: campaign, error: campErr } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campErr || !campaign) {
      return { success: false, processed: 0, sent: 0, failed: 0, remaining: 0, completed: false, error: 'Campaign not found' };
    }

    if (campaign.status === 'paused' || campaign.status === 'cancelled') {
      return {
        success: false,
        processed: 0,
        sent: 0,
        failed: 0,
        remaining: 0,
        completed: false,
        error: `Campaign is currently ${campaign.status}. Resume it first to send.`,
      };
    }

    // Set campaign status to 'sending' if draft or scheduled
    if (campaign.status !== 'sending') {
      await supabase
        .from('email_campaigns')
        .update({ status: 'sending', started_at: campaign.started_at || new Date().toISOString() })
        .eq('id', campaignId);
    }

    // 2. Fetch fresh suppression list
    const { data: suppressions } = await supabase.from('email_suppressions').select('email');
    const suppressedSet = new Set((suppressions || []).map((s) => s.email.toLowerCase()));

    // 3. Fetch next batch of queued recipients
    const { data: recipients, error: recipErr } = await supabase
      .from('campaign_recipients')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(batchSize);

    if (recipErr) throw recipErr;

    if (!recipients || recipients.length === 0) {
      // All recipients processed! Mark completed
      await supabase
        .from('email_campaigns')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', campaignId);

      revalidatePath(`/admin/outreach/campaigns/${campaignId}`);
      revalidatePath('/admin/outreach/campaigns');
      return { success: true, processed: 0, sent: 0, failed: 0, remaining: 0, completed: true };
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients as CampaignRecipient[]) {
      // Check suppression again right before sending
      if (suppressedSet.has(recipient.email.toLowerCase())) {
        await supabase
          .from('campaign_recipients')
          .update({
            status: 'skipped',
            error_message: 'Recipient was suppressed / unsubscribed prior to dispatch.',
          })
          .eq('id', recipient.id);
        continue;
      }

      const unsubscribeUrl = getUnsubscribeUrl(recipient.email, campaignId);
      const html = buildHtmlEmail({
        body: recipient.personalized_body,
        businessName: recipient.business_name,
        senderName: campaign.sender_name,
        companyName: 'Rayida Tech',
        unsubscribeUrl,
      });

      // Controlled micro-delay between emails to protect against provider burst limits
      await new Promise((resolve) => setTimeout(resolve, 150));

      const sendRes = await sendOutreachEmail({
        provider: campaign.provider as EmailProvider,
        to: recipient.email,
        subject: recipient.personalized_subject,
        html,
        text: recipient.personalized_body,
        senderName: campaign.sender_name,
        senderEmail: campaign.sender_email,
        replyTo: campaign.reply_to,
        campaignId,
        recipientId: recipient.id,
      });

      if (sendRes.success) {
        sentCount++;
        await supabase
          .from('campaign_recipients')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            provider_message_id: sendRes.messageId || null,
            error_message: null,
          })
          .eq('id', recipient.id);

        if (recipient.contact_id) {
          await supabase
            .from('outreach_contacts')
            .update({
              outreach_status: 'Email Sent',
              last_contacted_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', recipient.contact_id);
        }
      } else {
        failedCount++;
        await supabase
          .from('campaign_recipients')
          .update({
            status: 'failed',
            error_message: sendRes.error || 'Provider rejected email dispatch.',
            retry_count: (recipient.retry_count || 0) + 1,
          })
          .eq('id', recipient.id);
      }
    }

    // 4. Update campaign aggregates
    const { count: remainingCount } = await supabase
      .from('campaign_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .eq('status', 'queued');

    const newSentTotal = (campaign.sent_count || 0) + sentCount;
    const newFailedTotal = (campaign.failed_count || 0) + failedCount;
    const isNowCompleted = (remainingCount || 0) === 0;

    await supabase
      .from('email_campaigns')
      .update({
        sent_count: newSentTotal,
        failed_count: newFailedTotal,
        status: isNowCompleted ? 'completed' : 'sending',
        completed_at: isNowCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId);

    revalidatePath(`/admin/outreach/campaigns/${campaignId}`);
    revalidatePath('/admin/outreach/campaigns');
    revalidatePath('/admin/outreach/contacts');

    return {
      success: true,
      processed: recipients.length,
      sent: sentCount,
      failed: failedCount,
      remaining: remainingCount || 0,
      completed: isNowCompleted,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, processed: 0, sent: 0, failed: 0, remaining: 0, completed: false, error: msg };
  }
}

export async function pauseCampaignAction(campaignId: string): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('email_campaigns')
      .update({ status: 'paused', updated_at: new Date().toISOString() })
      .eq('id', campaignId);

    if (error) throw error;
    revalidatePath(`/admin/outreach/campaigns/${campaignId}`);
    revalidatePath('/admin/outreach/campaigns');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function resumeCampaignAction(campaignId: string): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('email_campaigns')
      .update({ status: 'sending', updated_at: new Date().toISOString() })
      .eq('id', campaignId);

    if (error) throw error;
    revalidatePath(`/admin/outreach/campaigns/${campaignId}`);
    revalidatePath('/admin/outreach/campaigns');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function cancelCampaignAction(campaignId: string): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();
    await supabase
      .from('campaign_recipients')
      .update({ status: 'skipped', error_message: 'Campaign cancelled by administrator.' })
      .eq('campaign_id', campaignId)
      .eq('status', 'queued');

    const { error } = await supabase
      .from('email_campaigns')
      .update({ status: 'cancelled', completed_at: new Date().toISOString() })
      .eq('id', campaignId);

    if (error) throw error;
    revalidatePath(`/admin/outreach/campaigns/${campaignId}`);
    revalidatePath('/admin/outreach/campaigns');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Creates a scheduled or immediate follow-up campaign filtering out prospects
 * who already unsubscribed, bounced, or replied!
 */
export async function createFollowUpCampaign(
  parentCampaignId: string,
  options: {
    name: string;
    subject: string;
    body: string;
    provider?: EmailProvider;
    delayDays?: number;
  }
): Promise<{ success: boolean; campaignId?: string; eligibleCount?: number; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  try {
    const supabase = await createClient();

    // 1. Fetch parent campaign recipients who received email ('sent' or 'delivered')
    const { data: parentRecipients, error: pErr } = await supabase
      .from('campaign_recipients')
      .select('contact_id, email, status')
      .eq('campaign_id', parentCampaignId)
      .in('status', ['sent', 'delivered']);

    if (pErr || !parentRecipients || parentRecipients.length === 0) {
      return { success: false, error: 'No sent recipients found in parent campaign to follow up with.' };
    }

    // 2. Fetch current suppressions
    const { data: suppressions } = await supabase.from('email_suppressions').select('email');
    const suppressedSet = new Set((suppressions || []).map((s) => s.email.toLowerCase()));

    // 3. Fetch contacts who have replied or expressed disinterest
    const contactIds = parentRecipients
      .map((r) => r.contact_id)
      .filter((id): id is string => Boolean(id));

    const { data: contacts } = await supabase
      .from('outreach_contacts')
      .select('id, email, outreach_status')
      .in('id', contactIds);

    const disqualifiedStatuses = new Set(['Replied', 'Interested', 'Not Interested', 'Unsubscribed', 'Bounced']);
    const eligibleContactIds: string[] = [];

    (contacts || []).forEach((c) => {
      const email = (c.email || '').toLowerCase().trim();
      if (!disqualifiedStatuses.has(c.outreach_status) && !suppressedSet.has(email)) {
        eligibleContactIds.push(c.id);
      }
    });

    if (eligibleContactIds.length === 0) {
      return {
        success: false,
        error: 'No eligible prospects left for follow-up (all replied, bounced, or unsubscribed).',
      };
    }

    // 4. Create new campaign linked to parent
    const { data: parentCamp } = await supabase
      .from('email_campaigns')
      .select('sender_name, sender_email, reply_to, provider')
      .eq('id', parentCampaignId)
      .single();

    const result = await createEmailCampaign({
      name: options.name,
      subject: options.subject,
      body: options.body,
      provider: options.provider || parentCamp?.provider || 'resend',
      senderName: parentCamp?.sender_name || 'Raymond Gaius',
      senderEmail: parentCamp?.sender_email || 'info@rayidatech.name.ng',
      replyTo: parentCamp?.reply_to || 'info@rayidatech.name.ng',
      contactIds: eligibleContactIds,
      parentCampaignId,
      followUpDelayDays: options.delayDays || 3,
    });

    return {
      success: result.success,
      campaignId: result.campaignId,
      eligibleCount: eligibleContactIds.length,
      error: result.error,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

