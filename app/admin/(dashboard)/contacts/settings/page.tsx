import { getContactSettings } from '@/lib/data/contact-settings';
import ContactSettingsForm from './ContactSettingsForm';

export const revalidate = 0;

export default async function AdminContactSettingsPage() {
  const settings = await getContactSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <ContactSettingsForm initialSettings={settings} />
    </div>
  );
}
