'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Award, ShieldCheck, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { defaultHeroSlides, type HeroSlide } from '@/lib/data/hero-slides';
import { stats } from '@/lib/data/stats';
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe';
import type { HeroSettings } from '@/types/hero-settings';

interface HeroProps {
  slides?: HeroSlide[];
  settings?: HeroSettings;
}

export default function Hero({ slides, settings }: HeroProps) {
  const heroSlides = slides && slides.length > 0 ? slides : defaultHeroSlides;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotionSafe();

  const showStatusPill = settings?.show_status_pill !== false;
  const statusPillText = settings?.status_pill_text || 'Available for projects';
  const statusPillLink = settings?.status_pill_link || '/contact';
  const statusPillAvailable = settings?.status_pill_available !== false;

  const primaryCtaLabel = settings?.primary_cta_label ?? 'Start Your Project';
  const primaryCtaLink = settings?.primary_cta_link || '/contact';
  const secondaryCtaLabel = settings?.secondary_cta_label ?? 'View My Work';
  const secondaryCtaLink = settings?.secondary_cta_link || '/projects';

  const showFloatingStat = settings?.show_floating_stat !== false;
  const floatingStatValue =
    settings?.floating_stat_value || (stats[0]?.value + (stats[0]?.suffix || '')) || '98%';
  const floatingStatLabel = settings?.floating_stat_label || stats[0]?.label || 'Client Satisfaction';

  const autoplayConfigured = settings?.autoplay_enabled !== false;
  const [isPaused, setIsPaused] = useState(!autoplayConfigured);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayInterval = (settings?.autoplay_interval || 5) * 1000;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const statBadgeY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const roleBadgeY = useTransform(scrollYProgress, [0, 1], [0, -25]);

  useEffect(() => {
    setIsPaused(!autoplayConfigured);
  }, [autoplayConfigured]);

  useEffect(() => {
    if (isPaused || isHovered || heroSlides.length <= 1) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, autoplayInterval);
    return () => clearTimeout(timer);
  }, [current, heroSlides.length, isPaused, isHovered, autoplayInterval]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const slide = heroSlides[current];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-ink"
    >
      {/* Ambient background glow — responds to brand dark/light tokens */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/4 w-[850px] h-[500px] rounded-full opacity-30 blur-[140px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.4) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px]"
          style={{
            background:
              'radial-gradient(circle, rgba(var(--secondary-rgb), 0.35) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Faint technical grid texture */}
      <div
        className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-30"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      {/* 3. HERO IMAGE & VISUAL COMPOSITION AS THE PRIMARY BACKGROUND LAYER (Rule 1 & 4) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
        {/* Soft backlight glow focused behind the visual portrait */}
        <div
          className="absolute right-0 sm:right-[8%] bottom-[12%] w-[550px] h-[550px] rounded-full opacity-35 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.18) 50%, transparent 75%)',
          }}
        />

        {/* The Flowing Wave Lines sweeping horizontally across the scene */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end overflow-visible">
          <div className="w-full lg:w-[68%] xl:w-[62%] h-full flex items-center justify-center">
            <svg
              viewBox="0 0 700 420"
              fill="none"
              className="w-full h-full object-contain overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="heroWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.25" />
                  <stop offset="35%" stopColor="var(--secondary)" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="var(--primary)" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path
                d="M 0 150 C 60 120, 100 65, 150 65 C 220 65, 270 165, 350 165 C 430 165, 470 60, 530 60 C 600 60, 650 115, 700 120"
                stroke="url(#heroWaveGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-80"
              />
              <path
                d="M 0 174 C 60 144, 100 89, 150 89 C 220 89, 270 189, 350 189 C 430 189, 470 84, 530 84 C 600 84, 650 139, 700 144"
                stroke="url(#heroWaveGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-70"
              />
              <path
                d="M 0 198 C 60 168, 100 113, 150 113 C 220 113, 270 213, 350 213 C 430 213, 470 108, 530 108 C 600 108, 650 163, 700 168"
                stroke="url(#heroWaveGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-60"
              />
              <path
                d="M 0 222 C 60 192, 100 137, 150 137 C 220 137, 270 237, 350 237 C 430 237, 470 132, 530 132 C 600 132, 650 187, 700 192"
                stroke="url(#heroWaveGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-50"
              />
            </svg>
          </div>
        </div>

        {/* The 4 Floating Circular Image Bubbles pinned along the wave lines */}
        <div className="absolute right-0 bottom-0 top-0 w-full lg:w-[62%] xl:w-[56%]">
          {/* Bubble 1 (Upper-Left on Wave Crest 1) */}
          <motion.div
            className="absolute top-[18%] left-[16%] sm:left-[20%] w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full border-2 sm:border-[3px] border-paper/75 shadow-[0_0_25px_rgba(0,209,255,0.35)] overflow-hidden bg-ink-deep"
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/card1.png"
              alt="UI/UX & Design"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

          {/* Bubble 2 (Lower-Left on Wave 3) */}
          <motion.div
            className="absolute top-[48%] left-[6%] sm:left-[8%] w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full border-2 sm:border-[3px] border-paper/75 shadow-[0_0_20px_rgba(128,0,255,0.35)] overflow-hidden bg-ink-deep"
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 3.9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/hero.jpg"
              alt="AI Intelligence"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

          {/* Bubble 3 (Upper-Right on Wave Crest 2) */}
          <motion.div
            className="absolute top-[14%] right-[14%] sm:right-[18%] w-13 h-13 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px] rounded-full border-2 sm:border-[3px] border-paper/75 shadow-[0_0_25px_rgba(0,209,255,0.35)] overflow-hidden bg-ink-deep"
            animate={prefersReducedMotion ? undefined : { y: [0, -7, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/abt.jpg"
              alt="Cloud & Web Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

          {/* Bubble 4 (Lower-Right on Wave 3/4) */}
          <motion.div
            className="absolute top-[44%] right-[4%] sm:right-[8%] w-15 h-15 sm:w-18 sm:h-18 lg:w-[84px] lg:h-[84px] rounded-full border-2 sm:border-[3px] border-paper/75 shadow-[0_0_28px_rgba(128,0,255,0.4)] overflow-hidden bg-ink-deep"
            animate={prefersReducedMotion ? undefined : { y: [0, 7, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4.3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/card2.png"
              alt="Digital Growth"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Primary Hero Slide Visual Column (strictly bounded to right half, never overflows into text) */}
        <div className="absolute right-0 bottom-0 top-0 w-full lg:w-[50%] xl:w-[48%] flex items-end justify-center lg:justify-end lg:pr-8 xl:pr-16 overflow-hidden pointer-events-none select-none">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex items-end justify-center lg:justify-end opacity-25 sm:opacity-40 lg:opacity-100"
              style={{
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 8%, black 100%)',
                maskImage: 'linear-gradient(to top, transparent 0%, black 8%, black 100%)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.label}
                className="max-h-[75vh] sm:max-h-[82vh] lg:max-h-[86vh] xl:max-h-[90vh] w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] select-none pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. TOP-RIGHT SLIDER / HERO NAVIGATION (Rule 6) */}
      <div className="absolute top-24 sm:top-28 lg:top-24 right-6 sm:right-12 lg:right-[120px] z-30 flex items-center gap-3">
        <div className="glass-strong rounded-full px-4 py-2 flex items-center gap-3 border border-(--line) shadow-xl backdrop-blur-md">
          {/* Slide Counter: 01 / 06 */}
          <span className="font-mono-tight text-xs font-semibold text-paper tabular-nums tracking-wider">
            {String(current + 1).padStart(2, '0')}
            <span className="text-mist-2 mx-1.5">/</span>
            <span className="text-mist-2">{String(heroSlides.length).padStart(2, '0')}</span>
          </span>

          <span className="h-3 w-px bg-white/10" aria-hidden="true" />

          {/* Slide Indicator Pills */}
          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current
                    ? 'w-7 bg-gradient-to-r from-primary to-secondary shadow-sm shadow-primary/50'
                    : 'w-2 bg-paper/25 hover:bg-paper/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <span className="h-3 w-px bg-white/10" aria-hidden="true" />

          {/* Flow Play / Pause & Prev / Next Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-mist-1 hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={isPaused ? 'Start slider auto-flow' : 'Pause slider auto-flow'}
              title={isPaused ? 'Start auto-flow' : 'Pause auto-flow'}
            >
              {isPaused ? (
                <Play className="w-2.5 h-2.5 fill-current text-secondary" />
              ) : (
                <Pause className="w-2.5 h-2.5 fill-current text-secondary" />
              )}
            </button>

            <span className="h-2.5 w-px bg-white/10 mx-0.5" aria-hidden="true" />

            <button
              type="button"
              onClick={() => goTo((current - 1 + heroSlides.length) % heroSlides.length)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-mist-1 hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => goTo((current + 1) % heroSlides.length)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-mist-1 hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Badges */}
      {showFloatingStat && (
        <motion.div
          className="glass-strong absolute right-8 sm:right-16 lg:right-[120px] top-40 sm:top-44 z-20 rounded-2xl px-4 py-3 shadow-2xl border border-(--line) hidden sm:block"
          style={prefersReducedMotion ? undefined : { y: statBadgeY }}
          initial={{ opacity: 0, y: 16 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: [0, -8, 0] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }
              : {
                  opacity: { duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                }
          }
        >
          <p className="font-display text-2xl font-bold gradient-text tabular-nums leading-none mb-1">
            {floatingStatValue}
          </p>
          <p className="font-mono-tight text-[10px] uppercase tracking-[0.15em] text-mist-2 leading-none">
            {floatingStatLabel}
          </p>
        </motion.div>
      )}

      {/* Floating Capability / Topic Pill */}
      <motion.div
        className="glass absolute bottom-12 sm:bottom-16 right-8 sm:right-auto sm:left-[52%] lg:left-[48%] xl:left-[50%] z-20 flex items-center gap-2 rounded-full px-4 py-2 shadow-xl border border-(--line)"
        style={prefersReducedMotion ? undefined : { y: roleBadgeY }}
        initial={{ opacity: 0, y: 16 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 1, y: [0, -6, 0] }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }
            : {
                opacity: { duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 },
              }
        }
      >
        <span className="h-2 w-2 rounded-full bg-secondary shadow-sm shadow-secondary/50 animate-pulse" />
        <span className="font-mono-tight text-xs text-paper font-medium tracking-wide">
          {slide.label}
        </span>
      </motion.div>

      {/* 5. FOREGROUND CONTENT (Editorial, Confident, Generous Whitespace) */}
      <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-[80px] xl:px-[120px]">
        <div className="w-full max-w-xl lg:max-w-xl xl:max-w-2xl flex flex-col justify-center">
          {showStatusPill && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 sm:mb-8"
            >
              <StatusPill
                text={statusPillText}
                available={statusPillAvailable}
                href={statusPillLink}
              />
            </motion.div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Topic / Category Kicker */}
              <p className="mb-4 flex items-center gap-3 font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary">
                <span className="h-px w-8 bg-secondary/50" aria-hidden="true" />
                {slide.label}
              </p>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.02] tracking-tighter text-paper">
                {slide.words.map((word, i) => {
                  const isLast = i === slide.words.length - 1;

                  if (isLast) {
                    return (
                      <span key={i} className="gradient-text block mt-1">
                        {word.split('').map((letter, li) => (
                          <motion.span
                            key={li}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.08 + i * 0.06 + li * 0.025,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{ display: 'inline-block' }}
                          >
                            {letter === ' ' ? '\u00A0' : letter}
                          </motion.span>
                        ))}
                      </span>
                    );
                  }

                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.08 + i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="block"
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </h1>

              {/* Accent horizontal line */}
              <motion.span
                className="mt-4 block h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left' }}
                aria-hidden="true"
              />

              {/* Body paragraph */}
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-mist-1">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons with Decorative Dot Matrix underneath */}
          <div className="relative mt-8 sm:mt-10">
            {/* Decorative Dot Grid Matrix under CTA — matches reference template */}
            <div
              className="pointer-events-none absolute -bottom-10 -left-6 opacity-30 select-none hidden sm:block"
              aria-hidden="true"
            >
              <div className="grid grid-cols-6 gap-2.5">
                {Array.from({ length: 36 }).map((_, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full bg-secondary/70"
                  />
                ))}
              </div>
            </div>

            <motion.div
              className="relative z-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {primaryCtaLabel && (
                <Link
                  href={primaryCtaLink}
                  className="btn-glow group/btn inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:bg-primary/90"
                >
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </Link>
              )}
              {secondaryCtaLabel && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-paper/5 px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-(--line-strong) hover:bg-paper/10"
                >
                  <span>{secondaryCtaLabel}</span>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Stats Row with Icon Pills */}
          <div className="mt-10 pt-8 border-t border-(--line)/40 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary shrink-0 shadow-inner">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              </div>
              <div>
                <p className="font-display text-base sm:text-xl font-bold text-paper leading-none">50+</p>
                <p className="font-mono-tight text-[10px] sm:text-xs text-mist-2 mt-1 truncate">Projects</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0 shadow-inner">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              </div>
              <div>
                <p className="font-display text-base sm:text-xl font-bold text-paper leading-none">5+ Yrs</p>
                <p className="font-mono-tight text-[10px] sm:text-xs text-mist-2 mt-1 truncate">Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary shrink-0 shadow-inner">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              </div>
              <div>
                <p className="font-display text-base sm:text-xl font-bold text-paper leading-none">
                  {floatingStatValue}
                </p>
                <p className="font-mono-tight text-[10px] sm:text-xs text-mist-2 mt-1 truncate">
                  Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}

