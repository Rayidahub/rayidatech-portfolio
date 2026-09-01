// components/ui/StatusPill.tsx
interface StatusPillProps {
  /** Defaults to true; pass false to show "Not taking new projects" state */
  available?: boolean;
  className?: string;
}

export default function StatusPill({
  available = true,
  className = '',
}: StatusPillProps) {
  return (
    <div
      className={`glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${available ? 'signal-dot' : 'bg-mist-2'}`}
        aria-hidden="true"
      />
      <span className="text-xs font-medium text-mist-1">
        {available ? 'Available for projects' : 'Not taking new projects'}
      </span>
    </div>
  );
}
