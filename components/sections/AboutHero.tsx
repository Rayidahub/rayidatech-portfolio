import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';

export default function AboutHero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] w-full overflow-hidden bg-ink flex flex-col justify-end pt-28 pb-12 md:pb-16 border-b border-(--line)">
      {/* ── Ambient background glows ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[45rem] h-[45rem] rounded-full bg-radial-glow from-primary/15 via-secondary/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* ── Technical dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.35]"
        aria-hidden="true"
      />

      {/* ── Centered portrait with smooth bottom gradient fade ── */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative h-[72vh] w-full max-w-[42rem] md:h-[82vh] lg:max-w-[48rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/about-portrait.png"
            alt="Raymond Gaius"
            className="h-full w-full object-contain object-bottom select-none drop-shadow-2xl"
          />

          {/* Smooth bottom fade into ink background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/50 to-transparent" />
        </div>
      </div>

      {/* ── Bottom content grid ── */}
      <div className="relative z-20 w-full">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end md:gap-10">
            {/* Bottom-left: hero statement */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-(--line) mb-4 text-xs font-mono-tight text-secondary">
                <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                <span>Strategic, bold, and built to connect</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-paper">
                Product
                <br />
                Designer
                <br />
                <span className="gradient-text">& AI Engineer</span>
              </h1>
            </div>

            {/* Bottom-right: context + CTA */}
            <div className="flex flex-col items-start gap-6 md:items-end">
              <p className="max-w-sm text-sm sm:text-base leading-relaxed text-mist-1 md:text-right">
                Raymond Gaius builds digital experiences that merge clean design
                with intelligent systems. Based in Nigeria, working globally.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center gap-3 rounded-full bg-primary hover:bg-primary/90 text-white px-7 py-3 text-sm font-medium transition-all group shadow-lg shadow-primary/20"
                >
                  Start a Project
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/projects"
                  className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-paper hover:text-secondary transition-colors"
                >
                  View Work
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

