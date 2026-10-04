-- Migration 013: Add contact_settings table for dynamic contact page customization

CREATE TABLE IF NOT EXISTS contact_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge_text TEXT DEFAULT 'Get In Touch',
  headline_prefix TEXT DEFAULT 'Let''s build something',
  headline_accent TEXT DEFAULT 'exceptional',
  headline_suffix TEXT DEFAULT 'together',
  subheadline TEXT DEFAULT 'Have an upcoming product, redesign, or engineering challenge? Tell me about your goals and timeline below, or connect directly through WhatsApp.',
  whatsapp_number TEXT DEFAULT '+234 701 447 8376',
  whatsapp_url TEXT DEFAULT 'https://wa.link/tlezg8',
  email TEXT DEFAULT 'rayidagaius@gmail.com',
  website_url TEXT DEFAULT 'https://rayidatech.name.ng',
  working_hours TEXT DEFAULT 'Mon — Sat, 9:00 AM — 6:00 PM (WAT / UTC+1)',
  location TEXT DEFAULT 'Lagos, Nigeria • Operating Worldwide',
  principles JSONB DEFAULT '[
    {"title": "Fast, transparent updates", "description": "Weekly video summaries and collaborative Figma files."},
    {"title": "Full code & design ownership", "description": "Complete source code and vector assets handed over upon completion."},
    {"title": "Post-launch support", "description": "30 days of warranty and bug fixing included in all full contracts."}
  ]'::jsonb,
  process_steps JSONB DEFAULT '[
    {"step": "01", "title": "Discovery & Brief", "description": "We review your goals, scope, and target audience within 24 hours of receiving your inquiry."},
    {"step": "02", "title": "Strategy & Alignment", "description": "A focused 20-minute call to align on technical feasibility, design direction, and deliverable milestones."},
    {"step": "03", "title": "Execution & Launch", "description": "Structured sprints with transparent Figma files, staging previews, and guaranteed on-time delivery."}
  ]'::jsonb,
  faqs JSONB DEFAULT '[
    {"question": "How quickly will you reply to my message?", "answer": "I reply to all inquiries within 24 business hours. If you need immediate assistance or have an urgent timeline, contacting me directly via WhatsApp is recommended."},
    {"question": "What information should I have ready before reaching out?", "answer": "A high-level description of what you are building, your target timeline, and an estimated budget range are great starting points. If you already have wireframes, design references, or PRDs, feel free to mention them."},
    {"question": "How are project payments structured?", "answer": "Typical engagements are milestone-based: 50% upfront to reserve the sprint, and 50% upon final delivery and client approval. For larger full-stack developments, we can establish three milestone installments."},
    {"question": "Do you work with international clients across different timezones?", "answer": "Yes, absolutely. I work with clients across the Americas, Europe, Africa, and Asia. Communication is maintained through scheduled async updates, Slack/WhatsApp channels, and convenient video check-ins."}
  ]'::jsonb,
  social_links JSONB DEFAULT '[
    {"name": "LinkedIn", "url": "https://www.linkedin.com/in/rayida-tech", "handle": "@rayida-tech"},
    {"name": "GitHub", "url": "https://github.com/Rayidahub", "handle": "@Rayidahub"},
    {"name": "X / Twitter", "url": "https://x.com/rayidatech", "handle": "@rayidatech"},
    {"name": "Instagram", "url": "https://instagram.com/rayidatech", "handle": "@rayidatech"},
    {"name": "YouTube", "url": "https://youtube.com/@rayidatech", "handle": "@rayidatech"},
    {"name": "TikTok", "url": "https://tiktok.com/@rayidatech", "handle": "@rayidatech"}
  ]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to contact_settings"
  ON contact_settings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access to contact_settings"
  ON contact_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial row if empty
INSERT INTO contact_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;
