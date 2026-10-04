import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import StatsBar from '@/components/sections/StatsBar';
import WhatWeDo from '@/components/sections/WhatWeDo';
import Services from '@/components/sections/Services';
import ComingSoon from '@/components/sections/ComingSoon';
import WhyRayidaTech from '@/components/sections/WhyRayidaTech';
import Team from '@/components/sections/Team';
import PortfolioTeaser from '@/components/sections/PortfolioTeaser';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import FinalCTA from '@/components/sections/FinalCTA';
import MarqueeCTA from '@/components/sections/MarqueeCTA';
import { createClient } from '@/lib/supabase/server';
import { toHeroSlides, type HeroSlideRow } from '@/lib/data/hero-slides';
import { getHeroSettings } from '@/lib/data/hero-settings';

export const revalidate = 3600;

export default async function Home() {
  const supabase = await createClient();
  const [rowsResult, heroSettings] = await Promise.all([
    supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .returns<HeroSlideRow[]>(),
    getHeroSettings(),
  ]);

  const slides = toHeroSlides(rowsResult.data);

  return (
    <main>
      <Hero slides={slides} settings={heroSettings} />
      <TrustBar />
      <StatsBar />
      <WhatWeDo />
      <Services />
      <ComingSoon />
      <WhyRayidaTech />
      <Team />
      <PortfolioTeaser />
      <Testimonials />
      <Newsletter />
      <FinalCTA />
      <MarqueeCTA />
    </main>
  );
}
