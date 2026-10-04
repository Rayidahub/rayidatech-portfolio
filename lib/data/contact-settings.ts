import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import type { ContactSettings } from '@/types/contact-settings';

export const defaultContactSettings: ContactSettings = {
  id: 'default',
  badge_text: 'Get In Touch',
  headline_prefix: "Let's build something",
  headline_accent: 'exceptional',
  headline_suffix: 'together',
  subheadline:
    'Have an upcoming product, redesign, or engineering challenge? Tell me about your goals and timeline below, or connect directly through WhatsApp.',
  whatsapp_number: '+234 701 447 8376',
  whatsapp_url: 'https://wa.link/tlezg8',
  email: 'rayidagaius@gmail.com',
  website_url: 'https://rayidatech.name.ng',
  working_hours: 'Mon — Sat, 9:00 AM — 6:00 PM (WAT / UTC+1)',
  location: 'Lagos, Nigeria • Operating Worldwide',
  principles: [
    {
      title: 'Fast, transparent updates',
      description: 'Weekly video summaries and collaborative Figma files.',
    },
    {
      title: 'Full code & design ownership',
      description: 'Complete source code and vector assets handed over upon completion.',
    },
    {
      title: 'Post-launch support',
      description: '30 days of warranty and bug fixing included in all full contracts.',
    },
  ],
  process_steps: [
    {
      step: '01',
      title: 'Discovery & Brief',
      description: 'We review your goals, scope, and target audience within 24 hours of receiving your inquiry.',
    },
    {
      step: '02',
      title: 'Strategy & Alignment',
      description: 'A focused 20-minute call to align on technical feasibility, design direction, and deliverable milestones.',
    },
    {
      step: '03',
      title: 'Execution & Launch',
      description: 'Structured sprints with transparent Figma files, staging previews, and guaranteed on-time delivery.',
    },
  ],
  faqs: [
    {
      question: 'How quickly will you reply to my message?',
      answer: 'I reply to all inquiries within 24 business hours. If you need immediate assistance or have an urgent timeline, contacting me directly via WhatsApp is recommended.',
    },
    {
      question: 'What information should I have ready before reaching out?',
      answer: 'A high-level description of what you are building, your target timeline, and an estimated budget range are great starting points. If you already have wireframes, design references, or PRDs, feel free to mention them.',
    },
    {
      question: 'How are project payments structured?',
      answer: 'Typical engagements are milestone-based: 50% upfront to reserve the sprint, and 50% upon final delivery and client approval. For larger full-stack developments, we can establish three milestone installments.',
    },
    {
      question: 'Do you work with international clients across different timezones?',
      answer: 'Yes, absolutely. I work with clients across the Americas, Europe, Africa, and Asia. Communication is maintained through scheduled async updates, Slack/WhatsApp channels, and convenient video check-ins.',
    },
  ],
  social_links: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rayida-tech', handle: '@rayida-tech' },
    { name: 'GitHub', url: 'https://github.com/Rayidahub', handle: '@Rayidahub' },
    { name: 'X / Twitter', url: 'https://x.com/rayidatech', handle: '@rayidatech' },
    { name: 'Instagram', url: 'https://instagram.com/rayidatech', handle: '@rayidatech' },
    { name: 'YouTube', url: 'https://youtube.com/@rayidatech', handle: '@rayidatech' },
    { name: 'TikTok', url: 'https://tiktok.com/@rayidatech', handle: '@rayidatech' },
  ],
};

const LOCAL_SETTINGS_FILE = path.join(process.cwd(), 'lib/data/contact-settings.json');

function readLocalSettings(): ContactSettings | null {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_FILE)) {
      const raw = fs.readFileSync(LOCAL_SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed reading local contact settings:', err);
  }
  return null;
}

function writeLocalSettings(data: ContactSettings): void {
  try {
    const dir = path.dirname(LOCAL_SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local contact settings:', err);
  }
}

export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contact_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data) {
      return {
        ...defaultContactSettings,
        ...data,
      };
    }
  } catch {
    // Supabase query failed or table does not exist
  }

  const local = readLocalSettings();
  if (local) {
    return {
      ...defaultContactSettings,
      ...local,
    };
  }

  // Write default to local file so it exists
  writeLocalSettings(defaultContactSettings);
  return defaultContactSettings;
}

export async function saveContactSettings(
  settings: ContactSettings
): Promise<{ success: boolean; error?: string }> {
  const updatedSettings = {
    ...settings,
    id: 'default',
    updated_at: new Date().toISOString(),
  };

  // 1. Always write locally for zero-latency guarantee
  writeLocalSettings(updatedSettings);

  // 2. Attempt Supabase write if table exists
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('contact_settings')
      .upsert(updatedSettings);

    if (error) {
      console.warn('Note: Supabase table contact_settings error (local file updated):', error.message);
    }
  } catch (e: any) {
    console.warn('Note: Supabase contact_settings write skipped:', e?.message);
  }

  return { success: true };
}
