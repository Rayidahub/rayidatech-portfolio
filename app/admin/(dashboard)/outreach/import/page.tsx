import OutreachNav from '@/components/admin/outreach/OutreachNav';
import ProspectImportClient from '@/components/admin/outreach/ProspectImportClient';

export const metadata = {
  title: 'Import Prospects (.xlsx / .csv) | Admin Outreach',
};

export const dynamic = 'force-dynamic';

export default function OutreachImportPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Import Prospects from Excel or CSV
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Bulk upload business contacts, map columns, detect duplicates, and validate email syntax.
          </p>
        </div>
      </div>

      <OutreachNav />

      <ProspectImportClient />
    </div>
  );
}

