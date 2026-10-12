-- Migration 017: Add gradient settings column to hero_settings table
ALTER TABLE hero_settings 
ADD COLUMN IF NOT EXISTS gradient JSONB DEFAULT NULL;
