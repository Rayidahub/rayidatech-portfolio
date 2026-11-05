import { describe, it, expect } from 'vitest';
import {
  formatWhatsAppPhoneNumber,
  isValidWhatsAppNumber,
  personalizeWhatsAppMessage,
  generateWhatsAppChatUrl,
} from '@/lib/whatsapp/whatsapp-utils';

describe('WhatsApp Number Formatter', () => {
  it('correctly normalizes 11-digit local Nigerian numbers with 234 prefix', () => {
    expect(formatWhatsAppPhoneNumber('08103905299')).toBe('2348103905299');
    expect(formatWhatsAppPhoneNumber('09114392318')).toBe('2349114392318');
    expect(formatWhatsAppPhoneNumber('07034905299')).toBe('2347034905299');
    expect(formatWhatsAppPhoneNumber('08060187135')).toBe('2348060187135');
  });

  it('handles spaces, dashes, parentheses and plus signs in numbers', () => {
    expect(formatWhatsAppPhoneNumber('+234 813 778 4516')).toBe('2348137784516');
    expect(formatWhatsAppPhoneNumber('+234(813)778-4516')).toBe('2348137784516');
    expect(formatWhatsAppPhoneNumber('234 810 390 5299')).toBe('2348103905299');
  });

  it('cleans redundant zeros after 234 country code', () => {
    expect(formatWhatsAppPhoneNumber('23408103905299')).toBe('2348103905299');
  });

  it('validates legitimate WhatsApp numbers', () => {
    expect(isValidWhatsAppNumber('08103905299')).toBe(true);
    expect(isValidWhatsAppNumber('+234 813 778 4516')).toBe(true);
    expect(isValidWhatsAppNumber('123')).toBe(false);
    expect(isValidWhatsAppNumber('')).toBe(false);
    expect(isValidWhatsAppNumber(null)).toBe(false);
  });
});

describe('WhatsApp Message Personalization & URL Generator', () => {
  it('personalizes message using spreadsheet contact details and clean business name', () => {
    const template = 'Hello {{clean_business_name}}! I saw your work in {{business_type}} in {{area}}. From {{sender_name}} at {{company_name}}.';
    const contact = {
      business_name: '1420 Events (Event Planner & Decor)',
      business_type: 'Event planning/decor',
      location: 'Galadimawa-Lokogoma',
    };

    const result = personalizeWhatsAppMessage(template, contact, {
      senderName: 'Raymond Gaius',
      companyName: 'Rayida Tech',
    });

    expect(result).toBe(
      'Hello 1420 Events! I saw your work in Event planning/decor in Galadimawa-Lokogoma. From Raymond Gaius at Rayida Tech.'
    );
  });

  it('generates a valid wa.me URL with encoded message', () => {
    const url = generateWhatsAppChatUrl('08103905299', 'Hello 1420 Events!');
    expect(url).toBe('https://wa.me/2348103905299?text=Hello%201420%20Events!');
  });
});
