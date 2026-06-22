import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

export default function WhatWeDo() {
  return (
    <Section className="relative overflow-hidden">
      {/* Decorative radial glow behind heading */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="h-[600px] w-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.3) 0%, transparent 60%)',
          }}
        />
      </div>

      <Container size="default">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
              What we do
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mb-6">
              Digital Solutions That Deliver{' '}
              <br className="hidden sm:block" />
              <span className="gradient-text">Real Results</span>
            </h2>
            <p className="text-mist-1 text-lg leading-relaxed max-w-2xl mx-auto">
              From branding and product design to digital transformation and
              business growth — we turn ambitious ideas into meaningful
              experiences.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}