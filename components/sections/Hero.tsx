'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { defaultHeroSlides, type HeroSlide } from '@/lib/data/hero-slides';

interface HeroProps {
  slides?: HeroSlide[];
}

export default function Hero({ slides }: HeroProps) {
  const heroSlides = slides && slides.length > 0 ? slides : defaultHeroSlides;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, heroSlides.length]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const slide = heroSlides[current];

  return (
    <section className="relative flex overflow-hidden">
      {/* Deep-space horizon background — uses CSS variables so it responds to light/dark theme */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--secondary-rgb), 0.42) 0%, rgba(var(--primary-rgb), 0.22) 30%, transparent 55%),
            radial-gradient(ellipse 120% 70% at 50% 0%, rgba(var(--primary-rgb), 0.18) 0%, transparent 50%),
            linear-gradient(180deg, var(--ink-deep) 0%, var(--ink) 100%)
          `,
        }}
      />

      {/* Left content column */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 pt-28 pb-20 md:w-[55%] md:px-12 lg:px-20 xl:px-28">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <StatusPill className="mb-8" />
          </motion.div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-4 font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
                {slide.label}
              </p>

              <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper md:text-5xl lg:text-6xl xl:text-7xl">
                {slide.words.map((word, i) => (
                  <motion.span
                    key={i}
                    className={i === slide.words.length - 1 ? 'gradient-text' : ''}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      display: 'inline-block',
                      marginRight: i < slide.words.length - 1 ? '0.3em' : undefined,
                    }}
                  >
                    {word}
                    {i < slide.words.length - 1 && <br />}
                  </motion.span>
                ))}
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-mist-1 md:text-lg">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

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
          <span className="font-mono-tight text-xs text-mist-2">
            {String(current + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-0.5 w-8 rounded-full transition-colors duration-300 ${
                  i === current ? 'bg-paper' : 'bg-paper/20 hover:bg-paper/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <span className="font-mono-tight text-xs text-mist-2">
            {String(heroSlides.length).padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      {/* Right visual column — portrait silhouette blend */}
      <div className="relative hidden h-[85vh] md:block md:w-[45%]">
        <div
          className="absolute inset-0 flex items-end justify-center"
          aria-hidden="true"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[85vh] w-full max-w-[34rem]"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to top, transparent 0%, black 12%, black 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                maskImage:
                  'linear-gradient(to top, transparent 0%, black 12%, black 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                className="h-full w-full object-contain object-bottom"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--secondary-rgb), 0.08) 40%, transparent 70%)',
        }}
      />

      <div className="section-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}
