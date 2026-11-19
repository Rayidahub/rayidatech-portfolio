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
