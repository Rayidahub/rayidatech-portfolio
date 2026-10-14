'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  Shield,
  UserCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { AdminUser, AdminRole, AdminPermission } from '@/types/admin-user'
import { ROLE_DEFINITIONS, CONTENT_PERMISSIONS, ROOT_SUPER_ADMIN_EMAIL } from '@/types/admin-user'
import { createAdminUserAction, updateAdminUserAction } from '@/app/actions/admin-users'

interface UserFormProps {
  initialData?: AdminUser
  mode: 'create' | 'edit'
}

export default function UserForm({ initialData, mode }: UserFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isRootAdmin =
    mode === 'edit' &&
    initialData?.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()

  const [email, setEmail] = useState(initialData?.email || '')
  const [name, setName] = useState(initialData?.name || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<AdminRole>(initialData?.role || 'editor')
  const [permissions, setPermissions] = useState<AdminPermission[]>(
    initialData?.permissions || ['dashboard']
  )
  const [isActive, setIsActive] = useState(initialData ? initialData.is_active : true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function togglePermission(permId: AdminPermission) {
    if (permissions.includes(permId)) {
      setPermissions(permissions.filter((p) => p !== permId))
    } else {
      setPermissions([...permissions, permId])
    }
  }

  function handleSelectAllPermissions() {
    setPermissions(['dashboard', ...CONTENT_PERMISSIONS.map((p) => p.id)])
  }

  function handleClearAllPermissions() {
    setPermissions(['dashboard'])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    startTransition(async () => {
      if (mode === 'create') {
        const res = await createAdminUserAction({
          email,
          name,
          role,
          permissions,
          is_active: isActive,
          password: password.trim() ? password : undefined,
        })

        if (!res.success) {
          setError(res.error || 'Failed to create user.')
        } else {
          setSuccess('Administrator successfully created! Redirecting to user list...')
          setTimeout(() => {
            router.push('/admin/users')
            router.refresh()
          }, 1200)
        }
      } else {
        if (!initialData?.id) return
        const res = await updateAdminUserAction({
          id: initialData.id,
          email,
          name,
          role,
          permissions,
          is_active: isActive,
        })

        if (!res.success) {
          setError(res.error || 'Failed to update user.')
        } else {
          setSuccess('User permissions updated successfully!')
          setTimeout(() => {
            router.push('/admin/users')
            router.refresh()
          }, 1000)
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 text-sm bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {isRootAdmin && (
        <div className="flex items-start gap-3 p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-xs text-mist-1">
          <Lock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-paper">Primary Super Admin Account</p>
            <p className="text-mist-2 mt-0.5">
              This is the root owner account for Rayida Tech. Its role and active status are
              permanently preserved to prevent accidental lockout.
            </p>
          </div>
        </div>
      )}

      {/* Account Info Card */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <h2 className="font-display font-semibold text-base text-paper border-b border-(--line) pb-3">
          1. Account Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1.5">
              Email Address <span className="text-secondary">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isRootAdmin || mode === 'edit'}
              required
              placeholder="colleague@example.com"
              className="w-full bg-paper/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary disabled:opacity-60 transition-colors"
            />
            {mode === 'create' && (
              <p className="text-[11px] text-mist-2 mt-1">
                The user can log into the admin dashboard with this email address.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1.5">
              Full Name or Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full bg-paper/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {mode === 'create' && (
            <div className="md:col-span-2 pt-2 border-t border-(--line)">
              <label className="block text-xs font-medium text-mist-1 mb-1.5">
                Initial Password (Optional / For Instant Sign-in)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password (min 6 characters)"
                  className="w-full bg-paper/5 border border-(--line) rounded-xl px-4 py-2.5 pr-10 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-2 hover:text-paper transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-mist-2 mt-1">
                Setting a password registers credentials so they can sign into /admin/login immediately.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Role Selection Card */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <h2 className="font-display font-semibold text-base text-paper">
            2. Assign Role
          </h2>
          <span className="text-xs text-mist-2">Select access level</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Super Admin */}
          <button
            type="button"
            disabled={isRootAdmin}
            onClick={() => setRole('super_admin')}
            className={`text-left p-4 rounded-xl border transition-all ${
              role === 'super_admin'
                ? 'bg-primary/20 border-secondary/60 shadow-md shadow-primary/20'
                : 'glass border-(--line) hover:border-white/20'
            } ${isRootAdmin ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary/30 flex items-center justify-center text-secondary">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="font-semibold text-sm text-paper">Super Admin</p>
            </div>
            <p className="text-xs text-mist-2 leading-relaxed">
              Full control over all content, user management, and roles.
            </p>
          </button>

          {/* Admin */}
          <button
            type="button"
            disabled={isRootAdmin}
            onClick={() => setRole('admin')}
            className={`text-left p-4 rounded-xl border transition-all ${
              role === 'admin'
                ? 'bg-secondary/15 border-secondary/60 shadow-md'
                : 'glass border-(--line) hover:border-white/20'
            } ${isRootAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                <Shield className="w-4 h-4" />
              </div>
              <p className="font-semibold text-sm text-paper">Admin</p>
            </div>
            <p className="text-xs text-mist-2 leading-relaxed">
              Full content management across all 8 portfolio modules. No user management.
            </p>
          </button>

          {/* Editor */}
          <button
            type="button"
            disabled={isRootAdmin}
            onClick={() => setRole('editor')}
            className={`text-left p-4 rounded-xl border transition-all ${
              role === 'editor'
                ? 'bg-white/10 border-accent-soft/50 shadow-md'
                : 'glass border-(--line) hover:border-white/20'
            } ${isRootAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-mist-1">
                <UserCheck className="w-4 h-4" />
              </div>
              <p className="font-semibold text-sm text-paper">Editor</p>
            </div>
            <p className="text-xs text-mist-2 leading-relaxed">
              Granular access. Assign specific sections (e.g. only Blog or Projects).
            </p>
          </button>
        </div>
      </div>

      {/* Permissions Matrix (Shown if Editor role is chosen) */}
      {role === 'editor' && (
        <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-(--line) pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary" />
                <h2 className="font-display font-semibold text-base text-paper">
                  3. Section Permissions
                </h2>
              </div>
              <p className="text-xs text-mist-2 mt-0.5">
                Check the modules this editor is permitted to view and manage.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAllPermissions}
                className="text-secondary hover:underline px-2 py-1 rounded bg-secondary/10 border border-secondary/20"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearAllPermissions}
                className="text-mist-2 hover:text-paper px-2 py-1 rounded bg-white/5 border border-(--line)"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {CONTENT_PERMISSIONS.map((perm) => {
              const isChecked = permissions.includes(perm.id)

              return (
                <label
                  key={perm.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-white/[0.01] border-(--line) hover:bg-white/[0.03]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => togglePermission(perm.id)}
                    className="mt-1 h-4 w-4 rounded border-(--line) bg-paper/5 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-paper">{perm.label}</p>
                    <p className="text-xs text-mist-2 leading-relaxed">{perm.description}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Account Status Card */}
      <div className="glass rounded-xl p-6 border border-(--line) flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-sm text-paper">Account Status</p>
          <p className="text-xs text-mist-2 mt-0.5">
            Active accounts can sign in and manage their permitted sections.
          </p>
        </div>

        <button
          type="button"
          disabled={isRootAdmin}
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
          } ${isRootAdmin ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-red-400'}`}
          />
          <span>{isActive ? 'Active' : 'Inactive / Suspended'}</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs text-mist-2 hover:text-paper transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel &amp; Return</span>
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors shadow-md shadow-primary/25 disabled:opacity-50"
        >
          {isPending ? (
            <span>Saving User...</span>
          ) : (
            <span>{mode === 'create' ? 'Create Administrator' : 'Save Changes'}</span>
          )}
        </button>
      </div>
    </form>
  )
}

