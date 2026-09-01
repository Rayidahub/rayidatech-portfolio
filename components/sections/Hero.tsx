'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { defaultHeroSlides, type HeroSlide } from '@/lib/data/hero-slides';
import { stats } from '@/lib/data/stats';
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe';

interface HeroProps {
  slides?: HeroSlide[];
}

export default function Hero({ slides }: HeroProps) {
  const heroSlides = slides && slides.length > 0 ? slides : defaultHeroSlides;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotionSafe();
  const featuredStat = stats[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const statBadgeY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const roleBadgeY = useTransform(scrollYProgress, [0, 1], [0, -30]);

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
    <section ref={sectionRef} className="relative flex overflow-hidden">
      {/* Deep-space horizon background — uses CSS variables so it responds to light/dark theme */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--secondary-rgb), var(--glow-1)) 0%, rgba(var(--primary-rgb), var(--glow-2)) 30%, transparent 55%),
            radial-gradient(ellipse 120% 70% at 50% 0%, rgba(var(--primary-rgb), var(--glow-3)) 0%, transparent 50%),
            linear-gradient(180deg, var(--ink-deep) 0%, var(--ink) 100%)
          `,
        }}
      />

      {/* Faint technical grid texture */}
      <div
        className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-60"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
        }}
        aria-hidden="true"
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
              <p className="mb-4 flex items-center gap-3 font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
                <span className="h-px w-8 bg-secondary/50" aria-hidden="true" />
                {slide.label}
              </p>

              <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tighter text-paper md:text-6xl lg:text-7xl xl:text-8xl">
                {slide.words.map((word, i) => {
                  const isLast = i === slide.words.length - 1;

                  if (isLast) {
                    // Signature accent word — reveals letter by letter
                    return (
                      <span key={i} className="gradient-text" style={{ display: 'inline-block' }}>
                        {word.split('').map((letter, li) => (
                          <motion.span
                            key={li}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.1 + i * 0.08 + li * 0.03,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{ display: 'inline-block' }}
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </span>
                    );
                  }

                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        display: 'inline-block',
                        marginRight: '0.3em',
                      }}
                    >
                      {word}
                      <br />
                    </motion.span>
                  );
                })}
              </h1>

              <motion.span
                className="mt-3 block h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left' }}
                aria-hidden="true"
              />

              <p className="mt-6 max-w-md text-base leading-relaxed text-mist-1 md:text-lg">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/contact"
              className="btn-glow group/btn inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:bg-primary/90"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-paper/5 px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-(--line-strong) hover:bg-paper/10"
            >
              View My Work
            </Link>
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

          {/* Floating stat badge */}
          {featuredStat && (
            <motion.div
              className="glass-strong absolute right-0 top-16 rounded-2xl px-5 py-4 lg:right-4"
              style={prefersReducedMotion ? undefined : { y: statBadgeY }}
              initial={{ opacity: 0, y: 16 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: [0, -10, 0] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }
                  : {
                      opacity: { duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] },
                      y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
                    }
              }
            >
              <p className="font-display text-3xl font-semibold gradient-text tabular-nums">
                {featuredStat.value}
                {featuredStat.suffix}
              </p>
              <p className="font-mono-tight text-xs uppercase tracking-[0.15em] text-mist-2">
                {featuredStat.label}
              </p>
            </motion.div>
          )}

          {/* Floating role badge */}
          <motion.div
            className="glass absolute bottom-24 left-0 flex items-center gap-2 rounded-full px-4 py-2 lg:-left-6"
            style={prefersReducedMotion ? undefined : { y: roleBadgeY }}
            initial={{ opacity: 0, y: 16 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: [0, -8, 0] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] }
                : {
                    opacity: { duration: 0.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
                  }
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="font-mono-tight text-xs text-mist-1">{slide.label}</span>
          </motion.div>
        </div>
      </div>

      {/* Mobile ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(var(--primary-rgb), var(--glow-2)) 0%, rgba(var(--secondary-rgb), var(--glow-3)) 40%, transparent 70%)',
        }}
      />

      <div className="section-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}
