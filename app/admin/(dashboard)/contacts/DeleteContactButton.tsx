'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteContactButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete contact inquiry from "${name}"? This cannot be undone.`)) {
      return;
    }
    setDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('contacts').delete().eq('id', id);

      if (error) {
        alert('Failed to delete inquiry: ' + error.message);
        setDeleting(false);
        return;
      }

      router.refresh();
    } catch (err: any) {
      alert('Error: ' + err.message);
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 rounded-lg text-mist-2 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
      title="Delete inquiry"
    >
      {deleting ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}

