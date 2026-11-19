import { describe, it, expect } from 'vitest';
import {
  CURATED_ABUJA_PROSPECTS,
  RESEARCH_CATEGORIES,
  ABUJA_AREAS,
  filterProspects,
  searchAndEnrichProspects,
} from '@/lib/email/prospect-research';

describe('Prospect Research & Lead Discovery Engine', () => {
  describe('Curated Base Dataset & Coverage', () => {
    it('contains at least 20 verified prospects in Abuja', () => {
      expect(CURATED_ABUJA_PROSPECTS.length).toBeGreaterThanOrEqual(20);
    });

    it('contains all user-specified businesses with public emails', () => {
      const names = CURATED_ABUJA_PROSPECTS.map((p) => p.business_name);
      expect(names).toContain('1420 Events');
      expect(names).toContain('Dventplanet');
      expect(names).toContain('Gemelos Treats');
      expect(names).toContain('Pastry Town');
      expect(names).toContain('Hashimas Pan Catering Services');
      expect(names).toContain('Jireh Creatives');
      expect(names).toContain('Party Chops & Events');
    });

    it('ensures every prospect has a non-empty name, category, area, and website status', () => {
      for (const p of CURATED_ABUJA_PROSPECTS) {
        expect(p.business_name).toBeTruthy();
        expect(p.business_category).toBeTruthy();
        expect(p.area).toBeTruthy();
        expect(p.location).toContain('Abuja');
        expect(p.website_status).toMatch(
          /No Website Found|Socials Only|Outdated \/ Needs Redesign|Active Website/
        );
        expect(p.opportunity_score).toMatch(/High|Medium|Low/);
        expect(p.verification_note).toBeTruthy();
      }
    });

    it('ensures 1420 Events has correct public email and phone from directory', () => {
      const events1420 = CURATED_ABUJA_PROSPECTS.find((p) => p.business_name === '1420 Events');
      expect(events1420).toBeDefined();
      expect(events1420?.email).toBe('1420eventsinfo@gmail.com');
      expect(events1420?.phone).toBe('+234 810 390 5299');
      expect(events1420?.area).toBe('Wuse 2');
      expect(events1420?.website_status).toBe('No Website Found');
    });

    it('ensures high email coverage across the dataset', () => {
      const withEmails = CURATED_ABUJA_PROSPECTS.filter((p) => p.email && p.email.includes('@'));
      const coverage = (withEmails.length / CURATED_ABUJA_PROSPECTS.length) * 100;
      expect(coverage).toBeGreaterThanOrEqual(95);
    });
  });

  describe('Categories & Areas Constants', () => {
    it('defines standard research categories including event, bakery, catering, interiors', () => {
      expect(RESEARCH_CATEGORIES).toContain('All');
      expect(RESEARCH_CATEGORIES).toContain('Event Planning & Decor');
      expect(RESEARCH_CATEGORIES).toContain('Bakery & Confectionery');
      expect(RESEARCH_CATEGORIES).toContain('Catering & Food Services');
      expect(RESEARCH_CATEGORIES).toContain('Interior Design & Furnishing');
      expect(RESEARCH_CATEGORIES).toContain('Hair, Beauty & Wellness');
    });

    it('defines primary Abuja business districts', () => {
      expect(ABUJA_AREAS).toContain('All Areas');
      expect(ABUJA_AREAS).toContain('Wuse 2');
      expect(ABUJA_AREAS).toContain('Maitama');
      expect(ABUJA_AREAS).toContain('Garki');
      expect(ABUJA_AREAS).toContain('Gwarinpa');
      expect(ABUJA_AREAS).toContain('Jabi');
      expect(ABUJA_AREAS).toContain('Utako');
    });
  });

  describe('filterProspects logic', () => {
    it('returns all prospects when default filters are passed', () => {
      const filtered = filterProspects(CURATED_ABUJA_PROSPECTS, {
        category: 'All',
        area: 'All Areas',
        website_status: 'All',
      });
      expect(filtered.length).toBe(CURATED_ABUJA_PROSPECTS.length);
    });

    it('filters accurately by category', () => {
      const filtered = filterProspects(CURATED_ABUJA_PROSPECTS, {
        category: 'Event Planning & Decor',
      });
      expect(filtered.length).toBeGreaterThan(0);
      for (const p of filtered) {
        expect(p.business_category).toBe('Event Planning & Decor');
      }
    });

    it('filters accurately by area in Abuja', () => {
      const filtered = filterProspects(CURATED_ABUJA_PROSPECTS, {
        area: 'Wuse 2',
      });
      expect(filtered.length).toBeGreaterThan(0);
      for (const p of filtered) {
        expect(p.area).toBe('Wuse 2');
      }
    });

    it('filters accurately by website opportunity status (No Website Found)', () => {
      const filtered = filterProspects(CURATED_ABUJA_PROSPECTS, {
        website_status: 'No Website Found',
      });
      expect(filtered.length).toBeGreaterThan(0);
      for (const p of filtered) {
        expect(p.website_status).toBe('No Website Found');
      }
    });

    it('filters accurately by hasEmailOnly', () => {
      const filtered = filterProspects(CURATED_ABUJA_PROSPECTS, {
        hasEmailOnly: true,
      });
      for (const p of filtered) {
        expect(p.email).toBeTruthy();
      }
    });

    it('filters accurately by text search query', () => {
      const filtered = filterProspects(CURATED_ABUJA_PROSPECTS, {
        search: 'Gemelos',
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].business_name).toBe('Gemelos Treats');
    });
  });

  describe('searchAndEnrichProspects dynamic discovery engine', () => {
    it('returns empty array if query is whitespace', () => {
      const results = searchAndEnrichProspects('   ');
      expect(results).toEqual([]);
    });

    it('generates structured high-opportunity leads for a custom query', () => {
      const results = searchAndEnrichProspects('Lekki Luxury Spa', 'Hair, Beauty & Wellness', 'Maitama');
      expect(results).toHaveLength(3);
      expect(results[0].business_name).toBe('Lekki Luxury Spa');
      expect(results[0].business_category).toBe('Hair, Beauty & Wellness');
      expect(results[0].area).toBe('Maitama');
      expect(results[0].email).toBeTruthy();
      expect(results[0].email).toContain('@');
      expect(results[0].opportunity_score).toBe('High');
      expect(results[0].recommended_pitch).toBeTruthy();
    });

  });
});
