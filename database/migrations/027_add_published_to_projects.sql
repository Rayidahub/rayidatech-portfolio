-- Migration 027: Add published and status columns to projects table
-- Supports draft vs published workflow with safe fallback to JSONB case_study
-- Safe to execute in Supabase SQL Editor.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Existing projects default to published so portfolio remains intact
UPDATE public.projects
SET 
  published = COALESCE(
    (case_study->>'published')::boolean,
    CASE WHEN case_study->>'status' = 'draft' THEN FALSE ELSE TRUE END
  ),
  status = COALESCE(
    case_study->>'status',
    CASE WHEN (case_study->>'published')::boolean = FALSE THEN 'draft' ELSE 'published' END
  )
WHERE published IS NULL OR status IS NULL;

-- Create index for fast status querying
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (published, created_at DESC);

-- Notify PostgREST to reload OpenAPI schema cache
NOTIFY pgrst, 'reload schema';
