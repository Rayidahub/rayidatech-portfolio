-- Migration 029: Enhance ecosystem_products table for full product catalog management
-- Adds optional metadata, category, image, links, and feature bullets
-- Safe to run in Supabase SQL editor (idempotent IF NOT EXISTS)

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS tagline TEXT;

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'AI & Intelligence';

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS image TEXT;

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS website_url TEXT;

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS waitlist_url TEXT;

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS badge TEXT;

ALTER TABLE public.ecosystem_products
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create index on slug and sort_order for fast public reads
CREATE INDEX IF NOT EXISTS idx_ecosystem_products_slug ON public.ecosystem_products (slug);
CREATE INDEX IF NOT EXISTS idx_ecosystem_products_active_sort ON public.ecosystem_products (is_active, sort_order ASC);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
