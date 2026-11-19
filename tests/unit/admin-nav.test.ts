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

    it('organizes appearance & hero category with visual design controls', () => {
      const appearanceCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'appearance');
      expect(appearanceCategory?.title).toBe('Appearance & Hero');
      expect(appearanceCategory?.items.map((i) => i.href)).toEqual([
        '/admin/hero',
        '/admin/hero/settings',
        '/admin/settings',
      ]);
    });

    it('organizes communication category with inbound pipeline and email outreach', () => {
      const communicationCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'communication');
      expect(communicationCategory?.title).toBe('Communication & Leads');
      expect(communicationCategory?.items.map((i) => i.href)).toEqual([
        '/admin/contacts',
        '/admin/subscribers',
        '/admin/outreach',
      ]);
    });

    it('organizes system & access category with RBAC user controls', () => {
      const systemCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'system');
      expect(systemCategory?.title).toBe('System & Access');
      expect(systemCategory?.items.map((i) => i.href)).toEqual(['/admin/users']);
    });

    it('ensures every item has valid label, defined icon, and permission', () => {
      for (const category of ADMIN_NAV_CATEGORIES) {
        expect(category.title).toBeTruthy();
        for (const item of category.items) {
          expect(item.label).toBeTruthy();
          expect(item.icon).toBeDefined();
          expect(item.permission).toBeTruthy();
          expect(item.href.startsWith('/admin')).toBe(true);
        }
      }
    });
  });

  describe('isItemPermitted role & permission checking', () => {
    const dashboardItem = ADMIN_NAV_CATEGORIES[0].items[0]; // /admin
    const usersItem = ADMIN_NAV_CATEGORIES[4].items[0]; // /admin/users
    const projectsItem = ADMIN_NAV_CATEGORIES[1].items[0]; // /admin/projects

    it('permits all items for super_admin', () => {
      expect(isItemPermitted(dashboardItem, 'super_admin', [])).toBe(true);
      expect(isItemPermitted(usersItem, 'super_admin', [])).toBe(true);
      expect(isItemPermitted(projectsItem, 'super_admin', [])).toBe(true);
    });

    it('permits everything except users for admin role', () => {
      expect(isItemPermitted(dashboardItem, 'admin', [])).toBe(true);
      expect(isItemPermitted(projectsItem, 'admin', [])).toBe(true);
      expect(isItemPermitted(usersItem, 'admin', [])).toBe(false);
    });

    it('permits content items for editor only if permission is granted', () => {
      expect(isItemPermitted(projectsItem, 'editor', [])).toBe(false);
      expect(isItemPermitted(projectsItem, 'editor', ['projects'])).toBe(true);
      expect(isItemPermitted(usersItem, 'editor', ['projects'])).toBe(false);
    });
  });
});
