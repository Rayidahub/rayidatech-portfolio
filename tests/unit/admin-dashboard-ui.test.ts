import { describe, it, expect } from 'vitest';
import {
  DEALDECK_THEME_TOKENS,
  formatDealDeckNumber,
  formatNaira,
  calculateActualSalesPipeline,
  calculateBarHeight,
  getDealDeckPillClass,
  calculateRingCircumference,
  calculateRingOffset,
  DEFAULT_MONTHLY_HABITS,
  DEFAULT_GEOGRAPHIC_GROWTH,
} from '@/lib/dealdeck-dashboard';
import { getMinimalistAdminCategoryTitle } from '@/lib/admin-nav';

describe('DealDeck Modern White Admin Dashboard Architecture', () => {
  describe('Design Tokens & Palette Constants', () => {
    it('defines the canvas background as soft off-white', () => {
      expect(DEALDECK_THEME_TOKENS.canvasBackground).toBe('#f4f5f9');
    });

    it('defines card surfaces as pure crisp white', () => {
      expect(DEALDECK_THEME_TOKENS.cardBackground).toBe('#ffffff');
    });

    it('defines primary accent as DealDeck electric royal blue', () => {
      expect(DEALDECK_THEME_TOKENS.primaryBlue).toBe('#3b5bfa');
    });

    it('defines pastel status pill background colors', () => {
      expect(DEALDECK_THEME_TOKENS.pillGreenBg).toBe('#ecfdf5');
      expect(DEALDECK_THEME_TOKENS.pillRedBg).toBe('#fef2f2');
    });
  });

  describe('Number Formatting (DealDeck Style)', () => {
    it('formats numbers with dots as thousands separators', () => {
      expect(formatDealDeckNumber(34760)).toBe('34.760');
      expect(formatDealDeckNumber(14987)).toBe('14.987');
      expect(formatDealDeckNumber(12987)).toBe('12.987');
      expect(formatDealDeckNumber(9829)).toBe('9.829');
      expect(formatDealDeckNumber(2487)).toBe('2.487');
      expect(formatDealDeckNumber(612917)).toBe('612.917');
    });

    it('handles small numbers and zero gracefully', () => {
      expect(formatDealDeckNumber(0)).toBe('0');
      expect(formatDealDeckNumber(42)).toBe('42');
      expect(formatDealDeckNumber(812)).toBe('812');
    });

    it('formats sales in Nigerian Naira (₦) with clean number grouping', () => {
      expect(formatNaira(18550000)).toBe('₦18.550.000');
      expect(formatNaira(2650000)).toBe('₦2.650.000');
      expect(formatNaira(0)).toBe('₦0');
    });

    it('calculates actual agency sales pipeline based on project count', () => {
      expect(calculateActualSalesPipeline(7)).toBe(18550000); // 7 * 2,650,000
      expect(calculateActualSalesPipeline(0)).toBe(0);
      expect(calculateActualSalesPipeline(1)).toBe(2650000);
    });
  });

  describe('Bar Chart Scaler (Customer Habits)', () => {
    it('calculates correct percentage height based on default max (60,000)', () => {
      expect(calculateBarHeight(30000, 60000)).toBe(50);
      expect(calculateBarHeight(60000, 60000)).toBe(100);
      expect(calculateBarHeight(0, 60000)).toBe(8); // minimum aesthetic bar height
    });

    it('clamps values above max to 100%', () => {
      expect(calculateBarHeight(75000, 60000)).toBe(100);
    });

    it('calculates heights for the April reference points', () => {
      const hSeen = calculateBarHeight(43787, 60000);
      const hSales = calculateBarHeight(39784, 60000);
      expect(hSeen).toBe(73);
      expect(hSales).toBe(66);
    });
  });

  describe('Pill Badge Classes', () => {
    it('returns green emerald styling for positive trends', () => {
      const cls = getDealDeckPillClass(true);
      expect(cls).toContain('bg-emerald-50');
      expect(cls).toContain('text-emerald-600');
      expect(cls).toContain('rounded-full');
    });

    it('returns red rose styling for negative trends', () => {
      const cls = getDealDeckPillClass(false);
      expect(cls).toContain('bg-rose-50');
      expect(cls).toContain('text-rose-500');
      expect(cls).toContain('rounded-full');
    });
  });

  describe('Concentric Circular Progress Rings', () => {
    it('calculates circumference correctly based on radius', () => {
      const c50 = calculateRingCircumference(50);
      expect(Math.round(c50)).toBe(314); // 2 * PI * 50 = 314.159...
    });

    it('calculates ring stroke dashoffset based on completion percentage', () => {
      const radius = 50;
      const c = 2 * Math.PI * radius;
      expect(calculateRingOffset(radius, 100)).toBe(0);
      expect(calculateRingOffset(radius, 0)).toBe(c);
      expect(calculateRingOffset(radius, 50)).toBeCloseTo(c / 2, 1);
    });
  });



  describe('Minimalist Clean Layout Grid Constants', () => {
    it('confirms 2x2 metric cards count', () => {
      const metricIds = ['total_sales', 'total_orders', 'visitor', 'total_sold_products'];
      expect(metricIds).toHaveLength(4);
    });

    it('verifies April focal points match reference values', () => {
      const aprSeen = 43787;
      const aprSales = 39784;
      expect(formatDealDeckNumber(aprSeen)).toBe('43.787');
      expect(formatDealDeckNumber(aprSales)).toBe('39.784');
    });
  });

  describe('Minimalist Admin Category Titles (DealDeck Style)', () => {
    it('maps overview to Menu', () => {
      expect(getMinimalistAdminCategoryTitle('overview')).toBe('Menu');
    });

    it('maps content to Content', () => {
      expect(getMinimalistAdminCategoryTitle('content')).toBe('Content');
    });

    it('maps appearance to Design', () => {
      expect(getMinimalistAdminCategoryTitle('appearance')).toBe('Design');
    });

    it('maps communication to Audience', () => {
      expect(getMinimalistAdminCategoryTitle('communication')).toBe('Audience');
    });

    it('maps system to Tools', () => {
      expect(getMinimalistAdminCategoryTitle('system')).toBe('Tools');
    });

    it('falls back to custom title or category id for unknown categories', () => {
      expect(getMinimalistAdminCategoryTitle('custom', 'Custom Title')).toBe('Custom Title');
      expect(getMinimalistAdminCategoryTitle('unknown')).toBe('unknown');
    });
  });

  describe('Default Datasets Structure', () => {
    it('provides exactly 7 months in DEFAULT_MONTHLY_HABITS', () => {
      expect(DEFAULT_MONTHLY_HABITS).toHaveLength(7);
      expect(DEFAULT_MONTHLY_HABITS.map((m) => m.month)).toEqual([
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
      ]);
    });

    it('includes specific April data matching the reference image tooltip', () => {
      const apr = DEFAULT_MONTHLY_HABITS.find((m) => m.month === 'Apr');
      expect(apr?.seenProducts).toBe(43787);
      expect(apr?.sales).toBe(39784);
    });

    it('provides 4 geographic locations matching DealDeck bubbles', () => {
      expect(DEFAULT_GEOGRAPHIC_GROWTH).toHaveLength(4);
      const countries = DEFAULT_GEOGRAPHIC_GROWTH.map((g) => g.country);
      expect(countries).toContain('United States');
      expect(countries).toContain('Germany');
      expect(countries).toContain('Australia');
      expect(countries).toContain('France');
    });
  });
});
