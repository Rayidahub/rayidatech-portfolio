-- Migration 012: Create team_members table

CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT,
  social_links JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_members' AND policyname = 'Allow public read access to team_members'
  ) THEN
    CREATE POLICY "Allow public read access to team_members"
      ON team_members FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_members' AND policyname = 'Allow authenticated insert access to team_members'
  ) THEN
    CREATE POLICY "Allow authenticated insert access to team_members"
      ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_members' AND policyname = 'Allow authenticated update access to team_members'
  ) THEN
    CREATE POLICY "Allow authenticated update access to team_members"
      ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_members' AND policyname = 'Allow authenticated delete access to team_members'
  ) THEN
    CREATE POLICY "Allow authenticated delete access to team_members"
      ON team_members FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END
$$;

-- Seed sample team members (only if the table is empty).
INSERT INTO team_members (name, role, bio, photo_url, social_links, sort_order, is_active)
SELECT 'Raymond Gaius', 'Founder & Product Designer', 'Product designer and AI engineer building digital experiences people can trust. Leads design, strategy, and engineering at Rayida Tech.', NULL, '{"linkedin":"https://linkedin.com","twitter":"https://x.com","github":"https://github.com"}'::jsonb, 1, true
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);

INSERT INTO team_members (name, role, bio, photo_url, social_links, sort_order, is_active)
SELECT 'Adeola Martins', 'Lead Developer', 'Full-stack engineer focused on scalable Next.js applications, clean architecture, and performance.', NULL, '{"linkedin":"https://linkedin.com","github":"https://github.com"}'::jsonb, 2, true
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);

INSERT INTO team_members (name, role, bio, photo_url, social_links, sort_order, is_active)
SELECT 'Fatima Bello', 'UI/UX Designer', 'User-centered designer turning complex problems into intuitive and accessible interfaces.', NULL, '{"linkedin":"https://linkedin.com","twitter":"https://x.com"}'::jsonb, 3, true
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);

INSERT INTO team_members (name, role, bio, photo_url, social_links, sort_order, is_active)
SELECT 'Chidi Nwosu', 'Brand Strategist', 'Brand storyteller who shapes messaging, identity, and growth strategies for digital products.', NULL, '{"linkedin":"https://linkedin.com","twitter":"https://x.com"}'::jsonb, 4, true
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);
