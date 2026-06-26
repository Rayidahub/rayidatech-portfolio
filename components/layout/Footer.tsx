// components/layout/Footer.tsx
import Link from 'next/link';
import { Mail, MessageCircle, MapPin, Phone, ArrowUpRight } from 'lucide-react';

// Brand icons are not bundled in this lucide-react version; use lightweight SVGs.
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const WHATSAPP_URL = 'https://wa.link/tlezg8';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  {
    href: 'https://github.com/Rayidahub',
    label: 'GitHub',
    icon: GitHubIcon,
  },
  {
    href: 'https://linkedin.com/in/rayida-tech',
    label: 'LinkedIn',
    icon: LinkedInIcon,
  },
  {
    href: WHATSAPP_URL,
    label: 'WhatsApp',
    icon: MessageCircle,
  },
  {
    href: 'mailto:rayidagaius@gmail.com',
    label: 'Email',
    icon: Mail,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-(--line) bg-[var(--ink-deep)]">
      {/* Top gradient line */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="inline-block font-display text-2xl font-semibold text-paper mb-4">
              Raymond<span className="text-primary">.</span>
            </Link>
            <p className="text-mist-1 text-sm leading-relaxed max-w-xs mb-6">
              Product Designer & AI Engineer building digital experiences people can trust.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-mist-1 hover:text-paper hover:border-(--line-strong) transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-paper uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-mist-1 hover:text-secondary transition-colors duration-300"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold text-paper uppercase tracking-wider mb-5">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:rayidagaius@gmail.com"
                  className="group flex items-start gap-3 text-sm text-mist-1 hover:text-paper transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span>rayidagaius@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-mist-1 hover:text-paper transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span>WhatsApp Message</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-mist-1">
                  <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span>Nigeria — Working globally</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-(--line) flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mist-2 font-mono-tight">
            &copy; {currentYear} Raymond Gaius. All rights reserved.
          </p>
          <p className="text-xs text-mist-2 font-mono-tight">
            Designed & Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
