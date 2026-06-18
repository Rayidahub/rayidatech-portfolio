// components/layout/Footer.tsx
import Link from 'next/link';
import { Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold text-white">
              Raymond<span className="text-teal-400">.dev</span>
            </Link>
            <p className="text-gray-500 text-sm mt-1">
              Building digital experiences people can trust.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-teal-400 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/rayida-tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-teal-400 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="mailto:rayidagaius@gmail.com"
              className="text-gray-500 hover:text-teal-400 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Raymond Gaius. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
