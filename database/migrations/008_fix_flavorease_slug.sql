-- Fix the FlavorEase project slug which was stored with spaces instead of hyphens.
-- This caused the project detail page to 404 because Next.js dynamic routes
-- expect URL-safe slugs. The application now also normalizes slugs as a fallback,
-- but the stored value should remain canonical.
UPDATE projects
SET slug = 'flavorease-mobile-food-discovery-app'
WHERE slug = 'flavorease Mobile Food Discovery App';
