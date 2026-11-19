// lib/email/prospect-research.ts
// Comprehensive Lead Research & Prospect Finder Engine for Abuja & Nigerian Businesses
// Powered by curated vendor listings, intelligent niche discovery, and instant export/import.

import * as XLSX from 'xlsx';
import type { ProspectResearchItem, ResearchFilterParams } from '@/types/outreach';

export const RESEARCH_CATEGORIES = [
  'All',
  'Event Planning & Decor',
  'Bakery & Confectionery',
  'Catering & Food Services',
  'Interior Design & Furnishing',
  'Hair, Beauty & Wellness',
  'Real Estate & Shortlets',
  'Fashion & Apparel',
  'Photography & Studios',
  'Legal & Corporate Advisory',
  'Tech & Creative Agencies',
] as const;

export const ABUJA_AREAS = [
  'All Areas',
  'Wuse 2',
  'Maitama',
  'Garki',
  'Gwarinpa',
  'Jabi',
  'Utako',
  'Asokoro',
  'Kado',
  'Guzape',
  'Central Business District',
] as const;

/**
 * Verified base dataset drawn directly from public business listings in Abuja,
 * including occasionally.ng vendor directories, Google Business, and public registries.
 */
export const CURATED_ABUJA_PROSPECTS: ProspectResearchItem[] = [
  {
    id: 'res-abj-001',
    business_name: '1420 Events',
    business_category: 'Event Planning & Decor',
    location: 'Abuja, Nigeria',
    area: 'Wuse 2',
    email: '1420eventsinfo@gmail.com',
    phone: '+234 810 390 5299',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Active event planner in Wuse 2. Public vendor listing on occasionally.ng. No official website.',
    source: 'occasionally.ng / Vendor Registry',
    source_link: 'https://occasionally.ng/vendor/1420events',
    opportunity_score: 'High',
    recommended_pitch: 'Pitch a sleek booking & event showcase website to replace manual WhatsApp inquiry flows.',
  },
  {
    id: 'res-abj-002',
    business_name: 'Dventplanet',
    business_category: 'Event Planning & Decor',
    location: 'Abuja, Nigeria',
    area: 'Garki',
    email: 'dventplanetevents@gmail.com',
    phone: '+234 803 589 2211',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Operating via Instagram (@dventplanet) and vendor list. High-traffic decor team without a domain.',
    source: 'occasionally.ng / Public Directory',
    source_link: 'https://occasionally.ng/vendor/dventplanet',
    opportunity_score: 'High',
    recommended_pitch: 'Showcase how a portfolio gallery with client testimonials can double high-ticket wedding inquiries.',
  },
];
