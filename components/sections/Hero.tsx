'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Award, ShieldCheck, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { defaultHeroSlides, type HeroSlide } from '@/lib/data/hero-slides';
import { stats } from '@/lib/data/stats';
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe';
import { useActiveTheme } from '@/lib/use-theme';
import { mergeHeroGradientSettings, buildHeroGradientCss } from '@/lib/hero-gradient';
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
  const activeTheme = useActiveTheme();

  const showStatusPill = settings?.show_status_pill !== false;
  const statusPillText = settings?.status_pill_text || 'Available for projects';
  const statusPillLink = settings?.status_pill_link || '/contact';
  const statusPillAvailable = settings?.status_pill_available !== false;

  const primaryCtaLabel = settings?.primary_cta_label ?? 'Start Your Project';
  const primaryCtaLink = settings?.primary_cta_link || '/contact';
  const secondaryCtaLabel = settings?.secondary_cta_label ?? 'View My Work';
  const secondaryCtaLink = settings?.secondary_cta_link || '/projects';

  const floatingStatValue =
    settings?.floating_stat_value || (stats[0]?.value + (stats[0]?.suffix || '')) || '98%';

  const autoplayConfigured = settings?.autoplay_enabled !== false;
  const [isPaused, setIsPaused] = useState(!autoplayConfigured);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayInterval = (settings?.autoplay_interval || 5) * 1000;

  // Gradient & Blur configuration
  const gradientSettings = mergeHeroGradientSettings(settings?.gradient);
  const blurAmount = gradientSettings.blur.enabled && gradientSettings.blur.amount > 0
    ? gradientSettings.blur.amount
    : 0;

  const darkDesktopGradient = buildHeroGradientCss(gradientSettings, 'dark', false);
  const lightDesktopGradient = buildHeroGradientCss(gradientSettings, 'light', false);
  const darkMobileGradient = buildHeroGradientCss(gradientSettings, 'dark', true);
  const lightMobileGradient = buildHeroGradientCss(gradientSettings, 'light', true);

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

  const slide = heroSlides[current] || defaultHeroSlides[0];

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-ink transition-colors duration-300"
    >
      {/* 1. FULL-BLEED BACKGROUND IMAGE SLIDER (Edge-to-Edge Cinematic Cover) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
            }}
            className={`absolute inset-0 w-full h-full ${
              blurAmount > 0
                ? '-inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] scale-105'
                : ''
            }`}
            style={blurAmount > 0 ? { filter: `blur(${blurAmount}px)` } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.label}
              className="w-full h-full object-cover object-center md:object-[center_right]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. THEME-AWARE DYNAMIC GRADIENT OVERLAYS (Desktop) */}
      {darkDesktopGradient !== 'none' && (
        <div
          className={`hero-dark-gradient pointer-events-none absolute inset-0 z-[1] hidden md:block transition-opacity duration-500 ease-in-out ${
            activeTheme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
          style={{ background: darkDesktopGradient }}
        />
      )}

      {lightDesktopGradient !== 'none' && (
        <div
          className={`hero-light-gradient pointer-events-none absolute inset-0 z-[1] hidden md:block transition-opacity duration-500 ease-in-out ${
            activeTheme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
          style={{ background: lightDesktopGradient }}
        />
      )}

      {/* 2b. THEME-AWARE MOBILE READABILITY WASH */}
      {darkMobileGradient !== 'none' && (
        <div
          className={`hero-mobile-dark-gradient pointer-events-none absolute inset-0 z-[2] md:hidden transition-opacity duration-500 ease-in-out ${
            activeTheme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
          style={{ background: darkMobileGradient }}
        />
      )}

      {lightMobileGradient !== 'none' && (
        <div
          className={`hero-mobile-light-gradient pointer-events-none absolute inset-0 z-[2] md:hidden transition-opacity duration-500 ease-in-out ${
            activeTheme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
          style={{ background: lightMobileGradient }}
        />
      )}

      {/* 2c. FAINT TECHNICAL GRID PATTERN (Brand Texture) */}
      <div
        className="bg-grid-pattern pointer-events-none absolute inset-0 z-[2] opacity-25"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      {/* 3. TOP-RIGHT SLIDER / HERO NAVIGATION */}
      <div className="absolute top-20 sm:top-24 md:top-28 right-4 sm:right-8 lg:right-16 xl:right-[120px] z-30 flex items-center gap-3">
        <div className="glass-strong rounded-full px-4 py-2 flex items-center gap-3 border border-(--line) shadow-xl backdrop-blur-md">
          {/* Slide Counter: 01 / 06 */}
          <span className="font-mono-tight text-xs font-semibold text-paper tabular-nums tracking-wider">
            {String(current + 1).padStart(2, '0')}
            <span className="text-mist-2 mx-1.5">/</span>
            <span className="text-mist-2">{String(heroSlides.length).padStart(2, '0')}</span>
          </span>

          <span className="h-3 w-px bg-(--line-strong)" aria-hidden="true" />

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

          <span className="h-3 w-px bg-(--line-strong)" aria-hidden="true" />

          {/* Flow Play / Pause & Prev / Next Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-mist-1 hover:text-paper hover:bg-paper/10 transition-colors cursor-pointer"
              aria-label={isPaused ? 'Start slider auto-flow' : 'Pause slider auto-flow'}
              title={isPaused ? 'Start auto-flow' : 'Pause auto-flow'}
            >
              {isPaused ? (
                <Play className="w-2.5 h-2.5 fill-current text-secondary" />
              ) : (
                <Pause className="w-2.5 h-2.5 fill-current text-secondary" />
              )}
            </button>

            <span className="h-2.5 w-px bg-(--line-strong) mx-0.5" aria-hidden="true" />

            <button
              type="button"
              onClick={() => goTo((current - 1 + heroSlides.length) % heroSlides.length)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-mist-1 hover:text-paper hover:bg-paper/10 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => goTo((current + 1) % heroSlides.length)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-mist-1 hover:text-paper hover:bg-paper/10 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. FOREGROUND CONTENT (Positioned over the darker left gradient) */}
      <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-[80px] xl:px-[120px]">
        <div className="w-full max-w-xl lg:max-w-2xl xl:max-w-3xl flex flex-col justify-center">
          {showStatusPill && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
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
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
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
                            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: prefersReducedMotion ? 0 : 0.08 + i * 0.06 + li * 0.025,
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
                      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: prefersReducedMotion ? 0 : 0.08 + i * 0.06,
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
                initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
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
            {/* Decorative Dot Grid Matrix under CTA */}
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
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
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

      <div className="section-separator absolute bottom-0 left-0 right-0 z-10" />
    </section>
  );
}
