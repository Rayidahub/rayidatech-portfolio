import { describe, it, expect } from 'vitest';
import {
  sendEmail,
  sendContactNotification,
  sendNewsletterWelcome,
  sanitizeHeaderValue,
} from '@/lib/email';

describe('Transactional Email Service', () => {
  it('gracefully simulates email dispatch when RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY;

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test body</p>',
      text: 'Test body plain text',
    });

    expect(result.success).toBe(true);
    expect(result.simulated).toBe(true);
  });

  it('prevents header injection by stripping newlines and carriage returns', () => {
    const maliciousHeader = 'Subject Line\r\nBcc: hacker@example.com\nTo: victim@example.com';
    const sanitized = sanitizeHeaderValue(maliciousHeader);
    expect(sanitized).not.toContain('\r');
    expect(sanitized).not.toContain('\n');
    expect(sanitized).toBe('Subject Line  Bcc: hacker@example.com To: victim@example.com');
  });

  it('generates contact inquiry notifications for admin and client with plain-text & HTML', async () => {
    const { adminResult, clientResult } = await sendContactNotification({
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Fintech Studio',
      project_type: 'Mobile App',
      subject: 'Mobile App Architecture',
      budget: '$5,000+',
      message: 'Looking to build an AI powered portfolio tracker.',
    });

    expect(adminResult.success).toBe(true);
    expect(clientResult.success).toBe(true);
  });

  it('generates newsletter welcome emails with plain-text fallback', async () => {
    const result = await sendNewsletterWelcome('subscriber@example.com');
    expect(result.success).toBe(true);
  });
});
