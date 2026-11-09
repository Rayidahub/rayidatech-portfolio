import { redirect } from 'next/navigation';

export default function AdminComingSoonRedirect() {
  redirect('/admin/products');
}
