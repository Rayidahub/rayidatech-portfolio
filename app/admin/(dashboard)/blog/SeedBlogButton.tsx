'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { seedSamplePostsAction } from '@/app/actions/blog-settings';

export default function SeedBlogButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [count, setCount] = useState(0);
  const router = useRouter();

  const handleSeed = () => {
    startTransition(async () => {
      const res = await seedSamplePostsAction();
      if (res.success) {
        setCount(res.count || 0);
        setStatus('success');
        router.refresh();
        setTimeout(() => setStatus('idle'), 4000);
      }
    });
  };

  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>{count > 0 ? `Synced ${count} sample posts!` : 'All samples already synced'}</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSeed}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) bg-[var(--glass-bg)] hover:bg-white/[0.05] text-mist-1 hover:text-paper text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
      title="Populate your database with 3 rich, pre-written sample articles"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-secondary" />
      )}
      <span>Sync Sample Posts</span>
    </button>
  );
}

