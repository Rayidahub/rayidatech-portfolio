import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Briefcase,
  Package,
  FileText,
  Mail,
  Image,
  Rocket,
  MessageSquareQuote,
  Users,
  ShieldCheck,
  Sliders,
  Palette,
  Activity,
  MailCheck,
  SendHorizontal,
} from 'lucide-react';
import type { AdminRole, AdminPermission } from '@/types/admin-user';

export type AdminBadgeVariant = 'live' | 'campaigns' | 'super' | 'default';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission: AdminPermission;
  badge?: string;
  badgeVariant?: AdminBadgeVariant;
  description?: string;
}

export interface AdminNavCategory {
  id: string;
  title: string;
  shortLabel?: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [
  {
    id: 'overview',
    title: 'Overview',
    shortLabel: 'Pulse',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard',
      },
      {
        href: '/admin/logs',
        label: 'User Activity Logs',
        icon: Activity,
        permission: 'dashboard',
        badge: 'Live',
        badgeVariant: 'live',
      },
    ],
  },
  {
    id: 'content',
    title: 'Content Management',
    shortLabel: 'CMS',
    items: [
      {
        href: '/admin/projects',
        label: 'Projects',
        icon: Briefcase,
        permission: 'projects',
      },
      {
        href: '/admin/services',
        label: 'Services',
        icon: Package,
        permission: 'services',
      },
      {
        href: '/admin/products',
        label: 'Products',
        icon: Rocket,
        permission: 'coming_soon',
      },
      {
        href: '/admin/blog',
        label: 'Blog',
        icon: FileText,
        permission: 'blog',
      },
      {
        href: '/admin/testimonials',
        label: 'Testimonials',
        icon: MessageSquareQuote,
        permission: 'testimonials',
      },
      {
        href: '/admin/team',
        label: 'Team',
        icon: Users,
        permission: 'team',
      },
    ],
  },
  {
    id: 'appearance',
    title: 'Appearance & Hero',
    shortLabel: 'Design',
    items: [
      {
        href: '/admin/hero',
        label: 'Hero Slides',
        icon: Image,
        permission: 'hero',
      },
      {
        href: '/admin/hero/settings',
        label: 'Hero Gradient & Settings',
        icon: Sliders,
        permission: 'hero',
      },
      {
        href: '/admin/settings',
        label: 'Theme & Appearance',
        icon: Palette,
        permission: 'dashboard',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communication & Leads',
    shortLabel: 'Audience',
    items: [
      {
        href: '/admin/contacts',
        label: 'Contacts',
        icon: Mail,
        permission: 'contacts',
      },
      {
        href: '/admin/subscribers',
        label: 'Subscribers',
        icon: MailCheck,
        permission: 'contacts',
      },
      {
        href: '/admin/outreach',
        label: 'Email Outreach',
        icon: SendHorizontal,
        permission: 'outreach',
        badge: 'Campaigns',
        badgeVariant: 'campaigns',
      },
    ],
  },
  {
    id: 'system',
    title: 'System & Access',
    shortLabel: 'Security',
    items: [
      {
        href: '/admin/users',
        label: 'Users & Roles',
        icon: ShieldCheck,
        permission: 'users',
        badge: 'Super',
        badgeVariant: 'super',
      },
    ],
  },
];

/**
 * Checks if a specific admin nav item is permitted for the given role and permissions.
 */
export function isItemPermitted(
  item: AdminNavItem,
  role: AdminRole = 'super_admin',
  permissions: AdminPermission[] = []
): boolean {
  if (role === 'super_admin') return true;
  if (role === 'admin') return item.permission !== 'users';
  if (item.permission === 'dashboard') return true;
  return permissions.includes(item.permission);
}

/**
 * Returns filtered categories containing only permitted items for the current admin user.
 * Categories with zero visible items are automatically omitted.
 */
export function getVisibleAdminNavCategories({
  role = 'super_admin',
  permissions = [],
}: {
  role?: AdminRole;
  permissions?: AdminPermission[];
}): AdminNavCategory[] {
  return ADMIN_NAV_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) => isItemPermitted(item, role, permissions)),
  })).filter((category) => category.items.length > 0);
}

/**
 * Determines whether an admin navigation route is currently active.
 */
export function isAdminRouteActive(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Returns class string for category section headers.
 */
export function getAdminCategoryHeaderClasses(): string {
  return 'text-[10px] uppercase font-mono-tight font-semibold tracking-wider text-mist-2/70 px-3 pt-3 pb-1 flex items-center justify-between select-none';
}

/**
 * Returns class string for admin nav item links.
 */
export function getAdminNavLinkClasses(isActive: boolean): string {
  const base =
    'group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200';
  if (isActive) {
    return `${base} bg-primary/20 text-secondary font-medium shadow-sm border border-primary/30`;
  }
  return `${base} text-mist-1 hover:text-paper hover:bg-white/5`;
}

/**
 * Returns badge styling based on badgeVariant.
 */
export function getAdminBadgeClasses(badgeVariant?: AdminBadgeVariant): string {
  switch (badgeVariant) {
    case 'live':
      return 'text-[10px] font-mono-tight px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'campaigns':
      return 'text-[10px] font-mono-tight px-1.5 py-0.5 rounded bg-primary/30 text-secondary border border-primary/40';
    case 'super':
      return 'text-[10px] font-mono-tight px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
    default:
      return 'text-[10px] font-mono-tight px-1.5 py-0.5 rounded bg-white/10 text-mist-1 border border-white/15';
  }
}
