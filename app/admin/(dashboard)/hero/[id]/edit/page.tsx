'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter, useParams } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ImageUploadField from '@/components/admin/ImageUploadField'

export default function EditHeroSlide() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({
    label: '',
    words: '',
    body: '',
    image: '',
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('hero_slides')
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
          label: data.label,
          words: Array.isArray(data.words) ? data.words.join('\n') : '',
          body: data.body,
          image: data.image ?? '',
          sort_order: data.sort_order ?? 0,
          is_active: data.is_active ?? true,
        })
        setLoading(false)
      })
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!form.image) {
      setError('Please upload or provide an image URL.')
      setSaving(false)
      return
    }

    const words = form.words
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (words.length === 0) {
      setError('Please provide at least one headline line.')
      setSaving(false)
      return
    }

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('hero_slides')
      .update({
        label: form.label,
        words,
        body: form.body,
        image: form.image,
        sort_order: form.sort_order,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push('/admin/hero')
    router.refresh()
  }

  if (loading) {
    return <p className="text-mist-1">Loading...</p>
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <p className="text-mist-1">Slide not found.</p>
        <Link href="/admin/hero" className="text-secondary text-sm mt-2 inline-block">
          ← Back to hero slides
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/hero" className="p-2 text-mist-2 hover:text-paper transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-paper">Edit Hero Slide</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-5 max-w-2xl">
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Label *</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              required
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">
              Headline lines * (one per line)
            </label>
            <textarea
              value={form.words}
              onChange={(e) => setForm((p) => ({ ...p, words: e.target.value }))}
              required
              rows={4}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
            <p className="text-xs text-mist-2 mt-1.5">
              The last line gets the violet → cyan gradient accent.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Body *</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              required
              rows={3}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Slide Image *"
              value={form.image}
              onChange={(url) => setForm((p) => ({ ...p, image: url }))}
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Display Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-(--line) bg-white/5 text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-mist-1">Active</span>
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
