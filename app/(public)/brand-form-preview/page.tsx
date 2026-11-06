'use client';

import { useState } from 'react';
import BrandIdentityFields from '@/components/admin/BrandIdentityFields';
import ProjectTypeSelect from '@/components/admin/ProjectTypeSelect';
import ServiceCategorySelect from '@/components/admin/ServiceCategorySelect';
import type { BrandIdentityCaseStudy, ProjectType } from '@/types/project';

const initialLuxeData: BrandIdentityCaseStudy = {
  case_study_type: 'Brand Identity',
  brand_introduction:
    'Luxe by Sey is an ultra-premium hair and beauty boutique dedicated to bespoke styling, refined aesthetics, and transforming personal care into an elevated ritual of confidence and empowerment.',
  brand_positioning:
    'A high-end sanctuary positioned at the intersection of artisanal hairstyling and modern minimalist luxury.',
  industry: 'Hair & Beauty',
  target_audience:
    'Discerning modern women aged 24–45 seeking bespoke hair treatments, executive styling, and indulgent beauty experiences.',
  brand_personality: 'Premium, Elegant, Modern, Feminine, Confident',
  brand_objectives:
    'Establish an unmistakable high-luxury visual identity across digital touchpoints, branded salon collateral, bespoke packaging, and urban outdoor presence.',
  brand_story:
    'Founded on the ethos "Where Luxury Meets Beauty", Luxe by Sey was created to eliminate the transactional nature of contemporary salons, replacing it with an intimate, luxury experience.',
  overview_image: '/img/portfolio/luxe-by-sey-hero.png',

  brand_challenge:
    'The salon market is crowded with generic, overly ornamental beauty branding that lacks consistency across physical packaging, apparel, and fleet logistics.',
  creative_direction:
    'A bold synthesis of regal violet tones, stark high-contrast typography, and spacious editorial layout that commands attention without unnecessary embellishment.',
  brand_attributes: 'Opulent, Minimalist, Refined, Confident, Modern',

  primary_logo: '/img/portfolio/luxe-by-sey-logo.png',
  logo_symbol: '/img/portfolio/luxe-by-sey-symbol.png',
  secondary_logo: '/img/portfolio/luxe-by-sey-secondary.png',
  horizontal_logo: '/img/portfolio/luxe-by-sey-horizontal.png',
  monochrome_logo: '/img/portfolio/luxe-by-sey-mono.png',
  logo_concept_description:
    'A clean, architectural serif wordmark harmonized with an interconnected monogram emblem that evokes beauty curves and structural elegance.',

  color_palette: [
    {
      id: 'c1',
      name: 'Regal Violet',
      hex: '#8000FF',
      rgb: 'rgb(128, 0, 255)',
      classification: 'Primary',
      usage: 'Primary signature brandmark, hero highlights, packaging accent foil',
    },
    {
      id: 'c2',
      name: 'Electric Cyan',
      hex: '#00D1FF',
      rgb: 'rgb(0, 209, 255)',
      classification: 'Secondary',
      usage: 'Interactive accents, social media motion markers, digital UI points',
    },
    {
      id: 'c3',
      name: 'Soft Lavender',
      hex: '#CCCCFF',
      rgb: 'rgb(204, 204, 255)',
      classification: 'Accent',
      usage: 'Subtle text accents, delicate divider lines, packaging interior tissue',
    },
    {
      id: 'c4',
      name: 'Midnight Ink',
      hex: '#1A1A2E',
      rgb: 'rgb(26, 26, 46)',
      classification: 'Background',
      usage: 'Core brand surface, luxury shopping bags, exterior signage base',
    },
    {
      id: 'c5',
      name: 'Pure Paper',
      hex: '#F2F2F2',
      rgb: 'rgb(242, 242, 242)',
      classification: 'Neutral',
      usage: 'Primary body typography, foil stamping, high-contrast reverse logos',
    },
  ],

  typography_system: [
    {
      id: 't1',
      font_name: 'Geist Display',
      font_role: 'Display',
      weight: 'Bold / 700',
      usage: 'Grand headings, luxury editorial billboards, hero brandmark titles',
    },
    {
      id: 't2',
      font_name: 'Inter',
      font_role: 'Body',
      weight: 'Regular / 400',
      usage: 'Body copy, packaging ingredient descriptions, collateral fine print',
    },
    {
      id: 't3',
      font_name: 'Geist Mono',
      font_role: 'Monospace',
      weight: 'Medium / 500',
      usage: 'Timestamps, batch codes, luxury serial numbers, metadata tags',
    },
  ],

  graphic_elements_description:
    'Minimalist geometric framing with micro-borders, generous negative space, and sleek glass reflections that convey clinical perfection and lavish comfort.',
  photography_direction:
    'High-contrast editorial photography with moody chiaroscuro lighting, celebrating natural hair textures, silky shine, and confident portraiture.',

  brand_applications: [
    {
      id: 'app1',
      title: 'Luxury Hair Treatment Serum Jars & Boxes',
      category: 'Product Packaging',
      description: 'Frosted matte violet glass jars with foil stamped typography and soft-touch outer carton.',
      primary_image: '/img/portfolio/luxe-packaging.png',
      layout_preference: 'hero',
      display_order: 1,
      is_visible: true,
    },
    {
      id: 'app2',
      title: 'Embossed Salon Shopping Bags',
      category: 'Shopping Bags',
      description: 'Heavyweight Midnight Ink craft paper bags with woven violet grosgrain ribbon handles.',
      primary_image: '/img/portfolio/luxe-bags.png',
      layout_preference: 'split',
      display_order: 2,
      is_visible: true,
    },
    {
      id: 'app3',
      title: 'Staff Uniforms & Branded Polos',
      category: 'Merchandise',
      description: 'Monochrome black piqué cotton polo shirts with embroidered purple micro-monogram on chest.',
      primary_image: '/img/portfolio/luxe-polo.png',
      layout_preference: 'split',
      display_order: 3,
      is_visible: true,
    },
    {
      id: 'app4',
      title: 'Fleet Delivery Motorcycle Livery',
      category: 'Transportation',
      description: 'High-gloss dual-tone violet and midnight purple motorcycle wrap for rapid VIP hair deliveries.',
      primary_image: '/img/portfolio/luxe-motorcycle.png',
      layout_preference: 'wide',
      display_order: 4,
      is_visible: true,
    },
    {
      id: 'app5',
      title: 'Metropolitan Outdoor Billboard Signage',
      category: 'Outdoor Advertising',
      description: 'Large-scale city billboard featuring high-contrast editorial photography and the brand tagline.',
      primary_image: '/img/portfolio/luxe-billboard.png',
      layout_preference: 'centered',
      display_order: 5,
      is_visible: true,
    },
    {
      id: 'app6',
      title: 'Social Media Launch & Promo Grid',
      category: 'Social Media',
      description: 'Cohesive Instagram carousel stories and reel cover templates for seasonal promotions.',
      primary_image: '/img/portfolio/luxe-social.png',
      layout_preference: 'editorial',
      display_order: 6,
      is_visible: true,
    },
  ],

  brand_gallery: [
    {
      id: 'g1',
      image_url: '/img/portfolio/luxe-gallery-1.png',
      caption: 'Gold Foil Stamped Appointment Cards & Stationery',
      display_order: 1,
    },
    {
      id: 'g2',
      image_url: '/img/portfolio/luxe-gallery-2.png',
      caption: 'Interior Salon Acrylic Signage & Backlit Brandmark',
      display_order: 2,
    },
    {
      id: 'g3',
      image_url: '/img/portfolio/luxe-gallery-3.png',
      caption: 'VIP Membership Loyalty Card in Matte Black Metal',
      display_order: 3,
    },
  ],
  gallery_layout: 'Editorial Grid',

  design_outcome:
    'A unified visual identity system that positions Luxe by Sey as the preeminent luxury hair destination, driving immediate prestige and brand recognition across physical and digital mediums.',
  project_impact:
    'Achieved an immediate 45% increase in VIP package bookings within the first 60 days following the identity rollout and received widespread acclaim across beauty industry publications.',
  personal_reflection:
    'Designing Luxe by Sey demanded finding the sweet spot between delicate femininity and uncompromising structural luxury. The resulting identity feels both timeless and aggressively modern.',
  closing_image: '/img/portfolio/luxe-closing.png',
};

export default function BrandFormPreviewPage() {
  const [projectType, setProjectType] = useState<ProjectType>('Brand Identity');
  const [category, setCategory] = useState<string>('Brand Identity');
  const [data, setData] = useState<BrandIdentityCaseStudy>(initialLuxeData);

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-[#f2f2f2] p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-white/10 pb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Brand Identity Case Study Architecture
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Structure Preview
              </span>
            </div>
            <h1 className="text-3xl font-bold mt-2">Brand Identity Case Study Form</h1>
            <p className="text-sm text-gray-400 mt-1">
              Live preview of the 9-section form with Luxe by Sey sample data
            </p>
          </div>
        </header>

        {/* Project Type & Category Selectors */}
        <div className="p-5 rounded-2xl bg-[#16162a] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Project Type Selector
            </label>
            <ProjectTypeSelect
              value={projectType}
              onChange={(t) => setProjectType(t)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Service Category Selector
            </label>
            <ServiceCategorySelect
              value={category}
              onChange={(c) => setCategory(c)}
            />
          </div>
        </div>

        {/* The 9 Brand Identity Sections */}
        <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6 sm:p-8">
          <BrandIdentityFields value={data} onChange={(next) => setData(next)} />
        </div>
      </div>
    </main>
  );
}
