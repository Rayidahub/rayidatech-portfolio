import Link from 'next/link';
import OutreachNav from '@/components/admin/outreach/OutreachNav';
import ContactsTableClient from '@/components/admin/outreach/ContactsTableClient';
import { getOutreachContacts } from '@/app/actions/outreach-contacts';

export const revalidate = 0;

export default async function OutreachContactsPage() {
  const result = await getOutreachContacts({ limit: 100 });

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Prospects Database ({result.total})
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Filter, search, select, and organize your Abuja and Nigerian client prospects.
          </p>
        </div>
      </div>

      <OutreachNav />

      <ContactsTableClient
        initialContacts={result.contacts}
        total={result.total}
        locations={result.locations}
        businessTypes={result.businessTypes}
      />
    </div>
  );
}

