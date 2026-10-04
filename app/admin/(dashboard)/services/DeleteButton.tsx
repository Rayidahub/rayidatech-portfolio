'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteServiceAction } from '@/app/actions/services'

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    startTransition(async () => {
      const result = await deleteServiceAction(id)
      if (!result.success) {
        alert('Failed to delete: ' + (result.error || 'Unknown error'))
        return
      }
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-mist-2 hover:text-red-400 transition-colors disabled:opacity-40"
      title={`Delete ${title}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
