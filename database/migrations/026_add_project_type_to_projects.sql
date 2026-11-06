-- Migration 026: Add project_type to projects table
-- Enables direct column indexing while remaining backward-compatible with JSONB case_study

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_type TEXT;

-- Populate existing rows based on JSONB case_study or tags
UPDATE public.projects
SET project_type = COALESCE(
  case_study->>'project_type',
  case_study->>'case_study_type',
  CASE WHEN 'Brand Identity' = ANY(tags) THEN 'Brand Identity' ELSE 'UI/UX Design' END
)
WHERE project_type IS NULL;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
