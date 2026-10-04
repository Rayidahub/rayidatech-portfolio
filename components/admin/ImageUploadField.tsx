'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  description?: string;
}

export default function ImageUploadField({
  label = 'Visual Showcase Image',
  value,
  onChange,
  folder = 'services',
  description = 'Upload an image from your device (PNG, JPG, WebP, SVG up to 10MB)',
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-paper">{label}</label>
        {value && (
          <span className="text-xs text-secondary font-mono-tight">Image attached</span>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-(--line) bg-white/5 aspect-[16/9] max-h-64 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
            <span className="text-xs text-white/80 font-mono-tight truncate max-w-[80%]">
              {value}
            </span>
            <button
              type="button"
              onClick={handleClear}
              disabled={uploading}
              className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-lg"
              title="Remove image"
            >
              <X className="w-4 h-4" />
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
              ? 'border-secondary bg-secondary/10'
              : 'border-(--line) bg-white/[0.03] hover:bg-white/[0.06] hover:border-secondary/40'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 text-secondary animate-spin" />
              <span className="text-sm font-medium text-paper">Uploading from device...</span>
              <span className="text-xs text-mist-2">Please wait while the image is processed</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-(--line) flex items-center justify-center text-secondary mb-3 shadow-inner">
                <Upload className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-sm font-medium text-paper mb-1">
                Click to upload from device or drag &amp; drop
              </span>
              <span className="text-xs text-mist-2">{description}</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
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
          placeholder="Or paste an image URL (e.g. /img/card1.png or https://...)"
          className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2 text-xs text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary transition-colors font-mono-tight"
        />
      </div>
    </div>
  );
}
