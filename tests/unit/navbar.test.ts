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

    it('does not falsely activate on partial slug substrings', () => {
      expect(isNavActive('/products-and-services', '/products')).toBe(false);
      expect(isNavActive('/about-us', '/about')).toBe(false);
    });

    it('returns false when routes do not match', () => {
      expect(isNavActive('/services', '/projects')).toBe(false);
      expect(isNavActive('/contact', '/about')).toBe(false);
    });
  });

  describe('getNavbarContainerClasses', () => {
    it('always includes fixed positioning and z-50', () => {
      const closedNormal = getNavbarContainerClasses({ isOpen: false, scrolled: false });
      const closedScrolled = getNavbarContainerClasses({ isOpen: false, scrolled: true });
      const openNormal = getNavbarContainerClasses({ isOpen: true, scrolled: false });
      const openScrolled = getNavbarContainerClasses({ isOpen: true, scrolled: true });

      for (const cls of [closedNormal, closedScrolled, openNormal, openScrolled]) {
        expect(cls).toContain('fixed top-0 left-0 right-0 z-50');
      }
    });

    it('applies completely solid bg-[var(--ink-deep)] when mobile menu is open, regardless of scroll', () => {
      const openClasses = getNavbarContainerClasses({ isOpen: true, scrolled: false });
      expect(openClasses).toContain('bg-[var(--ink-deep)]');
      expect(openClasses).toContain('border-b border-(--line)');
      expect(openClasses).toContain('shadow-2xl');
      expect(openClasses).not.toContain('glass');

      const openScrolledClasses = getNavbarContainerClasses({ isOpen: true, scrolled: true });
      expect(openScrolledClasses).toContain('bg-[var(--ink-deep)]');
      expect(openScrolledClasses).not.toContain('glass');
    });

    it('applies glass effect when closed and scrolled', () => {
      const classes = getNavbarContainerClasses({ isOpen: false, scrolled: true });
      expect(classes).toContain('glass');
      expect(classes).not.toContain('bg-[var(--ink-deep)]');
    });

    it('applies transparent border when closed and at the top', () => {
      const classes = getNavbarContainerClasses({ isOpen: false, scrolled: false });
      expect(classes).toContain('border-b border-transparent');
      expect(classes).not.toContain('glass');
      expect(classes).not.toContain('bg-[var(--ink-deep)]');
    });
  });
});
