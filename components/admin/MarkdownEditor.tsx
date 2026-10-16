'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListCheck,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  Minus,
  Eye,
  Edit3,
  Columns,
  Upload,
  Loader2,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Minimize2,
  HelpCircle,
  X,
} from 'lucide-react';
import MarkdownContent from '@/components/ui/MarkdownContent';
import { getReadingTime } from '@/lib/reading-time';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export default function MarkdownEditor({
  value = '',
  onChange,
  label = 'Article Write-up (Markdown)',
  placeholder = 'Write your article here using Markdown... You can use Bold, Italic, Headings, Lists, Quotes, or upload images directly.',
  minHeight = 'min-h-[360px]',
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('write');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [replacingPlaceholder, setReplacingPlaceholder] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const placeholderReplaceInputRef = useRef<HTMLInputElement>(null);

  // Calculate statistics
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const readingTime = getReadingTime(value);

  // Detect image placeholders in write-up
  const placeholdersFound = Array.from(
    new Set((value.match(/\[IMAGE_PLACEHOLDER[^\]]*\]/gi) || []))
  );

  // Helper to insert or wrap text at cursor position
  const insertText = useCallback(
    (before: string, after: string = '', defaultText: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);

      const insertion = selected
        ? `${before}${selected}${after}`
        : `${before}${defaultText}${after}`;

      const newValue = value.substring(0, start) + insertion + value.substring(end);
      onChange(newValue);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const cursorPosition = selected
          ? start + insertion.length
          : start + before.length + defaultText.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    },
    [value, onChange]
  );

  // Prefix block lines (e.g. for headings, lists, quotes)
  const prefixLines = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Find beginning of current line
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', end);
      const actualEnd = lineEnd === -1 ? value.length : lineEnd;

      const selectedBlock = value.substring(lineStart, actualEnd);
      const modifiedBlock = selectedBlock
        .split('\n')
        .map((line) => `${prefix}${line.replace(/^(\s*[-*#>]|\s*\d+\.)\s*/, '')}`)
        .join('\n');

      const newValue = value.substring(0, lineStart) + modifiedBlock + value.substring(actualEnd);
      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(lineStart + modifiedBlock.length, lineStart + modifiedBlock.length);
      }, 0);
    },
    [value, onChange]
  );

  // Handle keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K, Tab)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        insertText('**', '**', 'bold text');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        insertText('*', '*', 'italic text');
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        const selected = value.substring(
          textareaRef.current?.selectionStart || 0,
          textareaRef.current?.selectionEnd || 0
        );
        setLinkText(selected || 'link text');
        setLinkUrl('https://');
        setShowLinkModal(true);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ', '');
    }
  };

  // Upload image from device and insert markdown tag
  const handleDeviceImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blog');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload image');
      }

      const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      if (replacingPlaceholder) {
        // Replace existing placeholder in content
        const updated = value.replace(replacingPlaceholder, `![${alt}](${data.url})`);
        onChange(updated);
        setReplacingPlaceholder(null);
      } else {
        // Insert at cursor
        insertText(`\n![${alt}](${data.url})\n`, '');
      }
    } catch (err: any) {
      alert(`Image upload error: ${err?.message || 'Upload failed'}`);
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (placeholderReplaceInputRef.current) placeholderReplaceInputRef.current.value = '';
    }
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    insertText(`[${linkText || 'link'}](${linkUrl})`, '');
    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
  };

  return (
    <div
      className={`space-y-2 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[var(--ink)] p-6 overflow-y-auto flex flex-col'
          : 'relative'
      }`}
    >
      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleDeviceImageUpload(file);
        }}
      />
      <input
        ref={placeholderReplaceInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleDeviceImageUpload(file);
        }}
      />

      {/* Header and View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-paper">
            {label}
          </label>
          <span className="text-[11px] font-mono-tight text-mist-2 bg-white/5 px-2 py-0.5 rounded-full border border-(--line)">
            Markdown Enabled
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* View Mode Pills */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-(--line)">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'write'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-2 hover:text-paper'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-2 hover:text-paper'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-2 hover:text-paper'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-mist-2 hover:text-paper border border-(--line) transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Placeholders Notification Banner */}
      {placeholdersFound.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-medium">
              {placeholdersFound.length} Image Placeholder{placeholdersFound.length === 1 ? '' : 's'} detected in article:
            </span>
            <div className="flex flex-wrap gap-1">
              {placeholdersFound.map((ph) => (
                <span key={ph} className="font-mono bg-black/40 px-2 py-0.5 rounded text-amber-200">
                  {ph}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setReplacingPlaceholder(placeholdersFound[0]);
              placeholderReplaceInputRef.current?.click();
            }}
            disabled={uploadingImage}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-ink font-semibold transition-colors disabled:opacity-50"
          >
            {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>Upload Device Image to Replace {placeholdersFound[0]}</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <div
        className={`glass rounded-2xl border border-(--line) overflow-hidden flex flex-col ${
          isFullscreen ? 'flex-1' : ''
        }`}
      >
        {/* Rich Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-(--line) bg-white/[0.02]">
          {/* Headings */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => prefixLines('# ')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Heading 1 (# text)"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => prefixLines('## ')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Heading 2 (## text)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => prefixLines('### ')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Heading 3 (### text)"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Text Styling */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => insertText('**', '**', 'bold text')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors font-bold"
              title="Bold (**text**) — Ctrl+B"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('*', '*', 'italic text')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors italic"
              title="Italic (*text*) — Ctrl+I"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('~~', '~~', 'strikethrough')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Strikethrough (~~text~~)"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('`', '`', 'code')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors font-mono"
              title="Inline Code (`code`)"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => prefixLines('- ')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Bullet List (- item)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => prefixLines('1. ')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Numbered List (1. item)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => prefixLines('- [ ] ')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Checklist / Task List (- [ ] task)"
            >
              <ListCheck className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => prefixLines('> ')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Blockquote (> text)"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Links, Images & Placeholders */}
          <div className="flex items-center gap-1 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => {
                const selected = value.substring(
                  textareaRef.current?.selectionStart || 0,
                  textareaRef.current?.selectionEnd || 0
                );
                setLinkText(selected || 'link text');
                setLinkUrl('https://');
                setShowLinkModal(true);
              }}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Insert Link ([text](url)) — Ctrl+K"
            >
              <LinkIcon className="w-4 h-4 text-secondary" />
            </button>

            {/* Upload Image from Device */}
            <button
              type="button"
              onClick={() => {
                setReplacingPlaceholder(null);
                imageInputRef.current?.click();
              }}
              disabled={uploadingImage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-white text-xs font-medium border border-primary/30 transition-all disabled:opacity-50"
              title="Upload image from device and embed markdown"
            >
              {uploadingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-secondary" />
              )}
              <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
            </button>

            {/* Insert Image Placeholder */}
            <button
              type="button"
              onClick={() => {
                const count = placeholdersFound.length + 1;
                insertText(`\n![Image: Article Visual / Diagram]([IMAGE_PLACEHOLDER_${count}])\n`, '');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30 transition-colors"
              title="Insert image placeholder for manual upload later"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Add Placeholder</span>
            </button>
          </div>

          {/* Table & Divider */}
          <div className="flex items-center gap-0.5 pl-1.5">
            <button
              type="button"
              onClick={() =>
                insertText(
                  '\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Value 1 | Value 2 | Value 3 |\n| Value 4 | Value 5 | Value 6 |\n'
                )
              }
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Insert 3-Column Table"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\n---\n')}
              className="p-1.5 rounded-lg text-mist-1 hover:text-paper hover:bg-white/5 transition-colors"
              title="Horizontal Divider (---)"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className={`relative ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
          {/* Write Mode */}
          {viewMode === 'write' && (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={14}
              className={`w-full p-4 sm:p-5 bg-transparent text-sm sm:text-base text-paper placeholder:text-mist-2/60 focus:outline-none font-mono-tight leading-relaxed resize-y ${minHeight} ${
                isFullscreen ? 'flex-1 h-full resize-none' : ''
              }`}
            />
          )}

          {/* Preview Mode */}
          {viewMode === 'preview' && (
            <div
              className={`p-6 sm:p-8 overflow-y-auto bg-[var(--ink-deep)]/40 ${minHeight} ${
                isFullscreen ? 'flex-1 h-full' : 'max-h-[600px]'
              }`}
            >
              {value.trim() ? (
                <MarkdownContent
                  content={value}
                  onPlaceholderClick={(ph) => {
                    setReplacingPlaceholder(ph);
                    placeholderReplaceInputRef.current?.click();
                  }}
                />
              ) : (
                <p className="text-mist-2 italic text-sm">No write-up content to preview yet.</p>
              )}
            </div>
          )}

          {/* Split Mode (Side by Side) */}
          {viewMode === 'split' && (
            <div className={`grid grid-cols-2 divide-x divide-(--line) ${minHeight} ${isFullscreen ? 'flex-1' : ''}`}>
              <div className="p-4 flex flex-col">
                <span className="text-[10px] font-mono-tight text-mist-2 uppercase tracking-wider mb-2">
                  Editor (Markdown)
                </span>
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full flex-1 bg-transparent text-sm text-paper placeholder:text-mist-2/60 focus:outline-none font-mono-tight leading-relaxed resize-none h-[450px]"
                />
              </div>

              <div className="p-6 overflow-y-auto bg-[var(--ink-deep)]/40 h-[450px]">
                <span className="text-[10px] font-mono-tight text-secondary uppercase tracking-wider mb-4 block">
                  Live Formatted Output
                </span>
                {value.trim() ? (
                  <MarkdownContent
                    content={value}
                    onPlaceholderClick={(ph) => {
                      setReplacingPlaceholder(ph);
                      placeholderReplaceInputRef.current?.click();
                    }}
                  />
                ) : (
                  <p className="text-mist-2 italic text-sm">Output will render here as you type...</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Status Bar with Word Counts & Tips */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-t border-(--line) bg-white/[0.02] text-xs text-mist-2 font-mono-tight">
          <div className="flex items-center gap-3">
            <span>
              Words: <strong className="text-paper">{wordCount.toLocaleString()}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Characters: <strong className="text-paper">{charCount.toLocaleString()}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Read time: <strong className="text-secondary">{readingTime}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-mist-2 hidden sm:flex">
            <span>Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-paper">Ctrl+B</kbd>
            <span>Bold</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-paper">Ctrl+I</kbd>
            <span>Italic</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-paper">Ctrl+K</kbd>
            <span>Link</span>
          </div>
        </div>
      </div>

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLinkModal(false)}
        >
          <div
            className="w-full max-w-md glass rounded-2xl p-6 border border-(--line) space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-(--line) pb-3">
              <h3 className="font-display font-semibold text-paper text-sm flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-secondary" />
                <span>Insert Web Link</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-mist-2 hover:text-paper"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="space-y-3">
              <div>
                <label className="block text-xs text-mist-1 mb-1">Anchor Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Visit Rayida Tech"
                  className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-sm text-paper focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-mist-1 mb-1">Target URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-sm text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-mist-1 hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

