'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { deleteProductAction } from '@/app/actions/products';
import { useRouter } from 'next/navigation';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await deleteProductAction(productId);
      if (!res.success) {
        setError(res.error || 'Failed to delete product');
        setIsDeleting(false);
        return;
      }
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-mist-2 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        title={`Delete ${productName}`}
        aria-label={`Delete ${productName}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass max-w-md w-full rounded-2xl p-6 border border-(--line) space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-paper">Delete Product</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-mist-1 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-paper">&quot;{productName}&quot;</span>? This action cannot be
              undone and will remove it from both the admin dashboard and the public products page.
            </p>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-mist-1 hover:text-paper hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50 shadow-lg shadow-red-950/40"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
