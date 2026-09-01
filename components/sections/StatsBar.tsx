'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import { stats, type Stat } from '@/lib/data/stats';
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe';

function useCountUp(target: number, duration: number = 2000, startCounting: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, startCounting]);

  return count;
}

function StatItem({
  value,
  suffix,
  label,
  isVisible,
}: {
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
}) {
  const count = useCountUp(value, 2000, isVisible);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 md:py-8 md:border-r md:border-(--line) last:md:border-r-0">
      <p className="font-display text-4xl md:text-5xl font-semibold gradient-text mb-2 tabular-nums">
        {count}
        {suffix}
      </p>
      <p className="font-mono-tight text-xs uppercase tracking-[0.15em] text-mist-2 text-center">
        {label}
      </p>
    </div>
  );
}

function StatShowcaseCard({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div className="glass flex h-64 w-72 shrink-0 flex-col items-start justify-end rounded-3xl p-8 md:h-72 md:w-80">
      <p className="font-display text-5xl md:text-6xl font-semibold gradient-text mb-3 tabular-nums">
        {count}
        {stat.suffix}
      </p>
      <p className="font-mono-tight text-xs uppercase tracking-[0.15em] text-mist-2">
        {stat.label}
      </p>
    </div>
  );
}

/** Horizontal, scroll-pinned stat showcase — desktop / motion-enabled only. */
function HorizontalStatsStrip({ isVisible }: { isVisible: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const measure = () => {
      setScrollDistance(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <div ref={sectionRef} className="relative h-[220vh]">
      <div
        ref={viewportRef}
        className="sticky top-0 flex h-screen items-center overflow-hidden"
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 px-6 md:px-12 lg:px-20"
        >
          {stats.map((stat) => (
            <StatShowcaseCard key={stat.label} stat={stat} isVisible={isVisible} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotionSafe();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -20% 0px' }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Fires isVisible as soon as the section starts entering view, regardless of its height */}
      <div ref={sentinelRef} className="absolute top-0 h-px w-full" aria-hidden="true" />

      {/* Subtle dot grid using the shared token so it works in light & dark */}
      <div
        className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.35]"
        aria-hidden="true"
      />

      {/* Static grid — small screens, or reduced-motion */}
      <div className={prefersReducedMotion ? 'relative z-10' : 'relative z-10 md:hidden'}>
        <div className="py-16 border-y border-(--line)">
          <Container size="default">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0">
              {stats.map((stat, index) => (
                <Reveal key={stat.label} index={index}>
                  <StatItem
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    isVisible={isVisible}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* Horizontal scroll-pinned showcase — desktop, motion-enabled only */}
      {!prefersReducedMotion && (
        <div className="relative z-10 hidden md:block">
          <HorizontalStatsStrip isVisible={isVisible} />
        </div>
      )}
    </section>
  );
}
