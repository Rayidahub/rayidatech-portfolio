'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandLogo from '@/components/ui/BrandLogo'
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
  X,
} from 'lucide-react'
import type { AdminRole, AdminPermission } from '@/types/admin-user'

interface AdminSidebarProps {
  role?: AdminRole
  permissions?: AdminPermission[]
  isMobile?: boolean
  onClose?: () => void
}

interface NavItem {
  href: string
  label: string
  icon: any
  permission: AdminPermission
  badge?: string
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { href: '/admin/logs', label: 'User Activity Logs', icon: Activity, permission: 'dashboard', badge: 'Live' },
  { href: '/admin/settings', label: 'Theme & Appearance', icon: Palette, permission: 'dashboard' },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase, permission: 'projects' },
  { href: '/admin/services', label: 'Services', icon: Package, permission: 'services' },
  { href: '/admin/blog', label: 'Blog', icon: FileText, permission: 'blog' },
  { href: '/admin/hero', label: 'Hero Slides', icon: Image, permission: 'hero' },
  { href: '/admin/hero/settings', label: 'Hero Gradient & Settings', icon: Sliders, permission: 'hero' },
  { href: '/admin/coming-soon', label: 'Coming Soon', icon: Rocket, permission: 'coming_soon' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, permission: 'testimonials' },
  { href: '/admin/team', label: 'Team', icon: Users, permission: 'team' },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail, permission: 'contacts' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: MailCheck, permission: 'contacts' },
  { href: '/admin/users', label: 'Users & Roles', icon: ShieldCheck, permission: 'users', badge: 'Super' },
]

export default function AdminSidebar({
  role = 'super_admin',
  permissions = [],
  isMobile = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname()

  // Filter items based on role & permissions
  const visibleItems = navItems.filter((item) => {
    if (role === 'super_admin') return true
    if (role === 'admin') return item.permission !== 'users'
    if (item.permission === 'dashboard') return true
    return permissions.includes(item.permission)
  })

  const roleLabels: Record<AdminRole, { label: string; style: string }> = {
    super_admin: { label: 'Super Admin', style: 'text-secondary border-secondary/30 bg-secondary/10' },
    admin: { label: 'Admin', style: 'text-secondary/90 border-secondary/20 bg-secondary/5' },
    editor: { label: 'Editor', style: 'text-mist-1 border-white/10 bg-white/5' },
  }

  const roleInfo = roleLabels[role] || roleLabels.editor

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <aside
      className={`${
        isMobile
          ? 'w-full h-full flex flex-col bg-[var(--ink-deep)]'
          : 'w-64 min-h-screen bg-[var(--ink-deep)] border-r border-(--line) flex flex-col shrink-0'
      }`}
    >
      <div className="p-6 border-b border-(--line) flex items-center justify-between">
        <div>
          <Link href="/" onClick={handleLinkClick} className="inline-flex items-center">
            <BrandLogo className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-mist-2 text-xs">Admin Workspace</p>
            <span
              className={`text-[10px] uppercase font-mono-tight font-medium px-2 py-0.5 rounded-full border ${roleInfo.style}`}
            >
              {roleInfo.label}
            </span>
          </div>
        </div>

        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors -mr-2"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                isActive
                  ? 'bg-primary/20 text-secondary font-medium'
                  : 'text-mist-1 hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && role === 'super_admin' && (
                <span className="text-[10px] font-mono-tight px-1.5 py-0.5 rounded bg-primary/30 text-secondary border border-primary/40">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-(--line) space-y-2">
        {role === 'super_admin' && (
          <Link
            href="/admin/users"
            onClick={handleLinkClick}
            className="flex items-center gap-2 text-xs text-secondary/80 hover:text-secondary transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Manage Access &amp; Roles</span>
          </Link>
        )}
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2 text-xs text-mist-2 hover:text-paper transition-colors block"
        >
          ← Back to public site
        </Link>
      </div>
    </aside>
  )
}
