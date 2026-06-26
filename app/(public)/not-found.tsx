import Link from 'next/link';
import { ArrowLeft, FolderSearch } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';

export default function NotFound() {
  return (
    <Section className="pt-32 pb-20 min-h-screen bg-ink">
      <Container size="narrow">
        <GlassCard className="p-10 md:p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FolderSearch className="w-8 h-8 text-secondary" />
          </div>

          <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
            404 Error
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 gradient-text">
            Page Not Found
          </h1>
          <p className="text-mist-1 text-lg mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you were looking for. It might
            have been moved or no longer exists.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-paper rounded-lg px-6 py-3 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back Home
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 glass text-paper hover:text-secondary rounded-lg px-6 py-3 text-sm font-medium transition-colors"
            >
              View Projects
            </Link>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}
