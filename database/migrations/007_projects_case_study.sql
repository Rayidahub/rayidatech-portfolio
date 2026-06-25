-- Add flexible case-study content to projects
ALTER TABLE projects ADD COLUMN case_study JSONB DEFAULT NULL;
