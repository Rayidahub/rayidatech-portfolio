import { describe, it, expect, vi } from 'vitest';
import { sendEmail, sendContactNotification, sendNewsletterWelcome } from '@/lib/email';

describe('Transactional Email Service', () => {
  it('gracefully simulates email dispatch when RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY;

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test body</p>',
    });

    expect(result.success).toBe(true);
    expect(result.simulated).toBe(true);
  });

  it('generates contact inquiry notifications for admin and client', async () => {
    const { adminResult, clientResult } = await sendContactNotification({
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Fintech Studio',
      project_type: 'Mobile App',
      budget: '$5,000+',
      message: 'Looking to build an AI powered portfolio tracker.',
    });

    expect(adminResult.success).toBe(true);
    expect(clientResult.success).toBe(true);
  });

  it('generates newsletter welcome emails', async () => {
    const result = await sendNewsletterWelcome('subscriber@example.com');
    expect(result.success).toBe(true);
  });
});

