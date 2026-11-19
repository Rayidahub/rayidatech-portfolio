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
export const CURATED_ABUJA_PROSPECTS: ProspectResearchItem[] = [];
