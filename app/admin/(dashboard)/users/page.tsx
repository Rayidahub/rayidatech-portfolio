import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, UserPlus, ShieldAlert, Sparkles, Layers } from 'lucide-react'
import { getCurrentAdminUser } from '@/app/actions/admin-users'
import { getAdminUsers } from '@/lib/data/admin-users'
import UsersTable from '@/components/admin/users/UsersTable'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const currentUser = await getCurrentAdminUser()

  if (!currentUser) {
    redirect('/admin/login')
  }

  // Guard: Only Super Admin can access user management
  if (currentUser.role !== 'super_admin') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="glass rounded-2xl p-8 border border-red-500/20 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-paper">
            Super Admin Access Required
          </h1>
          <p className="text-sm text-mist-1 leading-relaxed">
            You are signed in as an <span className="font-semibold text-paper capitalize">{currentUser.role}</span>.
            User and role administration is restricted strictly to Super Admins.
          </p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const users = await getAdminUsers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--line) pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-secondary" />
            <h1 className="font-display text-2xl font-semibold text-paper">
              Users &amp; Roles Management
            </h1>
          </div>
          <p className="text-xs text-mist-2 mt-1">
            Manage administrative team members, assign access roles, and delegate granular permissions
          </p>
        </div>

        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-md shadow-primary/20 shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </Link>
      </div>

      {/* Role Architecture Guide Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-(--line) space-y-1.5">
          <div className="flex items-center gap-2 text-secondary">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-paper">Super Admin</h3>
          </div>
          <p className="text-xs text-mist-2 leading-relaxed">
            Complete platform authority. Can invite users, adjust roles, modify site settings, and manage all content.
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-(--line) space-y-1.5">
          <div className="flex items-center gap-2 text-secondary/80">
            <Layers className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-paper">Admin</h3>
          </div>
          <p className="text-xs text-mist-2 leading-relaxed">
            Full management across all 8 portfolio content modules (Projects, Services, Blog, etc.). Cannot edit users.
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-(--line) space-y-1.5">
          <div className="flex items-center gap-2 text-accent-soft">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-paper">Editor</h3>
          </div>
          <p className="text-xs text-mist-2 leading-relaxed">
            Restricted role. Has dashboard visibility plus only the specific sections explicitly checked by a Super Admin.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        initialUsers={users}
        currentUserId={currentUser.id}
        currentUserRole={currentUser.role}
      />
    </div>
  )
}

