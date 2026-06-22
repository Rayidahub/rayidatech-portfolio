-- Migration 003: Add phone and project_type columns to contacts table

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS project_type TEXT;
