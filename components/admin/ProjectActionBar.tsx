'use client';

import Link from 'next/link';
import { FileText, Globe } from 'lucide-react';
import {
  ProjectFormMode,
  ProjectFormStatus,
  getDraftButtonLabel,
  getPublishButtonLabel,
  getStatusToggleLabel,
  getStatusToggleClasses,
} from '@/lib/project-action-bar';

export interface ProjectActionBarProps {
  mode: ProjectFormMode;
  status: ProjectFormStatus;
  saving: boolean;
  onStatusToggle: () => void;
  onSaveDraft: () => void;
  onSavePublish: () => void;
  cancelHref?: string;
  position?: 'top' | 'bottom';
  isSticky?: boolean;
  className?: string;
}

export default function ProjectActionBar({
  mode,
  status,
  saving,
  onStatusToggle,
  onSaveDraft,
  onSavePublish,
  cancelHref = '/admin/projects',
  position = 'top',
  isSticky = false,
  className = '',
}: ProjectActionBarProps) {
  const isTop = position === 'top';

  return (
    <div
      data-testid={`project-action-bar-${position}`}
      data-status={status}
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isTop
          ? 'pb-4 mb-4 border-b border-(--line)'
          : 'pt-4 border-t border-(--line)'
      } ${
        isSticky
          ? 'sticky top-3 z-30 bg-ink-deep/90 backdrop-blur-md p-3.5 rounded-xl border border-(--line) shadow-2xl'
          : ''
      } ${className}`}
    >
      {/* Status Toggle Button */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-xs text-mist-2">Status:</span>
        <button
          type="button"
          onClick={onStatusToggle}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${getStatusToggleClasses(
            status
          )}`}
          title="Click to toggle publication status"
        >
          {getStatusToggleLabel(status, mode)}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        <Link
          href={cancelHref}
          className="px-3.5 py-2 rounded-xl text-xs text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
        >
          Cancel
        </Link>

        <button
          type="button"
          disabled={saving}
          onClick={onSaveDraft}
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-paper border border-(--line) hover:border-amber-500/40 rounded-xl px-4 py-2 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>{getDraftButtonLabel(mode, status, saving)}</span>
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={onSavePublish}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-xl px-5 py-2 text-xs font-medium transition-colors disabled:opacity-50 shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{getPublishButtonLabel(mode, status, saving)}</span>
        </button>
      </div>
    </div>
  );
}
