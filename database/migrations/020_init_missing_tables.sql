-- Migration 020: Consolidated setup for visitor_logs and site_settings tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/grtvnrqzmbndbjljramm/sql/new

-- 1. Create visitor_logs table
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  action_label TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  device_type TEXT DEFAULT 'desktop',
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-speed queries
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visitor_id ON public.visitor_logs (visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id ON public.visitor_logs (session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_event_type ON public.visitor_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_path ON public.visitor_logs (path);

-- Enable RLS
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow public insert to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow read to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow authenticated delete to visitor_logs" ON public.visitor_logs;

-- Recreate policies
CREATE POLICY "Allow public insert to visitor_logs"
  ON public.visitor_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read to visitor_logs"
  ON public.visitor_logs FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated delete to visitor_logs"
  ON public.visitor_logs FOR DELETE
  USING (auth.role() = 'authenticated');

-- 2. Create site_settings table (for default dark/light theme admin control)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  default_theme TEXT DEFAULT 'dark',
  allow_user_toggle BOOLEAN DEFAULT true,
  theme_version INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated full to site_settings" ON public.site_settings;

CREATE POLICY "Allow public read to site_settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full to site_settings"
  ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.site_settings (id, default_theme, allow_user_toggle, theme_version)
VALUES ('default', 'dark', true, 1)
ON CONFLICT (id) DO NOTHING;

