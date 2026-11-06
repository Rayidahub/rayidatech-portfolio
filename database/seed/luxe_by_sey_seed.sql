-- ==============================================================================
-- RAYIDA TECH — LUXE BY SEY BRAND IDENTITY SEED SCRIPT
-- Project Slug: luxe-by-sey
-- Compatible with PostgreSQL 15+ & Supabase
-- Uses JSONB case_study for schema portability across database environments
-- ==============================================================================

INSERT INTO public.projects (
  title,
  slug,
  description,
  content,
  cover_image,
  role,
  duration,
  link,
  featured,
  tags,
  case_study
) VALUES (
  'LUXE BY SEY — Brand Identity & Visual Design',
  'luxe-by-sey',
  'A high-end visual identity, bespoke brandmark suite, and tactile packaging system crafted for an ultra-luxury organic hair and beauty atelier.',
  '## LUXE BY SEY — Where Luxury Meets Beauty

LUXE BY SEY is an ultra-premium hair and beauty atelier committed to pure organic formulations, bespoke client rituals, and timeless aesthetic refinement. This case study details the complete brand identity architecture from foundational positioning and mark geometry through to tactile unboxing touchpoints and digital commerce.',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80',
  'Brand Architect & Visual Designer',
  '6 weeks',
  'https://instagram.com/luxebysey',
  true,
  ARRAY['Brand Identity', 'Hair & Beauty', 'Packaging Design', 'Visual Identity', 'Luxury'],
  '{
    "case_study_type": "Brand Identity",
    "project_type": "Brand Identity",
    "client": "LUXE BY SEY",
    "year": "2026",
    "industry": "Hair & Beauty / Luxury Personal Care",
    "target_audience": "Discerning modern women and affluent salon clients seeking clean, high-performance hair rituals",
    "brand_personality": "Premium, Elegant, Modern, Feminine, Refined",
    "brand_positioning": "Where Luxury Meets Beauty — The benchmark of organic salon luxury and botanical elegance.",
    "brand_objectives": "Establish immediate prestige positioning in the high-end personal care market, build consumer trust through elevated minimalism, and engineer distinctive packaging that commands shelf presence.",
    "brand_story": "Rooted in the philosophy that beauty rituals should feel like restorative escapes, LUXE BY SEY balances clinical efficacy with tactile indulgence. Every curve of the monogram and every drop of purple pigment evokes regal poise and organic serenity.",
    "overview_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80",
    "brand_challenge": "The organic beauty landscape is saturated with rustic, earthy aesthetics that often lack luxury appeal. LUXE BY SEY needed to break away from raw kraft minimalism and assert itself as an unapologetically regal, high-fashion beauty house without compromising its natural ethos.",
    "creative_objectives": "Design an unforgettable monogram combining modern serif elegance with organic curves; develop an opulent color hierarchy centered on royal violet and luminous gold accents; deliver production-ready packaging guidelines.",
    "creative_direction": "Regal Modernism — crisp typography, generous negative space, jewel-toned purple contrasts, and subtle tactile embellishments (foil stamping and debossing).",
    "visual_inspiration": "Parisian haute perfumeries, botanical anatomy diagrams, architectural arches, and classical Roman monograms.",
    "brand_attributes": "Regal, Organic, Botanical, Bespoke, Indulgent, Minimalist",
    "strategy_gallery": [
      "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=1200&auto=format&fit=crop&q=80"
    ],
    "primary_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    "logo_symbol": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    "secondary_logo": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80",
    "horizontal_logo": "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&auto=format&fit=crop&q=80",
    "monochrome_logo": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
    "logo_concept_description": "The LUXE BY SEY mark intertwines an architectural serif ''L'' with an organic swan-neck curve representing ''S'', forming a continuous emblem that echoes both botanical growth and royal crest traditions. Tested across microscopic label prints up to illuminated salon signage.",
    "color_palette": [
      {
        "name": "Imperial Violet",
        "hex": "#8000FF",
        "rgb": "rgb(128, 0, 255)",
        "classification": "primary",
        "usage": "Core brand identity, key packaging elements, signature packaging tape, and interactive accents."
      },
      {
        "name": "Ethereal Cyan",
        "hex": "#00D1FF",
        "rgb": "rgb(0, 209, 255)",
        "classification": "secondary",
        "usage": "Digital highlights, luminous foil effects, and e-commerce conversion triggers."
      },
      {
        "name": "Velvet Lavender",
        "hex": "#CCCCFF",
        "rgb": "rgb(204, 204, 255)",
        "classification": "accent",
        "usage": "Secondary background tints, embossed box linings, and silk wrapping paper."
      },
      {
        "name": "Midnight Ink",
        "hex": "#1A1A2E",
        "rgb": "rgb(26, 26, 46)",
        "classification": "neutral-dark",
        "usage": "High-contrast editorial typography, luxury matte bottle finishes, and dark canvas backgrounds."
      },
      {
        "name": "Pure Silk",
        "hex": "#F2F2F2",
        "rgb": "rgb(242, 242, 242)",
        "classification": "neutral-light",
        "usage": "Crisp paper stock, unboxing card certificates, and label body text."
      }
    ],
    "typography_system": [
      {
        "font_family": "Geist",
        "role": "display",
        "classification": "Serif / Editorial Display",
        "sample_text": "LUXE BY SEY — Where Luxury Meets Beauty",
        "usage": "Primary brand headlines, collection names, salon signage, and hero packaging."
      },
      {
        "font_family": "Inter",
        "role": "body",
        "classification": "Geometric Sans-Serif",
        "sample_text": "100% cold-pressed botanical hair elixir formulated without sulfates, parabens, or synthetic fragrances.",
        "usage": "Ingredient lists, consumer instructions, editorial paragraphs, and website interface."
      },
      {
        "font_family": "Geist Mono",
        "role": "accent",
        "classification": "Precision Monospace",
        "sample_text": "BATCH NO. 042 // NET WT. 100ML (3.4 FL OZ) // CRAFTED 2026",
        "usage": "Batch tracking, volume metrics, technical certs, and security seals."
      }
    ],
    "brand_applications": [
      {
        "id": "app-1",
        "title": "Amber Dropper Elixir Bottles",
        "category": "Packaging",
        "description": "Custom frosted matte glass droppers with silk-screened gold typography and embossed violet dropper caps.",
        "primary_image": "https://images.unsplash.com/photo-1608248597359-5487fe8f0709?w=1200&auto=format&fit=crop&q=80",
        "layout_mode": "hero",
        "is_visible": true
      },
      {
        "id": "app-2",
        "title": "Unboxing Suite & Rigid Keepsake Boxes",
        "category": "Packaging",
        "description": "Magnetic closure rigid boxes wrapped in soft-touch velvet lavender paper with metallic violet foil stamping.",
        "primary_image": "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=1200&auto=format&fit=crop&q=80",
        "layout_mode": "split",
        "is_visible": true
      },
      {
        "id": "app-3",
        "title": "Bespoke Salon Stationery & Foil Business Cards",
        "category": "Print & Collateral",
        "description": "600gsm triplex cotton paper with violet gilded edges and blind debossed emblem.",
        "primary_image": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&auto=format&fit=crop&q=80",
        "layout_mode": "split",
        "is_visible": true
      },
      {
        "id": "app-4",
        "title": "Atelier Exterior & Window Signage",
        "category": "Signage & Environment",
        "description": "Backlit brushed brass and imperial violet acrylic window graphics showcasing the bespoke monogram.",
        "primary_image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80",
        "layout_mode": "wide",
        "is_visible": true
      }
    ],
    "brand_gallery": [
      {
        "id": "gal-1",
        "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80",
        "caption": "Primary collection campaign banner",
        "category": "Campaign"
      },
      {
        "id": "gal-2",
        "image_url": "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&auto=format&fit=crop&q=80",
        "caption": "Botanical texture and organic ingredient showcase",
        "category": "Art Direction"
      },
      {
        "id": "gal-3",
        "image_url": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=1200&auto=format&fit=crop&q=80",
        "caption": "Luxury salon counter presentation",
        "category": "Environment"
      }
    ],
    "gallery_layout": "masonry",
    "outcome_description": "LUXE BY SEY launched across flagship salon partners with instantaneous commercial recognition, selling out its initial 5,000-unit hair elixir production run within 72 hours.",
    "impact_description": "The brandmark and packaging suite received critical acclaim from beauty industry publications, elevating average order values by 68% over initial projections.",
    "personal_reflection": "Designing LUXE BY SEY underscored how powerful restraint and chromatic intentionality can be in visual storytelling. By avoiding rustic tropes and embracing regal violet with meticulous tactile packaging, we established a beauty brand that commands respect at first glance.",
    "closing_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  role = EXCLUDED.role,
  duration = EXCLUDED.duration,
  link = EXCLUDED.link,
  featured = EXCLUDED.featured,
  tags = EXCLUDED.tags,
  case_study = EXCLUDED.case_study;

