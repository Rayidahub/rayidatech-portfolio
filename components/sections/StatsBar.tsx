'use client';

import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import { stats, type Stat } from '@/lib/data/stats';

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

function StatCard({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div className="glass flex h-36 sm:h-52 md:h-64 flex-col items-start justify-end rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1">
      <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold gradient-text mb-1.5 md:mb-3 tabular-nums">
        {count}
        {stat.suffix}
      </p>
      <p className="font-mono-tight text-[10px] sm:text-xs uppercase tracking-[0.15em] text-mist-2 line-clamp-2">
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-16 md:py-24 border-y border-(--line)"
    >
      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.35]"
        aria-hidden="true"
      />

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[15rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse, rgba(var(--primary-rgb), 0.25) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} index={index}>
              <StatCard stat={stat} isVisible={isVisible} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

