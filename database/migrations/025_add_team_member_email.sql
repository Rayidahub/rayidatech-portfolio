-- Migration 025: Add email column to team_members
-- Allows direct and bulk internal messaging through Resend and Zoho

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS email TEXT;
CREATE INDEX IF NOT EXISTS idx_team_members_email ON public.team_members (LOWER(email));

