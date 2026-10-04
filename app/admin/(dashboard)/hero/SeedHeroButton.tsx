'use client';

import { useState, useTransition } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { seedDefaultHeroSlidesAction } from '@/app/actions/hero-settings';
import { useRouter } from 'next/navigation';

export default function SeedHeroButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = () => {
    setStatus('idle');
    startTransition(async () => {
      const res = await seedDefaultHeroSlidesAction();
      if (res.success) {
        setStatus('success');
        if (res.count > 0) {
          setMessage(`Loaded ${res.count} default slides!`);
        } else {
          setMessage('All default slides already exist.');
        }
        router.refresh();
        setTimeout(() => setStatus('idle'), 3500);
      } else {
        setStatus('error');
        setMessage(res.error || 'Failed to seed slides');
        setTimeout(() => setStatus('idle'), 4000);
      }
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleSeed}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) bg-[var(--glass-bg)] hover:bg-white/[0.05] text-mist-1 hover:text-paper text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
        title="Populate default slides into database if not present"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
            <span>Loading slides...</span>
          </>
        ) : status === 'success' ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">{message}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Sync Default Slides</span>
          </>
        )}
      </button>

      {status === 'error' && (
        <span className="absolute -bottom-6 left-0 text-[10px] text-red-400 whitespace-nowrap">
          {message}
        </span>
      )}
    </div>
  );
}

