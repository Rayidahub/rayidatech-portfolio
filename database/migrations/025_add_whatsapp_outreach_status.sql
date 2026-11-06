-- Migration 025: Support 'Contacted via WhatsApp' status in outreach_contacts
-- Allows outreach contacts to transition to WhatsApp-contacted state.

ALTER TABLE public.outreach_contacts DROP CONSTRAINT IF EXISTS outreach_contacts_outreach_status_check;

ALTER TABLE public.outreach_contacts ADD CONSTRAINT outreach_contacts_outreach_status_check CHECK (
  outreach_status IN (
    'New',
    'Ready to Contact',
    'Campaign Queued',
    'Email Sent',
    'Replied',
    'Interested',
    'Follow-Up Required',
    'Contacted via WhatsApp',
    'Not Interested',
    'Unsubscribed',
    'Bounced',
    'Invalid Email',
    'Missing Email'
  )
);

