import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, Edit, Settings, ExternalLink, Sparkles } from 'lucide-react';
import DeleteButton from './DeleteButton';
import SeedHeroButton from './SeedHeroButton';

export default async function AdminHeroSlides() {
  const supabase = await createClient();
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('id, label, words, body, image, sort_order, is_active, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const count = slides?.length || 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">Hero Section & Slides</h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Manage your homepage hero rotation, text lines, silhouette portraits, and global section controls ({count} slide{count === 1 ? '' : 's'}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <SeedHeroButton />

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) text-mist-1 hover:text-paper text-xs font-medium transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/hero/settings"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) bg-[var(--glass-bg)] hover:bg-white/[0.05] text-mist-1 hover:text-paper text-xs font-medium transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Section Settings</span>
          </Link>

          <Link
            href="/admin/hero/new"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 text-xs font-medium transition-all shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Slide</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {(!slides || slides.length === 0) && (
          <div className="md:col-span-2 xl:col-span-3 glass rounded-xl p-12 text-center border border-(--line)">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-paper font-medium mb-1">No custom hero slides yet.</p>
            <p className="text-mist-2 text-xs max-w-md mx-auto mb-5 leading-relaxed">
              The public site is currently rendering default fallback slides. Click &ldquo;Sync Default Slides&rdquo; above to load the 6 curated slides into your database for full customization.
            </p>
            <div className="inline-flex items-center gap-3">
              <SeedHeroButton />
              <Link
                href="/admin/hero/new"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-all"
              >
                Create Custom Slide
              </Link>
            </div>
          </div>
        )}

        {slides?.map((slide) => {
          const wordsArray = Array.isArray(slide.words) ? slide.words : [slide.words];
          const lastWord = wordsArray[wordsArray.length - 1];
          const precedingWords = wordsArray.slice(0, -1);

          return (
            <div
              key={slide.id}
              className="glass rounded-xl overflow-hidden group hover:border-primary/40 transition-all duration-300 flex flex-col justify-between border border-(--line)"
            >
              <div>
                <div className="aspect-[16/10] bg-ink-deep relative border-b border-(--line) overflow-hidden flex items-end justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className="max-h-full max-w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-tight font-medium bg-black/60 backdrop-blur-md text-secondary border border-white/10">
                      {slide.label}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-tight font-medium ${
                        slide.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/10 text-mist-2 border border-white/10'
                      }`}
                    >
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-paper text-sm font-semibold mb-2 leading-snug">
                    {precedingWords.join(' ')}{' '}
                    <span className="text-secondary font-bold">{lastWord}</span>
                  </h3>

                  {slide.body && (
                    <p className="text-mist-1 text-xs line-clamp-2 leading-relaxed mb-3">
                      {slide.body}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-(--line)/40 bg-white/[0.01] flex items-center justify-between text-xs text-mist-2">
                <span className="font-mono-tight text-[11px]">Order: #{slide.sort_order}</span>

                <div className="inline-flex items-center gap-1">
                  <Link
                    href={`/admin/hero/${slide.id}/edit`}
                    className="p-1.5 text-mist-2 hover:text-paper hover:bg-white/5 rounded-lg transition-colors"
                    title="Edit slide"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton id={slide.id} label={slide.label} image={slide.image} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

