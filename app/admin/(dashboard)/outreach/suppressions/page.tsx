import OutreachNav from '@/components/admin/outreach/OutreachNav';
import SuppressionsClient from '@/components/admin/outreach/SuppressionsClient';
import { getEmailSuppressions } from '@/app/actions/outreach-suppressions';

export const metadata = {
  title: 'Suppressions & Opt-Outs | Admin Outreach',
};

export const dynamic = 'force-dynamic';

export default async function SuppressionsPage() {
  const suppressions = await getEmailSuppressions();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Suppression &amp; Unsubscribe Management
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Maintain email compliance (CAN-SPAM / NDPR). Suppressed contacts are guaranteed never to receive outreach.
          </p>
        </div>
      </div>

      <OutreachNav />

      <SuppressionsClient initialSuppressions={suppressions} />
    </div>
  );
}

