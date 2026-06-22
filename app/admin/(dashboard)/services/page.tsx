import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit } from 'lucide-react'
import DeleteButton from './DeleteButton'

export default async function AdminServices() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, title, slug, order, created_at')
    .order('order', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-paper">Services</h1>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Service
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="text-left text-mist-2 font-medium px-4 py-3">Title</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Slug</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Order</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!services || services.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center text-mist-2 px-4 py-12">
                  No services yet. Create your first one.
                </td>
              </tr>
            )}
            {services?.map((service) => (
              <tr
                key={service.id}
                className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-paper font-medium">{service.title}</td>
                <td className="px-4 py-3 text-mist-1 hidden sm:table-cell">{service.slug}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-white/5 text-mist-1">
                    {service.order}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="p-1.5 text-mist-2 hover:text-secondary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteButton id={service.id} title={service.title} />
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
