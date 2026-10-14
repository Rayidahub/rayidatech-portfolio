-- Migration 016: Admin roles and user management table
-- Supports role-based access control (super_admin, admin, editor)

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to admin_users"
  ON admin_users FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated manage admin_users"
  ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial root super admins (Raymond Gaius / Rayida)
INSERT INTO admin_users (email, name, role, permissions, is_active)
VALUES 
  (
    'rayidaweb@gmail.com',
    'Raymond Gaius',
    'super_admin',
    ARRAY['dashboard', 'projects', 'services', 'blog', 'hero', 'coming_soon', 'testimonials', 'team', 'contacts', 'users'],
    true
  ),
  (
    'rayidagaius@gmail.com',
    'Raymond Gaius',
    'super_admin',
    ARRAY['dashboard', 'projects', 'services', 'blog', 'hero', 'coming_soon', 'testimonials', 'team', 'contacts', 'users'],
    true
  ),
  (
    'rayidatech@gmail.com',
    'Rayida Tech',
    'super_admin',
    ARRAY['dashboard', 'projects', 'services', 'blog', 'hero', 'coming_soon', 'testimonials', 'team', 'contacts', 'users'],
    true
  )
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  permissions = ARRAY['dashboard', 'projects', 'services', 'blog', 'hero', 'coming_soon', 'testimonials', 'team', 'contacts', 'users'],
  is_active = true;

-- Insert initial Admin user
INSERT INTO admin_users (email, name, role, permissions, is_active)
VALUES (
  'admin@rayidatech.com',
  'Rayida Admin',
  'admin',
  ARRAY['dashboard', 'projects', 'services', 'blog', 'hero', 'coming_soon', 'testimonials', 'team', 'contacts'],
  true
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  permissions = ARRAY['dashboard', 'projects', 'services', 'blog', 'hero', 'coming_soon', 'testimonials', 'team', 'contacts'],
  is_active = true;

-- Insert initial Editor user
INSERT INTO admin_users (email, name, role, permissions, is_active)
VALUES (
  'editor@rayidatech.com',
  'Content Editor',
  'editor',
  ARRAY['dashboard', 'projects', 'blog'],
  true
)
ON CONFLICT (email) DO UPDATE SET
  role = 'editor',
  permissions = ARRAY['dashboard', 'projects', 'blog'],
  is_active = true;

