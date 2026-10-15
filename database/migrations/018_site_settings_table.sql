-- Migration 018: Add site_settings table for global theme and site configuration

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  default_theme TEXT DEFAULT 'dark', -- 'dark' | 'light'
  allow_user_toggle BOOLEAN DEFAULT true,
  theme_version INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to site_settings"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access to site_settings"
  ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial row if empty
INSERT INTO site_settings (id, default_theme, allow_user_toggle, theme_version)
VALUES ('default', 'dark', true, 1)
ON CONFLICT (id) DO NOTHING;

