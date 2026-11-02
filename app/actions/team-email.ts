'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import { sendOutreachEmail } from '@/lib/email/outreach-service';
import { isValidEmailAddress } from '@/lib/email/outreach-utils';
import {
  personalizeTeamMessage,
  buildTeamHtmlEmail,
  type TeamEmailPersonalizationInput,
} from '@/lib/email/team-email-utils';
import type { EmailProvider } from '@/types/outreach';

export interface TeamMemberRecipient {
  memberId: string;
  name: string;
  role?: string;
  email: string;
}

export interface SendTeamEmailParams {
  recipients: TeamMemberRecipient[];
  subject: string;
  body: string;
  provider: EmailProvider;
  senderName?: string;
  senderEmail?: string;
  replyTo?: string;
}

export interface SendTeamEmailResult {
  success: boolean;
  total: number;
  sent: number;
  failed: number;
  results: Array<{
    name: string;
    email: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
  error?: string;
}

/**
 * Sends a direct personalized message to one or more team members
 * using the unified outreach email dispatch system (Resend or Zoho Mail).
 */
export async function sendTeamDirectEmailAction(
  params: SendTeamEmailParams
): Promise<SendTeamEmailResult> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) {
    return {
      success: false,
      total: 0,
      sent: 0,
      failed: 0,
      results: [],
      error: auth.error || 'Unauthorized',
    };
  }

  const {
    recipients,
    subject,
    body,
    provider,
    senderName = 'Raymond Gaius',
    senderEmail = 'info@rayidatech.name.ng',
    replyTo = 'info@rayidatech.name.ng',
  } = params;

  if (!recipients || recipients.length === 0) {
    return {
      success: false,
      total: 0,
      sent: 0,
      failed: 0,
      results: [],
      error: 'Please select at least one team member recipient.',
    };
  }

  if (!subject.trim() || !body.trim()) {
    return {
      success: false,
      total: recipients.length,
      sent: 0,
      failed: recipients.length,
      results: [],
      error: 'Subject and message body cannot be empty.',
    };
  }

  const supabase = await createClient();
  const dispatchResults: SendTeamEmailResult['results'] = [];
  let sentCount = 0;
  let failedCount = 0;

  for (const recipient of recipients) {
    const email = (recipient.email || '').trim().toLowerCase();

    if (!isValidEmailAddress(email)) {
      failedCount++;
      dispatchResults.push({
        name: recipient.name,
        email: email || '(empty)',
        success: false,
        error: 'Invalid or missing email address.',
      });
      continue;
    }

    // 1. Personalize subject and body for this team member
    const memberInput: TeamEmailPersonalizationInput = {
      name: recipient.name,
      role: recipient.role || 'Team Member',
      email,
    };

    const personalizedSubject = personalizeTeamMessage(subject, memberInput, {
      senderName,
      companyName: 'Rayida Tech',
    });

    const personalizedBody = personalizeTeamMessage(body, memberInput, {
      senderName,
      companyName: 'Rayida Tech',
    });

    const htmlContent = buildTeamHtmlEmail({
      body: personalizedBody,
      recipientName: recipient.name,
      recipientRole: recipient.role,
      senderName,
      companyName: 'Rayida Tech',
    });

    // 2. Dispatch via unified outreach email engine (Resend or Zoho)
    try {
      const sendRes = await sendOutreachEmail({
        provider,
        to: email,
        subject: personalizedSubject,
        html: htmlContent,
        text: personalizedBody,
        senderName,
        senderEmail,
        replyTo,
      });

      if (sendRes.success) {
        sentCount++;
        dispatchResults.push({
          name: recipient.name,
          email,
          success: true,
          messageId: sendRes.messageId,
        });

        // Log to email_events for admin telemetry
        try {
          await supabase.from('email_events').insert({
            email,
            provider,
            event_type: 'delivered',
            payload: {
              context: 'team_internal_message',
              recipient_name: recipient.name,
              recipient_role: recipient.role,
              subject: personalizedSubject,
              message_id: sendRes.messageId,
            },
          });
        } catch {
          // Non-fatal telemetry log
        }

        // If email was not already saved on the member record, update social_links.email
        if (recipient.memberId) {
          try {
            const { data: member } = await supabase
              .from('team_members')
              .select('social_links')
              .eq('id', recipient.memberId)
              .single();

            if (member) {
              const currentSocials = (member.social_links as Record<string, string>) || {};
              if (currentSocials.email !== email) {
                await supabase
                  .from('team_members')
                  .update({
                    social_links: { ...currentSocials, email },
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', recipient.memberId);
              }
            }
          } catch {
            // Non-critical background save
          }
        }
      } else {
        failedCount++;
        dispatchResults.push({
          name: recipient.name,
          email,
          success: false,
          error: sendRes.error || 'Failed to dispatch email.',
        });
      }
    } catch (err: unknown) {
      failedCount++;
      const msg = err instanceof Error ? err.message : String(err);
      dispatchResults.push({
        name: recipient.name,
        email,
        success: false,
        error: msg,
      });
    }
  }

  revalidatePath('/admin/team');

  return {
    success: sentCount > 0,
    total: recipients.length,
    sent: sentCount,
    failed: failedCount,
    results: dispatchResults,
  };
}

/**
 * Updates a team member's email address in their record.
 */
export async function updateTeamMemberEmailAction(
  memberId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, error: auth.error };

  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail && !isValidEmailAddress(cleanEmail)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  try {
    const supabase = await createClient();
    const { data: member, error: fetchError } = await supabase
      .from('team_members')
      .select('social_links')
      .eq('id', memberId)
      .single();

    if (fetchError || !member) {
      return { success: false, error: 'Team member not found.' };
    }

    const currentSocials = (member.social_links as Record<string, string>) || {};
    const updatedSocials = { ...currentSocials, email: cleanEmail };

    const { error: updateError } = await supabase
      .from('team_members')
      .update({
        social_links: updatedSocials,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memberId);

    if (updateError) throw updateError;

    revalidatePath('/admin/team');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Bridges selected team members into the Outreach Contact CRM, allowing full bulk campaign execution.
 */
export async function exportTeamToOutreachContacts(
  memberIds: string[]
): Promise<{ success: boolean; contactIds: string[]; error?: string }> {
  const auth = await requireAdminSession();
  if (!auth.authenticated) return { success: false, contactIds: [], error: auth.error };

  if (!memberIds || memberIds.length === 0) {
    return { success: false, contactIds: [], error: 'No team members selected.' };
  }

  try {
    const supabase = await createClient();
    const { data: members, error: fetchErr } = await supabase
      .from('team_members')
      .select('*')
      .in('id', memberIds);

    if (fetchErr || !members) {
      return { success: false, contactIds: [], error: fetchErr?.message || 'Failed to fetch team members' };
    }

    const createdIds: string[] = [];

    for (const m of members) {
      const socials = (m.social_links as Record<string, string>) || {};
      const email = (socials.email || '').trim().toLowerCase();

      if (!email || !isValidEmailAddress(email)) {
        continue;
      }

      // Check if already in outreach_contacts
      const { data: existing } = await supabase
        .from('outreach_contacts')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        createdIds.push(existing.id);
      } else {
        const { data: inserted, error: insErr } = await supabase
          .from('outreach_contacts')
          .insert({
            business_name: m.name,
            contact_name: m.name,
            email,
            business_type: m.role || 'Team Member',
            location: 'Abuja',
            website: socials.website || null,
            notes: `Team Member at Rayida Tech (${m.role})`,
            outreach_status: 'Ready to Contact',
          })
          .select('id')
          .single();

        if (!insErr && inserted) {
          createdIds.push(inserted.id);
        }
      }
    }

    revalidatePath('/admin/outreach/contacts');

    return {
      success: createdIds.length > 0,
      contactIds: createdIds,
      error: createdIds.length === 0 ? 'None of the selected team members have a valid email address configured yet.' : undefined,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, contactIds: [], error: msg };
  }
}

