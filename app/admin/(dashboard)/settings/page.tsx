import { getSiteSettings } from '@/lib/data/site-settings';
import SiteSettingsForm from './SiteSettingsForm';

export const metadata = {
  title: 'Site & Theme Settings | Admin',
};

export const revalidate = 0;

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}

