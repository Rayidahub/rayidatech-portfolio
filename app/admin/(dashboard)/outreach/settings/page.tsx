import OutreachNav from '@/components/admin/outreach/OutreachNav';
import ProviderSettingsClient from '@/components/admin/outreach/ProviderSettingsClient';
import { getEmailSettings } from '@/app/actions/outreach-templates';

export const metadata = {
  title: 'Provider Settings & Diagnostics | Admin Outreach',
};

export const dynamic = 'force-dynamic';

export default async function OutreachSettingsPage() {
  const settings = await getEmailSettings();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Email Provider Settings &amp; Setup
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Configure Resend &amp; Zoho Mail integrations, test server connections, and manage default identities.
          </p>
        </div>
      </div>

      <OutreachNav />

      <ProviderSettingsClient initialSettings={settings} />
    </div>
  );
}

