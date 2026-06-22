import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit, ExternalLink } from 'lucide-react'
import DeleteButton from './DeleteButton'

export default async function AdminProjects() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, featured, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-paper">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="text-left text-mist-2 font-medium px-4 py-3">Title</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Slug</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Featured</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!projects || projects.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center text-mist-2 px-4 py-12">
                  No projects yet. Create your first one.
                </td>
              </tr>
            )}
            {projects?.map((project) => (
              <tr
                key={project.id}
                className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-paper font-medium">{project.title}</td>
                <td className="px-4 py-3 text-mist-1 hidden sm:table-cell">{project.slug}</td>
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
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="p-1.5 text-mist-2 hover:text-paper transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="p-1.5 text-mist-2 hover:text-secondary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteButton id={project.id} title={project.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
