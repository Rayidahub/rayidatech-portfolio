import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus, ShieldAlert } from 'lucide-react'
import { getCurrentAdminUser } from '@/app/actions/admin-users'
import UserForm from '@/components/admin/users/UserForm'

export const dynamic = 'force-dynamic'

export default async function NewAdminUserPage() {
  const currentUser = await getCurrentAdminUser()

  if (!currentUser) {
    redirect('/admin/login')
  }

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
            Only Super Admins have permission to add new administrative users or assign access privileges.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--line) pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-6 h-6 text-secondary" />
            <h1 className="font-display text-2xl font-semibold text-paper">
              Add Administrator / Assign Role
            </h1>
          </div>
          <p className="text-xs text-mist-2 mt-1">
            Create an administrator profile, assign their system role, and configure permissions
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs text-mist-2 hover:text-paper transition-colors py-2 px-3 rounded-lg hover:bg-white/5 border border-(--line)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Users</span>
        </Link>
      </div>

      <UserForm mode="create" />
    </div>
  )
}

