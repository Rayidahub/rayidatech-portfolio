import { describe, it, expect } from 'vitest';
import {
  CURATED_ABUJA_PROSPECTS,
  RESEARCH_CATEGORIES,
  ABUJA_AREAS,
  filterProspects,
  searchAndEnrichProspects,
  verifyProspectLead,
  verifyProspectList,
  OUTREACH_PITCH_TEMPLATES,
  calculateProspectScore,
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

    it('handles "All" category and "All Areas" gracefully with sensible defaults', () => {
      const results = searchAndEnrichProspects('Apex Architecture', 'All', 'All Areas');
      expect(results[0].business_category).toBe('General Services');
      expect(results[0].area).toBe('Abuja');
    });

    it('attaches verification details to discovered prospects automatically', () => {
      const results = searchAndEnrichProspects('Abuja Fashion Hub', 'Fashion & Apparel', 'Wuse 2');
      for (const item of results) {
        expect(item.verification).toBeDefined();
        expect(item.verification?.is_verified).toBe(true);
        expect(item.verification?.email_valid).toBe(true);
        expect(item.verification?.confidence_score).toBeGreaterThanOrEqual(80);
      }
    });
  });

  describe('verifyProspectLead and verifyProspectList functions', () => {
    it('verifies prospect with valid email and phone', () => {
      const item = CURATED_ABUJA_PROSPECTS[0]; // 1420 Events
      const result = verifyProspectLead(item);
      expect(result.is_verified).toBe(true);
      expect(result.email_valid).toBe(true);
      expect(result.phone_valid).toBe(true);
      expect(result.status_badge).toBe('Verified Contact Data');
      expect(result.confidence_score).toBe(100);
    });

    it('handles invalid email gracefully and marks unverified', () => {
      const badLead = {
        ...CURATED_ABUJA_PROSPECTS[0],
        email: 'invalid-email-string',
      };
      const result = verifyProspectLead(badLead);
      expect(result.is_verified).toBe(false);
      expect(result.email_valid).toBe(false);
      expect(result.status_badge).toBe('Phone Verified');
    });

    it('enriches a prospect list using verifyProspectList', () => {
      const sample = CURATED_ABUJA_PROSPECTS.slice(0, 3);
      const enriched = verifyProspectList(sample);
      expect(enriched).toHaveLength(3);
      for (const p of enriched) {
        expect(p.verification).toBeDefined();
        expect(p.verification?.is_verified).toBe(true);
      }
    });
  });

  describe('Outreach Pitch Templates & Qualification Engine', () => {
    it('defines Version A, Version B, and Version C scripts with dynamic business names', () => {
      const bizName = 'Prestige Royal Academy';
      const pitchA = OUTREACH_PITCH_TEMPLATES.version_a.buildText(bizName);
      expect(pitchA).toContain('Prestige Royal Academy');
      expect(pitchA).toContain('Crestfield Academy');
      expect(pitchA).toContain('Would you be open to seeing it?');

      const pitchB = OUTREACH_PITCH_TEMPLATES.version_b.buildText(bizName);
      expect(pitchB).toContain('Prestige Royal Academy');
      expect(pitchB).toContain('/projects/crestfield-academy');

      const pitchC = OUTREACH_PITCH_TEMPLATES.version_c.buildText(bizName);
      expect(pitchC).toContain('₦200,000');
      expect(pitchC).toContain('Business Growth System');
      expect(pitchC).toContain('7–10 business days');
    });

    it('calculates prospect score accurately based on website and contact availability', () => {
      const noWebsiteLead = CURATED_ABUJA_PROSPECTS.find((p) => p.website_status === 'No Website Found')!;
      const scoreObj = calculateProspectScore(noWebsiteLead);
      expect(scoreObj.score).toBeGreaterThanOrEqual(3);
      expect(scoreObj.reasons.some((r) => r.includes('No website found'))).toBe(true);
      expect(scoreObj.priority).toMatch(/High|Medium/);
    });

    it('includes Schools & Academies in categories', () => {
      expect(RESEARCH_CATEGORIES).toContain('Schools & Academies');
    });
  });
});
