// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rayidatech.name.ng'),
  title: {
    default: 'Raymond Gaius | Product Designer & AI Engineer',
    template: '%s | Raymond Gaius',
  },
  description:
    'Raymond Gaius — Product Designer and AI Engineer at Rayida Tech. Building digital experiences people can trust.',
  keywords: ['Raymond Gaius', 'Rayida Tech', 'Product Designer', 'AI Engineer', 'Portfolio'],
  openGraph: {
    title: 'Raymond Gaius | Product Designer & AI Engineer',
    description: 'Building digital experiences people can trust.',
    url: 'https://rayidatech.name.ng',
    siteName: 'Raymond Gaius',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geist.variable} ${geistMono.variable} text-paper antialiased`}
      >
        {/* Prevent theme flash before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Full-screen fixed background image */}
        <div className="fixed inset-0" aria-hidden="true" style={{ zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/bgmain.jpg"
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: 'blur(12px)', transform: 'scale(1.1)' }}
          />
        </div>
        {/* Theme-aware translucent overlay + blur */}
        <div
          className="fixed inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(var(--bg-blur))',
            WebkitBackdropFilter: 'blur(var(--bg-blur))',
            zIndex: 1,
            transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
          }}
        />
        <div className="relative" style={{ zIndex: 2 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
