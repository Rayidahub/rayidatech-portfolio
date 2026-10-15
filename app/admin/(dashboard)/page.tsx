import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentAdminUser } from '@/app/actions/admin-users'
import { getAdminUsers, hasPermission } from '@/lib/data/admin-users'
import {
  Briefcase,
  Package,
  FileText,
  Mail,
  Users,
  ShieldCheck,
  Shield,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { ROLE_DEFINITIONS } from '@/types/admin-user'
import { getSiteSettings } from '@/lib/data/site-settings'
import QuickThemeCard from '@/components/admin/QuickThemeCard'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [currentUser, supabase, siteSettings] = await Promise.all([
    getCurrentAdminUser(),
    createClient(),
    getSiteSettings(),
  ])

  const [
    { count: projectCount },
    { count: serviceCount },
    { count: postCount },
    { count: teamCount },
    { count: contactCount },
    allUsers,
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('team_members').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    getAdminUsers(),
  ])

  const allCards = [
    {
      label: 'Projects',
      value: projectCount ?? 0,
      icon: Briefcase,
      href: '/admin/projects',
      permission: 'projects' as const,
      description: 'Case studies & portfolio works',
    },
    {
      label: 'Services',
      value: serviceCount ?? 0,
      icon: Package,
      href: '/admin/services',
      permission: 'services' as const,
      description: 'Dynamic offerings & features',
    },
    {
      label: 'Blog Posts',
      value: postCount ?? 0,
      icon: FileText,
      href: '/admin/blog',
      permission: 'blog' as const,
      description: 'Articles & engineering insights',
    },
    {
      label: 'Team Members',
      value: teamCount ?? 0,
      icon: Users,
      href: '/admin/team',
      permission: 'team' as const,
      description: 'Directory & executive profiles',
    },
    {
      label: 'Contact Inquiries',
      value: contactCount ?? 0,
      icon: Mail,
      href: '/admin/contacts',
      permission: 'contacts' as const,
      description: 'Messages & partnership requests',
    },
    {
      label: 'Admin Users',
      value: allUsers.length,
      icon: ShieldCheck,
      href: '/admin/users',
      permission: 'users' as const,
      description: 'Team roles & access privileges',
    },
  ]

  // Filter stats by user permissions
  const visibleCards = allCards.filter((card) =>
    hasPermission(currentUser, card.permission)
  )

  const roleMeta = currentUser ? ROLE_DEFINITIONS[currentUser.role] : ROLE_DEFINITIONS.editor
  const RoleIcon =
    currentUser?.role === 'super_admin'
      ? ShieldCheck
      : currentUser?.role === 'admin'
      ? Shield
      : UserCheck

  return (
    <div className="space-y-6">
      {/* Welcome & Role Banner */}
      <div className="glass rounded-2xl p-6 sm:p-7 border border-(--line) relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono-tight text-secondary uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Workspace Overview
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper">
              Welcome back, {currentUser?.name || currentUser?.email?.split('@')[0] || 'Admin'}
            </h1>
            <p className="text-sm text-mist-1 mt-1 max-w-xl">
              You are signed in with{' '}
              <span className="font-semibold text-paper">{roleMeta.name}</span> privileges.
              {currentUser?.role === 'super_admin' &&
                ' You have unrestricted access to manage content, settings, and user access.'}
              {currentUser?.role === 'admin' &&
                ' You can view and edit all 8 portfolio content modules.'}
              {currentUser?.role === 'editor' &&
                ' You have granular access to your assigned sections.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono-tight ${roleMeta.badgeClass}`}
            >
              <RoleIcon className="w-4 h-4" />
              <span>{roleMeta.name}</span>
            </div>

            {currentUser?.role === 'super_admin' && (
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 text-xs font-medium transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manage Users</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Theme Setting Widget */}
      <QuickThemeCard
        initialTheme={siteSettings.default_theme}
        allowToggle={siteSettings.allow_user_toggle}
      />

      {/* Stats Grid */}
      <div>
        <h2 className="font-display font-semibold text-lg text-paper mb-4">
          Quick Access &amp; Statistics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="glass rounded-xl p-5 hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-200 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-xs text-mist-2 group-hover:text-secondary transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <p className="text-3xl font-display font-bold text-paper mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-paper">{stat.label}</p>
                  <p className="text-xs text-mist-2 mt-0.5">{stat.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
