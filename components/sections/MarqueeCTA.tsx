import { Sparkles } from 'lucide-react';

const CTA_PHRASES = ['Ready to Build Something Great', 'Start Your Project'];
const REPEATS = 3;

function MarqueeContent() {
  return (
    <>
      {Array.from({ length: REPEATS }).flatMap((_, repeatIndex) =>
        CTA_PHRASES.map((phrase, phraseIndex) => {
          const isAccent = phraseIndex % 2 === 1;
          return (
            <span
              key={`${repeatIndex}-${phrase}`}
              className="mx-6 flex shrink-0 items-center gap-6"
            >
              <span
                className={`font-display text-4xl font-semibold whitespace-nowrap md:text-6xl ${
                  isAccent ? 'gradient-text' : 'text-paper'
                }`}
              >
                {phrase}
              </span>
              <Sparkles className="h-6 w-6 shrink-0 text-secondary md:h-8 md:w-8" />
            </span>
          );
        })
      )}
    </>
  );
}

export default function MarqueeCTA() {
  return (
    <section className="relative overflow-hidden border-y border-(--line) bg-[var(--ink-deep)] py-10 md:py-14">
      <div
        className="pointer-events-none absolute -top-1/2 left-1/4 h-[40rem] w-[40rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-1/2 right-1/4 h-[40rem] w-[40rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--secondary-rgb), 0.35) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="marquee-cta-track flex w-max items-center whitespace-nowrap">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[var(--ink-deep)] to-transparent md:w-32"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[var(--ink-deep)] to-transparent md:w-32"
        aria-hidden="true"
      />
    </section>
  );
}
