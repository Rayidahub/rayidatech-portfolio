// types/outreach.ts
// Rayida Tech Portfolio — Bulk Email Outreach & Campaign Management Types

export type OutreachStatus =
  | 'New'
  | 'Ready to Contact'
  | 'Campaign Queued'
  | 'Email Sent'
  | 'Replied'
  | 'Interested'
  | 'Follow-Up Required'
  | 'Contacted via WhatsApp'
  | 'Not Interested'
  | 'Unsubscribed'
  | 'Bounced'
  | 'Invalid Email'
  | 'Missing Email';

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'completed'
  | 'paused'
  | 'cancelled'
  | 'failed';

export type RecipientStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'bounced'
  | 'opened'
  | 'clicked'
  | 'unsubscribed'
  | 'skipped';

export type EmailProvider = 'resend' | 'zoho';

export interface OutreachContact {
  id: string;
  business_name: string;
  contact_name?: string | null;
  email?: string | null;
  business_type?: string | null;
  location?: string | null;
  website?: string | null;
  instagram?: string | null;
  phone?: string | null;
  notes?: string | null;
  outreach_status: OutreachStatus;
  last_contacted_at?: string | null;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  provider: EmailProvider;
  sender_name: string;
  sender_email: string;
  reply_to?: string | null;
  status: CampaignStatus;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  bounced_count: number;
  opened_count: number;
  clicked_count: number;
  replied_count: number;
  unsubscribed_count: number;
  parent_campaign_id?: string | null;
  follow_up_delay_days?: number;
  scheduled_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  contact_id?: string | null;
  business_name: string;
  contact_name?: string | null;
  email: string;
  personalized_subject: string;
  personalized_body: string;
  provider_message_id?: string | null;
  status: RecipientStatus;
  error_message?: string | null;
  retry_count: number;
  sent_at?: string | null;
  delivered_at?: string | null;
  opened_at?: string | null;
  clicked_at?: string | null;
  unsubscribed_at?: string | null;
  created_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description?: string | null;
  category?: string;
  variables: string[];
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmailSuppression {
  id: string;
  email: string;
  reason: 'unsubscribed' | 'bounced' | 'complained' | 'manual';
  source_campaign_id?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface EmailEvent {
  id: string;
  campaign_id?: string | null;
  recipient_id?: string | null;
  email: string;
  provider: string;
  event_type: 'delivered' | 'bounced' | 'complained' | 'opened' | 'clicked' | 'unsubscribed' | 'failed';
  payload?: Record<string, unknown>;
  created_at?: string;
}

export interface EmailSettings {
  id?: string;
  default_provider: EmailProvider;
  sender_name: string;
  sender_email: string;
  reply_to: string;
  test_recipient_email: string;
  company_name: string;
  company_address?: string;
  zoho_host?: string;
  zoho_port?: number;
  zoho_secure?: boolean;
  zoho_username?: string;
  resend_rate_limit_per_sec?: number;
  zoho_rate_limit_per_min?: number;
  updated_at?: string;
}

// Import mapping types
export interface ColumnMapping {
  business_name: string;
  contact_name?: string;
  email: string;
  business_type?: string;
  location?: string;
  website?: string;
  instagram?: string;
  phone?: string;
  notes?: string;
  outreach_status?: string;
}

export interface ImportPreviewRow {
  rowNumber: number;
  business_name: string;
  contact_name: string;
  email: string;
  business_type: string;
  location: string;
  website: string;
  instagram: string;
  phone: string;
  notes: string;
  isValidEmail: boolean;
  isDuplicateInFile: boolean;
  isDuplicateInDb: boolean;
  isSuppressed: boolean;
  hasMissingEmail: boolean;
  validationError?: string;
}

