// app/admin/(dashboard)/outreach/research/page.tsx
import { Metadata } from 'next';
import ProspectResearchClient from '@/components/admin/outreach/ProspectResearchClient';

export const metadata: Metadata = {
  title: 'Lead Research & Prospect Finder | Rayida Tech Admin',
  description: 'Discover and enrich local Abuja and Nigerian business prospects with verified public emails.',
};

export default async function ProspectResearchPage() {
  return <ProspectResearchClient initialImportedEmails={[]} />;
}
