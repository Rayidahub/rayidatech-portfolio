// lib/whatsapp/whatsapp-utils.ts
// Utilities for WhatsApp phone number normalization, message personalization, and URL generation

import type { OutreachContact } from '@/types/outreach';
import { cleanBusinessName } from '@/lib/email/outreach-utils';

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'pitch' | 'intro' | 'followup' | 'custom';
  text: string;
}

export const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'abuja_pitch',
    name: 'Abuja Website Concept Pitch (Recommended)',
    category: 'pitch',
    text: `Hello {{clean_business_name}} 👋

I came across your business and saw your impressive work in {{business_type}} in {{area}}!

I’m Raymond Gaius, founder and product engineer at Rayida Tech. We design modern, high-converting websites that help growing businesses in Abuja turn casual visitors into loyal paying clients.

I'd love to share a free quick visual concept showing how a dedicated website could showcase your portfolio and automate customer bookings for {{clean_business_name}}.

Would you be open to seeing a quick concept this week?`,
  },
  {
    id: 'portfolio_intro',
    name: 'Quick Credibility & Portfolio Intro',
    category: 'intro',
    text: `Hi {{clean_business_name}} team!

Loved your offerings in {{business_type}}. Are you currently accepting new client bookings?

I help growing Abuja brands establish a standout online presence with fast, mobile-friendly websites that build instant customer trust.

Feel free to check out some of our recent case studies at https://rayidatech.name.ng

Let me know if this is something on your radar for {{clean_business_name}}!`,
  },
  {
    id: 'redesign_pitch',
    name: 'Website Revamp & Online Bookings',
    category: 'pitch',
    text: `Hello {{clean_business_name}},

I was reviewing prominent brands in {{business_type}} around {{area}}.

In today’s digital market, customer trust is often decided in seconds. At Rayida Tech, we build sleek, fast-loading digital platforms that automate client inquiries and look stunning on mobile phones.

Would you have 5 minutes this week for a brief conversation on how we can elevate {{clean_business_name}}'s digital presence?`,
  },
  {
    id: 'gentle_followup',
    name: 'Gentle Follow-Up Note',
    category: 'followup',
    text: `Hi {{clean_business_name}},

Quick follow-up regarding my earlier message about {{clean_business_name}}'s online presence.

If you ever need a clean, high-performance website or automated client booking system for your {{business_type}} business, feel free to keep my details handy or message me here anytime.

Wishing you continued success!`,
  },
];

/**
 * Normalizes phone numbers to standard WhatsApp format without '+' or spaces.
 * Supports Nigerian numbers (080..., 081..., 090..., 091..., 070..., +234...)
 * as well as international numbers.
 */
export function formatWhatsAppPhoneNumber(rawPhone?: string | null): string {
  if (!rawPhone || typeof rawPhone !== 'string') return '';

  // Remove all non-digit characters
  let digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';

  // Nigerian standard local number handling: e.g. 08103905299 -> 2348103905299
  if (digits.startsWith('0') && digits.length === 11) {
    digits = `234${digits.slice(1)}`;
  } else if (digits.length === 10 && !digits.startsWith('234')) {
    // Missing leading zero e.g. 8103905299
    digits = `234${digits}`;
  } else if (digits.startsWith('2340') && digits.length === 14) {
    // Redundant zero after country code: 2340810... -> 234810...
    digits = `234${digits.slice(4)}`;
  }

  return digits;
}

/**
 * Validates whether a phone number can receive WhatsApp messages.
 */
export function isValidWhatsAppNumber(rawPhone?: string | null): boolean {
  const formatted = formatWhatsAppPhoneNumber(rawPhone);
  // International phone numbers typically range from 7 to 15 digits
  return formatted.length >= 8 && formatted.length <= 15;
}

/**
 * Personalizes a WhatsApp message with prospect or team member variables.
 */
export function personalizeWhatsAppMessage(
  template: string,
  contact: Partial<OutreachContact>,
  meta: {
    senderName?: string;
    companyName?: string;
  } = {}
): string {
  if (!template) return '';

  const rawBusiness = (contact.business_name || '').trim();
  const cleanBusiness = cleanBusinessName(rawBusiness);
  const contactName = (contact.contact_name || '').trim();
  const businessType = (contact.business_type || '').trim();
  const area = (contact.location || '').trim();
  const senderName = (meta.senderName || 'Raymond Gaius').trim();
  const companyName = (meta.companyName || 'Rayida Tech').trim();

  let rendered = template;

  // Substitute variables
  rendered = rendered.replace(/\{\{clean_business_name\}\}/gi, cleanBusiness || rawBusiness || 'your business');
  rendered = rendered.replace(/\{\{business_name\}\}/gi, rawBusiness || 'your business');
  rendered = rendered.replace(/\{\{contact_name\}\}/gi, contactName || cleanBusiness || rawBusiness || 'there');
  rendered = rendered.replace(/\{\{business_type\}\}/gi, businessType || 'your industry');
  rendered = rendered.replace(/\{\{area\}\}/gi, area || 'Abuja');
  rendered = rendered.replace(/\{\{location\}\}/gi, area || 'Abuja');
  rendered = rendered.replace(/\{\{sender_name\}\}/gi, senderName);
  rendered = rendered.replace(/\{\{company_name\}\}/gi, companyName);

  // Clean any leftover curly tags
  rendered = rendered.replace(/\{\{[a-zA-Z0-9_-]+\}\}/g, '');

  return rendered.trim();
}

/**
 * Generates an official WhatsApp Click-to-Chat deep link.
 */
export function generateWhatsAppChatUrl(phone: string, message: string): string {
  const cleanPhone = formatWhatsAppPhoneNumber(phone);
  if (!cleanPhone) return '';
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

