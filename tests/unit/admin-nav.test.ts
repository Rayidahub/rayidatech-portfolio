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

  describe('getVisibleAdminNavCategories', () => {
    it('returns all 5 categories and 15 items for super_admin', () => {
      const visible = getVisibleAdminNavCategories({ role: 'super_admin' });

    it('omits System & Access category for admin role since Users & Roles is excluded', () => {
      const visible = getVisibleAdminNavCategories({ role: 'admin' });

    it('filters categories and excludes empty categories for restricted editor role', () => {
      const visible = getVisibleAdminNavCategories({
        role: 'editor',
        permissions: ['projects', 'blog'] as AdminPermission[],
      });
      const ids = visible.map((c) => c.id);
      expect(ids).toContain('overview');
      expect(ids).toContain('content');
      expect(ids).not.toContain('communication');
      expect(ids).not.toContain('system');

      const content = visible.find((c) => c.id === 'content');
      expect(content?.items.map((i) => i.href)).toEqual(['/admin/projects', '/admin/blog']);
    });
      expect(visible).toHaveLength(4);
      expect(visible.some((c) => c.id === 'system')).toBe(false);
      const totalItems = visible.reduce((acc, cat) => acc + cat.items.length, 0);
      expect(totalItems).toBe(14);
    });
      expect(visible).toHaveLength(5);
      const totalItems = visible.reduce((acc, cat) => acc + cat.items.length, 0);
      expect(totalItems).toBe(15);
    });
  });

  describe('isAdminRouteActive', () => {
    it('matches exact root /admin only when on /admin', () => {
      expect(isAdminRouteActive('/admin', '/admin')).toBe(true);
      expect(isAdminRouteActive('/admin/projects', '/admin')).toBe(false);
      expect(isAdminRouteActive('/admin/logs', '/admin')).toBe(false);
    });

    it('matches detail and nested subpaths for section routes', () => {
      expect(isAdminRouteActive('/admin/projects', '/admin/projects')).toBe(true);
      expect(isAdminRouteActive('/admin/projects/new', '/admin/projects')).toBe(true);
      expect(isAdminRouteActive('/admin/projects/123/edit', '/admin/projects')).toBe(true);
    });

    it('does not falsely activate unrelated sibling routes', () => {
      expect(isAdminRouteActive('/admin/products', '/admin/projects')).toBe(false);
      expect(isAdminRouteActive('/admin/hero/settings', '/admin/hero')).toBe(true);
      expect(isAdminRouteActive('/admin/hero', '/admin/hero/settings')).toBe(false);
    });
  });

  describe('Styling & Class Generators', () => {
    it('provides clean uppercase section header classes', () => {
      const classes = getAdminCategoryHeaderClasses();
      expect(classes).toContain('uppercase');
      expect(classes).toContain('font-mono-tight');
      expect(classes).toContain('text-mist-2/70');
    });
  });
});
