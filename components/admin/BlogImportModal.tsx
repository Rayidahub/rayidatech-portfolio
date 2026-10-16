'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Loader2,
  Check,
  HelpCircle,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  BookOpen,
} from 'lucide-react';
import MarkdownContent from '@/components/ui/MarkdownContent';

export const BLOG_TEMPLATE_COLUMNS = [
  'Title *',
  'Slug',
  'Excerpt *',
  'Content (Markdown) *',
  'Tags (comma-separated)',
  'Cover Image URL',
  'Published',
];

const SAMPLE_POST_ROWS = [
  {
    'Title *': 'Designing AI Experiences People Can Trust',
    Slug: 'designing-ai-experiences-people-can-trust',
    'Excerpt *':
      'How thoughtful product architecture, transparent feedback loops, and human-centered design create trustworthy artificial intelligence applications.',
    'Content (Markdown) *': `## Introduction

As machine learning systems become embedded in everyday workflows, the primary competitive moat for product designers is **trust**. Users do not just want answers—they want **verifiable transparency**.

### Core Tenets of Trustworthy Design

- **State Transparency:** Never leave the user guessing what the model is computing.
- **Graceful Failure:** When uncertainty is high, surface confidence intervals rather than hallucinations.
- **Reversible Actions:** Provide one-click rollback on all AI automated writes.

![System Architecture Overview]([IMAGE_PLACEHOLDER_1])

> "Trust is not built by pretending the AI is human. Trust is built by proving the machine is reliable."

### Practical Implementation

When engineering interfaces for generative systems, enforce strict latency budgets and progress indicators:

\`\`\`typescript
const result = await model.generate({
  temperature: 0.2, // Low variance for enterprise stability
  maxTokens: 1024,
});
\`\`\`

---

By prioritizing clarity over novelty, digital products foster deep, long-term user retention.`,
    'Tags (comma-separated)': 'AI, Product Design, UX, Engineering',
    'Cover Image URL': '[IMAGE_PLACEHOLDER]',
    Published: 'Yes',
  },
  {
    'Title *': 'The Evolution of High-Performance Fintech Systems',
    Slug: 'evolution-of-high-performance-fintech-systems',
    'Excerpt *':
      'Architectural insights into building ultra-low-latency transaction gateways, multi-tenant databases, and resilient consumer banking UX.',
    'Content (Markdown) *': `## The Modern Financial Stack

Modern fintech platforms require zero-downtime reliability combined with microsecond precision. A split-second delay during currency conversion directly correlates with cart abandonment.

### Essential Pillars

1. **Idempotent API Requests:** Every financial mutation must be safely retryable.
2. **Distributed Audit Ledgers:** Double-entry bookkeeping at the database constraint level.
3. **Optimistic UI Updates:** Instant balance reflection with background reconciliation.

![Transaction Gateway Workflow]([IMAGE_PLACEHOLDER_2])

### Summary

Simplicity on the surface requires immense precision beneath the hood.`,
    'Tags (comma-separated)': 'Fintech, Architecture, TypeScript',
    'Cover Image URL': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    Published: 'Yes',
  },
];

export interface ParsedBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover_image: string;
  published: boolean;
  rawRowIndex: number;
  hasErrors?: boolean;
  errors?: string[];
  placeholderCount?: number;
}

interface BlogImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSelectForEditor?: (post: ParsedBlogPost) => void;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BlogImportModal({
  isOpen,
  onClose,
  onSuccess,
  onSelectForEditor,
}: BlogImportModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [fileName, setFileName] = useState('');
  const [parsedPosts, setParsedPosts] = useState<ParsedBlogPost[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);
  const [previewPost, setPreviewPost] = useState<ParsedBlogPost | null>(null);

  if (!isOpen) return null;

  // 1. Download template file (CSV or XLSX)
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    const ws = XLSX.utils.json_to_sheet(SAMPLE_POST_ROWS, {
      header: BLOG_TEMPLATE_COLUMNS,
    });

    // Auto-size columns
    ws['!cols'] = [
      { wch: 38 }, // Title
      { wch: 32 }, // Slug
      { wch: 55 }, // Excerpt
      { wch: 75 }, // Content
      { wch: 30 }, // Tags
      { wch: 40 }, // Cover Image
      { wch: 12 }, // Published
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Blog Articles');

    if (format === 'xlsx') {
      XLSX.writeFile(wb, 'rayida_tech_blog_template.xlsx');
    } else {
      XLSX.writeFile(wb, 'rayida_tech_blog_template.csv', { bookType: 'csv' });
    }
  };

  // 2. Parse uploaded file
  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = wb.SheetNames[0];
      const ws = wb.Sheets[firstSheetName];

      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, {
        defval: '',
      });

      if (rawRows.length === 0) {
        alert('The uploaded spreadsheet contains no rows.');
        return;
      }

      const parsed: ParsedBlogPost[] = rawRows.map((row, idx) => {
        // Case-insensitive & asterisk-tolerant field lookup
        const getVal = (keyPattern: RegExp) => {
          const matchKey = Object.keys(row).find((k) => keyPattern.test(k.trim()));
          return matchKey ? String(row[matchKey]).trim() : '';
        };

        const title = getVal(/^title/i);
        let slug = getVal(/^slug/i);
        if (!slug && title) {
          slug = generateSlug(title);
        }

        const excerpt = getVal(/^excerpt|^summary|^description/i);
        const content = getVal(/^content|^markdown|^body|^text/i);
        const rawTags = getVal(/^tags|^categories/i);
        const tags = rawTags
          ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
          : [];

        const coverImage = getVal(/^cover|^image|^thumbnail/i);
        const rawPublished = getVal(/^published|^status/i);
        const published =
          rawPublished.toLowerCase() === 'yes' ||
          rawPublished.toLowerCase() === 'true' ||
          rawPublished === '1';

        // Detect image placeholders inside write-up or cover
        const contentPlaceholders = content.match(/\[IMAGE_PLACEHOLDER[^\]]*\]/gi) || [];
        const isCoverPlaceholder =
          !coverImage ||
          coverImage.includes('IMAGE_PLACEHOLDER') ||
          coverImage.toLowerCase().includes('placeholder');
        const placeholderCount =
          contentPlaceholders.length + (isCoverPlaceholder ? 1 : 0);

        // Validation checks
        const errors: string[] = [];
        if (!title) errors.push('Title is required');
        if (!content) errors.push('Content (Markdown) is required');
        if (!excerpt) errors.push('Excerpt / Summary is recommended');

        return {
          title,
          slug,
          excerpt,
          content,
          tags,
          cover_image: isCoverPlaceholder ? '' : coverImage,
          published,
          rawRowIndex: idx + 2,
          hasErrors: errors.length > 0,
          errors,
          placeholderCount,
        };
      });

      setParsedPosts(parsed);
      setSelectedIndices(
        parsed
          .map((p, idx) => (!p.hasErrors ? idx : -1))
          .filter((i) => i !== -1)
      );
      setStep('preview');
    } catch (err: any) {
      alert(`Error reading file: ${err?.message || 'Invalid format'}`);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIndices.length === parsedPosts.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(parsedPosts.map((_, i) => i));
    }
  };

  const handleToggleSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // 3. Import selected articles into Supabase
  const handleExecuteImport = async () => {
    const toImport = parsedPosts.filter((_, idx) => selectedIndices.includes(idx));
    if (toImport.length === 0) return;

    setImporting(true);
    let successCount = 0;
    let failedCount = 0;

    const supabase = createClient();

    for (const post of toImport) {
      try {
        const { error } = await supabase.from('posts').upsert(
          {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            tags: post.tags.length > 0 ? post.tags : null,
            cover_image: post.cover_image || null,
            published: post.published,
          },
          { onConflict: 'slug' }
        );

        if (error) {
          console.error('Supabase import error on post:', post.title, error);
          failedCount++;
        } else {
          successCount++;
        }
      } catch {
        failedCount++;
      }
    }

    setImporting(false);
    setImportResults({ success: successCount, failed: failedCount });
    router.refresh();

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl glass rounded-3xl border border-(--line) shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--line) bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-secondary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-paper">
                Import Blog Articles (CSV / Excel)
              </h2>
              <p className="text-xs text-mist-2">
                Batch upload articles formatted in Markdown with automatic image placeholder detection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-mist-2 hover:text-paper hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Step 1: Download Templates */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-(--line) space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 text-secondary text-xs font-mono-tight flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-display text-sm font-semibold text-paper">
                      Download Official Spreadsheet Template
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono-tight text-mist-2">
                    Pre-filled with Markdown samples
                  </span>
                </div>

                <p className="text-xs text-mist-1 leading-relaxed">
                  Use our formatted template to ensure your blog post structure (titles, slugs, excerpts, markdown write-ups, tags, and image placeholders) maps smoothly.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel Template (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-(--line) text-paper text-xs font-medium transition-all"
                  >
                    <Download className="w-4 h-4 text-secondary" />
                    <span>Download CSV Template (.csv)</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Upload File Dropzone */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 text-secondary text-xs font-mono-tight flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-display text-sm font-semibold text-paper">
                    Select Your Prepared Spreadsheet
                  </h3>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-(--line) hover:border-primary/50 bg-white/[0.01] hover:bg-primary/[0.02] rounded-3xl p-10 text-center cursor-pointer transition-all space-y-4 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />

                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary mx-auto group-hover:scale-105 transition-transform">
                    <Upload className="w-8 h-8 text-secondary" />
                  </div>

                  <div>
                    <p className="font-display font-semibold text-paper text-base">
                      Click to browse your device files or drag &amp; drop
                    </p>
                    <p className="text-xs text-mist-2 mt-1">
                      Supports CSV (.csv) and Microsoft Excel (.xlsx, .xls) up to 25MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Summary Stats Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-(--line) text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-secondary" />
                  <span className="text-paper font-medium">{fileName}</span>
                  <span className="text-mist-2">&bull;</span>
                  <span className="text-secondary font-mono-tight">
                    {parsedPosts.length} post{parsedPosts.length === 1 ? '' : 's'} parsed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-secondary hover:underline font-medium"
                  >
                    {selectedIndices.length === parsedPosts.length
                      ? 'Deselect All'
                      : 'Select All Valid'}
                  </button>
                  <span className="text-mist-2">&bull;</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('upload');
                      setParsedPosts([]);
                    }}
                    className="text-mist-2 hover:text-paper"
                  >
                    Upload Different File
                  </button>
                </div>
              </div>

              {/* Import Results Banner */}
              {importResults && (
                <div
                  className={`p-4 rounded-2xl border ${
                    importResults.failed === 0
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-semibold text-sm">
                        Successfully imported {importResults.success} article{importResults.success === 1 ? '' : 's'}!
                        {importResults.failed > 0 && ` (${importResults.failed} failed)`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.refresh();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* Posts Table */}
              <div className="glass rounded-2xl border border-(--line) overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-(--line) bg-white/[0.04] text-mist-2 font-mono-tight uppercase text-[11px]">
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIndices.length === parsedPosts.length && parsedPosts.length > 0}
                            onChange={handleToggleSelectAll}
                            className="rounded accent-primary"
                          />
                        </th>
                        <th className="py-3 px-4">Title &amp; Slug</th>
                        <th className="py-3 px-4">Tags &amp; Status</th>
                        <th className="py-3 px-4">Image Placeholders</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--line)">
                      {parsedPosts.map((post, idx) => {
                        const isSelected = selectedIndices.includes(idx);
                        return (
                          <tr
                            key={idx}
                            className={`hover:bg-white/[0.02] transition-colors ${
                              post.hasErrors ? 'opacity-60 bg-rose-500/[0.02]' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={post.hasErrors}
                                onChange={() => handleToggleSelect(idx)}
                                className="rounded accent-primary disabled:opacity-40"
                              />
                            </td>
                            <td className="py-3 px-4 max-w-sm">
                              <p className="font-medium text-paper truncate" title={post.title}>
                                {post.title || <span className="text-red-400 italic">Missing Title</span>}
                              </p>
                              <span className="font-mono text-[11px] text-secondary/80 block mt-0.5 truncate">
                                /{post.slug}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 2 && (
                                  <span className="text-[10px] text-mist-2">
                                    +{post.tags.length - 2}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`inline-block mt-1 text-[10px] font-mono-tight px-1.5 py-0.2 rounded ${
                                  post.published
                                    ? 'bg-emerald-500/10 text-emerald-300'
                                    : 'bg-white/5 text-mist-2'
                                }`}
                              >
                                {post.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {post.placeholderCount && post.placeholderCount > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                  <ImageIcon className="w-3 h-3 text-amber-400" />
                                  <span>{post.placeholderCount} image placeholder{post.placeholderCount === 1 ? '' : 's'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono-tight">
                                  <Check className="w-3 h-3" />
                                  <span>Images Ready</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => setPreviewPost(post)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper text-xs transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-secondary" />
                                <span>Preview</span>
                              </button>

                              {onSelectForEditor && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectForEditor(post);
                                    onClose();
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-white text-xs transition-colors"
                                  title="Load this article directly into editor"
                                >
                                  <span>Load in Editor</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Post Markdown Preview Drawer */}
              {previewPost && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-secondary/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-display font-semibold text-paper text-base">
                        {previewPost.title}
                      </h4>
                      <p className="text-xs text-mist-2 font-mono">
                        Slug: /{previewPost.slug}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewPost(null)}
                      className="p-1.5 rounded-lg text-mist-2 hover:text-paper"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-ink/60 border border-(--line) max-h-80 overflow-y-auto">
                    <MarkdownContent content={previewPost.content} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-(--line) bg-white/[0.02] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs text-mist-2 hover:text-paper border border-(--line) hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          {step === 'preview' && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-mist-2 font-mono-tight hidden sm:inline">
                {selectedIndices.length} of {parsedPosts.length} selected
              </span>

              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={importing || selectedIndices.length === 0}
                className="btn-glow inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                {importing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>
                  {importing
                    ? 'Writing Articles to Database...'
                    : `Batch Import (${selectedIndices.length}) Articles`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

