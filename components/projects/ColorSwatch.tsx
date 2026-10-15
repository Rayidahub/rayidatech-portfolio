'use client';

import { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';

interface ColorSwatchProps {
  name: string;
  hex: string;
}

export default function ColorSwatch({ name, hex }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const isLight = (hexCode: string) => {
    const clean = hexCode.replace('#', '');
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 160;
    }
    if (clean.length >= 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 160;
    }
    return false;
  };

  const light = isLight(hex);

  return (
    <div
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopy();
        }
      }}
      className="group relative flex flex-col rounded-2xl glass border border-(--line) p-3 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 cursor-pointer select-none"
      title={`Click to copy ${hex}`}
    >
      {/* Visual Color Block */}
      <div
        className="relative h-24 w-full rounded-xl border border-black/10 shadow-inner flex items-end justify-end p-2.5 transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ backgroundColor: hex }}
      >
        <span
          className={`text-[10px] font-mono-tight px-1.5 py-0.5 rounded shadow-sm ${
            light ? 'bg-black/15 text-black' : 'bg-white/20 text-white'
          }`}
        >
          {copied ? 'COPIED' : 'HEX'}
        </span>
      </div>

      {/* Info Row */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div>
          <p className="text-xs font-medium text-paper capitalize">{name}</p>
          <p className="font-mono-tight text-[11px] text-mist-2 uppercase tracking-wider">{hex}</p>
        </div>
        <div className="p-1.5 rounded-lg text-mist-2 group-hover:text-primary transition-colors">
          {copied ? (
            <CheckCheck className="w-3.5 h-3.5 text-secondary" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    </div>
  );
}
