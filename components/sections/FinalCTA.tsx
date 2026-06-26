import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <Section className="relative overflow-hidden bg-[var(--ink-deep)]">
      {/* Top border line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--line-strong), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Soft dual spotlight background */}
      <div
        className="pointer-events-none absolute -top-[20%] -right-[10%] w-[50rem] h-[50rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--secondary-rgb), 0.35) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-[20%] -left-[10%] w-[50rem] h-[50rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <Container size="wide" className="relative z-10">
        <Reveal>
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              {/* Left: copy + CTA */}
              <div className="p-10 md:p-14 lg:p-16 order-2 md:order-1">
                <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                  Start a project
                </p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-paper">
                  Ready to Build{' '}
                  <span className="gradient-text">Something Great?</span>
                </h2>
                <p className="text-mist-1 text-lg mb-8 max-w-md">
                  Let&apos;s turn your idea into a digital solution that works.
                </p>
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-paper transition-all hover:bg-primary/80"
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Right: image + glow */}
              <div className="relative h-80 md:h-full md:min-h-[480px] order-1 md:order-2 overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
                {/* Background glow orb */}
                <div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-50 blur-3xl"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(var(--primary-rgb), 0.45) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                <Image
                  src="/img/mabout-portrait.png"
                  alt="Raymond Gaius"
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
