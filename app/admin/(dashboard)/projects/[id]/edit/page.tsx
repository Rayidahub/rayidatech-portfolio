'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter, useParams } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SERVICE_CATEGORIES } from '@/lib/data/services'
import CaseStudyFields from '@/components/admin/CaseStudyFields'
import type { CaseStudy } from '@/types/project'

export default function EditProject() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    cover_image: '',
    role: '',
    duration: '',
    link: '',
    featured: false,
    category: '',
    tags: '',
    case_study: {} as CaseStudy,
  })

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }, [])

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }))
  }

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setNotFound(true)
          setLoading(false)
          return
        }
        const existingTags = Array.isArray(data.tags) ? data.tags : []
        const knownTitles = new Set<string>(SERVICE_CATEGORIES)
        const category =
          existingTags.find((t: string) => knownTitles.has(t)) || ''
        const otherTags = existingTags.filter((t: string) => t !== category)

        setForm({
          title: data.title,
          slug: data.slug,
          description: data.description,
          content: data.content ?? '',
          cover_image: data.cover_image ?? '',
          role: data.role ?? '',
          duration: data.duration ?? '',
          link: data.link ?? '',
          featured: data.featured ?? false,
          category,
          tags: otherTags.join(', '),
          case_study: (data.case_study as CaseStudy) || {},
        })
        setLoading(false)
      })
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    const categoryTag = form.category.trim()
    const additionalTags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const tags = categoryTag
      ? [categoryTag, ...additionalTags.filter((t) => t !== categoryTag)]
      : additionalTags

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        title: form.title,
        slug: form.slug,
        description: form.description,
        content: form.content,
        cover_image: form.cover_image || null,
        role: form.role || null,
        duration: form.duration || null,
        link: form.link || null,
        featured: form.featured,
        tags: tags.length > 0 ? tags : null,
        case_study: Object.keys(form.case_study).length > 0 ? form.case_study : null,
      })
      .eq('id', params.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  if (loading) {
    return <p className="text-mist-1">Loading...</p>
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <p className="text-mist-1">Project not found.</p>
        <Link href="/admin/projects" className="text-secondary text-sm mt-2 inline-block">
          ← Back to projects
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/projects" className="p-2 text-mist-2 hover:text-paper transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-paper">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-5 max-w-2xl">
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              required
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
              rows={2}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Content (Markdown)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={8}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Cover Image URL</label>
            <input
              type="url"
              value={form.cover_image}
              onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Role</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Duration</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Live Link</label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Service Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              required
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="" disabled>Select a service category</option>
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Additional Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 rounded border-(--line) bg-white/5 text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-mist-1">Featured project</span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2 border-t border-(--line) pt-8">
          <h2 className="font-display text-xl font-semibold text-paper mb-6">
            Case Study
          </h2>
          <CaseStudyFields
            value={form.case_study}
            onChange={(case_study) => setForm((p) => ({ ...p, case_study }))}
          />
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
