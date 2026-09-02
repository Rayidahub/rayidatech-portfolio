'use client';

// components/layout/Navbar.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Container from '@/components/ui/Container';

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
      <Container size="wide" className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center" aria-label="Rayida Tech">
          <Image
            src="/brand/logo-light.png"
            alt="Rayida Tech"
            width={419}
            height={120}
            className="logo-light h-8 w-auto md:h-9"
            priority
          />
          <Image
            src="/brand/logo-dark.png"
            alt="Rayida Tech"
            width={419}
            height={120}
            className="logo-dark h-8 w-auto md:h-9"
            priority
          />
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
          className="text-mist-1 transition-colors hover:text-paper md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {isOpen && (
        <div className="glass-strong border-t border-(--line) px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base ${
                  pathname === link.href ? 'text-paper' : 'text-mist-1'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <ThemeToggle />
              <StatusPill />
            </div>
            <Link
              href="/contact"
              className="btn-glow mt-1 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-medium text-paper transition-colors hover:bg-primary/80"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
