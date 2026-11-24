import { describe, it, expect } from 'vitest';
import {
  DIGITAL_UPGRADE_PACKAGES,
  CARE_RETAINER_PLANS,
} from '@/lib/data/pricing-packages';
import { CRESTFIELD_ACADEMY_PROJECT, DEMO_PROJECTS } from '@/lib/data/demo-projects';

describe('Monetization Engine & Productized Packages Architecture', () => {
  describe('Digital Upgrade Packages', () => {
    it('defines exactly three structured productized tiers', () => {
      expect(DIGITAL_UPGRADE_PACKAGES).toHaveLength(3);
      const ids = DIGITAL_UPGRADE_PACKAGES.map((p) => p.id);
      expect(ids).toEqual(['starter', 'growth', 'transformation']);
    });

    it('configures Starter at ₦100,000 with rapid 3-5 days delivery', () => {
      const starter = DIGITAL_UPGRADE_PACKAGES.find((p) => p.id === 'starter');
      expect(starter).toBeDefined();
      expect(starter?.price).toBe(100000);
      expect(starter?.formattedPrice).toBe('₦100,000');
      expect(starter?.deliveryTime).toContain('3–5');
      expect(starter?.deliverables.length).toBeGreaterThanOrEqual(5);
    });

    it('configures Business Growth System as the core flagship offer at ₦200,000', () => {
      const growth = DIGITAL_UPGRADE_PACKAGES.find((p) => p.id === 'growth');
      expect(growth).toBeDefined();
      expect(growth?.isPopular).toBe(true);
      expect(growth?.price).toBe(200000);
      expect(growth?.formattedPrice).toBe('₦200,000');
      expect(growth?.deliveryTime).toContain('7–10');
      expect(growth?.deliverables.some((d) => d.includes('WhatsApp'))).toBe(true);
    });

    it('configures Digital Transformation as premium enterprise at ₦350,000+', () => {
      const transformation = DIGITAL_UPGRADE_PACKAGES.find((p) => p.id === 'transformation');
      expect(transformation).toBeDefined();
      expect(transformation?.price).toBe(350000);
      expect(transformation?.formattedPrice).toBe('₦350,000+');
    });
  });

  describe('Website Care Retainer Plans (Monthly Recurring Revenue)', () => {
    it('defines three recurring care tiers: Essential, Business, and Growth', () => {
      expect(CARE_RETAINER_PLANS).toHaveLength(3);
      const ids = CARE_RETAINER_PLANS.map((c) => c.id);
      expect(ids).toEqual(['essential', 'business', 'growth-care']);
    });

    it('sets correct monthly prices: ₦15k, ₦35k, ₦75k', () => {
      const essential = CARE_RETAINER_PLANS.find((c) => c.id === 'essential');
      const business = CARE_RETAINER_PLANS.find((c) => c.id === 'business');
      const growth = CARE_RETAINER_PLANS.find((c) => c.id === 'growth-care');

      expect(essential?.monthlyPrice).toBe(15000);
      expect(business?.monthlyPrice).toBe(35000);
      expect(growth?.monthlyPrice).toBe(75000);
      expect(business?.isPopular).toBe(true);
    });
  });

  describe('Crestfield Academy Demo Showcase Project', () => {
    it('is registered in DEMO_PROJECTS dictionary with slug crestfield-academy', () => {
      expect(DEMO_PROJECTS['crestfield-academy']).toBeDefined();
      expect(CRESTFIELD_ACADEMY_PROJECT.slug).toBe('crestfield-academy');
    });

    it('is published and marked as featured', () => {
      expect(CRESTFIELD_ACADEMY_PROJECT.published).toBe(true);
      expect(CRESTFIELD_ACADEMY_PROJECT.status).toBe('published');
      expect(CRESTFIELD_ACADEMY_PROJECT.featured).toBe(true);
    });

    it('includes complete case study metadata and key features', () => {
      expect(CRESTFIELD_ACADEMY_PROJECT.case_study?.client).toBe('Crestfield Academy');
      expect(CRESTFIELD_ACADEMY_PROJECT.case_study?.key_features).toContain('3-Step Admission Pathway');
      expect(CRESTFIELD_ACADEMY_PROJECT.tags).toContain('WhatsApp Funnel');
    });
  });
});
