'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deleteHeroSlideImage } from '@/lib/storage'

export default function DeleteButton({
  id,
  label,
  image,
}: {
  id: string
  label: string
  image: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase.from('hero_slides').delete().eq('id', id)

    if (error) {
      alert('Failed to delete: ' + error.message)
      setDeleting(false)
      return
    }

    // Best-effort cleanup of the storage object.
    if (image) {
      await deleteHeroSlideImage(image)
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 text-mist-2 hover:text-red-400 transition-colors disabled:opacity-50"
      aria-label={`Delete ${label}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
