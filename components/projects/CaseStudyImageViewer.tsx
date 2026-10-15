'use client';

import { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';

interface CaseStudyImageViewerProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspect?: 'video' | 'portrait' | 'auto' | 'square';
  priority?: boolean;
}

export function cleanImageUrl(url?: string): string {
  if (!url) return '';
  // Remove small WordPress resizing query parameters like ?w=300 or ?w=200
  return url.replace(/\?w=\d+/, '');
}

export default function CaseStudyImageViewer({
  src,
  alt,
  caption,
  className = '',
  aspect = 'auto',
}: CaseStudyImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cleanSrc = cleanImageUrl(src);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!cleanSrc) return null;

  const aspectClasses = {
    video: 'aspect-video',
    portrait: 'aspect-[9/16] max-w-sm mx-auto',
    square: 'aspect-square',
    auto: 'min-h-[260px] max-h-[640px]',
  }[aspect];

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`group relative overflow-hidden rounded-2xl md:rounded-3xl glass border border-(--line) cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 ${className}`}
        role="button"
        tabIndex={0}
        aria-label={`View larger image: ${alt}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {/* Subtle hover overlay gradient */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover expand badge */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full glass-strong px-3 py-1.5 text-xs font-mono-tight text-paper opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg">
          <Maximize2 className="w-3.5 h-3.5 text-secondary" />
          <span>Expand</span>
        </div>

        {caption && (
          <div className="absolute bottom-4 left-4 z-20 max-w-[70%] opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <p className="text-xs font-mono-tight text-white/90 truncate">{caption}</p>
          </div>
        )}

        <div className={`w-full flex items-center justify-center bg-black/20 ${aspectClasses}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cleanSrc}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full glass-strong text-white hover:text-secondary hover:scale-105 transition-all"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl glass-strong border border-(--line) p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cleanSrc}
              alt={alt}
              className="w-auto h-auto max-w-full max-h-[82vh] object-contain rounded-xl mx-auto"
            />
            {caption && (
              <p className="mt-2.5 px-3 py-1 text-center font-mono-tight text-xs text-mist-1">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
