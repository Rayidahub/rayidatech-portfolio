-- ==============================================================================
-- RAYIDA TECH PORTFOLIO — CONSOLIDATED PRODUCTION DATABASE SCHEMA
-- Compatible with PostgreSQL 15+ & Supabase
-- Covers all tables, constraints, default rows, RLS policies, indexes, and storage
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTACTS / INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  icon_name TEXT NOT NULL DEFAULT 'Palette',
  image TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  testimonial TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HERO SLIDES TABLE
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  words TEXT[] NOT NULL DEFAULT '{}',
  body TEXT NOT NULL,
  image TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ECOSYSTEM PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.ecosystem_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('coming_soon', 'live')),
  launch_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  linkedin_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONTACT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge_text TEXT NOT NULL,
  headline_prefix TEXT NOT NULL,
  headline_accent TEXT NOT NULL,
  headline_suffix TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  whatsapp_url TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT NOT NULL,
  availability_status TEXT NOT NULL,
  response_time TEXT NOT NULL,
  principles JSONB NOT NULL DEFAULT '[]'::jsonb,
  process_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BLOG SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.blog_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge_text TEXT NOT NULL,
  headline_prefix TEXT NOT NULL,
  headline_accent TEXT NOT NULL,
  headline_suffix TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_bio TEXT NOT NULL,
  author_twitter TEXT NOT NULL,
  author_github TEXT NOT NULL,
  author_linkedin TEXT NOT NULL,
  newsletter_headline TEXT NOT NULL,
  newsletter_subheadline TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. HERO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.hero_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  status_pill_text TEXT NOT NULL,
  floating_stat_value TEXT NOT NULL,
  floating_stat_label TEXT NOT NULL,
  autoplay_enabled BOOLEAN NOT NULL DEFAULT true,
  autoplay_interval INTEGER NOT NULL DEFAULT 5,
  gradient JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  default_theme TEXT DEFAULT 'dark',
  allow_user_toggle BOOLEAN DEFAULT true,
  theme_version INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. VISITOR ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  action_label TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  device_type TEXT DEFAULT 'desktop',
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  country_code TEXT,
  country_flag TEXT,
  formatted_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects (featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services ("order" ASC);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON public.hero_slides (is_active, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_testimonials_active_order ON public.testimonials (is_active, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_ecosystem_active ON public.ecosystem_products (is_active, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members (is_active, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visitor_id ON public.visitor_logs (visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id ON public.visitor_logs (session_id);

-- 18. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- 19. RLS POLICIES (DROP AND RECREATE FOR IDEMPOTENCY)
-- Projects
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated full write to projects" ON public.projects;
CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full write to projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- Posts
DROP POLICY IF EXISTS "Allow public read access to posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated full write to posts" ON public.posts;
CREATE POLICY "Allow public read access to posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full write to posts" ON public.posts FOR ALL USING (auth.role() = 'authenticated');

-- Contacts
DROP POLICY IF EXISTS "Allow public insert access to contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow authenticated full to contacts" ON public.contacts;
CREATE POLICY "Allow public insert access to contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full to contacts" ON public.contacts FOR ALL USING (auth.role() = 'authenticated');

-- Services
DROP POLICY IF EXISTS "Allow public read access to services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated full to services" ON public.services;
CREATE POLICY "Allow public read access to services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to services" ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials
DROP POLICY IF EXISTS "Allow public read access to testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated full to testimonials" ON public.testimonials;
CREATE POLICY "Allow public read access to testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Hero Slides
DROP POLICY IF EXISTS "Allow public read access to hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow authenticated full to hero_slides" ON public.hero_slides;
CREATE POLICY "Allow public read access to hero_slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to hero_slides" ON public.hero_slides FOR ALL USING (auth.role() = 'authenticated');

-- Ecosystem Products
DROP POLICY IF EXISTS "Allow public read access to ecosystem_products" ON public.ecosystem_products;
DROP POLICY IF EXISTS "Allow authenticated full to ecosystem_products" ON public.ecosystem_products;
CREATE POLICY "Allow public read access to ecosystem_products" ON public.ecosystem_products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to ecosystem_products" ON public.ecosystem_products FOR ALL USING (auth.role() = 'authenticated');

-- Subscribers
DROP POLICY IF EXISTS "Allow public insert access to subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow authenticated read and manage subscribers" ON public.subscribers;
CREATE POLICY "Allow public insert access to subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read and manage subscribers" ON public.subscribers FOR ALL USING (auth.role() = 'authenticated');

-- Team Members
DROP POLICY IF EXISTS "Allow public read access to team_members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated full to team_members" ON public.team_members;
CREATE POLICY "Allow public read access to team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to team_members" ON public.team_members FOR ALL USING (auth.role() = 'authenticated');

-- Settings Tables
DROP POLICY IF EXISTS "Allow public read to contact_settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Allow authenticated full to contact_settings" ON public.contact_settings;
CREATE POLICY "Allow public read to contact_settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to contact_settings" ON public.contact_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow public read to blog_settings" ON public.blog_settings;
DROP POLICY IF EXISTS "Allow authenticated full to blog_settings" ON public.blog_settings;
CREATE POLICY "Allow public read to blog_settings" ON public.blog_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to blog_settings" ON public.blog_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow public read to hero_settings" ON public.hero_settings;
DROP POLICY IF EXISTS "Allow authenticated full to hero_settings" ON public.hero_settings;
CREATE POLICY "Allow public read to hero_settings" ON public.hero_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to hero_settings" ON public.hero_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow public read to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated full to site_settings" ON public.site_settings;
CREATE POLICY "Allow public read to site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Admin Users
DROP POLICY IF EXISTS "Allow authenticated full to admin_users" ON public.admin_users;
CREATE POLICY "Allow authenticated full to admin_users" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Visitor Logs
DROP POLICY IF EXISTS "Allow public insert to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow read to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow authenticated read to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow authenticated delete to visitor_logs" ON public.visitor_logs;
CREATE POLICY "Allow public insert to visitor_logs" ON public.visitor_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read to visitor_logs" ON public.visitor_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete to visitor_logs" ON public.visitor_logs FOR DELETE USING (auth.role() = 'authenticated');

-- 20. STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-slides',
  'hero-slides',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Allow public read access to hero-slides bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to hero-slides bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to hero-slides bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from hero-slides bucket" ON storage.objects;

CREATE POLICY "Allow public read access to hero-slides bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'hero-slides');

CREATE POLICY "Allow authenticated uploads to hero-slides bucket"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates to hero-slides bucket"
  ON storage.objects FOR UPDATE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes from hero-slides bucket"
  ON storage.objects FOR DELETE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

