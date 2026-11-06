import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit, ExternalLink } from 'lucide-react'
import DeleteButton from './DeleteButton'
import ProjectImportModal from './ProjectImportModal'
import ProjectStatusToggle from './ProjectStatusToggle'
import ProjectThumbnailCell from './ProjectThumbnailCell'
import { normalizeSlug } from '@/lib/slug'
import { inferProjectType } from '@/lib/brand-identity'
import { isProjectPublished, getProjectStatus, getProjectStatusBadge } from '@/lib/project-status'
import { getProjectCoverImage } from '@/lib/project-thumbnail'

interface AdminProjectsProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminProjects({ searchParams }: AdminProjectsProps) {
  const resolvedSearchParams = await searchParams
  const currentTab = resolvedSearchParams?.status || 'all'

  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, cover_image, featured, tags, case_study, created_at')
    .order('created_at', { ascending: false })

  const allProjects = projects || []
  const publishedCount = allProjects.filter(isProjectPublished).length
  const draftCount = allProjects.length - publishedCount

  const filteredProjects = allProjects.filter((p) => {
    if (currentTab === 'published') return isProjectPublished(p)
    if (currentTab === 'draft') return !isProjectPublished(p)
    return true
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">Projects</h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Manage your portfolio case studies, single project showcases, and live links.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProjectImportModal />
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-(--line) pb-2">
        <Link
          href="/admin/projects"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'all'
              ? 'bg-white/10 text-paper border border-(--line)'
              : 'text-mist-2 hover:text-paper hover:bg-white/5'
          }`}
        >
          All ({allProjects.length})
        </Link>
        <Link
          href="/admin/projects?status=published"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'published'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-mist-2 hover:text-paper hover:bg-white/5'
          }`}
        >
          Published ({publishedCount})
        </Link>
        <Link
          href="/admin/projects?status=draft"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'draft'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-mist-2 hover:text-paper hover:bg-white/5'
          }`}
        >
          Drafts ({draftCount})
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line) bg-white/[0.02]">
              <th className="text-left text-mist-2 font-medium px-4 py-3 w-20 sm:w-24">Cover</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3">Title</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Slug</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Type</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3">Status</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Featured</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-mist-2 px-4 py-12">
                  {currentTab === 'draft'
                    ? 'No draft projects found. You can save any project as a draft.'
                    : currentTab === 'published'
                    ? 'No published projects found.'
                    : 'No projects yet. Create your first one or import via CSV/XLSX.'}
                </td>
              </tr>
            )}
            {filteredProjects.map((project) => {
              const displayType = inferProjectType(project)
              const isBrand = displayType === 'Brand Identity'
              const isPublished = isProjectPublished(project)
              const status = getProjectStatus(project)
              const badge = getProjectStatusBadge(status)
              const coverImageUrl = getProjectCoverImage(project)

              return (
                <tr
                  key={project.id}
                  className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-2.5 w-20 sm:w-24">
                    <ProjectThumbnailCell
                      id={project.id}
                      title={project.title}
                      slug={project.slug}
                      coverImage={coverImageUrl}
                      projectType={displayType}
                      status={status}
                      isPublished={isPublished}
                    />
                  </td>
                  <td className="px-4 py-3 text-paper font-medium">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="hover:text-secondary transition-colors"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-mist-1 hidden sm:table-cell font-mono-tight text-xs">
                    {project.slug}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono-tight border ${
                        isBrand
                          ? 'bg-primary/15 text-accent-soft border-primary/30'
                          : 'bg-white/5 text-mist-1 border-(--line)'
                      }`}
                    >
                      {displayType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ProjectStatusToggle
                      id={project.id}
                      title={project.title}
                      currentStatus={status}
                      currentCaseStudy={project.case_study}
                    />
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        project.featured
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-white/5 text-mist-2'
                      }`}
                    >
                      {project.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/projects/${normalizeSlug(project.slug)}`}
                        target="_blank"
                        className="p-1.5 text-mist-2 hover:text-paper transition-colors"
                        title={isPublished ? 'View live case study' : 'Preview draft case study'}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="p-1.5 text-mist-2 hover:text-secondary transition-colors"
                        title="Edit project"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
