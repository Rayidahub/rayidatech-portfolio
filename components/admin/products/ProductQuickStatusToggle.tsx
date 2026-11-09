'use client';

import { useState } from 'react';
import { toggleProductActiveAction, toggleProductStatusAction } from '@/app/actions/products';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { formatProductStatus } from '@/lib/products';

interface ProductQuickStatusToggleProps {
  productId: string;
  initialActive: boolean;
  initialStatus: string;
  mode: 'active' | 'status';
}

export default function ProductQuickStatusToggle({
  productId,
  initialActive,
  initialStatus,
  mode,
}: ProductQuickStatusToggleProps) {
  const [isActive, setIsActive] = useState(initialActive);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (mode === 'active') {
    async function handleToggleActive() {
      const next = !isActive;
      setIsActive(next);
      setLoading(true);
      try {
        const res = await toggleProductActiveAction(productId, next);
        if (!res.success) {
          setIsActive(!next); // rollback
        } else {
          router.refresh();
        }
      } catch {
        setIsActive(!next);
      } finally {
        setLoading(false);
      }
    }

    return (
      <button
        type="button"
        disabled={loading}
        onClick={handleToggleActive}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-tight border transition-all cursor-pointer ${
          isActive
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            : 'bg-white/5 text-mist-2 border-(--line) hover:bg-white/10'
        }`}
        title={`Click to set ${isActive ? 'Inactive' : 'Active'}`}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin text-mist-1" />
        ) : isActive ? (
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        ) : (
          <XCircle className="w-3 h-3 text-mist-2" />
        )}
        <span>{isActive ? 'Active' : 'Inactive'}</span>
      </button>
    );
  }

  // mode === 'status'
  async function handleToggleStatus() {
    const nextStatus = status === 'live' ? 'coming_soon' : 'live';
    setStatus(nextStatus);
    setLoading(true);
    try {
      const res = await toggleProductStatusAction(productId, nextStatus);
      if (!res.success) {
        setStatus(status); // rollback
      } else {
        router.refresh();
      }
    } catch {
      setStatus(status);
    } finally {
      setLoading(false);
    }
  }

  const s = formatProductStatus(status);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleToggleStatus}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-tight border transition-all cursor-pointer ${s.bg} ${s.text} ${s.border} hover:opacity-85`}
      title={`Click to switch between Live and Coming Soon`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      )}
      <span>{s.label}</span>
    </button>
  );
}
