import { redirect } from 'next/navigation';

export default function AdminComingSoonNewRedirect() {
  redirect('/admin/products/new');
}
