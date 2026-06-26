'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter, useParams } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditEcosystemProduct() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({
    name: '',
    emoji: '',
    description: '',
    status: 'coming_soon' as 'coming_soon' | 'live',
    launch_date: '',
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('ecosystem_products')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setForm({
          name: data.name,
          emoji: data.emoji,
          description: data.description,
          status: data.status,
          launch_date: data.launch_date ? data.launch_date.slice(0, 10) : '',
          sort_order: data.sort_order,
          is_active: data.is_active,
        })
        setLoading(false)
      })
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('ecosystem_products')
      .update({
        name: form.name,
        emoji: form.emoji,
        description: form.description,
        status: form.status,
        launch_date: form.launch_date || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      })
      .eq('id', params.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push('/admin/coming-soon')
    router.refresh()
  }

  if (loading) {
    return <p className="text-mist-1">Loading...</p>
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <p className="text-mist-1">Product not found.</p>
        <Link href="/admin/coming-soon" className="text-secondary text-sm mt-2 inline-block">
          ← Back to products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/coming-soon"
          className="p-2 text-mist-2 hover:text-paper transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-paper">Edit Ecosystem Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-5 max-w-2xl">
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Emoji *</label>
            <input
              type="text"
              value={form.emoji}
              onChange={(e) => setForm((p) => ({ ...p, emoji: e.target.value }))}
              required
              maxLength={10}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Status *</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'coming_soon' | 'live' }))}
              required
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="coming_soon">Coming Soon</option>
              <option value="live">Live</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
              rows={3}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Launch Date</label>
            <input
              type="date"
              value={form.launch_date}
              onChange={(e) => setForm((p) => ({ ...p, launch_date: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value, 10) || 0 }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-(--line) bg-white/5 text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-mist-1">Visible on site</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
