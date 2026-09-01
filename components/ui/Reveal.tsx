'use client';

// components/ui/Reveal.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger index — multiplies into delay for sequenced children */
  index?: number;
  as?: 'div' | 'li';
  /** Entrance direction — defaults to 'up' (original behavior) */
  direction?: 'up' | 'down' | 'left' | 'right';
}

const INITIAL_OFFSET: Record<NonNullable<RevealProps['direction']>, { x?: number; y?: number }> = {
  up: { y: 8 },
  down: { y: -8 },
  left: { x: 24 },
  right: { x: -24 },
};

export default function Reveal({
  children,
  className = '',
  index = 0,
  as = 'div',
  direction = 'up',
}: RevealProps) {
  const Tag = motion[as];
  const offset = INITIAL_OFFSET[direction];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
