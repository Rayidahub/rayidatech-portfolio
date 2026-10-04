'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center p-2 rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 group mb-2"
            title="Return to main page"
          >
            <Image
              src="/brand/logo-light.png"
              alt="Rayida Tech"
              width={419}
              height={120}
              className="logo-light h-11 md:h-12 w-auto object-contain"
              style={{ width: 'auto', height: 'auto', maxHeight: '48px' }}
              priority
            />
            <Image
              src="/brand/logo-dark.png"
              alt="Rayida Tech"
              width={419}
              height={120}
              className="logo-dark h-11 md:h-12 w-auto object-contain"
              style={{ width: 'auto', height: 'auto', maxHeight: '48px' }}
              priority
            />
            <span className="sr-only">Rayida Tech</span>
          </Link>
          <h1 className="sr-only">Sign in to Rayida Tech Admin</h1>
          <p className="text-mist-1 text-sm">Sign in to the admin panel</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="glass-strong rounded-2xl p-6 md:p-8 space-y-4"
        >
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3.5 py-2.5">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-paper mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-paper/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-paper mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-paper/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 mt-2 shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
