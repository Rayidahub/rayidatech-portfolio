import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminUserByEmail } from '@/lib/data/admin-users'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'
import DeactivatedNotice from '@/components/admin/DeactivatedNotice'
import UnauthorizedNotice from '@/components/admin/UnauthorizedNotice'
import { ROOT_SUPER_ADMIN_EMAIL } from '@/types/admin-user'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/admin/login')
  }

  // Fetch admin profile and role/permissions
  const adminProfile = await getAdminUserByEmail(user.email)

  // Guard: If authenticated user is not in admin_users and not root super admin
  if (!adminProfile && user.email.toLowerCase() !== ROOT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return <UnauthorizedNotice email={user.email} />
  }

  // If user profile exists and has been deactivated by Super Admin
  if (adminProfile && adminProfile.is_active === false) {
    return <DeactivatedNotice email={user.email} />
  }

  const role = adminProfile?.role || 'super_admin'
  const permissions = adminProfile?.permissions || []
  const name = adminProfile?.name || user.email.split('@')[0]

  return (
    <AdminLayoutClient
      role={role}
      permissions={permissions}
      email={user.email}
      name={name}
    >
      {children}
    </AdminLayoutClient>
  )
}
