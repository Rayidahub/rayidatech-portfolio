import { createClient } from '@/lib/supabase/server';
import OutreachNav from '@/components/admin/outreach/OutreachNav';
import ProspectResearchClient from '@/components/admin/outreach/ProspectResearchClient';

export const revalidate = 0;

export default async function ProspectResearchPage() {
  const supabase = await createClient();

  // Fetch all existing emails in database to determine if a researched prospect is already in outreach contacts
  const { data: contacts } = await supabase
    .from('outreach_contacts')
    .select('email')
    .not('email', 'is', null);

  const existingEmails = (contacts || [])
    .map((c) => c.email)
    .filter((e): e is string => Boolean(e));

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Lead Research &amp; Prospect Discovery
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Identify, research, and audit prospective businesses across Abuja and Nigeria with public emails and website opportunities.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <OutreachNav />

      {/* Interactive Research Workspace */}
      <ProspectResearchClient existingEmails={existingEmails} />
    </div>
  );
}
