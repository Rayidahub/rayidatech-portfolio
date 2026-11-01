// lib/email/outreach-service.ts
// Production-grade Bulk Email Outreach Service for Rayida Tech Portfolio
// Supports Resend (REST API) & Zoho Mail (SMTP / OAuth2 REST API)

import crypto from 'crypto';
import nodemailer from 'nodemailer';
import type {
  EmailProvider,
  OutreachContact,
  EmailSettings,
  RecipientStatus,
} from '@/types/outreach';

export interface SendSingleEmailParams {
  provider: EmailProvider;
  to: string;
  subject: string;
  html: string;
  text?: string;
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  campaignId?: string;
  recipientId?: string;
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

const DEFAULT_SENDER_NAME = 'Raymond Gaius';
const DEFAULT_SENDER_EMAIL = 'info@rayidatech.name.ng';
const DEFAULT_COMPANY_NAME = 'Rayida Tech';
const DEFAULT_COMPANY_LOCATION = 'Abuja, Nigeria';

/**
 * Strips carriage returns and newlines to prevent email header injection attacks.
 */
export function sanitizeHeader(val?: string | null): string {
  if (!val || typeof val !== 'string') return '';
  return val.replace(/[\r\n\t]/g, ' ').trim();
}

/**
 * Validates email format according to standard RFC-compliant format.
 */
export function isValidEmailAddress(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  // RFC 5322 regex approximation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Generates a tamper-proof HMAC unsubscribe token for an email address.
 */
export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'rayidatech-outreach-secret-key';
  return crypto.createHmac('sha256', secret).update(email.toLowerCase().trim()).digest('hex');
}

/**
 * Verifies an unsubscribe token.
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expected = generateUnsubscribeToken(email);
  const bufExpected = Buffer.from(expected);
  const bufToken = Buffer.from(token);
  if (bufToken.length !== bufExpected.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufToken, bufExpected);
}

/**
 * Generates the unsubscribe URL with signed token.
 */
export function getUnsubscribeUrl(email: string, campaignId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rayidatech.name.ng';
  const token = generateUnsubscribeToken(email);
  const params = new URLSearchParams({
    email: email.trim().toLowerCase(),
    token,
  });
  if (campaignId) params.set('cid', campaignId);
  return `${baseUrl}/unsubscribe?${params.toString()}`;
}

/**
 * High-performance string personalizer with fallbacks and guarantee of zero unresolved variables.
 */
export function personalizeTemplate(
  template: string,
  contact: Partial<OutreachContact>,
  meta: {
    senderName?: string;
    companyName?: string;
    unsubscribeUrl?: string;
  } = {}
): string {
  if (!template) return '';

  const businessName = (contact.business_name || '').trim();
  const contactName = (contact.contact_name || '').trim();
  const businessType = (contact.business_type || '').trim();
  const location = (contact.location || '').trim();
  const website = (contact.website || '').trim();
  const senderName = (meta.senderName || DEFAULT_SENDER_NAME).trim();
  const companyName = (meta.companyName || DEFAULT_COMPANY_NAME).trim();
  const unsubscribeUrl = meta.unsubscribeUrl || '#';

  let rendered = template;

  // 1. Smart Greeting fallback:
  // If contact_name is empty, replace "Hello {{contact_name}}," with "Hello {{business_name}}," or "Hello,"
  if (!contactName) {
    if (businessName) {
      rendered = rendered.replace(/Hello\s*\{\{contact_name\}\}/gi, `Hello ${businessName}`);
      rendered = rendered.replace(/Hi\s*\{\{contact_name\}\}/gi, `Hi ${businessName}`);
      rendered = rendered.replace(/Dear\s*\{\{contact_name\}\}/gi, `Dear ${businessName}`);
    } else {
      rendered = rendered.replace(/Hello\s*\{\{contact_name\}\}/gi, 'Hello');
      rendered = rendered.replace(/Hi\s*\{\{contact_name\}\}/gi, 'Hi');
      rendered = rendered.replace(/Dear\s*\{\{contact_name\}\}/gi, 'Hello');
    }
  }

  // 2. Direct dynamic substitutions
  rendered = rendered.replace(/\{\{business_name\}\}/gi, businessName || 'your business');
  rendered = rendered.replace(/\{\{contact_name\}\}/gi, contactName || businessName || 'there');
  rendered = rendered.replace(/\{\{business_type\}\}/gi, businessType || 'your industry');
  rendered = rendered.replace(/\{\{location\}\}/gi, location || 'your area');
  rendered = rendered.replace(/\{\{website\}\}/gi, website || '');
  rendered = rendered.replace(/\{\{sender_name\}\}/gi, senderName);
  rendered = rendered.replace(/\{\{company_name\}\}/gi, companyName);
  rendered = rendered.replace(/\{\{unsubscribe_url\}\}/gi, unsubscribeUrl);

  // 3. Strict safety pass: Clean up ANY leftover unresolved {{variable}} tags
  rendered = rendered.replace(/\{\{[a-zA-Z0-9_-]+\}\}/g, '');

  return rendered.trim();
}

/**
 * Builds standard compliant HTML email layout with dark/light ergonomics and unsubscribe footer.
 */
export function buildHtmlEmail({
  body,
  businessName,
  senderName,
  companyName,
  unsubscribeUrl,
}: {
  body: string;
  businessName: string;
  senderName?: string;
  companyName?: string;
  unsubscribeUrl: string;
}): string {
  // Convert newlines in plain body to clean paragraphs
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      // If line contains HTML tags, preserve it; otherwise convert single breaks to <br/>
      if (p.startsWith('<p') || p.startsWith('<div') || p.startsWith('<table')) return p;
      return `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #333333; font-size: 15px;">${p.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  const sender = senderName || DEFAULT_SENDER_NAME;
  const company = companyName || DEFAULT_COMPANY_NAME;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message from ${sender}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f8fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f8fb; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #8000ff 0%, #00d1ff 100%);"></td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              ${paragraphs}
            </td>
          </tr>

          <!-- Compliance & Unsubscribe Footer -->
          <tr>
            <td style="padding: 20px 28px 24px 28px; background-color: #f9fafb; border-top: 1px solid #edf2f7; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #718096; line-height: 1.5;">
                Sent to <strong>${businessName}</strong> by ${sender} &bull; ${company}<br/>
                Abuja, Federal Capital Territory, Nigeria
              </p>
              <p style="margin: 0; font-size: 11px; color: #a0aec0;">
                If you do not wish to receive future notes regarding web development or design, you can
                <a href="${unsubscribeUrl}" target="_blank" style="color: #8000ff; text-decoration: underline;">unsubscribe here with 1 click</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// PROVIDER: RESEND
// ---------------------------------------------------------------------------

async function sendViaResend(params: SendSingleEmailParams): Promise<SendEmailResponse> {
  const apiKey = process.env.RESEND_API_KEY || '';
  const cleanFrom = `${sanitizeHeader(params.senderName)} <${sanitizeHeader(params.senderEmail)}>`;
  const cleanTo = sanitizeHeader(params.to);
  const cleanSubject = sanitizeHeader(params.subject);
  const cleanReplyTo = params.replyTo ? sanitizeHeader(params.replyTo) : undefined;

  if (!apiKey) {
    console.info(`[Resend:Simulated] To: ${cleanTo} | Subject: "${cleanSubject}"`);
    return {
      success: true,
      messageId: `sim_resend_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      simulated: true,
    };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: cleanFrom,
        to: [cleanTo],
        subject: cleanSubject,
        html: params.html,
        ...(params.text ? { text: params.text } : {}),
        ...(cleanReplyTo ? { reply_to: cleanReplyTo } : {}),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        error: `Resend API Error (${res.status}): ${errorText}`,
      };
    }

    const data = (await res.json()) as { id?: string };
    return {
      success: true,
      messageId: data.id || `resend_${Date.now()}`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Resend Network Error: ${msg}` };
  }
}

// ---------------------------------------------------------------------------
// PROVIDER: ZOHO MAIL
// ---------------------------------------------------------------------------

function getZohoSmtpTransporter() {
  const host = process.env.ZOHO_MAIL_HOST || 'smtppro.zoho.com';
  const port = Number(process.env.ZOHO_MAIL_PORT || '465');
  const secure = port === 465;
  const user = process.env.ZOHO_MAIL_USER || process.env.ZOHO_MAIL_USERNAME || 'info@rayidatech.name.ng';
  const pass = process.env.ZOHO_MAIL_PASSWORD || process.env.ZOHO_MAIL_APP_PASSWORD || '';

  if (!pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: true,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
  });
}

/**
 * Sends an email via Zoho Mail (SMTP or OAuth REST API).
 */
async function sendViaZoho(params: SendSingleEmailParams): Promise<SendEmailResponse> {
  const cleanFrom = `"${sanitizeHeader(params.senderName)}" <${sanitizeHeader(params.senderEmail)}>`;
  const cleanTo = sanitizeHeader(params.to);
  const cleanSubject = sanitizeHeader(params.subject);

  // Check if Zoho OAuth REST API credentials are provided
  const clientId = process.env.ZOHO_MAIL_CLIENT_ID;
  const clientSecret = process.env.ZOHO_MAIL_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_MAIL_REFRESH_TOKEN;
  const accountId = process.env.ZOHO_MAIL_ACCOUNT_ID;

  if (clientId && clientSecret && refreshToken && accountId) {
    return sendViaZohoRestApi(params, { clientId, clientSecret, refreshToken, accountId });
  }

  // Otherwise, fallback to Zoho SMTP via nodemailer
  const transporter = getZohoSmtpTransporter();

  if (!transporter) {
    // If neither OAuth nor SMTP password is configured, simulate safely
    console.info(`[ZohoMail:Simulated] To: ${cleanTo} | Subject: "${cleanSubject}"`);
    return {
      success: true,
      messageId: `sim_zoho_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      simulated: true,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: cleanFrom,
      to: cleanTo,
      subject: cleanSubject,
      html: params.html,
      ...(params.text ? { text: params.text } : {}),
      ...(params.replyTo ? { replyTo: sanitizeHeader(params.replyTo) } : {}),
    });

    return {
      success: true,
      messageId: info.messageId || `zoho_${Date.now()}`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Zoho SMTP Error: ${msg}` };
  }
}

/**
 * Sends email via Zoho Mail official REST API v2 using OAuth2.
 */
async function sendViaZohoRestApi(
  params: SendSingleEmailParams,
  auth: { clientId: string; clientSecret: string; refreshToken: string; accountId: string }
): Promise<SendEmailResponse> {
  try {
    // 1. Refresh OAuth Access Token
    const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
    const tokenParams = new URLSearchParams({
      refresh_token: auth.refreshToken,
      client_id: auth.clientId,
      client_secret: auth.clientSecret,
      grant_type: 'refresh_token',
    });

    const tokenRes = await fetch(`${tokenUrl}?${tokenParams.toString()}`, { method: 'POST' });
    if (!tokenRes.ok) {
      const errTxt = await tokenRes.text();
      return { success: false, error: `Zoho OAuth Token Error: ${errTxt}` };
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
    if (!tokenData.access_token) {
      return { success: false, error: `Zoho Token Error: ${tokenData.error || 'No access token returned'}` };
    }

    // 2. Dispatch email via Zoho Mail API v2
    const apiUrl = `https://mail.zoho.com/api/accounts/${auth.accountId}/messages`;
    const bodyPayload = {
      fromAddress: params.senderEmail,
      toAddress: params.to,
      subject: params.subject,
      content: params.html,
      mailFormat: 'html',
      ...(params.replyTo ? { replyTo: params.replyTo } : {}),
    };

    const sendRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!sendRes.ok) {
      const errTxt = await sendRes.text();
      return { success: false, error: `Zoho REST API Error (${sendRes.status}): ${errTxt}` };
    }

    const sendData = (await sendRes.json()) as { data?: { messageId?: string } };
    return {
      success: true,
      messageId: sendData?.data?.messageId || `zoho_api_${Date.now()}`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Zoho REST API Exception: ${msg}` };
  }
}

// ---------------------------------------------------------------------------
// UNIFIED EMAIL DISPATCHER
// ---------------------------------------------------------------------------

export async function sendOutreachEmail(params: SendSingleEmailParams): Promise<SendEmailResponse> {
  if (params.provider === 'zoho') {
    return sendViaZoho(params);
  }
  return sendViaResend(params);
}

/**
 * Diagnostic tool: Test provider connection and credentials without launching a bulk campaign.
 */
export async function testProviderConnection(provider: EmailProvider): Promise<{
  connected: boolean;
  provider: EmailProvider;
  mode: 'live' | 'simulated';
  message: string;
}> {
  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return {
        connected: true,
        provider: 'resend',
        mode: 'simulated',
        message: 'Resend API key not detected in .env.local — running in safe Simulated Mode.',
      };
    }

    try {
      // Test key validity against Resend domains API
      const res = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        return {
          connected: true,
          provider: 'resend',
          mode: 'live',
          message: 'Connected to Resend successfully. Verified domains are active.',
        };
      }
      return {
        connected: false,
        provider: 'resend',
        mode: 'live',
        message: `Resend responded with HTTP ${res.status}: check your RESEND_API_KEY.`,
      };
    } catch (err: unknown) {
      return {
        connected: false,
        provider: 'resend',
        mode: 'live',
        message: `Failed to reach Resend: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  // Zoho connection test
  const hasOAuth = Boolean(process.env.ZOHO_MAIL_CLIENT_ID && process.env.ZOHO_MAIL_REFRESH_TOKEN);
  const hasSmtp = Boolean(process.env.ZOHO_MAIL_PASSWORD || process.env.ZOHO_MAIL_APP_PASSWORD);

  if (!hasOAuth && !hasSmtp) {
    return {
      connected: true,
      provider: 'zoho',
      mode: 'simulated',
      message: 'Zoho credentials not set — running in safe Simulated Mode.',
    };
  }

  if (hasSmtp) {
    const transporter = getZohoSmtpTransporter();
    if (!transporter) {
      return {
        connected: false,
        provider: 'zoho',
        mode: 'live',
        message: 'Unable to initialize Zoho SMTP transporter.',
      };
    }

    try {
      await transporter.verify();
      return {
        connected: true,
        provider: 'zoho',
        mode: 'live',
        message: 'Zoho Mail SMTP connection verified successfully (smtppro.zoho.com:465).',
      };
    } catch (err: unknown) {
      return {
        connected: false,
        provider: 'zoho',
        mode: 'live',
        message: `Zoho SMTP verification failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  return {
    connected: true,
    provider: 'zoho',
    mode: 'live',
    message: 'Zoho Mail OAuth2 credentials detected.',
  };
}
