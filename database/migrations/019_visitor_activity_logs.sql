-- Migration 019: Create visitor_logs table for website user activity tracking

CREATE TABLE IF NOT EXISTS visitor_logs (
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

-- Indexes for lightning-fast queries and admin filtering
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visitor_id ON visitor_logs (visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id ON visitor_logs (session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_event_type ON visitor_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_path ON visitor_logs (path);

-- Row Level Security
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Allow public and anonymous clients to insert activity logs
CREATE POLICY "Allow public insert to visitor_logs"
  ON visitor_logs FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admin users to read logs
CREATE POLICY "Allow authenticated read to visitor_logs"
  ON visitor_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated admin users to delete logs (cleanup)
CREATE POLICY "Allow authenticated delete to visitor_logs"
  ON visitor_logs FOR DELETE
  USING (auth.role() = 'authenticated');

