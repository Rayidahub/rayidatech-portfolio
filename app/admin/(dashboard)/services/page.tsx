import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit, ExternalLink, Sparkles, Package } from 'lucide-react'
import DeleteButton from './DeleteButton'
import SeedServicesButton from './SeedServicesButton'
import { ServiceIcon } from '@/lib/service-icons'

export const dynamic = 'force-dynamic'

export default async function AdminServices() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, title, slug, headline, icon_name, order, created_at')
    .order('order', { ascending: true })

  const hasServices = services && services.length > 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--line) pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Package className="w-6 h-6 text-secondary" />
            <h1 className="font-display text-2xl font-semibold text-paper">
              Services Management
            </h1>
          </div>
          <p className="text-xs text-mist-2 mt-1">
            Create, edit, and organize all dynamic service offerings displayed on your portfolio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/services"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-mist-1 hover:text-secondary border border-(--line) hover:border-secondary/40 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Service</span>
          </Link>
        </div>
      </div>

      {/* Services Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line) bg-white/[0.02]">
              <th className="text-left text-mist-2 font-medium px-4 py-3.5">Service</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3.5 hidden sm:table-cell">Slug &amp; Public Link</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3.5 hidden md:table-cell">Order</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!hasServices && (
              <tr>
                <td colSpan={4} className="text-center text-mist-2 px-4 py-16">
                  <div className="max-w-md mx-auto space-y-4">
                    <p className="text-paper font-medium text-base">
                      No services found in database yet
                    </p>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      You can create a brand new custom service right away, or import the 7
                      pre-configured portfolio services into your Supabase database with one click.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <SeedServicesButton />
                      <Link
                        href="/admin/services/new"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create New Custom Service</span>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {services?.map((service) => (
              <tr
                key={service.id}
                className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                {/* Service title + icon */}
                <td className="px-4 py-3.5 text-paper font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-(--line) flex items-center justify-center text-secondary shrink-0">
                      <ServiceIcon name={service.icon_name} className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-paper text-sm">{service.title}</p>
                      {service.headline && (
                        <p className="text-xs text-mist-2 truncate max-w-xs">{service.headline}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Slug & live link */}
                <td className="px-4 py-3.5 text-mist-1 hidden sm:table-cell">
                  <a
                    href={`/services/${service.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono-tight text-xs text-mist-1 hover:text-secondary transition-colors"
                  >
                    <span>/services/{service.slug}</span>
                    <ExternalLink className="w-3 h-3 text-mist-2" />
                  </a>
                </td>

                {/* Display Order */}
                <td className="px-4 py-3.5 text-center hidden md:table-cell">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono-tight bg-secondary/10 text-secondary border border-secondary/20">
                    #{service.order}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="p-1.5 text-mist-2 hover:text-secondary transition-colors rounded-lg hover:bg-white/5"
                      title="Edit service"
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

      {hasServices && (
        <div className="flex items-center justify-between text-xs text-mist-2 px-1 pt-2">
          <span>{services.length} services configured</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-secondary" />
            Changes sync live to your public site
          </span>
        </div>
      )}
    </div>
  )
}
