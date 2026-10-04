'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, ArrowLeft, Eye, Check, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react'
import { createServiceAction } from '@/app/actions/services'
import { AVAILABLE_SERVICE_ICONS, ServiceIcon } from '@/lib/service-icons'
import GlassCard from '@/components/ui/GlassCard'
import ImageUploadField from '@/components/admin/ImageUploadField'

export default function NewService() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    slug: '',
    headline: '',
    description: '',
    content: '',
    features: '',
    icon_name: 'Palette',
    image_url: '',
    order: 0,
  })

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }, [])

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }))
  }

  const featuresList = form.features
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const result = await createServiceAction({
        title: form.title,
        slug: form.slug,
        headline: form.headline,
        description: form.description,
        content: form.content,
        features: featuresList,
        icon_name: form.icon_name,
        image_url: form.image_url || null,
        order: Number(form.order) || 0,
      })

      if (!result.success) {
        setError(result.error || 'Failed to create service')
        return
      }

      router.push('/admin/services')
      router.refresh()
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-(--line) pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="p-2 text-mist-2 hover:text-paper rounded-lg hover:bg-white/5 transition-colors"
            title="Back to services"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-paper">
              New Service
            </h1>
            <p className="text-xs text-mist-2 mt-0.5">
              Publish a new capability to the public portfolio and services directory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="px-4 py-2 text-sm text-mist-1 hover:text-paper rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="service-form"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all shadow-md shadow-primary/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? 'Publishing...' : 'Publish Service'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7">
          <form
            id="service-form"
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-paper mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. AI Workflow Engineering"
                  required
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-paper mb-1.5">
                  Slug (URL Path) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-mist-2 font-mono-tight">
                    /services/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, slug: e.target.value }))
                    }
                    placeholder="ai-workflow-engineering"
                    required
                    className="flex-1 bg-white/5 border border-(--line) rounded-xl px-3 py-2 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary transition-colors font-mono-tight"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-paper mb-1.5">
                  Headline Tagline
                </label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, headline: e.target.value }))
                  }
                  placeholder="e.g. Intelligent Systems That Accelerate Operations"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-paper mb-1.5">
                  Card Summary / Short Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="A clear 2-3 sentence overview displayed on the services listing card..."
                  required
                  rows={3}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary transition-colors resize-none"
                />
              </div>

              {/* Visual Showcase Image Upload */}
              <div className="pt-2 border-t border-(--line)">
                <ImageUploadField
                  label="Visual Showcase Image (For Details Page & Preview)"
                  value={form.image_url}
                  onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
                  folder="services"
                  description="Upload an image from your device or paste a URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-paper mb-1.5">
                  Detail Content (Overview narrative for /services/[slug])
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Detailed breakdown of your approach, methodologies, business impact, and how you execute this service..."
                  rows={6}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary transition-colors leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-paper">
                    Key Deliverables &amp; Features
                  </label>
                  <span className="text-xs text-mist-2 font-mono-tight">
                    One per line ({featuresList.length} total)
                  </span>
                </div>
                <textarea
                  value={form.features}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, features: e.target.value }))
                  }
                  placeholder="Custom AI Agents & Workflows&#10;LLM Integration & Prompt Engineering&#10;Intelligent Chatbots & Assistants&#10;Workflow Automation & APIs"
                  rows={4}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-secondary transition-colors font-mono-tight"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-paper mb-1.5">
                    Service Icon
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-(--line) flex items-center justify-center text-secondary shrink-0">
                      <ServiceIcon name={form.icon_name} className="w-5 h-5" />
                    </div>
                    <select
                      value={form.icon_name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, icon_name: e.target.value }))
                      }
                      className="flex-1 bg-ink border border-(--line) rounded-xl px-3 py-2.5 text-sm text-paper focus:outline-none focus:border-secondary transition-colors cursor-pointer"
                    >
                      {AVAILABLE_SERVICE_ICONS.map((icon) => (
                        <option key={icon.name} value={icon.name} className="bg-ink text-paper">
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-paper mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        order: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-2.5 text-sm text-paper focus:outline-none focus:border-secondary transition-colors"
                  />
                  <p className="text-[11px] text-mist-2 mt-1">
                    Lower numbers appear first on the page
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Real-time Card Preview: 5 cols */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-mist-2 font-mono-tight uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-secondary" />
              Live Card Preview
            </span>
            <span className="text-secondary">Updates as you type</span>
          </div>

          <GlassCard className="p-7 md:p-8 h-full flex flex-col justify-between relative overflow-hidden border-secondary/30 shadow-xl shadow-secondary/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-secondary/50 to-primary/30" />

            <div>
              {/* Optional Visual Image Thumbnail */}
              {form.image_url && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5 border border-(--line)">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Top row */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-secondary/40 flex items-center justify-center text-secondary shadow-inner">
                  <ServiceIcon
                    name={form.icon_name}
                    className="w-6 h-6 text-secondary"
                  />
                </div>
                <span className="font-mono-tight text-xs uppercase tracking-widest text-secondary bg-paper/[0.03] border border-secondary/30 px-3 py-1 rounded-full">
                  0{form.order || 1}
                </span>
              </div>

              {/* Title & Tag */}
              <p className="font-mono-tight text-xs uppercase tracking-[0.18em] text-secondary mb-2">
                Service Offering
              </p>
              <h2 className="font-display text-2xl font-semibold text-paper mb-2">
                {form.title || 'Untitled Service'}
              </h2>
              {form.headline && (
                <p className="text-secondary/80 text-xs font-mono-tight mb-3">
                  {form.headline}
                </p>
              )}
              <p className="text-mist-1 text-sm leading-relaxed mb-6 line-clamp-3">
                {form.description ||
                  'Your service description will appear here as a concise overview for prospective clients.'}
              </p>

              {/* Deliverables preview */}
              {featuresList.length > 0 && (
                <div className="border-t border-(--line) pt-4 mb-6">
                  <p className="font-mono-tight text-[11px] uppercase tracking-wider text-mist-2 mb-3">
                    Key Deliverables
                  </p>
                  <ul className="space-y-2">
                    {featuresList.slice(0, 3).map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-mist-1"
                      >
                        <span className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-secondary" />
                        </span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom action */}
            <div className="pt-4 border-t border-(--line) flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
                Explore Capability
                <ArrowRight className="w-4 h-4 text-secondary" />
              </span>
              <span className="text-[11px] font-mono-tight text-mist-2 uppercase tracking-wider">
                Learn More
              </span>
            </div>
          </GlassCard>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) text-xs text-mist-2 space-y-1">
            <p className="text-mist-1 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" /> Device Upload Supported
            </p>
            <p>
              Select any image from your computer or phone. It will be stored and featured
              prominently on the service details page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
