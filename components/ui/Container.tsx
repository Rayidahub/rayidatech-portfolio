// components/ui/Container.tsx
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Narrow containers (prose, forms) vs wide (grids, hero) */
  size?: 'narrow' | 'default' | 'wide';
}

const sizeMap = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
};

export default function Container({
  children,
  className = '',
  size = 'default',
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-6 md:px-8 ${sizeMap[size]} ${className}`}>
      {children}
    </div>
  );
}