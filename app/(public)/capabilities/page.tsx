import type { Metadata } from 'next';
import CapabilitiesViewer from '@/components/capabilities/CapabilitiesViewer';

export const metadata: Metadata = {
  title: 'Capabilities Statement & Pitch Deck',
  description:
    'One-page capability statement and pitch deck for prospective clients and agency partners. Product Design, Next.js Full-Stack Engineering, and Explainable AI by Raymond Gaius at Rayida Tech.',
  openGraph: {
    title: 'Capabilities Statement & Pitch Deck | Rayida Tech',
    description:
      'High-velocity Product Design and AI Engineering. Download our 1-page capability statement or view our agency pitch deck.',
    url: 'https://rayidatech.name.ng/capabilities',
    siteName: 'Rayida Tech',
    type: 'website',
  },
};

export default function CapabilitiesPage() {
  return (
    <main className="min-h-screen bg-ink">
      <CapabilitiesViewer />
    </main>
  );
}
