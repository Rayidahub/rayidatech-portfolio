'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Shield,
  UserCheck,
  Edit,
  Trash2,
  CheckCircle2,
  Search,
  UserPlus,
  AlertTriangle,
  Lock,
} from 'lucide-react'
import type { AdminUser, AdminRole } from '@/types/admin-user'
import { ROLE_DEFINITIONS, CONTENT_PERMISSIONS, ROOT_SUPER_ADMIN_EMAIL } from '@/types/admin-user'
import { toggleUserStatusAction, deleteAdminUserAction } from '@/app/actions/admin-users'

interface UsersTableProps {
  initialUsers: AdminUser[]
  currentUserId: string
  currentUserRole: AdminRole
}

export default function UsersTable({
  initialUsers,
  currentUserId,
  currentUserRole,
}: UsersTableProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRole>('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter users by search and role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  function handleToggleStatus(user: AdminUser) {
    if (user.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()) {
      setErrorMessage('The primary Super Admin cannot be deactivated.')
      return
    }

    if (user.id === currentUserId && user.is_active) {
      setErrorMessage('You cannot deactivate your own active session.')
      return
    }

    const nextStatus = !user.is_active
    setErrorMessage(null)

    startTransition(async () => {
      const res = await toggleUserStatusAction(user.id, nextStatus)
      if (res.success) {
        setUsers((prev) =>
          prev.map((item) => (item.id === user.id ? { ...item, is_active: nextStatus } : item))
        )
        setSuccessMessage(`User ${user.email} marked as ${nextStatus ? 'Active' : 'Inactive'}.`)
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage(res.error || 'Failed to update user status.')
      }
    })
  }

  function handleDelete(user: AdminUser) {
    if (user.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()) {
      setErrorMessage('The primary Super Admin cannot be deleted.')
      setDeleteConfirmId(null)
      return
    }

    if (user.id === currentUserId) {
      setErrorMessage('You cannot delete your own account.')
      setDeleteConfirmId(null)
      return
    }

    setErrorMessage(null)

    startTransition(async () => {
      const res = await deleteAdminUserAction(user.id)
      if (res.success) {
        setUsers((prev) => prev.filter((item) => item.id !== user.id))
        setSuccessMessage(`User ${user.email} successfully deleted.`)
        setDeleteConfirmId(null)
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage(res.error || 'Failed to delete user.')
        setDeleteConfirmId(null)
      }
    })
  }

  const getRoleIcon = (role: AdminRole) => {
    if (role === 'super_admin') return <ShieldCheck className="w-3.5 h-3.5" />
    if (role === 'admin') return <Shield className="w-3.5 h-3.5" />
    return <UserCheck className="w-3.5 h-3.5" />
  }

  return (
    <div className="space-y-4">
      {/* Alert Banners */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-sm bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-paper/5 border border-(--line) rounded-xl pl-10 pr-4 py-2 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Role Filters & Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center glass rounded-xl p-1 border border-(--line)">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-1 hover:text-paper'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('super_admin')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === 'super_admin'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-1 hover:text-paper'
              }`}
            >
              Super Admins ({users.filter((u) => u.role === 'super_admin').length})
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === 'admin'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-1 hover:text-paper'
              }`}
            >
              Admins ({users.filter((u) => u.role === 'admin').length})
            </button>
            <button
              onClick={() => setRoleFilter('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === 'editor'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-1 hover:text-paper'
              }`}
            >
              Editors ({users.filter((u) => u.role === 'editor').length})
            </button>
          </div>

          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors shadow-md shadow-primary/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="text-left text-mist-2 font-medium px-4 py-3.5">User</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3.5">Role</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3.5 hidden md:table-cell">
                  Module Permissions
                </th>
                <th className="text-center text-mist-2 font-medium px-4 py-3.5">Status</th>
                <th className="text-right text-mist-2 font-medium px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-mist-2 px-4 py-12">
                    <p className="text-paper font-medium mb-1">No admin users found</p>
                    <p className="text-xs">
                      {search
                        ? 'No users match your search query.'
                        : 'Click "Add User" above to create an administrator or editor.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleMeta = ROLE_DEFINITIONS[user.role]
                  const isRoot = user.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()
                  const isSelf = user.id === currentUserId

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-(--line) flex items-center justify-center text-secondary font-display font-semibold text-sm shrink-0">
                            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-paper text-sm">{user.name || 'Unnamed'}</p>
                              {isRoot && (
                                <span className="text-[10px] font-mono-tight bg-secondary/10 text-secondary border border-secondary/30 px-1.5 py-0.2 rounded">
                                  Owner
                                </span>
                              )}
                              {isSelf && (
                                <span className="text-[10px] font-mono-tight bg-primary/20 text-accent-soft px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-mist-2 font-mono-tight">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-tight ${roleMeta.badgeClass}`}
                        >
                          {getRoleIcon(user.role)}
                          <span>{roleMeta.name}</span>
                        </span>
                      </td>

                      {/* Permissions */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        {user.role === 'super_admin' ? (
                          <span className="text-xs text-secondary font-mono-tight bg-secondary/10 px-2 py-1 rounded-md border border-secondary/20">
                            All Modules &amp; Full Settings
                          </span>
                        ) : user.role === 'admin' ? (
                          <span className="text-xs text-mist-1 font-mono-tight bg-white/5 px-2 py-1 rounded-md border border-(--line)">
                            All Content Sections (8)
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.permissions && user.permissions.filter((p) => p !== 'dashboard').length > 0 ? (
                              user.permissions
                                .filter((p) => p !== 'dashboard')
                                .map((perm) => {
                                  const permDef = CONTENT_PERMISSIONS.find((c) => c.id === perm)
                                  return (
                                    <span
                                      key={perm}
                                      className="text-[11px] font-mono-tight bg-white/5 text-mist-1 px-1.5 py-0.5 rounded border border-(--line)"
                                    >
                                      {permDef?.label.split(' ')[0] || perm}
                                    </span>
                                  )
                                })
                            ) : (
                              <span className="text-xs text-mist-2 italic">Dashboard only</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          disabled={isRoot || (isSelf && user.is_active) || isPending}
                          title={
                            isRoot
                              ? 'Primary Super Admin cannot be deactivated'
                              : isSelf
                              ? 'Cannot deactivate your own account'
                              : 'Click to toggle status'
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            user.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                          } ${isRoot || isSelf ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {user.is_active ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="p-1.5 text-mist-2 hover:text-secondary transition-colors rounded-lg hover:bg-white/5"
                            title="Edit role and permissions"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {isRoot ? (
                            <span
                              className="p-1.5 text-mist-2/40 cursor-not-allowed"
                              title="Primary Super Admin is protected"
                            >
                              <Lock className="w-4 h-4" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(user.id)}
                              disabled={isSelf || isPending}
                              className={`p-1.5 transition-colors rounded-lg hover:bg-white/5 ${
                                isSelf
                                  ? 'text-mist-2/40 cursor-not-allowed'
                                  : 'text-mist-2 hover:text-red-400'
                              }`}
                              title={isSelf ? 'Cannot delete yourself' : 'Delete user'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl max-w-sm w-full p-6 space-y-4 border border-red-500/20">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display font-semibold text-lg text-paper">Remove User?</h3>
            </div>
            <p className="text-sm text-mist-1">
              Are you sure you want to remove this administrator? They will immediately lose access
              to the portfolio management dashboard.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-mist-1 hover:text-paper rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const targetUser = users.find((u) => u.id === deleteConfirmId)
                  if (targetUser) handleDelete(targetUser)
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {isPending ? 'Removing...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
