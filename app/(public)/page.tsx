import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import StatsBar from '@/components/sections/StatsBar';
import WhatWeDo from '@/components/sections/WhatWeDo';
import Services from '@/components/sections/Services';
import WhyRayidaTech from '@/components/sections/WhyRayidaTech';
import PortfolioTeaser from '@/components/sections/PortfolioTeaser';
import Testimonials from '@/components/sections/Testimonials';
import FinalCTA from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <StatsBar />
      <WhatWeDo />
      <Services />
      <WhyRayidaTech />
      <PortfolioTeaser />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
