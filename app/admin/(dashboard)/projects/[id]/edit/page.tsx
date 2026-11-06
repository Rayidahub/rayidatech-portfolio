'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter, useParams } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SERVICE_CATEGORIES } from '@/lib/data/services'
import ServiceCategorySelect from '@/components/admin/ServiceCategorySelect'
import ProjectTypeSelect from '@/components/admin/ProjectTypeSelect'
import CaseStudyFields from '@/components/admin/CaseStudyFields'
import BrandIdentityFields from '@/components/admin/BrandIdentityFields'
import ImageUploadField from '@/components/admin/ImageUploadField'
import { inferProjectType } from '@/lib/brand-identity'
import type { CaseStudy, BrandIdentityCaseStudy, ProjectType } from '@/types/project'

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
    project_type: 'UI/UX Design' as ProjectType,
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
      category:
        project_type === 'Brand Identity' && !prev.category
          ? 'Brand Identity'
          : prev.category,
    }));
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

        // Safe backward-compatible project_type determination via shared inference
        const inferredType: ProjectType = inferProjectType({
          ...data,
          tags: existingTags,
        })

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
          project_type: inferredType,
          category,
          tags: otherTags.join(', '),
          case_study: (data.case_study as CaseStudy | BrandIdentityCaseStudy) || {},
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

    // Prepare case study payload with explicit type indicator
    const caseStudyPayload = {
      ...(form.case_study || {}),
      case_study_type: form.project_type,
      project_type: form.project_type,
    }

    const finalTags = form.project_type
      ? Array.from(new Set([...tags, form.project_type]))
      : tags

    const updatePayload: any = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      content: form.content,
      cover_image: form.cover_image || null,
      role: form.role || null,
      duration: form.duration || null,
      link: form.link || null,
      featured: form.featured,
      tags: finalTags.length > 0 ? finalTags : null,
      case_study: caseStudyPayload,
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update(updatePayload)
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
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">Edit Project</h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Manage project taxonomy, media assets, and case study details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-6 max-w-4xl">
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Core Classification Grid */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-4">
          <div className="flex items-center justify-between border-b border-(--line) pb-2">
            <span className="text-xs font-mono-tight uppercase tracking-wider text-mist-1">
              Project Architecture & Classification
            </span>
            <span className="text-[11px] text-secondary font-mono-tight">
              Determines Form & Public View
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-paper mb-1.5">
                Project Type *
              </label>
              <ProjectTypeSelect
                value={form.project_type}
                onChange={handleProjectTypeChange}
              />
              <p className="text-[11px] text-mist-2 mt-1">
                Switches the case study form and public presentation layout.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-paper mb-1.5">
                Service Category *
              </label>
              <ServiceCategorySelect
                value={form.category}
                onChange={handleCategoryChange}
                required
              />
              <p className="text-[11px] text-mist-2 mt-1">
                Controls portfolio filtering tags and public taxonomy.
              </p>
            </div>
          </div>
        </div>

        {/* General Project Meta */}
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
            <label className="block text-sm text-mist-1 mb-1.5">Content (Markdown / Notes)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={6}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors font-mono-tight"
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Project Cover Image"
              value={form.cover_image}
              onChange={(url) => setForm((p) => ({ ...p, cover_image: url }))}
              folder="projects"
              description="High-resolution primary cover banner for portfolio cards and hero view"
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

        <div className="flex justify-end pt-4 border-t border-(--line)">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
