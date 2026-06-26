'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase.from('ecosystem_products').delete().eq('id', id)

    if (error) {
      alert('Failed to delete: ' + error.message)
      setDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 text-mist-2 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
