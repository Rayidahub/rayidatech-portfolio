'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Database, Sparkles } from 'lucide-react'
import { seedInitialServicesAction } from '@/app/actions/services'

export default function SeedServicesButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  function handleSeed() {
    setMessage('')
    startTransition(async () => {
      const result = await seedInitialServicesAction()
      if (!result.success) {
        alert('Failed to seed services: ' + (result.error || 'Unknown error'))
        return
      }
      setMessage(result.message || 'Seeded successfully!')
      router.refresh()
    })
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        onClick={handleSeed}
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 text-secondary px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-50"
      >
        <Database className="w-4 h-4" />
        <span>{isPending ? 'Importing initial services...' : 'Import 7 Default Services into Database'}</span>
      </button>
      {message && <p className="text-xs text-secondary font-mono-tight">{message}</p>}
    </div>
  )
}
