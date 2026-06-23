-- Migration 006: Create hero_slides table and storage bucket

CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  words TEXT[] NOT NULL DEFAULT '{}',
  body TEXT NOT NULL,
  image TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hero_slides"
  ON hero_slides FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to hero_slides"
  ON hero_slides FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to hero_slides"
  ON hero_slides FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to hero_slides"
  ON hero_slides FOR DELETE USING (auth.role() = 'authenticated');

-- Create the Supabase Storage bucket for hero slide images.
-- If the bucket already exists this will be skipped by the ON CONFLICT clause.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-slides',
  'hero-slides',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,0
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for the hero-slides bucket
CREATE POLICY "Allow public read access to hero-slides bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'hero-slides');

CREATE POLICY "Allow authenticated uploads to hero-slides bucket"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates to hero-slides bucket"
  ON storage.objects FOR UPDATE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes from hero-slides bucket"
  ON storage.objects FOR DELETE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');
