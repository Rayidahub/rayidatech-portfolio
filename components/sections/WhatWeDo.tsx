import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

const steps = [
  {
    number: '01',
    title: 'Research',
    description: 'Understand users, market, and business goals before designing anything.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Create intuitive, beautiful interfaces rooted in user needs.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Develop with modern tools for performance, accessibility, and scalability.',
  },
  {
    number: '04',
    title: 'Iterate',
    description: 'Test, learn, and refine until the product delivers real value.',
  },
];

export default function WhatWeDo() {
  return (
    <Section className="relative overflow-hidden bg-[var(--ink-deep)]">
      {/* Top gradient line */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--paper) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Decorative radial glows */}
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[30rem] h-[30rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[30rem] h-[30rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--secondary-rgb), 0.25) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <Container size="default" className="relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
              Process
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-paper">
              How I <span className="gradient-text">Work</span>
            </h2>
            <p className="text-mist-1 text-lg max-w-xl mx-auto">
              A structured approach that keeps every project focused and
              effective.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.number} index={index}>
              <div className="glass rounded-2xl card-hover p-6 text-center h-full">
                <span className="font-mono-tight text-2xl font-bold text-secondary/50">
                  {step.number}
                </span>
                <h3 className="font-display text-lg font-semibold text-paper mt-3 mb-2">
                  {step.title}
                </h3>
                <p className="text-mist-1 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
