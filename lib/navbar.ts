export interface NavLink {
  href: string;
  label: string;
}

export const MAIN_NAV_LINKS: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

/**
 * Determines whether a nav link is currently active given the current pathname.
 */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Returns the CSS class string for the top navigation bar container,
 * ensuring a solid, non-transparent background when the mobile menu is open.
 */
export function getNavbarContainerClasses({
  isOpen,
  scrolled,
}: {
  isOpen: boolean;
  scrolled: boolean;
}): string {
  const base = 'fixed top-0 left-0 right-0 z-50 transition-colors duration-300';
  if (isOpen) {
    // Completely solid, opaque background to eliminate transparency when open
    return `${base} bg-[var(--ink-deep)] border-b border-(--line) shadow-2xl`;
  }
  if (scrolled) {
    return `${base} glass`;
  }
  return `${base} border-b border-transparent`;
}

/**
 * Returns the CSS class string for the mobile menu dropdown drawer,
 * using a 100% opaque background to prevent underlying hero/page content from bleeding through.
 */
export function getMobileMenuDrawerClasses(): string {
  return 'bg-[var(--ink-deep)] border-t border-b border-(--line) px-4 sm:px-6 py-5 md:hidden max-h-[calc(100vh-4.5rem)] overflow-y-auto shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-top-2 duration-200';
}
