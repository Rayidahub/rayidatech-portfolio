'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SERVICE_CATEGORIES } from '@/lib/data/services'
import ProjectClassificationCard from '@/components/admin/ProjectClassificationCard'
import ProjectDetailsCard from '@/components/admin/ProjectDetailsCard'
import CaseStudyFields from '@/components/admin/CaseStudyFields'

import BrandIdentityFields from '@/components/admin/BrandIdentityFields'
import ImageUploadField from '@/components/admin/ImageUploadField'
import ProjectActionBar from '@/components/admin/ProjectActionBar'
import { inferProjectType } from '@/lib/brand-identity'
import { isProjectPublished, getProjectStatus, buildStatusPayload } from '@/lib/project-status'
import type { CaseStudy, BrandIdentityCaseStudy, ProjectType, ProjectStatus } from '@/types/project'
import { getCoverAspectBadge } from '@/lib/project-card-image'

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
    card_image: '',
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

        const published = isProjectPublished(data)
        const status = getProjectStatus(data)

        setForm({
          title: data.title,
          slug: data.slug,
          description: data.description,
          content: data.content ?? '',
          cover_image: data.cover_image ?? '',
          card_image: (data as any).card_image ?? data.case_study?.card_image ?? '',
          role: data.role ?? '',
          duration: data.duration ?? '',
          link: data.link ?? '',
          featured: data.featured ?? false,
          project_type: inferredType,
          published,
          status,
          category,
          tags: otherTags.join(', '),
          case_study: (data.case_study as CaseStudy | BrandIdentityCaseStudy) || {},
        })
        setLoading(false)
      })
  }, [params.id])

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
    const effectiveCardImage = form.card_image.trim() || form.cover_image.trim() || null

    // Prepare case study payload with explicit type, status, and card_image indicators
    const caseStudyPayload = {
      ...(form.case_study || {}),
      case_study_type: form.project_type,
      project_type: form.project_type,
      published: statusPayload.published,
      status: statusPayload.status,
      card_image: effectiveCardImage,
    }

    const finalTags = form.project_type
      ? Array.from(new Set([...tags, form.project_type]))
      : tags

    const updatePayload: any = {
      title: form.title,
      slug: form.slug,
      description: form.description || (isDraft ? 'Draft project description' : ''),
      content: form.content,
      cover_image: form.cover_image || null,
      card_image: effectiveCardImage,
      role: form.role || null,
      duration: form.duration || null,
      link: form.link || null,
      featured: form.featured,
      tags: finalTags.length > 0 ? finalTags : null,
      case_study: caseStudyPayload,
    }

    let { error: updateError } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', params.id)

    // Resilient fallback if direct card_image column is not yet present on remote DB
    if (updateError && updateError.message?.toLowerCase().includes('card_image')) {
      delete updatePayload.card_image
      const retryResult = await supabase
        .from('projects')
        .update(updatePayload)
        .eq('id', params.id)
      updateError = retryResult.error
    }

    if (updateError) {
      setError(updateError.message)
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
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-paper">Edit Project</h1>
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
            Manage project taxonomy, media assets, and case study details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-6 max-w-4xl">
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Top Control Action Bar (Sticky at top of view) */}
        <ProjectActionBar
          mode="edit"
          status={form.status}
          saving={saving}
          onStatusToggle={handleStatusToggle}
          onSaveDraft={() => saveProject('draft')}
          onSavePublish={() => saveProject('published')}
          cancelHref="/admin/projects"
          position="top"
          isSticky={true}
        />

        {/* Core Classification Grid (Collapsible, default collapsed) */}
        <ProjectClassificationCard
          projectType={form.project_type}
          onProjectTypeChange={handleProjectTypeChange}
          category={form.category}
          onCategoryChange={handleCategoryChange}
          defaultOpen={false}
        />

        {/* General Project Details & Media (Collapsible, default collapsed) */}
        <ProjectDetailsCard
          form={form}
          onChange={(field, val) => setForm((p) => ({ ...p, [field]: val }))}
          onTitleChange={handleTitleChange}
          defaultOpen={false}
        />


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

        {/* Bottom Control Action Bar */}
        <ProjectActionBar
          mode="edit"
          status={form.status}
          saving={saving}
          onStatusToggle={handleStatusToggle}
          onSaveDraft={() => saveProject('draft')}
          onSavePublish={() => saveProject('published')}
          cancelHref="/admin/projects"
          position="bottom"
        />
      </form>
    </div>
  )
}
