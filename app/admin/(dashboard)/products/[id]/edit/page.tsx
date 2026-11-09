import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/products/ProductForm';
import { normalizeProduct } from '@/lib/products';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Product | Rayida Tech Admin',
  description: 'Update ecosystem product specifications, roadmap status, and links.',
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ecosystem_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <h2 className="font-display text-xl font-semibold text-paper">Product Not Found</h2>
        <p className="text-sm text-mist-1">
          The requested product could not be located in the database.
        </p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Products Catalog</span>
        </Link>
      </div>
    );
  }

  const product = normalizeProduct(data);

  return <ProductForm mode="edit" initialProduct={product} />;
}
