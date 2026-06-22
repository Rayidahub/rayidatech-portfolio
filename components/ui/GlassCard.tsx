import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** 'strong' for elements that need to stand forward, e.g. the hero CTA card */
  variant?: 'default' | 'strong';
  as?: 'div' | 'article';
  /** Enable hover lift + glow animation */
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  as: Tag = 'div',
  hover = true,
}: GlassCardProps) {
  const base = variant === 'strong' ? 'glass-strong' : 'glass';
  const hoverClass = hover ? 'card-hover' : '';

  return (
    <Tag
      className={`${base} rounded-2xl ${hoverClass} ${className}`}
    >
      {children}
    </Tag>
  );
}