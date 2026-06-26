import { Building2 } from 'lucide-react';

const logos = [
  'Armstrong Corp',
  'ProptVerse',
  'NEA Group',
  'The Link PR',
  'ALX Africa',
  'Coursera',
  'Vaulta',
  'FlavorEase',
];

export default function TrustBar() {
  const doubled = [...logos, ...logos];

  return (
    <section className="relative overflow-hidden py-14 border-y border-(--line) bg-[var(--ink-deep)]">
      {/* Subtle top light beam */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)',
        }}
        aria-hidden="true"
      />

      <p className="text-center text-sm text-mist-2 mb-8 font-mono-tight uppercase tracking-[0.2em]">
        Trusted by startups, businesses, and founders
      </p>

      <div className="relative">
        <div className="marquee-track flex items-center gap-6 whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5 text-sm font-medium text-mist-1 hover:text-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-(--line-strong) cursor-default"
            >
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-secondary font-semibold">
                {name.charAt(0)}
              </span>
              {name}
            </span>
          ))}
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[var(--ink-deep)] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[var(--ink-deep)] to-transparent z-10" />
      </div>
    </section>
  );
}
