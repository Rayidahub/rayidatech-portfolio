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
    <section className="overflow-hidden py-12 border-b border-(--line)">
      <p className="text-center text-sm text-mist-2 mb-8 font-mono-tight uppercase tracking-[0.15em]">
        Trusted by startups, businesses, and founders across Nigeria
      </p>
      <div className="relative">
        <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-sm font-medium text-mist-1 opacity-50 hover:opacity-100 transition-opacity px-2"
            >
              {name}
            </span>
          ))}
        </div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10" />
      </div>
    </section>
  );
}