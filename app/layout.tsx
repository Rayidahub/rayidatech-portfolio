import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Geist, Geist_Mono } from 'next/font/google';
import { getBaseUrl } from '@/lib/url';
import { getSiteSettings } from '@/lib/data/site-settings';
import ActivityTracker from '@/components/analytics/ActivityTracker';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
    { media: '(prefers-color-scheme: light)', color: '#f8f7fb' },
  ],
};

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
  keywords: [
    'Raymond Gaius',
    'Rayida Tech',
    'Product Designer',
    'AI Engineer',
    'Full Stack Developer',
    'UI/UX Designer Nigeria',
    'Fintech Product Design',
    'Portfolio',
  ],
  authors: [{ name: 'Raymond Gaius', url: getBaseUrl() }],
  creator: 'Raymond Gaius',
  publisher: 'Rayida Tech',
  openGraph: {
    title: 'Raymond Gaius | Product Designer & AI Engineer',
    description: 'Building digital experiences people can trust.',
    url: getBaseUrl(),
    siteName: 'Raymond Gaius — Rayida Tech',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Raymond Gaius — Product Designer & AI Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raymond Gaius | Product Designer & AI Engineer',
    description: 'Building digital experiences people can trust.',
    creator: '@Rayidahub',
    images: ['/icon.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();
  const defaultTheme = siteSettings.default_theme === 'light' ? 'light' : 'dark';
  const allowToggle = siteSettings.allow_user_toggle !== false;
  const themeVersion = Math.max(1, Math.floor(Number(siteSettings.theme_version) || 1));

  return (
    <html
      lang="en"
      data-theme={defaultTheme}
      data-allow-toggle={allowToggle ? 'true' : 'false'}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${geist.variable} ${geistMono.variable} text-paper antialiased`}
      >
        {/* Prevent theme flash before hydration with admin default fallback */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var defaultTheme = '${defaultTheme}';
                  var allowToggle = ${allowToggle ? 'true' : 'false'};
                  var currentVersion = ${themeVersion};
                  var storedVersion = parseInt(localStorage.getItem('theme_version') || '0', 10);
                  var storedTheme = localStorage.getItem('theme');

                  var finalTheme = defaultTheme;
                  if (allowToggle && storedVersion >= currentVersion && (storedTheme === 'light' || storedTheme === 'dark')) {
                    finalTheme = storedTheme;
                  } else {
                    localStorage.setItem('theme', defaultTheme);
                    localStorage.setItem('theme_version', String(currentVersion));
                  }

                  document.documentElement.setAttribute('data-theme', finalTheme);
                } catch (e) {}
              })();
            `,
          }}
        />

        <Suspense fallback={null}>
          <ActivityTracker />
        </Suspense>

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': `${getBaseUrl()}/#person`,
                  name: 'Raymond Gaius',
                  jobTitle: 'Product Designer & AI Engineer',
                  url: getBaseUrl(),
                  email: 'rayidagaius@gmail.com',
                  sameAs: [
                    'https://github.com/Rayidahub',
                    'https://wa.link/tlezg8',
                  ],
                  worksFor: {
                    '@type': 'Organization',
                    name: 'Rayida Tech',
                    url: getBaseUrl(),
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': `${getBaseUrl()}/#website`,
                  url: getBaseUrl(),
                  name: 'Rayida Tech — Raymond Gaius',
                  description: 'Building digital experiences people can trust.',
                  publisher: {
                    '@id': `${getBaseUrl()}/#person`,
                  },
                },
              ],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}
