-- Migration 009: Add image_url column to services table
-- Run in Supabase SQL editor

ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN services.image_url IS 'Public URL of the visual showcase cover image for the service';
