// components/layout/Footer.tsx
import Link from 'next/link';
import { Share, Link as LinkIcon, Mail, MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.link/tlezg8';

export default function Footer() {
  return (
    <footer className="border-t border-(--line) py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between md:px-8">
        <div className="text-center md:text-left">
          <Link href="/" className="font-display text-lg font-semibold text-paper">
            Raymond<span className="text-signal">.</span>
          </Link>
          <p className="mt-1 text-sm text-mist-2">
            Building digital experiences people can trust.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/Rayidahub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mist-2 transition-colors hover:text-signal"
            aria-label="GitHub"
          >
            <LinkIcon className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/in/rayida-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mist-2 transition-colors hover:text-signal"
            aria-label="LinkedIn"
          >
            <Share className="h-5 w-5" />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mist-2 transition-colors hover:text-signal"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href="mailto:rayidagaius@gmail.com"
            className="text-mist-2 transition-colors hover:text-signal"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>

        <p className="text-sm text-mist-2">
          &copy; {new Date().getFullYear()} Raymond Gaius
        </p>
      </div>
    </footer>
  );
}