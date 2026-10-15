import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import SubscribersClient, { type Subscriber } from './SubscribersClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Newsletter Subscribers | Admin',
  description: 'Manage and export your newsletter subscribers list.',
};

export default async function AdminSubscribersPage() {
  const supabase = await createClient();
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error);
  }

  return <SubscribersClient initialSubscribers={(subscribers as Subscriber[]) || []} />;
}

