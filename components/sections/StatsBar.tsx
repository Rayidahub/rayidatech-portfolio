'use client';

import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import { stats } from '@/lib/data/stats';

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

export default function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-16 border-y border-(--line) relative overflow-hidden bg-ink"
      ref={ref}
    >
      {/* Subtle dot grid using the shared token so it works in light & dark */}
      <div
        className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.35]"
        aria-hidden="true"
      />
      <Container size="default" className="relative z-10">
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
    </section>
  );
}
