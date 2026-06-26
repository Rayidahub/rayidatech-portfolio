import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit } from 'lucide-react'
import DeleteButton from './DeleteButton'

export default async function AdminComingSoon() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('ecosystem_products')
    .select('id, name, emoji, status, launch_date, sort_order, is_active')
    .order('sort_order', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-paper">Coming Soon</h1>
        <Link
          href="/admin/coming-soon/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="text-left text-mist-2 font-medium px-4 py-3">Product</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Status</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Launch Date</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden lg:table-cell">Order</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden lg:table-cell">Active</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center text-mist-2 px-4 py-12">
                  No products yet. Create your first one.
                </td>
              </tr>
            )}
            {products?.map((product) => (
              <tr
                key={product.id}
                className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{product.emoji}</span>
                    <span className="text-paper font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      product.status === 'live'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {product.status === 'live' ? 'Live' : 'Coming Soon'}
                  </span>
                </td>
                <td className="px-4 py-3 text-mist-1 hidden md:table-cell">
                  {product.launch_date
                    ? new Date(product.launch_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="px-4 py-3 text-center text-mist-1 hidden lg:table-cell">
                  {product.sort_order}
                </td>
                <td className="px-4 py-3 text-center hidden lg:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      product.is_active
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-white/5 text-mist-2'
                    }`}
                  >
                    {product.is_active ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/coming-soon/${product.id}/edit`}
                      className="p-1.5 text-mist-2 hover:text-secondary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteButton id={product.id} name={product.name} />
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
