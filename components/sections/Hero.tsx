'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import { motion } from 'framer-motion';

const headlineWords = ['Build.', 'Scale.', 'Dominate Your', 'Digital Presence'];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen overflow-hidden">
      {/* Left content column */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 pt-28 pb-20 md:w-[55%] md:px-12 lg:px-20 xl:px-28">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <StatusPill className="mb-8" />

            <p className="mb-4 font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
              Rayida Tech
            </p>
          </motion.div>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper md:text-5xl lg:text-6xl xl:text-7xl">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                className={i === headlineWords.length - 1 ? 'gradient-text' : ''}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ display: 'inline-block', marginRight: i < headlineWords.length - 1 ? '0.3em' : undefined }}
              >
                {i === 0 || i === 1 ? word + (i === 1 ? '' : ' ') : word}
                {i < headlineWords.length - 1 && <br />}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-md text-base leading-relaxed text-mist-1 md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            We design and develop powerful digital solutions that help
            startups and businesses grow, stand out, and succeed.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/contact"
              className="group/btn flex h-14 w-14 items-center justify-center rounded-full border border-(--line) bg-paper/5 text-paper transition-all duration-300 hover:border-primary hover:bg-primary hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.35)]"
              aria-label="Start Your Project"
            >
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Link>
            <span className="text-sm font-medium text-mist-1">Start Your Project</span>
          </motion.div>
        </div>

        {/* Slide pagination */}
        <motion.div
          className="absolute bottom-12 left-6 hidden items-center gap-4 md:left-12 lg:left-20 xl:left-28 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <span className="font-mono-tight text-xs text-mist-2">01</span>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-8 rounded-full bg-paper" />
            <span className="h-0.5 w-8 rounded-full bg-paper/20" />
            <span className="h-0.5 w-8 rounded-full bg-paper/20" />
            <span className="h-0.5 w-8 rounded-full bg-paper/20" />
          </div>
          <span className="font-mono-tight text-xs text-mist-2">05</span>
        </motion.div>
      </div>

      {/* Right visual column */}
      <div className="relative hidden md:block md:w-[45%]">
        {/* Ambient glow behind image */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div
            className="h-[55vh] w-[55vh] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(128,0,255,0.55) 0%, rgba(0,209,255,0.18) 50%, transparent 70%)',
            }}
          />
        </div>

        {/* Circular rim light */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div
            className="h-[48vh] w-[48vh] rounded-full border border-primary/20 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(128,0,255,0.12) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Hero image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-8 lg:p-12 hero-float"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logobg.png"
            alt=""
            className="h-full max-h-[75vh] w-auto object-contain opacity-90 drop-shadow-[0_0_60px_rgba(128,0,255,0.25)]"
          />
        </motion.div>
      </div>

      {/* Mobile ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(128,0,255,0.2) 0%, rgba(0,209,255,0.08) 40%, transparent 70%)',
        }}
      />

      <div className="section-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}
