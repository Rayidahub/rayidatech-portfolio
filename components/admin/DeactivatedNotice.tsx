'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { ShieldAlert, LogOut } from 'lucide-react'

export default function DeactivatedNotice({ email }: { email: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="glass max-w-md w-full rounded-2xl p-8 text-center space-y-5 border border-red-500/20">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-paper">
            Account Inactive
          </h1>
          <p className="text-sm text-mist-1 leading-relaxed">
            Your administrator account (<span className="text-paper font-medium">{email}</span>) has been deactivated by the Super Admin.
          </p>
          <p className="text-xs text-mist-2">
            If you believe this is in error, please contact the portfolio owner to restore your access.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper border border-(--line) transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

