import { describe, it, expect } from 'vitest';
import {
  MAIN_NAV_LINKS,
  isNavActive,
  getNavbarContainerClasses,
  getMobileMenuDrawerClasses,
  getMobileBackdropClasses,
  getMobileNavLinkClasses,
} from '@/lib/navbar';

describe('Navbar System & Mobile Menu Opaque Architecture', () => {
  describe('MAIN_NAV_LINKS', () => {
    it('defines the complete standard set of 6 main navigation links', () => {
      expect(MAIN_NAV_LINKS).toHaveLength(6);
    });

    it('contains the expected canonical navigation routes', () => {
      const labels = MAIN_NAV_LINKS.map((l) => l.label);
      expect(labels).toEqual([
        'About',
        'Projects',
        'Services',
        'Products',
        'Blog',
        'Contact',
      ]);
    });

    it('ensures all links have valid absolute path hrefs starting with /', () => {
      for (const link of MAIN_NAV_LINKS) {
        expect(link.href.startsWith('/')).toBe(true);
        expect(link.href).not.toBe('');
      }
    });

    it('includes /products in the main navigation list', () => {
      const productLink = MAIN_NAV_LINKS.find((l) => l.href === '/products');
      expect(productLink).toBeDefined();
      expect(productLink?.label).toBe('Products');
    });
  });

  describe('isNavActive', () => {
    it('accurately identifies active root path', () => {
      expect(isNavActive('/', '/')).toBe(true);
      expect(isNavActive('/about', '/')).toBe(false);
    });

    it('accurately identifies exact route match', () => {
      expect(isNavActive('/about', '/about')).toBe(true);
      expect(isNavActive('/projects', '/projects')).toBe(true);
      expect(isNavActive('/contact', '/contact')).toBe(true);
    });

    it('identifies nested subpath routes as active for parent link', () => {
      expect(isNavActive('/projects/luxe-by-sey', '/projects')).toBe(true);
      expect(isNavActive('/blog/understanding-design-systems', '/blog')).toBe(true);
      expect(isNavActive('/services/brand-identity', '/services')).toBe(true);
    });
  });
});
