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
  });
});
