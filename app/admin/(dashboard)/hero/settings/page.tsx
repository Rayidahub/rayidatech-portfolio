import { getHeroSettings } from '@/lib/data/hero-settings';
import { createClient } from '@/lib/supabase/server';
import { toHeroSlides, type HeroSlideRow } from '@/lib/data/hero-slides';
import HeroSettingsForm from './HeroSettingsForm';

export const metadata = {
  title: 'Hero Section Settings | Admin',
};

export default async function AdminHeroSettingsPage() {
  const supabase = await createClient();
  const [settings, rowsResult] = await Promise.all([
    getHeroSettings(),
    supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .returns<HeroSlideRow[]>(),
  ]);

  const slides = toHeroSlides(rowsResult.data);

  return (
    <div className="max-w-5xl mx-auto">
      <HeroSettingsForm initialSettings={settings} slides={slides} />
    </div>
  );
}
