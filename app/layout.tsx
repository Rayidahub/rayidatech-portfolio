// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Raymond Gaius | Product Designer & AI Engineer',
  description: 'Portfolio of Raymond Gaius — Product Designer, UI/UX Designer, and AI Engineer at Rayida Tech.',
  keywords: ['Raymond Gaius', 'Product Designer', 'UI/UX', 'Rayida Tech', 'Portfolio'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}