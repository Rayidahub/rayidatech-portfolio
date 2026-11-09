import ProductForm from '@/components/admin/products/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Product | Rayida Tech Admin',
  description: 'Add a new product or software tool to the Rayida Tech ecosystem.',
};

export default function NewProductPage() {
  return <ProductForm mode="create" />;
}
