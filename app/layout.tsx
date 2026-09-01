// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Geist, Geist_Mono } from 'next/font/google';
import { getBaseUrl } from '@/lib/url';
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
  metadataBase: new URL(getBaseUrl()),
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
    url: getBaseUrl(),
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geist.variable} ${geistMono.variable} text-paper antialiased`}
      >
        {/* Prevent theme flash before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}
