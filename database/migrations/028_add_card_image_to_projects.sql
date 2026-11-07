-- Migration 028: Add card_image column to projects table
-- Enables dedicated portrait/vertical card cover for portfolio grids (PremiumCard)
-- separate from wide landscape cover_image hero banners.
-- Safe to execute in Supabase SQL Editor.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS card_image TEXT;

-- Backfill card_image from case_study->>'card_image' or default to cover_image
UPDATE public.projects
SET card_image = COALESCE(
  case_study->>'card_image',
  cover_image
)
WHERE card_image IS NULL AND cover_image IS NOT NULL;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
