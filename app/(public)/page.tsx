import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import StatsBar from '@/components/sections/StatsBar';
import WhatWeDo from '@/components/sections/WhatWeDo';
import Services from '@/components/sections/Services';
import ComingSoon from '@/components/sections/ComingSoon';
import WhyRayidaTech from '@/components/sections/WhyRayidaTech';
import PortfolioTeaser from '@/components/sections/PortfolioTeaser';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import FinalCTA from '@/components/sections/FinalCTA';
import { createClient } from '@/lib/supabase/server';
import { toHeroSlides, type HeroSlideRow } from '@/lib/data/hero-slides';

export const revalidate = 3600;

export default async function Home() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .returns<HeroSlideRow[]>();

  const slides = toHeroSlides(rows);

  return (
    <main>
      <Hero slides={slides} />
      <TrustBar />
      <StatsBar />
      <WhatWeDo />
      <Services />
      <ComingSoon />
      <WhyRayidaTech />
      <PortfolioTeaser />
      <Testimonials />
      <Newsletter />
      <FinalCTA />
    </main>
  );
}
