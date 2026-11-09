import { describe, it, expect } from 'vitest';
import {
  normalizeProduct,
  formatProductStatus,
  formatProductCategory,
  getProductSlug,
  getProductBadge,
  filterProducts,
  calculateProductStats,
  generateProductsJsonLd,
} from '@/lib/products';
import { defaultEcosystemProducts } from '@/lib/data/products';
import type { EcosystemProduct } from '@/types/ecosystem-product';

describe('Products Architecture & Helpers', () => {
  describe('normalizeProduct', () => {
    it('returns default product fallback when input is empty or null', () => {
      const p = normalizeProduct(null);
      expect(p.name).toBe(defaultEcosystemProducts[0].name);
      expect(p.emoji).toBe(defaultEcosystemProducts[0].emoji);
      expect(p.is_active).toBe(true);
    });

    it('preserves existing fields and generates slug and category if missing', () => {
      const p = normalizeProduct({
        id: 'test-123',
        name: 'Payida',
        emoji: '💳',
        description: 'Payment system',
        status: 'live',
      });

      expect(p.id).toBe('test-123');
      expect(p.name).toBe('Payida');
      expect(p.slug).toBe('payida');
      expect(p.category).toBe('Fintech & Web3');
      expect(p.status).toBe('live');
      expect(p.is_active).toBe(true);
    });

    it('extracts metadata fields when columns are stored in JSONB', () => {
      const p = normalizeProduct({
        id: 'custom-id',
        name: 'Custom AI Tool',
        metadata: {
          tagline: 'Supercharge your prompt workflows',
          slug: 'custom-ai-tool',
          category: 'AI & Intelligence',
          features: ['Feature 1', 'Feature 2'],
          image: 'https://example.com/mockup.png',
        },
      });

      expect(p.tagline).toBe('Supercharge your prompt workflows');
      expect(p.slug).toBe('custom-ai-tool');
      expect(p.category).toBe('AI & Intelligence');
      expect(p.features).toEqual(['Feature 1', 'Feature 2']);
      expect(p.image).toBe('https://example.com/mockup.png');
    });

    it('parses comma-separated string features into an array', () => {
      const p = normalizeProduct({
        name: 'Simple App',
        features: 'Fast, Secure, Scalable' as any,
      });

      expect(p.features).toEqual(['Fast', 'Secure', 'Scalable']);
    });
  });

  describe('formatProductStatus', () => {
    it('returns emerald badge styling for live status', () => {
      const s = formatProductStatus('live');
      expect(s.label).toBe('Live');
      expect(s.text).toContain('emerald');
    });

    it('returns cyan badge styling for beta status', () => {
      const s = formatProductStatus('beta');
      expect(s.label).toBe('Beta');
      expect(s.text).toBe('text-secondary');
    });

    it('returns amber badge styling for coming soon status', () => {
      const s = formatProductStatus('coming_soon');
      expect(s.label).toBe('Coming Soon');
      expect(s.text).toContain('amber');
    });
  });

  describe('formatProductCategory', () => {
    it('preserves explicit category if given', () => {
      expect(formatProductCategory('Fintech & Web3', 'Payida')).toBe('Fintech & Web3');
    });

    it('infers category from name if missing or "All"', () => {
      expect(formatProductCategory('All', 'RayTexta')).toBe('Voice & Productivity');
      expect(formatProductCategory('', 'Raydemy')).toBe('EdTech & Learning');
    });
  });

  describe('getProductSlug', () => {
    it('uses existing slug when present', () => {
      expect(getProductSlug({ slug: 'my-custom-slug', name: 'Product' })).toBe('my-custom-slug');
    });

    it('derives slug from name when missing', () => {
      expect(getProductSlug({ name: 'Rayida AI Hub & Suite' })).toBe('rayida-ai-hub-suite');
    });
  });

  describe('getProductBadge', () => {
    it('returns custom badge if present', () => {
      const p = { ...defaultEcosystemProducts[0], badge: 'Core Flagship' };
      expect(getProductBadge(p)).toBe('Core Flagship');
    });

    it('returns Available Now for live products', () => {
      const p = { ...defaultEcosystemProducts[0], badge: undefined, status: 'live' as const };
      expect(getProductBadge(p)).toBe('Available Now');
    });
  });

  describe('filterProducts', () => {
    const products: EcosystemProduct[] = [
      {
        ...defaultEcosystemProducts[0],
        id: '1',
        name: 'Rayce',
        category: 'AI & Intelligence',
        status: 'live',
        is_active: true,
      },
      {
        ...defaultEcosystemProducts[1],
        id: '2',
        name: 'Raydemy',
        category: 'EdTech & Learning',
        status: 'coming_soon',
        is_active: true,
      },
      {
        ...defaultEcosystemProducts[2],
        id: '3',
        name: 'Ranect',
        category: 'Networking & Community',
        status: 'coming_soon',
        is_active: false,
      },
    ];

    it('filters out inactive products by default', () => {
      const filtered = filterProducts(products);
      expect(filtered.length).toBe(2);
      expect(filtered.find((p) => p.name === 'Ranect')).toBeUndefined();
    });

    it('includes inactive products when requested', () => {
      const filtered = filterProducts(products, { includeInactive: true });
      expect(filtered.length).toBe(3);
    });

    it('filters by status correctly', () => {
      const liveOnly = filterProducts(products, { status: 'live' });
      expect(liveOnly.length).toBe(1);
      expect(liveOnly[0].name).toBe('Rayce');
    });

    it('filters by search query matching name or description', () => {
      const matched = filterProducts(products, { query: 'Raydemy' });
      expect(matched.length).toBe(1);
      expect(matched[0].name).toBe('Raydemy');
    });

    it('filters by search query matching features or tagline', () => {
      const matched = filterProducts(products, { query: 'orchestration' });
      expect(matched.length).toBe(1);
      expect(matched[0].name).toBe('Rayce');
    });

    it('handles empty results gracefully when query has no matches', () => {
      const matched = filterProducts(products, { query: 'NonExistentProductXYZ' });
      expect(matched.length).toBe(0);
    });
  });

  describe('calculateProductStats', () => {
    it('aggregates live, coming soon, active, and total counts accurately', () => {
      const stats = calculateProductStats(defaultEcosystemProducts);
      expect(stats.total).toBe(5);
      expect(stats.comingSoon).toBe(5);
      expect(stats.active).toBe(5);
      expect(stats.live).toBe(0);
    });
  });

  describe('defaultEcosystemProducts Catalog Integrity', () => {
    it('contains all 5 canonical Rayida Tech ecosystem products', () => {
      const names = defaultEcosystemProducts.map((p) => p.name);
      expect(names).toContain('Rayce');
      expect(names).toContain('Raydemy');
      expect(names).toContain('Ranect');
      expect(names).toContain('Payida');
      expect(names).toContain('RayTexta');
    });

    it('ensures each canonical product has valid slug, category, emoji, and features', () => {
      for (const p of defaultEcosystemProducts) {
        expect(p.slug).toBeTruthy();
        expect(p.category).toBeTruthy();
        expect(p.emoji).toBeTruthy();
        expect(Array.isArray(p.features)).toBe(true);
        expect(p.features!.length).toBeGreaterThan(0);
        expect(p.description.length).toBeGreaterThan(20);
      }
    });
  });

  describe('generateProductsJsonLd', () => {
    it('generates valid Schema.org ItemList with SoftwareApplication elements', () => {
      const jsonLd = generateProductsJsonLd(defaultEcosystemProducts);
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('ItemList');
      expect(Array.isArray(jsonLd.itemListElement)).toBe(true);
      expect(jsonLd.itemListElement.length).toBe(defaultEcosystemProducts.length);

      const firstItem = jsonLd.itemListElement[0].item;
      expect(firstItem['@type']).toBe('SoftwareApplication');
      expect(firstItem.name).toBe(defaultEcosystemProducts[0].name);
      expect(firstItem.applicationCategory).toBe(defaultEcosystemProducts[0].category);
      expect(firstItem.offers.availability).toBe('https://schema.org/PreOrder');
    });

    it('sets InStock offer availability for live products', () => {
      const liveProduct = { ...defaultEcosystemProducts[0], status: 'live' as const };
      const jsonLd = generateProductsJsonLd([liveProduct]);
      expect(jsonLd.itemListElement[0].item.offers.availability).toBe('https://schema.org/InStock');
    });
  });
});
