// lib/email/index.ts
// Transactional Email Service for Rayida Tech Portfolio
// Supports Resend via native REST API (zero extra runtime bloat)

export interface ContactNotificationPayload {
  name: string;
  email: string;
  subject?: string | null;
  project_type?: string | null;
  phone?: string | null;
  company?: string | null;
  budget?: string | null;
  message: string;
  submitted_at?: string | null;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

const DEFAULT_ADMIN_EMAIL = 'info@rayidatech.name.ng';
const DEFAULT_EMAIL_FROM = 'Rayida Tech <info@rayidatech.name.ng>';
const BRAND_VIOLET = '#8000ff';
const BRAND_CYAN = '#00d1ff';
const BRAND_BG = '#1a1a2e';
const BRAND_CARD = '#22223b';
const BRAND_TEXT = '#f2f2f2';
const BRAND_MUTED = '#b8b8c8';

/**
 * Strips carriage returns and newlines to prevent email header injection attacks.
 */
export function sanitizeHeaderValue(val: string): string {
  if (!val || typeof val !== 'string') return '';
  return val.replace(/[\r\n\t]/g, ' ').trim();
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY || '';
  const from = process.env.EMAIL_FROM || DEFAULT_EMAIL_FROM;
  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  return { apiKey, from, adminEmail };
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<EmailResult> {
  const { apiKey, from } = getEmailConfig();
  const cleanFrom = sanitizeHeaderValue(from);
  const cleanSubject = sanitizeHeaderValue(subject);
  const cleanTo = Array.isArray(to) ? to.map(sanitizeHeaderValue) : [sanitizeHeaderValue(to)];
  const cleanReplyTo = replyTo ? sanitizeHeaderValue(replyTo) : undefined;

  if (!apiKey) {
    console.info(
      `[EmailService:Simulated] No RESEND_API_KEY set. Simulated email to: ${cleanTo.join(', ')} | Subject: "${cleanSubject}"`
    );
    return { success: true, simulated: true };
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
        to: cleanTo,
        subject: cleanSubject,
        html,
        ...(text ? { text } : {}),
        ...(cleanReplyTo ? { reply_to: cleanReplyTo } : {}),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[EmailService:Error] Resend API responded with ${res.status}: ${errorText}`);
      return { success: false, error: `Resend API Error (${res.status}): ${errorText}` };
    }

    const data = (await res.json()) as { id?: string };
    return { success: true, messageId: data.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EmailService:Exception]', msg);
    return { success: false, error: msg };
  }
}

/**
 * Dispatches an internal admin lead alert to info@rayidatech.name.ng
 * and an auto-acknowledgment reply to the visitor.
 */
export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<{ adminResult: EmailResult; clientResult: EmailResult }> {
  const { adminEmail, from } = getEmailConfig();
  const inquirySubject = payload.subject || payload.project_type || 'General Inquiry';
  const submissionTimestamp =
    payload.submitted_at ||
    new Date().toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

  // 1. Admin Alert Email HTML (Rayida Tech Branded Design System)
  const adminHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${BRAND_BG}; color: ${BRAND_TEXT}; padding: 24px; margin: 0; }
        .card { background-color: ${BRAND_CARD}; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .badge { display: inline-block; background-color: ${BRAND_VIOLET}; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .logo-text { font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 20px; }
        .logo-sub { color: ${BRAND_CYAN}; }
        h1 { margin-top: 12px; font-size: 22px; color: #ffffff; line-height: 1.3; }
        .row { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 0; }
        .label { font-size: 11px; color: ${BRAND_MUTED}; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { font-size: 15px; font-weight: 600; color: #ffffff; margin-top: 4px; }
        .message-box { background-color: rgba(0,0,0,0.3); border-left: 3px solid ${BRAND_CYAN}; padding: 16px; border-radius: 8px; margin-top: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #eaeaea; }
        .footer { font-size: 12px; color: ${BRAND_MUTED}; text-align: center; margin-top: 24px; }
        .reply-banner { background-color: rgba(0, 209, 255, 0.1); border: 1px solid rgba(0, 209, 255, 0.25); border-radius: 8px; padding: 12px 16px; margin-top: 20px; font-size: 13px; color: ${BRAND_CYAN}; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo-text">Rayida<span class="logo-sub">Tech</span></div>
        <span class="badge">New Contact Inquiry</span>
        <h1>Inquiry from ${escapeHtml(payload.name)}</h1>
        <div class="row">
          <div class="label">Sender Name</div>
          <div class="value">${escapeHtml(payload.name)}</div>
        </div>
        <div class="row">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${escapeHtml(payload.email)}" style="color: ${BRAND_CYAN}; text-decoration: none;">${escapeHtml(payload.email)}</a></div>
        </div>
        <div class="row">
          <div class="label">Subject / Project Type</div>
          <div class="value">${escapeHtml(inquirySubject)}</div>
        </div>
        ${payload.phone ? `<div class="row"><div class="label">Phone / WhatsApp</div><div class="value">${escapeHtml(payload.phone)}</div></div>` : ''}
        ${payload.company ? `<div class="row"><div class="label">Company / Brand</div><div class="value">${escapeHtml(payload.company)}</div></div>` : ''}
        ${payload.budget ? `<div class="row"><div class="label">Estimated Budget</div><div class="value" style="color: ${BRAND_CYAN};">${escapeHtml(payload.budget)}</div></div>` : ''}
        <div class="row">
          <div class="label">Submission Date & Time</div>
          <div class="value" style="font-size: 13px; color: ${BRAND_MUTED};">${escapeHtml(submissionTimestamp)}</div>
        </div>
        <div class="row" style="border-bottom: none;">
          <div class="label">Message</div>
          <div class="message-box">${escapeHtml(payload.message)}</div>
        </div>
        <div class="reply-banner">
          💡 <strong>Tip:</strong> Hitting <em>Reply</em> in Zoho Mail responds directly to ${escapeHtml(payload.email)}.
        </div>
      </div>
      <div class="footer">
        Dispatched automatically from <a href="https://rayidatech.name.ng" style="color: ${BRAND_CYAN}; text-decoration: none;">Rayida Tech Portfolio</a> to ${escapeHtml(adminEmail)}.
      </div>
    </body>
  </html>
  `;

  // 1b. Admin Alert Plain-Text Fallback
  const adminText = [
    `RAYIDA TECH — NEW INQUIRY ALERT`,
    `============================================================`,
    ``,
    `You have received a new contact inquiry from rayidatech.name.ng:`,
    ``,
    `VISITOR DETAILS:`,
    `------------------------------------------------------------`,
    `• Name:             ${payload.name}`,
    `• Email:            ${payload.email}`,
    `• Subject / Scope:  ${inquirySubject}`,
    payload.phone ? `• Phone / WhatsApp: ${payload.phone}` : null,
    payload.company ? `• Company / Brand:  ${payload.company}` : null,
    payload.budget ? `• Estimated Budget: ${payload.budget}` : null,
    `• Submitted At:     ${submissionTimestamp}`,
    ``,
    `MESSAGE:`,
    `------------------------------------------------------------`,
    payload.message,
    ``,
    `============================================================`,
    `Reply-To is configured to ${payload.email}. Hit Reply to respond directly.`,
  ]
    .filter(Boolean)
    .join('\n');

  // 2. Client Confirmation Email HTML
  const clientHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${BRAND_BG}; color: ${BRAND_TEXT}; padding: 24px; margin: 0; }
        .card { background-color: ${BRAND_CARD}; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo-text { font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
        .logo-sub { color: ${BRAND_CYAN}; }
        h1 { margin-top: 24px; font-size: 22px; color: #ffffff; font-weight: 700; line-height: 1.3; }
        p { font-size: 15px; line-height: 1.6; color: ${BRAND_MUTED}; }
        .highlight { color: #ffffff; font-weight: 600; }
        .btn { display: inline-block; background-color: ${BRAND_VIOLET}; color: #ffffff !important; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
        .summary-box { background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px; margin: 24px 0; }
        .footer { font-size: 12px; color: ${BRAND_MUTED}; text-align: center; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo-text">Rayida<span class="logo-sub">Tech</span></div>
        <h1>Thank you for reaching out, ${escapeHtml(payload.name.split(' ')[0] || payload.name)}!</h1>
        <p>
          I have received your inquiry regarding <span class="highlight">${escapeHtml(inquirySubject)}</span>.
        </p>
        <p>
          I typically review project scopes and reply within <span class="highlight">24 hours</span> with technical feasibility and recommended next steps.
        </p>
        <div class="summary-box">
          <div style="font-size: 12px; color: ${BRAND_MUTED}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Your Message Summary:</div>
          <div style="font-size: 14px; color: #e0e0e0; font-style: italic; white-space: pre-wrap;">"${escapeHtml(payload.message.slice(0, 300))}${payload.message.length > 300 ? '...' : ''}"</div>
        </div>
        <p>
          Need an immediate response? You can also connect directly on WhatsApp:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://wa.link/tlezg8" class="btn">Message on WhatsApp</a>
        </div>
        <p style="margin-top: 24px; font-size: 14px;">
          Best regards,<br />
          <strong style="color: #ffffff;">Raymond Gaius</strong><br />
          Product Designer & AI Engineer — Rayida Tech
        </p>
      </div>
      <div class="footer">
        Rayida Tech • Building digital experiences people can trust • <a href="https://rayidatech.name.ng" style="color: ${BRAND_CYAN}; text-decoration: none;">rayidatech.name.ng</a>
      </div>
    </body>
  </html>
  `;

  // 2b. Client Confirmation Plain-Text Fallback
  const clientText = [
    `RAYIDA TECH`,
    `============================================================`,
    ``,
    `Hi ${payload.name.split(' ')[0] || payload.name},`,
    ``,
    `Thank you for reaching out regarding ${inquirySubject}!`,
    ``,
    `I have received your inquiry and typically review scopes within 24 business hours to provide technical feasibility and next steps.`,
    ``,
    `YOUR MESSAGE SUMMARY:`,
    `------------------------------------------------------------`,
    payload.message,
    ``,
    `NEED AN IMMEDIATE RESPONSE?`,
    `You can also connect with me directly on WhatsApp: https://wa.link/tlezg8`,
    ``,
    `Best regards,`,
    `Raymond Gaius`,
    `Product Designer & AI Engineer — Rayida Tech`,
    `Website: https://rayidatech.name.ng`,
    `Email: ${adminEmail}`,
  ].join('\n');

  // Dispatch both emails in parallel via verified Resend sender
  const [adminResult, clientResult] = await Promise.all([
    sendEmail({
      to: adminEmail,
      subject: `[Lead Alert] ${payload.name} — ${inquirySubject}`,
      html: adminHtml,
      text: adminText,
      replyTo: payload.email,
    }),
    sendEmail({
      to: payload.email,
      subject: 'Inquiry Received — Rayida Tech',
      html: clientHtml,
      text: clientText,
      replyTo: adminEmail,
    }),
  ]);

  return { adminResult, clientResult };
}

/**
 * Dispatches a welcome email for newsletter subscribers.
 */
export async function sendNewsletterWelcome(email: string): Promise<EmailResult> {
  const cleanEmail = sanitizeHeaderValue(email);

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${BRAND_BG}; color: ${BRAND_TEXT}; padding: 24px; margin: 0; }
        .card { background-color: ${BRAND_CARD}; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; }
        .logo-text { font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
        .logo-sub { color: ${BRAND_CYAN}; }
        h1 { margin-top: 24px; font-size: 22px; color: #ffffff; font-weight: 700; }
        p { font-size: 15px; line-height: 1.6; color: ${BRAND_MUTED}; }
        .btn { display: inline-block; background-color: ${BRAND_VIOLET}; color: #ffffff !important; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0; }
        .footer { font-size: 12px; color: ${BRAND_MUTED}; text-align: center; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo-text">Rayida<span class="logo-sub">Tech</span></div>
        <h1>Welcome to the Rayida Tech Circle</h1>
        <p>
          You're on the list! You&apos;ll receive occasional, high-value insights on:
        </p>
        <ul style="color: ${BRAND_TEXT}; font-size: 14px; line-height: 1.8;">
          <li>Modern product design systems & UX architectures</li>
          <li>AI Engineering, LLM integrations & intelligent agents</li>
          <li>Behind-the-scenes case studies of scalable web applications</li>
        </ul>
        <p>
          Zero spam, pure signal. In the meantime, feel free to explore recent articles and case studies:
        </p>
        <div style="text-align: center;">
          <a href="https://rayidatech.name.ng/blog" class="btn">Read Latest Articles</a>
        </div>
        <p style="margin-top: 20px; font-size: 14px;">
          Warmly,<br />
          <strong style="color: #ffffff;">Raymond Gaius</strong><br />
          Rayida Tech
        </p>
      </div>
      <div class="footer">
        Rayida Tech • <a href="https://rayidatech.name.ng" style="color: ${BRAND_CYAN}; text-decoration: none;">rayidatech.name.ng</a>
      </div>
    </body>
  </html>
  `;

  const text = [
    `RAYIDA TECH — NEWSLETTER WELCOME`,
    `============================================================`,
    ``,
    `Welcome to the Rayida Tech Circle!`,
    ``,
    `You are on the list to receive high-value insights on:`,
    `• Modern product design systems & UX architectures`,
    `• AI Engineering, LLM integrations & intelligent agents`,
    `• Case studies of scalable web applications`,
    ``,
    `Explore recent articles: https://rayidatech.name.ng/blog`,
    ``,
    `Warmly,`,
    `Raymond Gaius — Rayida Tech`,
  ].join('\n');

  return sendEmail({
    to: cleanEmail,
    subject: 'Welcome to the Rayida Tech Newsletter',
    html,
    text,
  });
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
