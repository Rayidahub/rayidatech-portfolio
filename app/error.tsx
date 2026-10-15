'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime application error:', error);
  }, [error]);

  return (
    <main className="relative min-h-[80vh] flex items-center justify-center bg-ink py-20 px-4 overflow-hidden">
      {/* Background radial ambient glow */}
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
          className="p-8 sm:p-12 text-center border border-(--line) space-y-6 max-w-lg mx-auto shadow-2xl rounded-3xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-2">
              System Notice
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper">
              Something went <span className="gradient-text">wrong</span>
            </h1>
          </div>

          <p className="text-sm text-mist-1 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while loading this page. Our telemetry has logged the incident.
          </p>

          {error?.message && process.env.NODE_ENV === 'development' && (
            <pre className="p-3 rounded-xl bg-black/60 border border-rose-500/20 text-rose-300 text-xs font-mono text-left overflow-x-auto max-h-32">
              {error.message}
            </pre>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold transition-all hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="glass inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-(--line) text-paper text-sm font-semibold hover:border-(--line-strong) transition-colors"
            >
              <Home className="w-4 h-4 text-secondary" />
              <span>Back Home</span>
            </Link>
          </div>
        </GlassCard>
      </Container>
    </main>
  );
}

