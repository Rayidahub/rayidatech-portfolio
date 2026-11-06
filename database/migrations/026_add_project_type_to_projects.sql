-- Migration 026: Add project_type to projects table
-- Enables direct column indexing while remaining backward-compatible with JSONB case_study
-- Safe to execute in Supabase SQL Editor.
-- Note: The frontend application is architected with dual-layer fallback:
-- it automatically stores and infers project_type inside the case_study JSONB
-- column and tags array, meaning the system functions seamlessly even before
-- or after this SQL migration is executed.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'UI/UX Design';

-- Populate existing rows based on JSONB case_study or tags
UPDATE public.projects
SET project_type = COALESCE(
  case_study->>'project_type',
  case_study->>'case_study_type',
  CASE WHEN 'Brand Identity' = ANY(tags) THEN 'Brand Identity' ELSE 'UI/UX Design' END
)
WHERE project_type IS NULL;

-- Notify PostgREST to reload OpenAPI schema cache
NOTIFY pgrst, 'reload schema';
