'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

interface BlogThumbnailCellProps {
  id: string;
  title: string;
  coverImage?: string | null;
}

export default function BlogThumbnailCell({ id, title, coverImage }: BlogThumbnailCellProps) {
  const [hasError, setHasError] = useState(false);

  const isValidUrl =
    Boolean(coverImage) &&
    !hasError &&
    (coverImage?.startsWith('/') ||
      coverImage?.startsWith('http://') ||
      coverImage?.startsWith('https://') ||
      coverImage?.startsWith('data:image/'));

  return (
    <Link
      href={`/admin/blog/${id}/edit`}
      className="group relative block w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden border border-(--line) bg-ink-deep hover:border-primary/50 transition-all shrink-0 shadow-sm"
      title={`Edit "${title}"`}
    >
      {isValidUrl && coverImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={coverImage}
          alt={title}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] text-mist-2 group-hover:text-primary transition-colors">
          <ImageIcon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-[9px] font-mono-tight uppercase tracking-tight mt-0.5 opacity-50">
            No pic
          </span>
        </div>
      )}
    </Link>
  );
}

