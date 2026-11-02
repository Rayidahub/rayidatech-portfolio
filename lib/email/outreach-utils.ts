// lib/email/outreach-utils.ts
// Pure client-safe utility functions for outreach email personalization & validation
// Zero Node-only dependencies (safe for both browser and server)

import type { OutreachContact } from '@/types/outreach';

export const DEFAULT_SENDER_NAME = 'Raymond Gaius';
export const DEFAULT_SENDER_EMAIL = 'info@rayidatech.name.ng';
export const DEFAULT_COMPANY_NAME = 'Rayida Tech';
export const DEFAULT_COMPANY_LOCATION = 'Abuja, Nigeria';

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
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Sanitizes and cleans business names that have parenthetical category tags.
 * For example: "1420 Events (Event Planner & Decor)" -> "1420 Events"
 */
export function cleanBusinessName(name?: string | null): string {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  // Strip trailing or embedded parentheses such as "(Event Planner & Decor)", "(Catering)", etc.
  const cleaned = trimmed.replace(/\s*\([^)]*\)\s*$/g, '').trim();
  return cleaned || trimmed;
}

/**
 * High-performance string personalizer with fallbacks and guarantee of zero unresolved variables.
 * Perfectly aligns with user's Abuja spreadsheet columns:
 * - Business Name ({{business_name}}, {{clean_business_name}})
 * - Business Type ({{business_type}}, {{industry}})
 * - Area ({{area}}, {{location}})
 * - Public Email Address ({{public_email}}, {{email}})
 * - Public Phone Number ({{phone}}, {{phone_number}}, {{public_phone}})
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
  const cleanBusiness = cleanBusinessName(businessName);
  const contactName = (contact.contact_name || '').trim();
  const businessType = (contact.business_type || '').trim();
  const location = (contact.location || '').trim();
  const phone = (contact.phone || '').trim();
  const email = (contact.email || '').trim();
  const website = (contact.website || '').trim();
  const senderName = (meta.senderName || DEFAULT_SENDER_NAME).trim();
  const companyName = (meta.companyName || DEFAULT_COMPANY_NAME).trim();
  const unsubscribeUrl = meta.unsubscribeUrl || '#';

  let rendered = template;

  // 1. Smart Greeting fallback:
  // If contact_name is empty, replace "Hello {{contact_name}}," with "Hello {{business_name}}," (or clean name)
  const greetingTarget = contactName || cleanBusiness || businessName;
  if (!contactName) {
    if (greetingTarget) {
      rendered = rendered.replace(/Hello\s*\{\{contact_name\}\}/gi, `Hello ${greetingTarget}`);
      rendered = rendered.replace(/Hi\s*\{\{contact_name\}\}/gi, `Hi ${greetingTarget}`);
      rendered = rendered.replace(/Dear\s*\{\{contact_name\}\}/gi, `Dear ${greetingTarget}`);
    } else {
      rendered = rendered.replace(/Hello\s*\{\{contact_name\}\}/gi, 'Hello');
      rendered = rendered.replace(/Hi\s*\{\{contact_name\}\}/gi, 'Hi');
      rendered = rendered.replace(/Dear\s*\{\{contact_name\}\}/gi, 'Hello');
    }
  }

  // 2. Direct dynamic substitutions (Spreadsheet title headings & variables)
  rendered = rendered.replace(/\{\{clean_business_name\}\}/gi, cleanBusiness || businessName || 'your business');
  rendered = rendered.replace(/\{\{business_name\}\}/gi, businessName || 'your business');
  rendered = rendered.replace(/\{\{contact_name\}\}/gi, contactName || cleanBusiness || businessName || 'there');
  rendered = rendered.replace(/\{\{business_type\}\}/gi, businessType || 'your industry');
  rendered = rendered.replace(/\{\{industry\}\}/gi, businessType || 'your industry');
  // Both {{area}} and {{location}} resolve to contact.location (e.g. "Abuja", "Wuse 2", "Kado")
  rendered = rendered.replace(/\{\{area\}\}/gi, location || 'Abuja');
  rendered = rendered.replace(/\{\{location\}\}/gi, location || 'Abuja');
  rendered = rendered.replace(/\{\{public_email\}\}/gi, email || '');
  rendered = rendered.replace(/\{\{email\}\}/gi, email || '');
  rendered = rendered.replace(/\{\{public_phone\}\}/gi, phone || '');
  rendered = rendered.replace(/\{\{phone_number\}\}/gi, phone || '');
  rendered = rendered.replace(/\{\{phone\}\}/gi, phone || '');
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
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
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

