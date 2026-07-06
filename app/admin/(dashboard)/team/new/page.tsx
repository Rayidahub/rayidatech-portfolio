'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTeamMember() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    linkedin: '',
    twitter: '',
    github: '',
    website: '',
    sort_order: 0,
    is_active: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const socialLinks: Record<string, string> = {}
    if (form.linkedin.trim()) socialLinks.linkedin = form.linkedin.trim()
    if (form.twitter.trim()) socialLinks.twitter = form.twitter.trim()
    if (form.github.trim()) socialLinks.github = form.github.trim()
    if (form.website.trim()) socialLinks.website = form.website.trim()

    const supabase = createClient()
    const { error: insertError } = await supabase.from('team_members').insert({
      name: form.name,
      role: form.role,
      bio: form.bio,
      photo_url: form.photo_url || null,
      social_links: socialLinks,
      sort_order: form.sort_order,
      is_active: form.is_active,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/admin/team')
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/team"
          className="p-2 text-mist-2 hover:text-paper transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-paper">New Team Member</h1>
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
              placeholder="Raymond Gaius"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Role *</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              required
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Founder & Product Designer"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Bio *</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              required
              rows={4}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              placeholder="Short description about this team member..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Photo URL</label>
            <input
              type="url"
              value={form.photo_url}
              onChange={(e) => setForm((p) => ({ ...p, photo_url: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">LinkedIn</label>
            <input
              type="url"
              value={form.linkedin}
              onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">X / Twitter</label>
            <input
              type="url"
              value={form.twitter}
              onChange={(e) => setForm((p) => ({ ...p, twitter: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="https://x.com/..."
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">GitHub</label>
            <input
              type="url"
              value={form.github}
              onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="https://..."
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
            {saving ? 'Saving...' : 'Save Member'}
          </button>
        </div>
      </form>
    </div>
  )
}
