-- database/schema.sql
-- Full schema snapshot for the Rayida Tech portfolio.
-- Apply this to a fresh Supabase project, or run migrations sequentially instead.

-- 1. Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  role TEXT,
  duration TEXT,
  link TEXT,
  tags TEXT[],
  case_study JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Blog Posts Table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Contacts Table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Services Table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  icon_name TEXT NOT NULL DEFAULT 'Palette',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Testimonials Table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  testimonial TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Hero Slides Table
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

-- 7. Ecosystem Products Table
CREATE TABLE ecosystem_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('coming_soon', 'live')),
  launch_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Subscribers Table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies

-- Projects: public read, authenticated full write
CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to projects"
  ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to projects"
  ON projects FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to projects"
  ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Posts: public read, authenticated full write
CREATE POLICY "Allow public read access to posts"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to posts"
  ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to posts"
  ON posts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to posts"
  ON posts FOR DELETE USING (auth.role() = 'authenticated');

-- Contacts: public insert, authenticated read/update/delete
CREATE POLICY "Allow public insert access to contacts"
  ON contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read access to contacts"
  ON contacts FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to contacts"
  ON contacts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to contacts"
  ON contacts FOR DELETE USING (auth.role() = 'authenticated');

-- Services: public read, authenticated full write
CREATE POLICY "Allow public read access to services"
  ON services FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to services"
  ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to services"
  ON services FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to services"
  ON services FOR DELETE USING (auth.role() = 'authenticated');

-- Testimonials: public read, authenticated full write
CREATE POLICY "Allow public read access to testimonials"
  ON testimonials FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to testimonials"
  ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to testimonials"
  ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to testimonials"
  ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- Hero Slides: public read, authenticated full write
CREATE POLICY "Allow public read access to hero_slides"
  ON hero_slides FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to hero_slides"
  ON hero_slides FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to hero_slides"
  ON hero_slides FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to hero_slides"
  ON hero_slides FOR DELETE USING (auth.role() = 'authenticated');

-- Ecosystem Products: public read, authenticated full write
CREATE POLICY "Allow public read access to ecosystem_products"
  ON ecosystem_products FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to ecosystem_products"
  ON ecosystem_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to ecosystem_products"
  ON ecosystem_products FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to ecosystem_products"
  ON ecosystem_products FOR DELETE USING (auth.role() = 'authenticated');

-- Subscribers: public insert only
CREATE POLICY "Allow public insert access to subscribers"
  ON subscribers FOR INSERT WITH CHECK (true);

-- 11. Storage
-- Hero slide images bucket
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
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Allow public read access to hero-slides bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'hero-slides');

CREATE POLICY "Allow authenticated uploads to hero-slides bucket"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates to hero-slides bucket"
  ON storage.objects FOR UPDATE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes from hero-slides bucket"
  ON storage.objects FOR DELETE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');
