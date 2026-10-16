'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, FileSpreadsheet, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ImageUploadField from '@/components/admin/ImageUploadField'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import BlogImportModal, { type ParsedBlogPost } from '@/components/admin/BlogImportModal'

export default function NewPost() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    tags: '',
    published: false,
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

  // Populate form from uploaded spreadsheet post
  const handleLoadFromSpreadsheet = (post: ParsedBlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug || generateSlug(post.title),
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image,
      tags: post.tags.join(', '),
      published: post.published,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const { error: insertError } = await supabase.from('posts').insert({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image || null,
      tags: tags.length > 0 ? tags : null,
      published: form.published,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/admin/blog')
    router.refresh()
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 text-mist-2 hover:text-paper hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-paper">New Article</h1>
            <p className="text-xs text-mist-2">
              Compose a markdown write-up or auto-populate from a CSV/Excel file.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowImportModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-(--line) text-paper text-xs font-medium transition-all shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-secondary" />
          <span>Import from CSV / Excel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-6 border border-(--line)">
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3 border border-red-500/20">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-paper mb-1.5">Article Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Designing AI Systems People Can Trust"
              required
              className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-3 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-paper mb-1.5">Slug (URL identifier) *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="auto-generated-from-title"
              required
              className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-3 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-paper mb-1.5">Excerpt / Summary *</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              placeholder="A brief 1-2 sentence preview that appears on blog listing cards and search engines..."
              required
              rows={2}
              className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-3 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary/50 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* High-Standard Markdown Editor */}
          <div className="sm:col-span-2">
            <MarkdownEditor
              value={form.content}
              onChange={(newContent) => setForm((p) => ({ ...p, content: newContent }))}
              label="Article Write-up (Markdown)"
              placeholder="Write your article in Markdown. Use toolbar buttons or keyboard shortcuts for Bold (Ctrl+B), Italic (Ctrl+I), Headings, Lists, Quotes, or upload images directly..."
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Cover Image"
              value={form.cover_image}
              onChange={(url) => setForm((p) => ({ ...p, cover_image: url }))}
              folder="blog"
              description="Upload a high-resolution cover banner from your device (PNG, JPG, WebP) or paste an image URL"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-paper mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-3 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="AI, Product Design, Fintech, UX"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                className="w-4 h-4 rounded accent-primary border-(--line)"
              />
              <span className="text-sm font-medium text-paper">Publish immediately to public blog</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--line)">
          <Link
            href="/admin/blog"
            className="px-4 py-2.5 rounded-xl text-xs text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-glow inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Article...' : 'Publish / Save Article'}</span>
          </button>
        </div>
      </form>

      {/* Spreadsheet Import Modal */}
      <BlogImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSelectForEditor={handleLoadFromSpreadsheet}
      />
    </div>
  )
}
