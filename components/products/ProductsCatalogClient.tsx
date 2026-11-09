'use client';

import { useState } from 'react';
import { Search, Sparkles, Filter, RefreshCcw } from 'lucide-react';
import type { EcosystemProduct } from '@/types/ecosystem-product';
import ProductPublicCard from './ProductPublicCard';
import ProductWaitlistModal from './ProductWaitlistModal';
import Reveal from '@/components/ui/Reveal';
import { filterProducts } from '@/lib/products';
import { PRODUCT_CATEGORIES } from '@/lib/data/products';

interface ProductsCatalogClientProps {
  products: EcosystemProduct[];
}

export default function ProductsCatalogClient({ products }: ProductsCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeWaitlistProduct, setActiveWaitlistProduct] = useState<EcosystemProduct | null>(null);

  const filtered = filterProducts(products, {
    category: selectedCategory,
    status: selectedStatus,
    query: searchQuery,
    includeInactive: false,
  });

  function resetFilters() {
    setSelectedCategory('All');
    setSelectedStatus('all');
    setSearchQuery('');
  }

  return (
    <div className="space-y-10">
      {/* Search and Filters Bar */}
      <div className="glass rounded-2xl p-4 sm:p-5 border border-(--line) shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-mist-2 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, capabilities, or tech stack..."
              className="w-full bg-white/5 border border-(--line) rounded-xl pl-10 pr-4 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-(--line) shrink-0 self-start md:self-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'live', label: 'Live' },
              { id: 'coming_soon', label: 'Coming Soon' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tight transition-colors whitespace-nowrap cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-mist-1 hover:text-paper hover:bg-white/5'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-(--line)">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono-tight text-mist-2 mr-1">
            <Filter className="w-3.5 h-3.5 text-secondary" />
            <span>Category:</span>
          </div>
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono-tight transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-secondary/20 text-secondary border border-secondary/40 font-semibold'
                    : 'bg-white/5 text-mist-1 border border-white/10 hover:text-paper hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs font-mono-tight text-mist-2 px-1">
        <span>
          Showing {filtered.length} of {products.length} Ecosystem {products.length === 1 ? 'Product' : 'Products'}
        </span>
        {(selectedCategory !== 'All' || selectedStatus !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-secondary hover:underline cursor-pointer"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-(--line) space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-(--line) flex items-center justify-center text-xl mx-auto text-mist-2">
            🔍
          </div>
          <h3 className="font-display text-lg font-semibold text-paper">No Matching Products</h3>
          <p className="text-sm text-mist-1 leading-relaxed">
            We couldn&apos;t find any products matching your current category or search criteria.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/20 border border-secondary/25 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, idx) => (
            <Reveal key={product.id} index={idx} className="h-full">
              <div id={product.slug || product.name.toLowerCase()} className="h-full scroll-mt-28">
                <ProductPublicCard
                  product={product}
                  onOpenWaitlist={(p) => setActiveWaitlistProduct(p)}
                />
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Waitlist Modal */}
      <ProductWaitlistModal
        product={activeWaitlistProduct}
        onClose={() => setActiveWaitlistProduct(null)}
      />
    </div>
  );
}
