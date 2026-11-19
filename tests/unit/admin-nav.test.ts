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
  });
});
