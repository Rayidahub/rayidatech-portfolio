-- Migration 014: Add blog_settings table for dynamic blog page customization

CREATE TABLE IF NOT EXISTS blog_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge_text TEXT DEFAULT 'Insights & Perspectives',
  headline_prefix TEXT DEFAULT 'Thoughts on Design, Tech &',
  headline_accent TEXT DEFAULT 'Growth',
  headline_suffix TEXT DEFAULT '',
  subheadline TEXT DEFAULT 'Practical perspectives on product design, AI engineering, building scalable systems, and design-led company building by Raymond Gaius.',
  author_name TEXT DEFAULT 'Raymond Gaius',
  author_role TEXT DEFAULT 'Product Designer & AI Engineer',
  author_bio TEXT DEFAULT 'Product Designer & AI Engineer at Rayida Tech. Building digital experiences people can trust across fintech, AI interfaces, and scalable SaaS ecosystems.',
  author_twitter TEXT DEFAULT 'https://twitter.com/rayidatech',
  author_github TEXT DEFAULT 'https://github.com/Rayidahub',
  author_linkedin TEXT DEFAULT 'https://linkedin.com/in/rayida-tech',
  newsletter_headline TEXT DEFAULT 'Stay in the loop',
  newsletter_subheadline TEXT DEFAULT 'Get insights on design, AI engineering, product thinking, and behind-the-scenes updates — no spam, just value.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE blog_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to blog_settings"
  ON blog_settings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access to blog_settings"
  ON blog_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial row if empty
INSERT INTO blog_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

