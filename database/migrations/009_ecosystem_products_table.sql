-- Migration 009: Create ecosystem_products table

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

ALTER TABLE ecosystem_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to ecosystem_products"
  ON ecosystem_products FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access to ecosystem_products"
  ON ecosystem_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access to ecosystem_products"
  ON ecosystem_products FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access to ecosystem_products"
  ON ecosystem_products FOR DELETE USING (auth.role() = 'authenticated');

-- Seed the initial Rayida Tech ecosystem products.
-- Launch dates are left NULL so they can be set from the admin dashboard.
INSERT INTO ecosystem_products (name, emoji, description, status, launch_date, sort_order, is_active)
VALUES
  ('Rayce', '⚡', 'The intelligence hub connecting every Rayida product. Think of it as the brain behind the ecosystem.', 'coming_soon', NULL, 1, true),
  ('Raydemy', '🎓', 'Learn digital skills that actually pay. Courses, certifications, and community learning — all in one place.', 'coming_soon', NULL, 2, true),
  ('Ranect', '🔗', 'Connect with professionals, discover opportunities, and grow your network. The future of professional networking.', 'coming_soon', NULL, 3, true),
  ('Payida', '💳', 'Digital payments, wallets, and blockchain — built for the future of finance. Secure, fast, and smart.', 'coming_soon', NULL, 4, true),
  ('RayTexta', '🎤', 'Speech-to-text made simple. Transcribe, create, and boost your productivity with voice.', 'coming_soon', NULL, 5, true);
