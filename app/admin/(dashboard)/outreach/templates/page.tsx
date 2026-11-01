import OutreachNav from '@/components/admin/outreach/OutreachNav';
import TemplatesClient from '@/components/admin/outreach/TemplatesClient';
import { getEmailTemplates } from '@/app/actions/outreach-templates';

export const metadata = {
  title: 'Email Templates | Admin Outreach',
};

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const templates = await getEmailTemplates();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Email Templates Library
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Manage your library of cold outreach pitches, value audits, and automated follow-ups.
          </p>
        </div>
      </div>

      <OutreachNav />

      <TemplatesClient initialTemplates={templates} />
    </div>
  );
}

