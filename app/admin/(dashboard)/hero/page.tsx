import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit } from 'lucide-react'
import DeleteButton from './DeleteButton'

export default async function AdminHeroSlides() {
  const supabase = await createClient()
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('id, label, words, image, sort_order, is_active, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-paper">Hero Slides</h1>
        <Link
          href="/admin/hero/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Slide
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(!slides || slides.length === 0) && (
          <div className="md:col-span-2 xl:col-span-3 glass rounded-xl p-12 text-center">
            <p className="text-mist-1">No hero slides yet.</p>
            <p className="text-mist-2 text-sm mt-1">
              Create one and the home page slider will use it instead of the default slides.
            </p>
          </div>
        )}

        {slides?.map((slide) => (
          <div
            key={slide.id}
            className="glass rounded-xl overflow-hidden group hover:border-primary/30 transition-all duration-200"
          >
            <div className="aspect-video bg-white/5 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.label}
                className="w-full h-full object-contain p-4"
              />
              {!slide.is_active && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-mist-1">
                  Inactive
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-paper font-medium">{slide.label}</p>
                  <p className="text-mist-2 text-xs mt-0.5 line-clamp-2">
                    {Array.isArray(slide.words) ? slide.words.join(' ') : slide.words}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1">
                  <Link
                    href={`/admin/hero/${slide.id}/edit`}
                    className="p-1.5 text-mist-2 hover:text-secondary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton id={slide.id} label={slide.label} image={slide.image} />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 text-xs text-mist-2">
                <span>Order: {slide.sort_order}</span>
                <span className="w-1 h-1 rounded-full bg-mist-2/50" />
                <span>{slide.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
