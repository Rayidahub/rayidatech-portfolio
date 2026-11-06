'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { buildStatusPayload, getProjectStatusBadge } from '@/lib/project-status'
import type { ProjectStatus } from '@/types/project'
import { Loader2 } from 'lucide-react'

interface ProjectStatusToggleProps {
  id: string
  title: string
  currentStatus: ProjectStatus
  currentCaseStudy?: any
}

export default function ProjectStatusToggle({
  id,
  title,
  currentStatus,
  currentCaseStudy,
}: ProjectStatusToggleProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState<ProjectStatus>(currentStatus)

  async function handleToggle() {
    if (updating) return
    const nextDraft = status === 'published'
    const nextStatus: ProjectStatus = nextDraft ? 'draft' : 'published'

    setUpdating(true)
    const supabase = createClient()
    const statusPayload = buildStatusPayload(nextDraft)

    const updatedCaseStudy = {
      ...(currentCaseStudy || {}),
      published: statusPayload.published,
      status: statusPayload.status,
    }

    const { error } = await supabase
      .from('projects')
      .update({
        case_study: updatedCaseStudy,
      })
      .eq('id', id)

    if (error) {
      console.error('Failed to toggle project status:', error)
      alert(`Could not toggle status for "${title}": ${error.message}`)
    } else {
      setStatus(nextStatus)
      router.refresh()
    }
    setUpdating(false)
  }

  const badge = getProjectStatusBadge(status)

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={updating}
      title={`Click to switch to ${status === 'published' ? 'Draft' : 'Published'}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono-tight border transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 ${badge.badgeClass}`}
    >
      {updating ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
      )}
      <span>{badge.label}</span>
    </button>
  )
}

