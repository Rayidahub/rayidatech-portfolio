import { notFound } from 'next/navigation';
import OutreachNav from '@/components/admin/outreach/OutreachNav';
import CampaignDetailsClient from '@/components/admin/outreach/CampaignDetailsClient';
import { getEmailCampaignById } from '@/app/actions/outreach-campaigns';

export const metadata = {
  title: 'Campaign Details & Telemetry | Admin Outreach',
};

export default async function CampaignDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const result = await getEmailCampaignById(id);

  if (!result.campaign) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            {result.campaign.name}
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Subject: &quot;{result.campaign.subject}&quot; &bull; Created {new Date(result.campaign.created_at || '').toLocaleDateString()}
          </p>
        </div>
      </div>

      <OutreachNav />

      <CampaignDetailsClient
        campaign={result.campaign}
        recipients={result.recipients}
      />
    </div>
  );
}

