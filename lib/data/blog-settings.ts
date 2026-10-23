import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import type { BlogSettings } from '@/types/blog-settings';

export const defaultBlogSettings: BlogSettings = {
  id: 'default',
  badge_text: 'Insights & Perspectives',
  headline_prefix: 'Thoughts on Design, Tech &',
  headline_accent: 'Growth',
  headline_suffix: '',
  subheadline:
    'Practical perspectives on product design, AI engineering, building scalable systems, and design-led company building by Raymond Gaius.',
  author_name: 'Raymond Gaius',
  author_role: 'Product Designer & AI Engineer',
  author_bio:
    'Product Designer & AI Engineer at Rayida Tech. Building digital experiences people can trust across fintech, AI interfaces, and scalable SaaS ecosystems.',
  author_twitter: 'https://twitter.com/rayidatech',
  author_github: 'https://github.com/Rayidahub',
  author_linkedin: 'https://linkedin.com/in/rayida-tech',
  newsletter_headline: 'Stay in the loop',
  newsletter_subheadline:
    'Get insights on design, AI engineering, product thinking, and behind-the-scenes updates — no spam, just value.',
};

const LOCAL_SETTINGS_FILE = path.join(/*turbopackIgnore: true*/ process.cwd(), 'lib/data/blog-settings.json');

function readLocalSettings(): BlogSettings | null {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_FILE)) {
      const raw = fs.readFileSync(LOCAL_SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed reading local blog settings:', err);
  }
  return null;
}

function writeLocalSettings(data: BlogSettings): void {
  try {
    const dir = path.dirname(LOCAL_SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local blog settings:', err);
  }
}

export async function getBlogSettings(): Promise<BlogSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data) {
      return {
        ...defaultBlogSettings,
        ...data,
      };
    }
  } catch {
    // Supabase query error fallback
  }

  const local = readLocalSettings();
  if (local) {
    return {
      ...defaultBlogSettings,
      ...local,
    };
  }

  writeLocalSettings(defaultBlogSettings);
  return defaultBlogSettings;
}

export async function saveBlogSettings(
  settings: BlogSettings
): Promise<{ success: boolean; error?: string }> {
  const updatedSettings = {
    ...settings,
    id: 'default',
    updated_at: new Date().toISOString(),
  };

  writeLocalSettings(updatedSettings);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('blog_settings').upsert(updatedSettings);

    if (error) {
      console.warn('Note: Supabase table blog_settings error (local file updated):', error.message);
    }
  } catch (e: any) {
    console.warn('Note: Supabase blog_settings write skipped:', e?.message);
  }

  return { success: true };
}

