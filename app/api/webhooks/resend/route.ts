import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = body?.type; // e.g. 'email.delivered', 'email.bounced', 'email.opened'
    const eventData = body?.data;

    if (!eventType || !eventData) {
      return NextResponse.json({ received: true, ignored: true });
    }

    const emailId = eventData.email_id || eventData.id;
    const toAddress = Array.isArray(eventData.to) ? eventData.to[0] : eventData.to;
    const cleanEmail = (toAddress || '').toLowerCase().trim();

    const supabase = await createClient();

    // 1. Find matching recipient by provider_message_id or email
    let recipient: any = null;
    if (emailId) {
      const { data } = await supabase
        .from('campaign_recipients')
        .select('id, campaign_id, contact_id, status')
        .eq('provider_message_id', emailId)
        .maybeSingle();
      recipient = data;
    }

    if (!recipient && cleanEmail) {
      const { data } = await supabase
        .from('campaign_recipients')
        .select('id, campaign_id, contact_id, status')
        .ilike('email', cleanEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      recipient = data;
    }

    const campaignId = recipient?.campaign_id || null;
    const recipientId = recipient?.id || null;

    // 2. Map Resend event type to our system
    let mappedType: 'delivered' | 'bounced' | 'complained' | 'opened' | 'clicked' | 'failed' | null = null;
    if (eventType === 'email.delivered') mappedType = 'delivered';
    else if (eventType === 'email.bounced') mappedType = 'bounced';
    else if (eventType === 'email.complained') mappedType = 'complained';
    else if (eventType === 'email.opened') mappedType = 'opened';
    else if (eventType === 'email.clicked') mappedType = 'clicked';
    else if (eventType === 'email.failed') mappedType = 'failed';

    if (mappedType) {
      // 3. Log event into email_events
      await supabase.from('email_events').insert({
        campaign_id: campaignId,
        recipient_id: recipientId,
        email: cleanEmail || 'unknown',
        provider: 'resend',
        event_type: mappedType,
        payload: body,
      });

      // 4. Update recipient status and campaign counters
      if (recipientId) {
        const updatePayload: Record<string, any> = {};
        const now = new Date().toISOString();

        if (mappedType === 'delivered') {
          updatePayload.status = 'delivered';
          updatePayload.delivered_at = now;
        } else if (mappedType === 'bounced') {
          updatePayload.status = 'bounced';
          updatePayload.error_message = eventData.bounce?.message || 'Bounced by destination mail server';
        } else if (mappedType === 'opened') {
          updatePayload.opened_at = now;
        } else if (mappedType === 'clicked') {
          updatePayload.clicked_at = now;
        }

        await supabase.from('campaign_recipients').update(updatePayload).eq('id', recipientId);
      }

      // 5. Handle bounces & complaints in suppressions
      if (cleanEmail && (mappedType === 'bounced' || mappedType === 'complained')) {
        await supabase.from('email_suppressions').upsert(
          {
            email: cleanEmail,
            reason: mappedType,
            source_campaign_id: campaignId,
            notes: `Auto-suppressed via Resend webhook (${eventType})`,
          },
          { onConflict: 'email' }
        );

        if (recipient?.contact_id) {
          await supabase
            .from('outreach_contacts')
            .update({ outreach_status: 'Bounced', updated_at: new Date().toISOString() })
            .eq('id', recipient.contact_id);
        }
      }

      // 6. Update campaign aggregate counters if campaignId is present
      if (campaignId) {
        const { data: camp } = await supabase
          .from('email_campaigns')
          .select('delivered_count, bounced_count, opened_count, clicked_count')
          .eq('id', campaignId)
          .single();

        if (camp) {
          const campUpdates: Record<string, number> = {};
          if (mappedType === 'delivered') campUpdates.delivered_count = (camp.delivered_count || 0) + 1;
          if (mappedType === 'bounced') campUpdates.bounced_count = (camp.bounced_count || 0) + 1;
          if (mappedType === 'opened') campUpdates.opened_count = (camp.opened_count || 0) + 1;
          if (mappedType === 'clicked') campUpdates.clicked_count = (camp.clicked_count || 0) + 1;

          await supabase.from('email_campaigns').update(campUpdates).eq('id', campaignId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Resend webhook error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

