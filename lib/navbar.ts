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
