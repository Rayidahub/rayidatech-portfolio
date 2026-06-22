// components/ui/Section.tsx
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  /** Use 'tight' for sections that follow closely after a hero */
  spacing?: 'default' | 'tight';
  id?: string;
}

export default function Section({
  children,
  className = '',
  spacing = 'default',
  id,
}: SectionProps) {
  const padding =
    spacing === 'tight'
      ? 'py-[var(--section-py-tight)]'
      : 'py-[var(--section-py)]';

  return (
    <section id={id} className={`${padding} ${className}`}>
      {children}
    </section>
  );
}