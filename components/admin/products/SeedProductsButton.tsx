'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { seedProductsAction } from '@/app/actions/products';
import { useRouter } from 'next/navigation';

export default function SeedProductsButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSeed() {
    setLoading(true);
    try {
      const res = await seedProductsAction();
      if (res.success) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSeed}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tight text-secondary hover:text-paper bg-secondary/10 hover:bg-secondary/20 border border-secondary/25 rounded-lg transition-all cursor-pointer disabled:opacity-50"
      title="Populate with Rayida Tech default ecosystem catalog"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : success ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      <span>{success ? 'Catalog Seeded!' : 'Seed Ecosystem Defaults'}</span>
    </button>
  );
}
