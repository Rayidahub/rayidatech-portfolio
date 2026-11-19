import { describe, it, expect } from 'vitest';
import {
  ADMIN_NAV_CATEGORIES,
  isItemPermitted,
  getVisibleAdminNavCategories,
  isAdminRouteActive,
  getAdminCategoryHeaderClasses,
  getAdminNavLinkClasses,
  getAdminBadgeClasses,
} from '@/lib/admin-nav';
import type { AdminRole, AdminPermission } from '@/types/admin-user';

describe('Admin Navigation & Categorized Menu Architecture', () => {
  describe('ADMIN_NAV_CATEGORIES structure & canonical routes', () => {
    it('defines the standard 5 functional categories', () => {
      expect(ADMIN_NAV_CATEGORIES).toHaveLength(5);
      const ids = ADMIN_NAV_CATEGORIES.map((c) => c.id);
      expect(ids).toEqual(['overview', 'content', 'appearance', 'communication', 'system']);
    });

    it('contains all 15 canonical admin routes across all categories without duplicates', () => {
      const allHrefs = ADMIN_NAV_CATEGORIES.flatMap((c) => c.items.map((i) => i.href));
      expect(allHrefs).toHaveLength(15);
      const uniqueHrefs = new Set(allHrefs);
      expect(uniqueHrefs.size).toBe(15);
    });

    it('organizes overview category with Dashboard and Activity Logs', () => {
      const overviewCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'overview');
      expect(overviewCategory?.title).toBe('Overview');
      expect(overviewCategory?.items.map((i) => i.href)).toEqual(['/admin', '/admin/logs']);
    });

    it('organizes content management category with 6 core CMS items', () => {
      const contentCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'content');
      expect(contentCategory?.title).toBe('Content Management');
      expect(contentCategory?.items.map((i) => i.href)).toEqual([
        '/admin/projects',
        '/admin/services',
        '/admin/products',
        '/admin/blog',
        '/admin/testimonials',
        '/admin/team',
      ]);
    });
  });
});
