import { createClient } from '@/lib/supabase/server';
import ProductsTableClient from '@/components/admin/products/ProductsTableClient';
import { normalizeProduct } from '@/lib/products';
import { defaultEcosystemProducts } from '@/lib/data/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products & Ecosystem Management | Rayida Tech Admin',
  description: 'Manage Rayida Tech proprietary products, status, and ecosystem waitlists.',
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ecosystem_products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  let products = (data || []).map(normalizeProduct);

  if (products.length === 0 && (!data || data.length === 0)) {
    // If table is completely fresh, display defaults for easy seeding/editing
    products = defaultEcosystemProducts.map(normalizeProduct);
  }

  return (
    <div className="space-y-6">
      <ProductsTableClient initialProducts={products} />
    </div>
  );
}
