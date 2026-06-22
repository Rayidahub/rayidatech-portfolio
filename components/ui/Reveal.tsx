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
}

export default function Reveal({
  children,
  className = '',
  index = 0,
  as = 'div',
}: RevealProps) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
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