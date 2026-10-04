import type { Metadata } from 'next';
import { getContactSettings } from '@/lib/data/contact-settings';
import ContactClient from '@/components/contact/ContactClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project with Raymond Gaius — Product Designer & AI Engineer at Rayida Tech. Send a project brief or reach out directly on WhatsApp.',
};

export default async function ContactPage() {
  const settings = await getContactSettings();

  return <ContactClient settings={settings} />;
}
