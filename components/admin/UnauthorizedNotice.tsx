'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { ShieldX, LogOut, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedNotice({ email }: { email: string }) {
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
          <ShieldX className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-paper">
            Unauthorized Access
          </h1>
          <p className="text-sm text-mist-1 leading-relaxed">
            The account (<span className="text-paper font-medium">{email}</span>) does not have administrative privileges for Rayida Tech.
          </p>
          <p className="text-xs text-mist-2">
            Please ask the Super Admin to invite your email address and grant you access.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign In with Different Account</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-xs text-mist-2 hover:text-paper transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
