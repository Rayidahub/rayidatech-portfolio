-- database/schema.sql

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
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Testimonials Table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  testimonial TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 6. Create Policies (who can read/write)
-- Projects: Anyone can read, only authenticated can write
CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to projects"
  ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Posts: Anyone can read, only authenticated can write
CREATE POLICY "Allow public read access to posts"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to posts"
  ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Contacts: Anyone can insert, only authenticated can read
CREATE POLICY "Allow public insert access to contacts"
  ON contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read access to contacts"
  ON contacts FOR SELECT USING (auth.role() = 'authenticated');

-- Testimonials: Anyone can read, only authenticated can write
CREATE POLICY "Allow public read access to testimonials"
  ON testimonials FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to testimonials"
  ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');