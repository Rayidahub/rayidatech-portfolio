-- ==============================================================================
-- RAYIDA TECH PORTFOLIO — CONSOLIDATED PRODUCTION DATABASE SCHEMA
-- Compatible with PostgreSQL 15+ & Supabase
-- Fully Idempotent & Self-Healing: Safe to run on fresh or existing databases
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
  photo_url TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONTACT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge_text TEXT DEFAULT 'Get In Touch',
  headline_prefix TEXT DEFAULT 'Let''s build something',
  headline_accent TEXT DEFAULT 'exceptional',
  headline_suffix TEXT DEFAULT 'together',
  subheadline TEXT DEFAULT 'Have an upcoming product, redesign, or engineering challenge? Tell me about your goals and timeline below, or connect directly through WhatsApp.',
  whatsapp_number TEXT DEFAULT '+234 701 447 8376',
  whatsapp_url TEXT DEFAULT 'https://wa.link/tlezg8',
  email TEXT DEFAULT 'rayidagaius@gmail.com',
  website_url TEXT DEFAULT 'https://rayidatech.name.ng',
  working_hours TEXT DEFAULT 'Mon — Sat, 9:00 AM — 6:00 PM (WAT / UTC+1)',
  location TEXT DEFAULT 'Lagos, Nigeria • Operating Worldwide',
  principles JSONB DEFAULT '[
    {"title": "Fast, transparent updates", "description": "Weekly video summaries and collaborative Figma files."},
    {"title": "Full code & design ownership", "description": "Complete source code and vector assets handed over upon completion."},
    {"title": "Post-launch support", "description": "30 days of warranty and bug fixing included in all full contracts."}
  ]'::jsonb,
  process_steps JSONB DEFAULT '[
    {"step": "01", "title": "Discovery & Brief", "description": "We review your goals, scope, and target audience within 24 hours of receiving your inquiry."},
    {"step": "02", "title": "Strategy & Alignment", "description": "A focused 20-minute call to align on technical feasibility, design direction, and deliverable milestones."},
    {"step": "03", "title": "Execution & Launch", "description": "Structured sprints with transparent Figma files, staging previews, and guaranteed on-time delivery."}
  ]'::jsonb,
  faqs JSONB DEFAULT '[
    {"question": "How quickly will you reply to my message?", "answer": "I reply to all inquiries within 24 business hours. If you need immediate assistance or have an urgent timeline, contacting me directly via WhatsApp is recommended."},
    {"question": "What information should I have ready before reaching out?", "answer": "A high-level description of what you are building, your target timeline, and an estimated budget range are great starting points. If you already have wireframes, design references, or PRDs, feel free to mention them."},
    {"question": "How are project payments structured?", "answer": "Typical engagements are milestone-based: 50% upfront to reserve the sprint, and 50% upon final delivery and client approval. For larger full-stack developments, we can establish three milestone installments."},
    {"question": "Do you work with international clients across different timezones?", "answer": "Yes, absolutely. I work with clients across the Americas, Europe, Africa, and Asia. Communication is maintained through scheduled async updates, Slack/WhatsApp channels, and convenient video check-ins."}
  ]'::jsonb,
  social_links JSONB DEFAULT '[
    {"name": "LinkedIn", "url": "https://www.linkedin.com/in/rayida-tech", "handle": "@rayida-tech"},
    {"name": "GitHub", "url": "https://github.com/Rayidahub", "handle": "@Rayidahub"},
    {"name": "X / Twitter", "url": "https://x.com/rayidatech", "handle": "@rayidatech"},
    {"name": "Instagram", "url": "https://instagram.com/rayidatech", "handle": "@rayidatech"},
    {"name": "YouTube", "url": "https://youtube.com/@rayidatech", "handle": "@rayidatech"},
    {"name": "TikTok", "url": "https://tiktok.com/@rayidatech", "handle": "@rayidatech"}
  ]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BLOG SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.blog_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge_text TEXT DEFAULT 'Insights & Perspectives',
  headline_prefix TEXT DEFAULT 'Thoughts on Design, Tech &',
  headline_accent TEXT DEFAULT 'Growth',
  headline_suffix TEXT DEFAULT '',
  subheadline TEXT DEFAULT 'Practical perspectives on product design, AI engineering, building scalable systems, and design-led company building by Raymond Gaius.',
  author_name TEXT DEFAULT 'Raymond Gaius',
  author_role TEXT DEFAULT 'Product Designer & AI Engineer',
  author_bio TEXT DEFAULT 'Product Designer & AI Engineer at Rayida Tech. Building digital experiences people can trust across fintech, AI interfaces, and scalable SaaS ecosystems.',
  author_twitter TEXT DEFAULT 'https://twitter.com/rayidatech',
  author_github TEXT DEFAULT 'https://github.com/Rayidahub',
  author_linkedin TEXT DEFAULT 'https://linkedin.com/in/rayida-tech',
  newsletter_headline TEXT DEFAULT 'Stay in the loop',
  newsletter_subheadline TEXT DEFAULT 'Get insights on design, AI engineering, product thinking, and behind-the-scenes updates — no spam, just value.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. HERO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.hero_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  show_status_pill BOOLEAN DEFAULT true,
  status_pill_text TEXT DEFAULT 'Available for projects',
  status_pill_link TEXT DEFAULT '/contact',
  status_pill_available BOOLEAN DEFAULT true,
  primary_cta_label TEXT DEFAULT 'Start Your Project',
  primary_cta_link TEXT DEFAULT '/contact',
  secondary_cta_label TEXT DEFAULT 'View My Work',
  secondary_cta_link TEXT DEFAULT '/projects',
  show_floating_stat BOOLEAN DEFAULT true,
  floating_stat_value TEXT DEFAULT '98%',
  floating_stat_label TEXT DEFAULT 'Client Satisfaction',
  autoplay_enabled BOOLEAN DEFAULT true,
  autoplay_interval INTEGER DEFAULT 5,
  gradient JSONB DEFAULT '{}'::jsonb,
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

-- ==============================================================================
-- 17. SELF-HEALING COLUMN UPGRADES (In case tables already existed previously)
-- ==============================================================================

-- Testimonials upgrades
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Hero Slides upgrades
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS words TEXT[] NOT NULL DEFAULT '{}';

-- Team Members upgrades
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Ecosystem Products upgrades
ALTER TABLE public.ecosystem_products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.ecosystem_products ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Services upgrades
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}';

-- Projects upgrades
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS case_study JSONB DEFAULT NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Hero Settings upgrades
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS show_status_pill BOOLEAN DEFAULT true;
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS status_pill_link TEXT DEFAULT '/contact';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS status_pill_available BOOLEAN DEFAULT true;
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS primary_cta_label TEXT DEFAULT 'Start Your Project';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS primary_cta_link TEXT DEFAULT '/contact';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS secondary_cta_label TEXT DEFAULT 'View My Work';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS secondary_cta_link TEXT DEFAULT '/projects';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS show_floating_stat BOOLEAN DEFAULT true;
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS gradient JSONB DEFAULT '{}'::jsonb;

-- Contact Settings upgrades
ALTER TABLE public.contact_settings ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Lagos, Nigeria • Operating Worldwide';
ALTER TABLE public.contact_settings ADD COLUMN IF NOT EXISTS working_hours TEXT DEFAULT 'Mon — Sat, 9:00 AM — 6:00 PM (WAT / UTC+1)';
ALTER TABLE public.contact_settings ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT 'https://rayidatech.name.ng';

-- Visitor Logs upgrades
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS country_flag TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS formatted_address TEXT;

-- Admin Users upgrades
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- ==============================================================================
-- 18. PERFORMANCE INDEXES
-- ==============================================================================
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

-- ==============================================================================
-- 19. ENABLE ROW LEVEL SECURITY
-- ==============================================================================
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

-- ==============================================================================
-- 20. RLS POLICIES (DROP AND RECREATE FOR IDEMPOTENCY)
-- ==============================================================================

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

-- Contact Settings
DROP POLICY IF EXISTS "Allow public read to contact_settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Allow authenticated full to contact_settings" ON public.contact_settings;
CREATE POLICY "Allow public read to contact_settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to contact_settings" ON public.contact_settings FOR ALL USING (auth.role() = 'authenticated');

-- Blog Settings
DROP POLICY IF EXISTS "Allow public read to blog_settings" ON public.blog_settings;
DROP POLICY IF EXISTS "Allow authenticated full to blog_settings" ON public.blog_settings;
CREATE POLICY "Allow public read to blog_settings" ON public.blog_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to blog_settings" ON public.blog_settings FOR ALL USING (auth.role() = 'authenticated');

-- Hero Settings
DROP POLICY IF EXISTS "Allow public read to hero_settings" ON public.hero_settings;
DROP POLICY IF EXISTS "Allow authenticated full to hero_settings" ON public.hero_settings;
CREATE POLICY "Allow public read to hero_settings" ON public.hero_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to hero_settings" ON public.hero_settings FOR ALL USING (auth.role() = 'authenticated');

-- Site Settings
DROP POLICY IF EXISTS "Allow public read to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated full to site_settings" ON public.site_settings;
CREATE POLICY "Allow public read to site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full to site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Admin Users
DROP POLICY IF EXISTS "Allow authenticated full to admin_users" ON public.admin_users;
CREATE POLICY "Allow authenticated full to admin_users" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Visitor Logs (Locked down: Public can only INSERT; Only AUTHENTICATED can READ/DELETE)
DROP POLICY IF EXISTS "Allow public insert to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow read to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow authenticated read to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow authenticated delete to visitor_logs" ON public.visitor_logs;
CREATE POLICY "Allow public insert to visitor_logs" ON public.visitor_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read to visitor_logs" ON public.visitor_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete to visitor_logs" ON public.visitor_logs FOR DELETE USING (auth.role() = 'authenticated');

-- ==============================================================================
-- 21. SEED DEFAULT CONFIGURATION ROWS (Only inserted if absent)
-- ==============================================================================
INSERT INTO public.site_settings (id, default_theme, allow_user_toggle, theme_version)
VALUES ('default', 'dark', true, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.contact_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.blog_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hero_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- Seed initial admin user if not present
INSERT INTO public.admin_users (id, email, name, role, permissions, is_active)
SELECT 'root-super-admin-01', 'rayidagaius@gmail.com', 'Raymond Gaius', 'super_admin',
  ARRAY['dashboard', 'projects', 'services', 'blog', 'hero', 'coming_soon', 'testimonials', 'team', 'contacts', 'users', 'logs'], true
WHERE NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'rayidagaius@gmail.com');

-- Seed sample ecosystem products if table is empty
INSERT INTO public.ecosystem_products (name, emoji, description, status, launch_date, sort_order, is_active)
SELECT * FROM (VALUES
  ('Rayce', '⚡', 'The intelligence hub connecting every Rayida product. Think of it as the brain behind the ecosystem.', 'coming_soon', NULL::date, 1, true),
  ('Raydemy', '🎓', 'Learn digital skills that actually pay. Courses, certifications, and community learning — all in one place.', 'coming_soon', NULL::date, 2, true),
  ('Ranect', '🔗', 'Connect with professionals, discover opportunities, and grow your network. The future of professional networking.', 'coming_soon', NULL::date, 3, true),
  ('Payida', '💳', 'Digital payments, wallets, and blockchain — built for the future of finance. Secure, fast, and smart.', 'coming_soon', NULL::date, 4, true),
  ('RayTexta', '🎤', 'Speech-to-text made simple. Transcribe, create, and boost your productivity with voice.', 'coming_soon', NULL::date, 5, true)
) AS seed(name, emoji, description, status, launch_date, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.ecosystem_products LIMIT 1);

-- Seed sample testimonials if table is empty
INSERT INTO public.testimonials (name, role, company, testimonial, is_active, sort_order)
SELECT * FROM (VALUES
  ('Adeola Martins', 'Founder', 'ProptVerse', 'Working with Rayida Tech was a game-changer for our brand. The design quality and attention to detail exceeded our expectations.', true, 1),
  ('Chidi Nwosu', 'CEO', 'Vaulta', 'They transformed our digital presence completely. Professional, creative, and results-driven every step of the way.', true, 2),
  ('Fatima Bello', 'Product Manager', 'FlavorEase', 'The team delivered beyond what we asked for. Our users love the new interface and we have seen a significant improvement in engagement.', true, 3)
) AS seed(name, role, company, testimonial, is_active, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials LIMIT 1);

-- ==============================================================================
-- 22. STORAGE BUCKET CONFIGURATION
-- ==============================================================================
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
