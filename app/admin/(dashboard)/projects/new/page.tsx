'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, Sparkles } from 'lucide-react'

import Link from 'next/link'
import ProjectClassificationCard from '@/components/admin/ProjectClassificationCard'
import ProjectDetailsCard from '@/components/admin/ProjectDetailsCard'
import CaseStudyFields from '@/components/admin/CaseStudyFields'

import BrandIdentityFields from '@/components/admin/BrandIdentityFields'
import ImageUploadField from '@/components/admin/ImageUploadField'
import ProjectActionBar from '@/components/admin/ProjectActionBar'
import type { CaseStudy, BrandIdentityCaseStudy, ProjectType, ProjectStatus } from '@/types/project'
import { buildStatusPayload, getProjectStatusBadge } from '@/lib/project-status'
import { getCoverAspectBadge } from '@/lib/project-card-image'

export default function NewProject() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [caseStudyOpen, setCaseStudyOpen] = useState(false)
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
      card_image: effectiveCardImage,
      role: form.role || null,
      duration: form.duration || null,
      link: form.link || null,
      featured: form.featured,
      tags: finalTags.length > 0 ? finalTags : null,
      case_study: caseStudyPayload,
    }

    let { error: insertError } = await supabase.from('projects').insert(insertPayload)

    // Resilient fallback if direct card_image column is not yet present on remote DB
    if (insertError && insertError.message?.toLowerCase().includes('card_image')) {
      delete insertPayload.card_image
      const retryResult = await supabase.from('projects').insert(insertPayload)
      insertError = retryResult.error
    }

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

        {/* Top Control Action Bar (Sticky at top of view) */}
        <ProjectActionBar
          mode="new"
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


        {/* Dynamic Case Study Section (Collapsible, default collapsed) */}
        <div
          data-testid="case-study-section-card"
          data-state={caseStudyOpen ? 'open' : 'collapsed'}
          className="rounded-xl bg-white/[0.02] border border-(--line) overflow-hidden transition-all duration-200"
        >
          <button
            type="button"
            onClick={() => setCaseStudyOpen((prev) => !prev)}
            aria-expanded={caseStudyOpen}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors focus:outline-none focus:bg-white/[0.03] cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-mist-1 font-medium">
                    {isBrandIdentity
                      ? 'Brand Identity Case Study Architecture'
                      : 'Case Study Architecture & Deliverables'}
                  </span>
                  <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                    {form.project_type}
                  </span>
                  <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-white/5 border border-(--line) text-mist-1">
                    {isBrandIdentity ? '9 Modular Sections' : '10 Modular Sections'}
                  </span>
                </div>
                <p className="text-[11px] text-mist-2 mt-0.5 truncate">
                  {isBrandIdentity
                    ? 'Logos, color palettes, typography, merchandise, product packaging & visual systems.'
                    : 'Problem framing, research, design process, interactive systems, and final deliverables.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-[10px] font-mono-tight text-mist-2 hidden sm:inline-block">
                {caseStudyOpen ? 'Click to collapse' : 'Click to expand'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-mist-2 transition-transform duration-200 ${
                  caseStudyOpen ? 'rotate-180 text-primary' : ''
                }`}
              />
            </div>
          </button>

          {caseStudyOpen && (
            <div className="p-4 sm:p-6 border-t border-(--line) space-y-6 animate-fade-in">
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
          )}
        </div>


        {/* Bottom Control Action Bar */}
        <ProjectActionBar
          mode="new"
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
