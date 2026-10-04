import Link from 'next/link';

interface StatusPillProps {
  /** Defaults to true; pass false to show "Not taking new projects" state */
  available?: boolean;
  text?: string;
  href?: string;
  className?: string;
}

export default function StatusPill({
  available = true,
  text,
  href,
  className = '',
}: StatusPillProps) {
  const label = text || (available ? 'Available for projects' : 'Not taking new projects');

  const content = (
    <div
      className={`glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${available ? 'signal-dot' : 'bg-mist-2'}`}
        aria-hidden="true"
      />
      <span className="text-xs font-medium text-mist-1">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-transform hover:scale-105">
        {content}
      </Link>
    );
  }

  return content;
}
