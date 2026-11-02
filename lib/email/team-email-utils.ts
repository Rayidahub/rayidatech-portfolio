// lib/email/team-email-utils.ts
// Client and server safe email template utilities for Team direct messaging

export interface TeamEmailPersonalizationInput {
  name: string;
  role?: string;
  email: string;
}

/**
 * Replaces dynamic variables in subject and body for a team member:
 * {{name}}, {{role}}, {{email}}, {{sender_name}}, {{company_name}}
 */
export function personalizeTeamMessage(
  template: string,
  member: TeamEmailPersonalizationInput,
  meta: {
    senderName?: string;
    companyName?: string;
  } = {}
): string {
  if (!template) return '';

  const senderName = meta.senderName || 'Raymond Gaius';
  const companyName = meta.companyName || 'Rayida Tech';

  let rendered = template;
  rendered = rendered.replace(/\{\{name\}\}/gi, member.name || 'Team Member');
  rendered = rendered.replace(/\{\{role\}\}/gi, member.role || 'Team Member');
  rendered = rendered.replace(/\{\{email\}\}/gi, member.email || '');
  rendered = rendered.replace(/\{\{sender_name\}\}/gi, senderName);
  rendered = rendered.replace(/\{\{company_name\}\}/gi, companyName);

  // Clean any leftover unresolved curly brace tags
  rendered = rendered.replace(/\{\{[a-zA-Z0-9_-]+\}\}/g, '');

  return rendered.trim();
}

/**
 * Builds standard compliant HTML email layout for direct team communications.
 */
export function buildTeamHtmlEmail({
  body,
  recipientName,
  recipientRole,
  senderName = 'Raymond Gaius',
  companyName = 'Rayida Tech',
}: {
  body: string;
  recipientName: string;
  recipientRole?: string;
  senderName?: string;
  companyName?: string;
}): string {
  // Convert newlines to cleanly spaced HTML paragraphs
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #2d3748;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message from ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 24px 32px; border-bottom: 2px solid #8000ff;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                      ${companyName}
                    </div>
                    <div style="font-size: 11px; color: #00d1ff; font-family: monospace; text-transform: uppercase; margin-top: 2px;">
                      Internal Team Communication
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; color: #b8b8c8; font-family: monospace;">
                      ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px;">
              <div style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #edf2f7; font-size: 12px; color: #718096;">
                Delivered to <strong style="color: #1a202c;">${recipientName}</strong> ${recipientRole ? `&bull; <span>${recipientRole}</span>` : ''}
              </div>
              <div style="color: #2d3748;">
                ${paragraphs}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #718096; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">
                Sent by <strong>${senderName}</strong> via ${companyName} Admin Console
              </p>
              <p style="margin: 0; font-size: 11px; color: #a0aec0;">
                Abuja, Nigeria &bull; <a href="https://rayidatech.name.ng" style="color: #8000ff; text-decoration: none;">rayidatech.name.ng</a>
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

