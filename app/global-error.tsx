'use client';

import { RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className="bg-[#1a1a2e] text-[#f2f2f2] min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#00d1ff] mx-auto text-2xl font-bold">
            !
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[#00d1ff] font-mono mb-2">
              Critical Error
            </p>
            <h1 className="text-2xl font-bold">Application Error</h1>
          </div>

          <p className="text-sm text-[#b8b8c8] leading-relaxed">
            A critical system error occurred. Please try refreshing the page or returning home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#8000ff] hover:bg-[#8000ff]/90 text-white text-sm font-semibold transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#f2f2f2] text-sm font-semibold transition-colors"
            >
              <Home className="w-4 h-4 text-[#00d1ff]" />
              <span>Back Home</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

