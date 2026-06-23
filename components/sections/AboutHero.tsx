'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(360deg,#000,transparent)]">
      {/* ── Centered portrait ── */}
      <div
        className="absolute inset-0 flex items-end justify-center"
        aria-hidden="true"
      >
        <div className="relative h-[78vh] w-full max-w-[48rem] md:h-[85vh] lg:max-w-[54rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/about-portrait.png"
            alt="Raymond Gaius"
            className="h-full w-full object-contain object-bottom"
          />

          {/* Gradient overlay: black at the bottom, transparent at the top */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      </div>

      {/* ── Bottom content grid ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 px-6 md:px-10 lg:px-16"
        style={{ paddingBottom: 'calc(var(--spacing) * 25)' }}
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-end md:gap-8">
          {/* Bottom-left: hero statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-4 font-mono-tight text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 md:text-xs">
              Strategic, bold, and built to connect.
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper md:text-5xl lg:text-6xl xl:text-7xl">
              Product
              <br />
              Designer
              <br />
              <span className="gradient-text">& AI Engineer</span>
            </h1>
          </motion.div>

          {/* Bottom-right: context + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-start gap-6 md:items-end"
          >
            <p className="max-w-xs text-sm leading-relaxed text-white/70 md:text-right md:text-base">
              Raymond Gaius builds digital experiences that merge clean design
              with intelligent systems. Based in Nigeria, working globally.
            </p>

            <Link
              href="/contact"
              className="group/btn inline-flex items-center gap-4 rounded-full border border-(--line) bg-transparent py-2 pl-7 pr-2 text-white transition-all duration-300 hover:border-primary hover:bg-primary"
            >
              <span className="text-sm font-medium text-white">
                Start a Project
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-(--line) bg-transparent transition-all duration-300 group-hover/btn:border-white group-hover/btn:bg-white">
                <ArrowRight className="h-4 w-4 text-white transition-colors duration-300 group-hover/btn:text-[#1a1a1a]" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
