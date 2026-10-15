-- Migration 021: Add SELECT and DELETE policies for subscribers
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/grtvnrqzmbndbjljramm/sql/new

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Allow authenticated read access to subscribers'
  ) THEN
    CREATE POLICY "Allow authenticated read access to subscribers"
      ON public.subscribers FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Allow authenticated delete access to subscribers'
  ) THEN
    CREATE POLICY "Allow authenticated delete access to subscribers"
      ON public.subscribers FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

