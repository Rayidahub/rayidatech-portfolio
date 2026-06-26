-- Migration 010: Add management columns to testimonials and seed sample data

-- Add ordering and visibility controls if they don't already exist.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
  END IF;
END
$$;

-- Seed sample testimonials (skipped if testimonials already exist).
INSERT INTO testimonials (name, role, company, testimonial, is_active, sort_order)
SELECT * FROM (VALUES
  ('Adeola Martins', 'Founder', 'ProptVerse', 'Working with Rayida Tech was a game-changer for our brand. The design quality and attention to detail exceeded our expectations.', true, 1),
  ('Chidi Nwosu', 'CEO', 'Vaulta', 'They transformed our digital presence completely. Professional, creative, and results-driven every step of the way.', true, 2),
  ('Fatima Bello', 'Product Manager', 'FlavorEase', 'The team delivered beyond what we asked for. Our users love the new interface and we have seen a significant improvement in engagement.', true, 3)
) AS seed(name, role, company, testimonial, is_active, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
