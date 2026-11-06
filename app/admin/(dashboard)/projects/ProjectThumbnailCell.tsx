'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  ZoomIn,
  X,
  ExternalLink,
  Edit,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { isValidImageUrl, formatCoverImageAlt } from '@/lib/project-thumbnail';
import { ProjectStatus } from '@/types/project';

interface ProjectThumbnailCellProps {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  projectType?: string;
  status?: ProjectStatus;
  isPublished?: boolean;
}

export default function ProjectThumbnailCell({
  id,
  title,
  slug,
  coverImage,
  projectType = 'UI/UX Design',
  status = 'published',
  isPublished = true,
}: ProjectThumbnailCellProps) {
  const [hasError, setHasError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const valid = isValidImageUrl(coverImage) && !hasError;

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isPreviewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPreviewOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen]);

  const handleCopyUrl = async () => {
    if (!coverImage) return;
    try {
      await navigator.clipboard.writeText(coverImage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <>
      <div className="relative group shrink-0">
        {valid && coverImage ? (
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="group relative block w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden border border-(--line) bg-ink-deep hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm text-left cursor-pointer"
            title={`Preview "${title}" cover image`}
            aria-label={`Preview "${title}" cover image`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={formatCoverImageAlt(title)}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <ZoomIn className="w-4 h-4 text-paper drop-shadow" />
            </div>
          </button>
        ) : (
          <Link
            href={`/admin/projects/${id}/edit`}
            className="group relative flex flex-col items-center justify-center w-14 h-10 sm:w-16 sm:h-11 rounded-lg border border-dashed border-(--line) bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all text-mist-2 hover:text-paper"
            title={`No cover image set for "${title}". Click to add one.`}
          >
            <ImageIcon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-[9px] font-mono-tight uppercase tracking-tight mt-0.5 opacity-60">
              No cover
            </span>
          </Link>
        )}
      </div>

      {/* Lightbox / High-Res Preview Modal */}
      {isPreviewOpen && valid && coverImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`preview-title-${id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl glass-strong border border-(--line) rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-(--line) bg-white/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2
                      id={`preview-title-${id}`}
                      className="font-display font-semibold text-paper text-base sm:text-lg truncate"
                    >
                      {title}
                    </h2>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono-tight border ${
                        projectType === 'Brand Identity'
                          ? 'bg-primary/20 text-accent-soft border-primary/30'
                          : 'bg-white/5 text-mist-1 border-(--line)'
                      }`}
                    >
                      {projectType}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-tight border ${
                        status === 'draft'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          status === 'draft' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      {status === 'draft' ? 'Draft' : 'Published'}
                    </span>
                  </div>
                  <p className="text-xs text-mist-2 font-mono-tight mt-0.5 truncate">
                    /{slug}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors"
                title="Close preview (Esc)"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Canvas */}
            <div className="relative bg-ink-deep flex items-center justify-center overflow-auto p-4 sm:p-6 min-h-[260px] max-h-[60vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={formatCoverImageAlt(title)}
                className="max-w-full max-h-[55vh] object-contain rounded-lg border border-(--line) shadow-lg"
              />
            </div>

            {/* Modal Footer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-(--line) bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs text-mist-2 truncate max-w-md">
                <span className="font-mono-tight text-[11px] truncate">
                  {coverImage}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper transition-colors shrink-0 text-xs"
                  title="Copy image URL"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/projects/${slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) text-mist-1 hover:text-paper hover:bg-white/5 text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isPublished ? 'Live View' : 'Preview Case Study'}</span>
                </Link>
                <Link
                  href={`/admin/projects/${id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
