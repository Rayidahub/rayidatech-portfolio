'use client';

import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import BlogImportModal from '@/components/admin/BlogImportModal';

export default function BlogImportButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) bg-white/[0.04] hover:bg-white/[0.08] text-mist-1 hover:text-paper text-xs font-medium transition-all shadow-sm"
        title="Upload and auto-write articles from CSV or Excel (.xlsx)"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-secondary" />
        <span>Import (CSV / Excel)</span>
      </button>

      <BlogImportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

