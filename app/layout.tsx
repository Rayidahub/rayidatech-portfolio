// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Geist, Geist_Mono } from 'next/font/google';
import { getBaseUrl } from '@/lib/url';
import { getSiteSettings } from '@/lib/data/site-settings';
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
  const defaultTheme = siteSettings.default_theme || 'dark';
  const allowToggle = siteSettings.allow_user_toggle !== false;
  const themeVersion = siteSettings.theme_version || 1;

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

        {children}
      </body>
    </html>
  );
}
