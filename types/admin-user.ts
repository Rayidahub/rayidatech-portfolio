export const ROOT_SUPER_ADMIN_EMAIL = 'rayidagaius@gmail.com';

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export type AdminPermission =
  | 'dashboard'
  | 'projects'
  | 'services'
  | 'blog'
  | 'hero'
  | 'coming_soon'
  | 'testimonials'
  | 'team'
  | 'contacts'
  | 'users'
  | 'logs';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: AdminRole;
  permissions: AdminPermission[];
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface PermissionDefinition {
  id: AdminPermission;
  label: string;
  description: string;
  path: string;
}

export const CONTENT_PERMISSIONS: PermissionDefinition[] = [
  {
    id: 'projects',
    label: 'Projects & Case Studies',
    description: 'Create, edit, and organize portfolio projects and case studies',
    path: '/admin/projects',
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Manage offerings, pricing, details, and feature points',
    path: '/admin/services',
  },
  {
    id: 'blog',
    label: 'Blog & Articles',
    description: 'Publish and edit articles, tags, reading times, and settings',
    path: '/admin/blog',
  },
  {
    id: 'hero',
    label: 'Hero Slides & Customization',
    description: 'Control hero imagery, autoplay intervals, and headlines',
    path: '/admin/hero',
  },
  {
    id: 'coming_soon',
    label: 'Coming Soon / Ecosystem',
    description: 'Manage launch countdowns, ecosystem products, and badges',
    path: '/admin/coming-soon',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    description: 'Manage client reviews, ratings, and testimonials',
    path: '/admin/testimonials',
  },
  {
    id: 'team',
    label: 'Team Directory',
    description: 'Manage team members, bios, roles, and social profiles',
    path: '/admin/team',
  },
  {
    id: 'contacts',
    label: 'Contact Inquiries',
    description: 'Review messages, client inquiries, and contact settings',
    path: '/admin/contacts',
  },
  {
    id: 'logs',
    label: 'User Activity Logs',
    description: 'Monitor real-time website visitor activity, page visits, and user interactions',
    path: '/admin/logs',
  },
];

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    description: 'Access to dashboard summary statistics and quick links',
    path: '/admin',
  },
  ...CONTENT_PERMISSIONS,
  {
    id: 'users',
    label: 'Users & Roles Management',
    description: 'Manage administrative users, assign roles, and configure permissions (Super Admin only)',
    path: '/admin/users',
  },
];

export const ROLE_DEFINITIONS: Record<
  AdminRole,
  {
    name: string;
    description: string;
    badgeClass: string;
  }
> = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full system ownership. Manages team roles, access permissions, settings, and all site content.',
    badgeClass: 'bg-primary/20 text-secondary border border-secondary/30 shadow-sm shadow-primary/20',
  },
  admin: {
    name: 'Admin',
    description: 'Full content management access across all portfolio modules. Cannot alter user accounts or roles.',
    badgeClass: 'bg-secondary/15 text-secondary border border-secondary/25',
  },
  editor: {
    name: 'Editor',
    description: 'Granular access. Can only access and modify specific sections explicitly assigned by a Super Admin.',
    badgeClass: 'bg-white/10 text-mist-1 border border-(--line)',
  },
};

