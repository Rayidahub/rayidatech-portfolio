'use client';

// components/layout/Navbar.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import ThemeToggle from '@/components/ui/ThemeToggle';
import BrandLogo from '@/components/ui/BrandLogo';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const timeout = window.setTimeout(() => setIsOpen(false), 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'glass' : 'border-b border-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[120px] flex items-center justify-between py-3.5 sm:py-4">
        <Link href="/" className="flex items-center">
          <BrandLogo priority />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  active ? 'text-paper' : 'text-mist-1 hover:text-paper'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <StatusPill />
          <Link
            href="/contact"
            className="btn-glow rounded-full bg-primary px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-primary/80"
          >
            Start a Project
          </Link>
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="p-2 -mr-1.5 rounded-xl text-mist-1 transition-colors hover:text-paper hover:bg-paper/5 md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="glass-strong border-t border-(--line) px-4 sm:px-6 py-5 md:hidden max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 px-3 rounded-xl text-base font-medium transition-colors ${
                  pathname === link.href ? 'text-paper bg-primary/10' : 'text-mist-1 hover:text-paper hover:bg-paper/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 mt-1 border-t border-(--line) px-1">
              <ThemeToggle />
              <StatusPill />
            </div>
            <Link
              href="/contact"
              className="btn-glow mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-primary/80"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
