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
];
