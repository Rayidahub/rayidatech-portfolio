'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import { motion } from 'framer-motion';

const headlineWords = ['Build.', 'Scale.', 'Dominate Your', 'Digital Presence'];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen overflow-hidden">
      <div className="relative z-10 flex w-full flex-col justify-center px-6 pt-24 pb-16 md:w-3/5 md:px-12 lg:px-20 xl:px-28">
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

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-paper md:text-5xl lg:text-6xl xl:text-7xl">
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
            className="mt-6 max-w-lg text-base leading-relaxed text-mist-1 md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            We design and develop powerful digital solutions that help
            startups and businesses grow, stand out, and succeed.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-paper transition-all hover:bg-primary/80"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-(--line) px-6 py-3 text-sm font-medium text-mist-1 transition-all hover:border-primary hover:text-paper"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative hidden md:block md:w-2/5">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute -bottom-1/4 -right-1/4 h-[120%] w-[120%] rounded-full opacity-30 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at 40% 50%, rgba(128,0,255,0.35) 0%, rgba(0,209,255,0.15) 40%, transparent 70%)',
            }}
          />
          <div
            className="absolute -top-1/4 left-1/3 h-[80%] w-[80%] rounded-full opacity-20 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(0,209,255,0.2) 0%, rgba(128,0,255,0.1) 50%, transparent 70%)',
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-12 hero-float" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logobg.png"
            alt=""
            className="h-full w-full object-contain opacity-70"
          />
        </div>

        <motion.div
          className="absolute bottom-12 right-8 glass rounded-2xl border-(--line) p-5 max-w-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono-tight text-xs text-mist-2">Trust builds</p>
          <p className="font-display text-2xl font-semibold text-paper">Technology</p>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(128,0,255,0.15) 0%, rgba(0,209,255,0.08) 40%, transparent 70%)',
        }}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator hidden md:flex flex-col items-center gap-2 text-mist-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <span className="font-mono-tight text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      <div className="section-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}