'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadHeroSlideImage, deleteHeroSlideImage } from '@/lib/storage';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({
  label = 'Image',
  value,
  onChange,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    // Best-effort cleanup of the previous image when replacing it.
    if (value) {
      await deleteHeroSlideImage(value);
    }

    const { url, error: uploadError } = await uploadHeroSlideImage(file);

    if (uploadError || !url) {
      setError(uploadError ?? 'Upload failed');
      setUploading(false);
      return;
    }

    onChange(url);
    setUploading(false);
  }

  async function handleClear() {
    if (value) {
      await deleteHeroSlideImage(value);
    }
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <label className="block text-sm text-mist-1 mb-1.5">{label}</label>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-(--line) bg-white/5 aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={handleClear}
            disabled={uploading}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 text-paper hover:bg-red-500/80 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border border-dashed border-(--line) bg-white/5 hover:bg-white/[0.07] transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-mist-1 animate-spin mb-2" />
              <span className="text-sm text-mist-1">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-mist-1 mb-2" />
              <span className="text-sm text-mist-1">Click to upload image</span>
              <span className="text-xs text-mist-2 mt-1">PNG, JPG, WebP up to 5MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL"
        className="w-full mt-3 bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}
