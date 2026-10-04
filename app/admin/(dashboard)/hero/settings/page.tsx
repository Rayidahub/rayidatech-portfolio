import { getHeroSettings } from '@/lib/data/hero-settings';
import HeroSettingsForm from './HeroSettingsForm';

export const metadata = {
  title: 'Hero Section Settings | Admin',
};

export default async function AdminHeroSettingsPage() {
  const settings = await getHeroSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <HeroSettingsForm initialSettings={settings} />
    </div>
  );
}

