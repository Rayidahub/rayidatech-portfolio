-- ==============================================================================
-- 024_email_outreach_campaigns.sql
-- RAYIDA TECH PORTFOLIO — BULK EMAIL OUTREACH & CAMPAIGN MANAGEMENT SCHEMA
-- Compatible with PostgreSQL 15+ / Supabase
-- Fully Idempotent & Production-Ready
-- ==============================================================================

-- 1. OUTREACH CONTACTS (Prospects database)
CREATE TABLE IF NOT EXISTS public.outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  business_type TEXT,
  location TEXT,
  website TEXT,
  instagram TEXT,
  phone TEXT,
  notes TEXT,
  outreach_status TEXT NOT NULL DEFAULT 'New' CHECK (
    outreach_status IN (
      'New',
      'Ready to Contact',
      'Campaign Queued',
      'Email Sent',
      'Replied',
      'Interested',
      'Follow-Up Required',
      'Not Interested',
      'Unsubscribed',
      'Bounced',
      'Invalid Email',
      'Missing Email'
    )
  ),
  last_contacted_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching and filtering prospects
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_email ON public.outreach_contacts (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_status ON public.outreach_contacts (outreach_status);
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_location ON public.outreach_contacts (location);
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_business_type ON public.outreach_contacts (business_type);
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_created_at ON public.outreach_contacts (created_at DESC);

-- 2. EMAIL CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'resend' CHECK (provider IN ('resend', 'zoho')),
  sender_name TEXT NOT NULL DEFAULT 'Raymond Gaius',
  sender_email TEXT NOT NULL DEFAULT 'info@rayidatech.name.ng',
  reply_to TEXT DEFAULT 'info@rayidatech.name.ng',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'scheduled', 'sending', 'completed', 'paused', 'cancelled', 'failed')
  ),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  parent_campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
  follow_up_delay_days INTEGER DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON public.email_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON public.email_campaigns (created_at DESC);

-- 3. CAMPAIGN RECIPIENTS
CREATE TABLE IF NOT EXISTS public.campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.outreach_contacts(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT NOT NULL,
  personalized_subject TEXT NOT NULL,
  personalized_body TEXT NOT NULL,
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN ('queued', 'sending', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'skipped')
  ),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON public.campaign_recipients (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_email ON public.campaign_recipients (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON public.campaign_recipients (status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_msg_id ON public.campaign_recipients (provider_message_id);

-- 4. EMAIL TEMPLATES
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'outreach',
  variables TEXT[] DEFAULT '{"business_name", "contact_name", "business_type", "location", "website", "sender_name", "company_name"}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EMAIL EVENTS (Webhooks & Telemetry)
CREATE TABLE IF NOT EXISTS public.email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.campaign_recipients(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('delivered', 'bounced', 'complained', 'opened', 'clicked', 'unsubscribed', 'failed')
  ),
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_events_campaign ON public.email_events (campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_events_recipient ON public.email_events (recipient_id);
CREATE INDEX IF NOT EXISTS idx_email_events_email ON public.email_events (LOWER(email));

-- 6. EMAIL SUPPRESSIONS (Unsubscribes, Bounces, Spam complaints)
CREATE TABLE IF NOT EXISTS public.email_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('unsubscribed', 'bounced', 'complained', 'manual')),
  source_campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_suppressions_email ON public.email_suppressions (LOWER(email));

-- 7. EMAIL SETTINGS (Zoho, Resend, Default identities)
CREATE TABLE IF NOT EXISTS public.email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_provider TEXT NOT NULL DEFAULT 'resend' CHECK (default_provider IN ('resend', 'zoho')),
  sender_name TEXT NOT NULL DEFAULT 'Raymond Gaius',
  sender_email TEXT NOT NULL DEFAULT 'info@rayidatech.name.ng',
  reply_to TEXT NOT NULL DEFAULT 'info@rayidatech.name.ng',
  test_recipient_email TEXT DEFAULT 'rayidagaius@gmail.com',
  company_name TEXT NOT NULL DEFAULT 'Rayida Tech',
  company_address TEXT DEFAULT 'Abuja, Nigeria',
  zoho_host TEXT DEFAULT 'smtppro.zoho.com',
  zoho_port INTEGER DEFAULT 465,
  zoho_secure BOOLEAN DEFAULT TRUE,
  zoho_username TEXT DEFAULT 'info@rayidatech.name.ng',
  resend_rate_limit_per_sec INTEGER DEFAULT 5,
  zoho_rate_limit_per_min INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings row if missing
INSERT INTO public.email_settings (id, default_provider, sender_name, sender_email, reply_to, test_recipient_email, company_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'resend',
  'Raymond Gaius',
  'info@rayidatech.name.ng',
  'info@rayidatech.name.ng',
  'rayidagaius@gmail.com',
  'Rayida Tech'
)
ON CONFLICT (id) DO NOTHING;

-- Seed high-converting outreach templates
INSERT INTO public.email_templates (name, subject, body, description, is_default)
VALUES 
(
  'Abuja Business Website Proposal',
  'A website idea for {{business_name}}',
  'Hello {{contact_name}},

I came across {{business_name}} and noticed that your business specializes in {{business_type}} in {{location}}.

I’m Raymond Gaius, founder and lead product engineer at Rayida Tech. We build fast, high-converting digital platforms and bespoke websites that help businesses turn casual visitors into loyal paying clients.

Looking at your presence, I believe a modern, responsive website could help {{business_name}} showcase your offerings, build immediate trust, and automate customer inquiries.

Would you be open to a brief 5-minute conversation or seeing a free visual concept this week?

Best regards,
Raymond Gaius
Founder, Rayida Tech
https://rayidatech.name.ng',
  'Ideal for cold outreach to Nigerian and Abuja businesses specializing in retail, hospitality, services, and luxury events.',
  TRUE
),
(
  'Website Redesign & Modernization',
  'Quick suggestion for {{business_name}}''s online presence',
  'Hello {{contact_name}},

I was reviewing prominent brands in {{business_type}} and took a look at {{business_name}}.

In today''s market, customer trust is decided within the first 3 seconds of opening a website. At Rayida Tech, we help brands revamp their digital identity with clean user experience, instant mobile load times, and conversion-focused design.

I have a couple of specific ideas that could elevate {{business_name}}''s digital conversions. 

Would you have 5 minutes this week for a quick chat?

Warm regards,
Raymond Gaius
Product Designer & AI Engineer
Rayida Tech — https://rayidatech.name.ng',
  'Tailored for businesses that already have an existing web presence or outdated page needing a redesign.',
  FALSE
),
(
  'Follow-Up #1: Gentle Bump',
  'Following up on {{business_name}}',
  'Hello {{contact_name}},

I wanted to quickly follow up on my earlier note regarding {{business_name}} and your digital presence in {{location}}.

I know how busy things get running operations in {{business_type}}. If you are interested, I would be happy to share a brief 1-page visual audit or answer any questions you might have about building a high-performance web experience.

Let me know if this is something on your radar this quarter!

Best,
Raymond Gaius
Founder, Rayida Tech',
  'Follow-up sent 3–4 days after initial email if no reply received.',
  FALSE
),
(
  'Follow-Up #2: Final Check-in',
  'Final check-in regarding {{business_name}}',
  'Hello {{contact_name}},

I don''t want to crowd your inbox, so this will be my final note.

If you ever decide to expand {{business_name}}''s online footprint, automate client bookings, or upgrade your website, feel free to keep my details handy or explore our recent case studies at https://rayidatech.name.ng.

Wishing you and {{business_name}} continued success!

Best regards,
Raymond Gaius
Rayida Tech',
  'Polite closing message sent 7+ days later that leaves the door open.',
  FALSE
)
ON CONFLICT DO NOTHING;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.outreach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full management access
CREATE POLICY "Admins full access to outreach_contacts" ON public.outreach_contacts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to email_campaigns" ON public.email_campaigns
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to campaign_recipients" ON public.campaign_recipients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to email_templates" ON public.email_templates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to email_events" ON public.email_events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to email_suppressions" ON public.email_suppressions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to email_settings" ON public.email_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow public access for unsubscribes and webhook events
CREATE POLICY "Public insert for unsubscribe suppressions" ON public.email_suppressions
  FOR INSERT TO anon WITH CHECK (reason = 'unsubscribed');

CREATE POLICY "Public insert for webhook events" ON public.email_events
  FOR INSERT TO anon WITH CHECK (true);

