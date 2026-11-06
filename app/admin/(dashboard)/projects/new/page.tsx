'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Sparkles, FileText, Globe } from 'lucide-react'
import Link from 'next/link'
import ProjectClassificationCard from '@/components/admin/ProjectClassificationCard'
import CaseStudyFields from '@/components/admin/CaseStudyFields'
import BrandIdentityFields from '@/components/admin/BrandIdentityFields'
import ImageUploadField from '@/components/admin/ImageUploadField'
import ProjectActionBar from '@/components/admin/ProjectActionBar'
import type { CaseStudy, BrandIdentityCaseStudy, ProjectType, ProjectStatus } from '@/types/project'
import { buildStatusPayload, getProjectStatusBadge } from '@/lib/project-status'

export default function NewProject() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
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
    project_type: 'UI/UX Design' as ProjectType,
    published: true,
    status: 'published' as ProjectStatus,
    category: '',
    tags: '',
    case_study: {} as CaseStudy | BrandIdentityCaseStudy,
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

  function handleCategoryChange(category: string) {
    setForm((prev) => {
      // If user chooses Brand Identity, auto-align project_type
      const updatedType =
        category.toLowerCase() === 'brand identity'
          ? ('Brand Identity' as ProjectType)
          : prev.project_type;
      return {
        ...prev,
        category,
        project_type: updatedType,
      };
    });
  }

  function handleProjectTypeChange(project_type: ProjectType) {
    setForm((prev) => ({
      ...prev,
      project_type,
      // If user switches to Brand Identity and category is empty, auto-populate
      category:
        project_type === 'Brand Identity' && !prev.category
          ? 'Brand Identity'
          : prev.category,
    }));
  }

  const handleStatusToggle = useCallback(() => {
    setForm((p) => ({
      ...p,
      status: p.status === 'draft' ? 'published' : 'draft',
      published: p.status !== 'draft',
    }))
  }, [])

  async function saveProject(statusToSave: ProjectStatus = form.status) {
    if (!form.title.trim()) {
      setError('Please provide a project title.')
      return
    }
    if (!form.slug.trim()) {
      setError('Please provide a project slug.')
      return
    }

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

    const isDraft = statusToSave === 'draft'
    const statusPayload = buildStatusPayload(isDraft)

    // Prepare case study payload with explicit type and status indicators
    const caseStudyPayload = {
      ...(form.case_study || {}),
      case_study_type: form.project_type,
      project_type: form.project_type,
      published: statusPayload.published,
      status: statusPayload.status,
    }

    // Include project_type in tags as an additional safety guarantee
    const finalTags = form.project_type
      ? Array.from(new Set([...tags, form.project_type]))
      : tags

    const insertPayload: any = {
      title: form.title,
      slug: form.slug,
      description: form.description || (isDraft ? 'Draft project description' : ''),
      content: form.content,
      cover_image: form.cover_image || null,
      role: form.role || null,
      duration: form.duration || null,
      link: form.link || null,
      featured: form.featured,
      tags: finalTags.length > 0 ? finalTags : null,
      case_study: caseStudyPayload,
    }

    const { error: insertError } = await supabase.from('projects').insert(insertPayload)

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await saveProject(form.status)
  }

  // Keyboard shortcut: Ctrl+S / Cmd+S saves draft immediately
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveProject('draft')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [form, saving])

  const isBrandIdentity = form.project_type === 'Brand Identity'

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/projects"
          className="p-2 text-mist-2 hover:text-paper transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-paper">New Project</h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono-tight border ${
                form.status === 'draft'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  form.status === 'draft' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span>{form.status === 'draft' ? 'Draft' : 'Published'}</span>
            </span>
          </div>
          <p className="text-xs text-mist-2 mt-0.5">
            Create a showcase project or an in-depth brand identity case study
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-6 max-w-4xl">
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Top Control Action Bar */}
        <ProjectActionBar
          mode="new"
          status={form.status}
          saving={saving}
          onStatusToggle={handleStatusToggle}
          onSaveDraft={() => saveProject('draft')}
          onSavePublish={() => saveProject('published')}
          cancelHref="/admin/projects"
          position="top"
        />

        {/* Core Classification Grid (Collapsible) */}
        <ProjectClassificationCard
          projectType={form.project_type}
          onProjectTypeChange={handleProjectTypeChange}
          category={form.category}
          onCategoryChange={handleCategoryChange}
          defaultOpen={true}
        />

        {/* General Project Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="e.g. LUXE BY SEY — Brand Identity & Visual Design"
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
              placeholder="e.g. luxe-by-sey"
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Short Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
              rows={2}
              placeholder="A concise summary of the brand or digital product..."
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Content (Markdown / Overview)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={6}
              placeholder="Optional markdown notes or narrative description..."
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Project Cover Image *"
              value={form.cover_image}
              onChange={(url) => setForm((p) => ({ ...p, cover_image: url }))}
              folder="projects"
              description="High-resolution primary cover banner for portfolio cards and hero view"
            />
          </div>
          <div>
            <label className="block text-sm text-mist-1 mb-1.5">My Role</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="e.g. Brand Designer & Visual Strategist"
            />
          </div>
          <div>
            <label className="block text-sm text-mist-1 mb-1.5">Project Duration</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="e.g. 4 weeks"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Live Project Link</label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="https://..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-mist-1 mb-1.5">Additional Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Luxury, Beauty, Visual Identity, Packaging"
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
              <span className="text-sm text-mist-1">Featured project on homepage</span>
            </label>
          </div>
        </div>

        {/* Dynamic Case Study Section */}
        <div className="border-t border-(--line) pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-paper">
                  {isBrandIdentity
                    ? 'Brand Identity Case Study Form'
                    : 'Case Study Form'}
                </h2>
                <span className="text-[11px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                  {form.project_type}
                </span>
              </div>
              <p className="text-xs text-mist-2 mt-1">
                {isBrandIdentity
                  ? 'Tailored specifically for logos, color palettes, typography, merchandise, vehicle livery, packaging & visual systems.'
                  : 'Tailored for user pain points, flows, wireframes, component design systems and app mockups.'}
              </p>
            </div>
          </div>

          {isBrandIdentity ? (
            <BrandIdentityFields
              value={form.case_study as BrandIdentityCaseStudy}
              onChange={(case_study) => setForm((p) => ({ ...p, case_study }))}
            />
          ) : (
            <CaseStudyFields
              category={form.category}
              value={form.case_study as CaseStudy}
              onChange={(case_study) => setForm((p) => ({ ...p, case_study }))}
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-(--line)">
          <div className="flex items-center gap-2">
            <span className="text-xs text-mist-2">Target status:</span>
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  status: p.status === 'draft' ? 'published' : 'draft',
                  published: p.status !== 'draft',
                }))
              }
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                form.status === 'draft'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              Click to toggle: {form.status === 'draft' ? 'Draft Mode' : 'Live / Published'}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              href="/admin/projects"
              className="px-4 py-2.5 rounded-xl text-xs text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveProject('draft')}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-paper border border-(--line) hover:border-amber-500/40 rounded-xl px-5 py-2.5 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{saving ? 'Saving...' : 'Save as Draft'}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveProject('published')}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-xl px-6 py-2.5 text-xs font-medium transition-colors disabled:opacity-50 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{saving ? 'Publishing...' : 'Publish Project'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
