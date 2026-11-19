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
  });
});
