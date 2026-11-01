import { describe, it, expect } from 'vitest';
import {
  personalizeTemplate,
  isValidEmailAddress,
  buildHtmlEmail,
} from '@/lib/email/outreach-utils';
import {
  generateUnsubscribeToken,
  verifyUnsubscribeToken,
} from '@/lib/email/outreach-service';

describe('Outreach Personalization Engine', () => {
  it('correctly substitutes dynamic variables for a full prospect profile', () => {
    const template = 'Hello {{contact_name}}, I noticed that {{business_name}} specializes in {{business_type}} in {{location}}. Check {{website}}. Regards, {{sender_name}} from {{company_name}}.';
    const contact = {
      business_name: 'Pebbles Rentals & Events',
      contact_name: 'Amina Bello',
      business_type: 'Luxury Event Rentals',
      location: 'Wuse 2, Abuja',
      website: 'https://pebblesevents.com',
    };

    const rendered = personalizeTemplate(template, contact, {
      senderName: 'Raymond Gaius',
      companyName: 'Rayida Tech',
    });

    expect(rendered).toContain('Hello Amina Bello,');
    expect(rendered).toContain('Pebbles Rentals & Events specializes in Luxury Event Rentals');
    expect(rendered).toContain('in Wuse 2, Abuja.');
    expect(rendered).toContain('Check https://pebblesevents.com.');
    expect(rendered).toContain('Raymond Gaius from Rayida Tech.');
    expect(rendered).not.toContain('{{');
    expect(rendered).not.toContain('}}');
  });

  it('falls back to business name when contact person is missing', () => {
    const template = 'Hello {{contact_name}},\n\nI was reviewing {{business_name}} and love your work.';
    const contact = {
      business_name: 'Maitama Prime Residences',
      contact_name: '', // Empty
    };

    const rendered = personalizeTemplate(template, contact);
    expect(rendered).toContain('Hello Maitama Prime Residences,');
    expect(rendered).not.toContain('{{contact_name}}');
  });

  it('guarantees zero unresolved {{variable}} tokens in rendered output', () => {
    const template = 'Hello {{contact_name}}, regarding {{unknown_custom_tag}} and {{another_missing_token}}.';
    const contact = {
      business_name: 'Abuja Artisan Coffee',
    };

    const rendered = personalizeTemplate(template, contact);
    expect(rendered).not.toMatch(/\{\{[^}]+\}\}/);
  });
});

describe('Email Address Validation', () => {
  it('identifies valid RFC emails', () => {
    expect(isValidEmailAddress('rayidagaius@gmail.com')).toBe(true);
    expect(isValidEmailAddress('info@rayidatech.name.ng')).toBe(true);
    expect(isValidEmailAddress('contact.us+sales@pebbles.co.uk')).toBe(true);
  });

  it('rejects invalid or missing emails', () => {
    expect(isValidEmailAddress('')).toBe(false);
    expect(isValidEmailAddress(null as any)).toBe(false);
    expect(isValidEmailAddress('not-an-email')).toBe(false);
    expect(isValidEmailAddress('user@')).toBe(false);
    expect(isValidEmailAddress('@domain.com')).toBe(false);
    expect(isValidEmailAddress('spaces in@email.com')).toBe(false);
  });
});

describe('Unsubscribe Security Token System', () => {
  it('generates consistent HMAC tokens and verifies valid matches', () => {
    const email = 'prospect@business.ng';
    const token = generateUnsubscribeToken(email);

    expect(token).toBeDefined();
    expect(token.length).toBe(64); // SHA-256 hex string
    expect(verifyUnsubscribeToken(email, token)).toBe(true);
  });

  it('rejects tampered or mismatched unsubscribe tokens', () => {
    const email1 = 'prospect1@business.ng';
    const email2 = 'prospect2@business.ng';
    const token1 = generateUnsubscribeToken(email1);

    expect(verifyUnsubscribeToken(email2, token1)).toBe(false);
    expect(verifyUnsubscribeToken(email1, 'tampered-token-value-12345')).toBe(false);
  });
});

describe('HTML Outreach Email Builder', () => {
  it('builds compliant email with paragraphs and unsubscribe footer', () => {
    const html = buildHtmlEmail({
      body: 'First paragraph.\n\nSecond paragraph.',
      businessName: 'Pebbles Rentals',
      senderName: 'Raymond Gaius',
      companyName: 'Rayida Tech',
      unsubscribeUrl: 'https://rayidatech.name.ng/unsubscribe?email=test&token=abc',
    });

    expect(html).toContain('First paragraph.');
    expect(html).toContain('Second paragraph.');
    expect(html).toContain('Pebbles Rentals');
    expect(html).toContain('https://rayidatech.name.ng/unsubscribe?email=test&token=abc');
    expect(html).toContain('Abuja, Federal Capital Territory, Nigeria');
  });
});

