// lib/email/index.ts
// Transactional Email Service for Rayida Tech Portfolio
// Supports Resend via native REST API (zero extra runtime bloat)

export interface ContactNotificationPayload {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  project_type?: string | null;
  budget?: string | null;
  message: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

const DEFAULT_ADMIN_EMAIL = 'rayidagaius@gmail.com';
const BRAND_VIOLET = '#8000ff';
const BRAND_CYAN = '#00d1ff';
const BRAND_BG = '#1a1a2e';
const BRAND_CARD = '#22223b';
const BRAND_TEXT = '#f2f2f2';
const BRAND_MUTED = '#b8b8c8';

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY || '';
  const from = process.env.EMAIL_FROM || 'Rayida Tech <onboarding@resend.dev>';
  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  return { apiKey, from, adminEmail };
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<EmailResult> {
  const { apiKey, from } = getEmailConfig();

  if (!apiKey) {
    console.info(
      `[EmailService:Simulated] No RESEND_API_KEY set. Simulated email to: ${Array.isArray(to) ? to.join(', ') : to} | Subject: "${subject}"`
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
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
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
 * Dispatches an internal admin lead alert and an auto-acknowledgment reply to the user.
 */
export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<{ adminResult: EmailResult; clientResult: EmailResult }> {
  const { adminEmail } = getEmailConfig();

  // 1. Admin Alert Email HTML
  const adminHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${BRAND_BG}; color: ${BRAND_TEXT}; padding: 24px; margin: 0; }
        .card { background-color: ${BRAND_CARD}; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; }
        .badge { display: inline-block; background-color: ${BRAND_VIOLET}; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        h1 { margin-top: 16px; font-size: 24px; color: #ffffff; }
        .row { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 0; }
        .label { font-size: 12px; color: ${BRAND_MUTED}; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { font-size: 15px; font-weight: 600; color: #ffffff; margin-top: 4px; }
        .message-box { background-color: rgba(0,0,0,0.25); border-left: 3px solid ${BRAND_CYAN}; padding: 16px; border-radius: 8px; margin-top: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #eaeaea; }
        .footer { font-size: 12px; color: ${BRAND_MUTED}; text-align: center; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">New Contact Inquiry</span>
        <h1>Project Inquiry from ${payload.name}</h1>
        <div class="row">
          <div class="label">Sender Name</div>
          <div class="value">${escapeHtml(payload.name)}</div>
        </div>
        <div class="row">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${escapeHtml(payload.email)}" style="color: ${BRAND_CYAN}; text-decoration: none;">${escapeHtml(payload.email)}</a></div>
        </div>
        ${payload.phone ? `<div class="row"><div class="label">Phone / WhatsApp</div><div class="value">${escapeHtml(payload.phone)}</div></div>` : ''}
        ${payload.company ? `<div class="row"><div class="label">Company / Brand</div><div class="value">${escapeHtml(payload.company)}</div></div>` : ''}
        ${payload.project_type ? `<div class="row"><div class="label">Project Type</div><div class="value">${escapeHtml(payload.project_type)}</div></div>` : ''}
        ${payload.budget ? `<div class="row"><div class="label">Estimated Budget</div><div class="value" style="color: ${BRAND_CYAN};">${escapeHtml(payload.budget)}</div></div>` : ''}
        <div class="row" style="border-bottom: none;">
          <div class="label">Message</div>
          <div class="message-box">${escapeHtml(payload.message)}</div>
        </div>
      </div>
      <div class="footer">
        Dispatched automatically from <a href="https://rayidatech.name.ng" style="color: ${BRAND_MUTED};">Rayida Tech Portfolio</a>.
      </div>
    </body>
  </html>
  `;

  // 2. Client Confirmation Email HTML
  const clientHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${BRAND_BG}; color: ${BRAND_TEXT}; padding: 24px; margin: 0; }
        .card { background-color: ${BRAND_CARD}; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; }
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
          I have received your inquiry regarding <span class="highlight">${escapeHtml(payload.project_type || 'your project')}</span>.
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

  // Run in parallel
  const [adminResult, clientResult] = await Promise.all([
    sendEmail({
      to: adminEmail,
      subject: `[Lead Alert] ${payload.name} — ${payload.project_type || 'New Project'}`,
      html: adminHtml,
      replyTo: payload.email,
    }),
    sendEmail({
      to: payload.email,
      subject: 'Inquiry Received — Rayida Tech',
      html: clientHtml,
    }),
  ]);

  return { adminResult, clientResult };
}

/**
 * Dispatches a welcome email for newsletter subscribers.
 */
export async function sendNewsletterWelcome(email: string): Promise<EmailResult> {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
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

  return sendEmail({
    to: email,
    subject: 'Welcome to the Rayida Tech Newsletter',
    html,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

