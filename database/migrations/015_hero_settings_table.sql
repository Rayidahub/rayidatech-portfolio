-- Migration 015: Add hero_settings table for dynamic homepage hero customization

CREATE TABLE IF NOT EXISTS hero_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  show_status_pill BOOLEAN DEFAULT true,
  status_pill_text TEXT DEFAULT 'Available for projects',
  status_pill_link TEXT DEFAULT '/contact',
  status_pill_available BOOLEAN DEFAULT true,

  primary_cta_label TEXT DEFAULT 'Start Your Project',
  primary_cta_link TEXT DEFAULT '/contact',
  secondary_cta_label TEXT DEFAULT 'View My Work',
  secondary_cta_link TEXT DEFAULT '/projects',

  show_floating_stat BOOLEAN DEFAULT true,
  floating_stat_value TEXT DEFAULT '98%',
  floating_stat_label TEXT DEFAULT 'Client Satisfaction',

  autoplay_enabled BOOLEAN DEFAULT true,
  autoplay_interval INTEGER DEFAULT 5,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hero_settings"
  ON hero_settings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access to hero_settings"
  ON hero_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial default row
INSERT INTO hero_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

