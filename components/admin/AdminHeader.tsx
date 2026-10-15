'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { LogOut, ShieldCheck, UserCheck, Shield, Menu } from 'lucide-react'
import type { AdminRole } from '@/types/admin-user'
import { ROLE_DEFINITIONS } from '@/types/admin-user'

interface AdminHeaderProps {
  email: string
  name?: string
  role?: AdminRole
  onOpenMobileMenu?: () => void
}

export default function AdminHeader({
  email,
  name,
  role = 'super_admin',
  onOpenMobileMenu,
}: AdminHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const roleMeta = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.editor
  const RoleIcon = role === 'super_admin' ? ShieldCheck : role === 'admin' ? Shield : UserCheck

  return (
    <header className="h-16 border-b border-(--line) flex items-center justify-between px-4 sm:px-6 gap-3 bg-[var(--ink)]">
      <div className="flex items-center gap-2.5">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors -ml-1.5"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <span className="text-xs text-mist-2 hidden sm:inline">Signed in as</span>
        <span className="text-sm font-medium text-paper truncate max-w-[150px] sm:max-w-none">
          {name || email}
        </span>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Role Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-tight ${roleMeta.badgeClass}`}
          title={roleMeta.description}
        >
          <RoleIcon className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{roleMeta.name}</span>
        </div>

        <div className="h-4 w-px bg-white/10 hidden xs:block" aria-hidden="true" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-mist-2 hover:text-paper transition-colors py-1.5 px-2.5 rounded-lg hover:bg-white/5"
          title="Sign out of admin session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
