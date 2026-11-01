import OutreachNav from '@/components/admin/outreach/OutreachNav';
import CampaignWizardClient from '@/components/admin/outreach/CampaignWizardClient';
import { getOutreachContacts } from '@/app/actions/outreach-contacts';
import { getEmailTemplates, getEmailSettings } from '@/app/actions/outreach-templates';

export const metadata = {
  title: 'Create Campaign | Admin Outreach',
};

export const dynamic = 'force-dynamic';

export default async function NewCampaignPage(props: {
  searchParams: Promise<{ contacts?: string }>;
}) {
  const searchParams = await props.searchParams;
  const preselected = searchParams.contacts ? searchParams.contacts.split(',').filter(Boolean) : [];

  const [contactsResult, templates, settings] = await Promise.all([
    getOutreachContacts({ limit: 500 }),
    getEmailTemplates(),
    getEmailSettings(),
  ]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Create Email Campaign
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            6-step workflow: select recipients, personalize template, preview, test, and queue controlled batch sending.
          </p>
        </div>
      </div>

      <OutreachNav />

      <CampaignWizardClient
        contacts={contactsResult.contacts}
        templates={templates}
        settings={settings}
        preselectedContactIds={preselected}
      />
    </div>
  );
}

