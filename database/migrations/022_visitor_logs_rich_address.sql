-- Migration 022: Add comprehensive physical address, network, and geolocation columns to visitor_logs
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/grtvnrqzmbndbjljramm/sql/new

ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS formatted_address TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS isp TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS country_code TEXT;

CREATE INDEX IF NOT EXISTS idx_visitor_logs_country ON public.visitor_logs (country);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_city ON public.visitor_logs (city);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_region ON public.visitor_logs (region);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_isp ON public.visitor_logs (isp);

