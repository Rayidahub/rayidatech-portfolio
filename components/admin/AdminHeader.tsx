'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AdminHeader({ email }: { email: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="h-16 border-b border-(--line) flex items-center justify-end px-6 gap-4 bg-[var(--ink)]">
      <span className="text-sm text-mist-1">{email}</span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-mist-2 hover:text-paper transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  )
}
