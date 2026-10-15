import Link from 'next/link';
import { ArrowLeft, ArrowRight, FolderSearch } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

export default function NotFound() {
  return (
    <main className="relative min-h-[85vh] flex items-center justify-center bg-ink py-20 px-4 overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container size="narrow" className="relative z-10">
        <GlassCard
          hover={false}
          className="p-8 sm:p-12 md:p-16 text-center border border-(--line) space-y-6 max-w-lg mx-auto shadow-2xl rounded-3xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary mx-auto shadow-inner">
            <FolderSearch className="w-8 h-8 text-secondary" />
          </div>

          <div>
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-2">
              404 • Not Found
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-paper">
              Page <span className="gradient-text">Not Found</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-mist-1 leading-relaxed max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page you were looking for. It might have been moved, renamed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold transition-all hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back Home</span>
            </Link>
            <Link
              href="/projects"
              className="glass inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-(--line) text-paper text-sm font-semibold hover:border-(--line-strong) transition-colors"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 text-secondary" />
            </Link>
          </div>
        </GlassCard>
      </Container>
    </main>
  );
}
