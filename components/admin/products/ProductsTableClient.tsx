'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, ExternalLink, Search, SlidersHorizontal, Plus } from 'lucide-react';
import type { EcosystemProduct } from '@/types/ecosystem-product';
import DeleteProductButton from './DeleteProductButton';
import ProductQuickStatusToggle from './ProductQuickStatusToggle';
import ProductStatsRow from './ProductStatsRow';
import SeedProductsButton from './SeedProductsButton';
import { filterProducts } from '@/lib/products';

interface ProductsTableClientProps {
  initialProducts: EcosystemProduct[];
}

export default function ProductsTableClient({ initialProducts }: ProductsTableClientProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'coming_soon' | 'inactive'>('all');

  const filteredProducts = filterProducts(initialProducts, {
    query,
    status: statusFilter === 'inactive' ? 'all' : statusFilter,
    includeInactive: true,
  }).filter((p) => {
    if (statusFilter === 'inactive') return !p.is_active;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-paper">Products & Ecosystem</h1>
            <span className="text-xs font-mono-tight px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
              {initialProducts.length} Items
            </span>
          </div>
          <p className="text-sm text-mist-1 mt-1">
            Manage Rayida Tech proprietary digital products, SaaS tools, and ecosystem waitlists.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-tight text-mist-1 hover:text-paper bg-white/5 hover:bg-white/10 border border-(--line) transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-secondary" />
            <span>Public Catalog</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors shadow-lg shadow-primary/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <ProductStatsRow products={initialProducts} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-(--line) overflow-x-auto">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'live', label: 'Live' },
            { id: 'coming_soon', label: 'Coming Soon' },
            { id: 'inactive', label: 'Inactive' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-1 hover:text-paper hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-mist-2 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, category, features..."
            className="w-full bg-white/5 border border-(--line) rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-hidden border border-(--line) shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="text-left text-mist-2 font-mono-tight text-xs uppercase px-4 py-3.5">Product</th>
                <th className="text-left text-mist-2 font-mono-tight text-xs uppercase px-4 py-3.5 hidden md:table-cell">
                  Category
                </th>
                <th className="text-center text-mist-2 font-mono-tight text-xs uppercase px-4 py-3.5">Status</th>
                <th className="text-left text-mist-2 font-mono-tight text-xs uppercase px-4 py-3.5 hidden lg:table-cell">
                  Launch Date
                </th>
                <th className="text-center text-mist-2 font-mono-tight text-xs uppercase px-4 py-3.5 hidden sm:table-cell">
                  Order
                </th>
                <th className="text-center text-mist-2 font-mono-tight text-xs uppercase px-4 py-3.5">Active</th>
                <th className="text-right text-mist-2 font-mono-tight text-xs uppercase px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-mist-2 px-4 py-16 space-y-3">
                    <p className="text-sm">No products found matching your current filters.</p>
                    {initialProducts.length === 0 && (
                      <div className="pt-2">
                        <SeedProductsButton />
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-(--line) last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-(--line) flex items-center justify-center text-xl shrink-0 shadow-inner">
                          {product.emoji || '🚀'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-semibold text-paper truncate">{product.name}</span>
                            {product.badge && (
                              <span className="text-[10px] font-mono-tight px-1.5 py-0.5 rounded bg-white/5 text-mist-1 border border-white/10">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          {product.tagline ? (
                            <p className="text-xs text-mist-2 truncate max-w-xs">{product.tagline}</p>
                          ) : (
                            <p className="text-xs text-mist-2 truncate max-w-xs">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-mono-tight bg-white/5 text-mist-1 border border-white/10">
                        {product.category || 'AI & Intelligence'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <ProductQuickStatusToggle
                        productId={product.id}
                        initialActive={product.is_active}
                        initialStatus={product.status}
                        mode="status"
                      />
                    </td>

                    <td className="px-4 py-3.5 hidden lg:table-cell text-xs font-mono-tight text-mist-1">
                      {product.launch_date ? (
                        <span>{new Date(product.launch_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      ) : (
                        <span className="text-mist-2">TBA</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center hidden sm:table-cell text-xs font-mono-tight text-mist-2">
                      #{product.sort_order}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <ProductQuickStatusToggle
                        productId={product.id}
                        initialActive={product.is_active}
                        initialStatus={product.status}
                        mode="active"
                      />
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/products#${product.slug || product.name.toLowerCase()}`}
                          target="_blank"
                          className="p-1.5 text-mist-2 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-mist-2 hover:text-paper hover:bg-white/5 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
