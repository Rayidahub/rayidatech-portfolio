import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit } from 'lucide-react'
import DeleteButton from './DeleteButton'

export default async function AdminTestimonials() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id, name, role, company, is_active, sort_order')
    .order('sort_order', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-paper">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Testimonial
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="text-left text-mist-2 font-medium px-4 py-3">Name</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Role</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Company</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden lg:table-cell">Order</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden lg:table-cell">Active</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!testimonials || testimonials.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center text-mist-2 px-4 py-12">
                  No testimonials yet. Create your first one.
                </td>
              </tr>
            )}
            {testimonials?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-paper font-medium">{item.name}</td>
                <td className="px-4 py-3 text-mist-1 hidden sm:table-cell">{item.role || '—'}</td>
                <td className="px-4 py-3 text-mist-1 hidden md:table-cell">{item.company || '—'}</td>
                <td className="px-4 py-3 text-center text-mist-1 hidden lg:table-cell">{item.sort_order}</td>
                <td className="px-4 py-3 text-center hidden lg:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      item.is_active
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-white/5 text-mist-2'
                    }`}
                  >
                    {item.is_active ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/testimonials/${item.id}/edit`}
                      className="p-1.5 text-mist-2 hover:text-secondary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteButton id={item.id} name={item.name} />
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
