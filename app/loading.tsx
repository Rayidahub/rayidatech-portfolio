export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-25 blur-3xl animate-pulse"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.4) 0%, rgba(var(--secondary-rgb), 0.2) 60%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated ring spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-secondary border-r-primary border-b-transparent border-l-transparent animate-spin" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-sm font-semibold tracking-wider text-paper/80">
            RAYIDA TECH
          </span>
          <span className="font-mono-tight text-[11px] text-mist-2 uppercase tracking-widest animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}

