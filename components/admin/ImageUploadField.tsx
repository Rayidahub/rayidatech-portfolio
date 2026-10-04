'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  description?: string;
  objectFit?: 'cover' | 'contain';
  aspectRatio?: string;
}

export default function ImageUploadField({
  label = 'Visual Showcase Image',
  value,
  onChange,
  folder = 'uploads',
  description = 'Upload from your device (PNG, JPG, WebP, SVG up to 10MB)',
  objectFit = 'cover',
  aspectRatio = 'aspect-[16/9]',
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }

  function handleClear() {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-paper">{label}</label>
        {value && (
          <span className="inline-flex items-center gap-1 text-xs text-secondary font-mono-tight">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Image attached</span>
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {value ? (
        <div className="space-y-2">
          <div
            className={`relative group rounded-xl overflow-hidden border border-(--line) bg-ink-deep ${aspectRatio} max-h-72 shadow-md flex items-center justify-center p-2`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded Preview"
              className={`w-full h-full ${
                objectFit === 'contain' ? 'object-contain' : 'object-cover'
              } transition-transform duration-500`}
            />

            {/* Overlay action bar on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={uploading}
                  className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-white/80 font-mono-tight truncate max-w-[65%] bg-black/50 px-2 py-1 rounded">
                  {value}
                </span>

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-ink font-semibold text-xs hover:bg-secondary/90 transition-colors shadow-lg cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace Image</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) bg-[var(--glass-bg)] hover:bg-white/5 text-mist-1 hover:text-paper font-medium transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-secondary" />
              <span>Choose different file from device</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="text-mist-2 hover:text-red-400 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-full aspect-[16/7] rounded-xl border border-dashed transition-all cursor-pointer p-6 text-center ${
            dragOver
              ? 'border-secondary bg-secondary/10 scale-[0.99]'
              : 'border-(--line) bg-white/[0.03] hover:bg-white/[0.06] hover:border-secondary/50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              <span className="text-sm font-semibold text-paper">Uploading from device...</span>
              <span className="text-xs text-mist-2">Saving and optimizing your file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-(--line) flex items-center justify-center text-secondary mb-3 shadow-inner group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-sm font-semibold text-paper mb-1">
                Choose Image from Device
              </span>
              <span className="text-xs text-mist-2 mb-2">Click to browse your device files or drag &amp; drop</span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono-tight bg-white/5 border border-white/10 text-mist-1">
                {description}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden native device file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Direct URL input fallback */}
      <div className="pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an image URL directly (/img/... or https://...)"
          className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2 text-xs text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary transition-colors font-mono-tight"
        />
      </div>
    </div>
  );
}

