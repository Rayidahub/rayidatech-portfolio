'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  Search,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import StatusPill from '@/components/ui/StatusPill';
import Newsletter from '@/components/sections/Newsletter';
import { getReadingTime } from '@/lib/reading-time';
import type { Post } from '@/types/post';
import type { BlogSettings } from '@/types/blog-settings';

interface BlogClientProps {
  posts: Post[];
  settings?: BlogSettings;
}

function PostCoverImage({
  src,
  alt,
  className = '',
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  // If no source or if invalid URL format (e.g. webpage URL without image extension), use fallback
  const isImageValid =
    Boolean(src) &&
    !error &&
    (src?.startsWith('/') ||
      src?.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)($|\?)/i) ||
      src?.includes('images.unsplash.com') ||
      src?.includes('supabase.co'));

  if (!isImageValid) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/15 via-ink to-secondary/15 ${className}`}
      >
        <div
          className="absolute inset-0 bg-dot-pattern opacity-40"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-secondary mb-2 shadow-inner">
            <BookOpen className="w-5 h-5 text-secondary" />
          </div>
          <span className="font-display text-sm font-semibold tracking-wider text-paper/70">
            RAYIDA TECH
          </span>
        </div>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${className}`}
    />
  );
}

export default function BlogClient({ posts, settings }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        if (tag && tag.trim()) tagsSet.add(tag.trim());
      });
    });
    return ['All', ...Array.from(tagsSet)];
  }, [posts]);

  // Filter posts based on tag and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag =
        selectedTag === 'All' ||
        post.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesTag && matchesSearch;
    });
  }, [posts, selectedTag, searchQuery]);

  const isBrowsingAll = selectedTag === 'All' && !searchQuery.trim();
  const featuredPost = isBrowsingAll && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <main className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-ink">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full opacity-35 blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px]"
          style={{
            background:
              'radial-gradient(circle, rgba(var(--secondary-rgb), 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      <Container size="wide" className="relative z-10">
        {/* Header Hero */}
        <Reveal>
          <div className="max-w-3xl mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tight uppercase tracking-wider bg-primary/10 border border-primary/20 text-secondary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{settings?.badge_text || 'Insights & Perspectives'}</span>
              </span>
              <StatusPill />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-paper mb-5 leading-[1.08]">
              {settings?.headline_prefix || 'Thoughts on Design, Tech &'}{' '}
              <span className="gradient-text">{settings?.headline_accent || 'Growth'}</span>
              {settings?.headline_suffix ? ` ${settings.headline_suffix}` : ''}
            </h1>

            <p className="text-mist-1 text-base sm:text-lg leading-relaxed max-w-2xl">
              {settings?.subheadline ||
                'Practical perspectives on product design, AI engineering, building scalable systems, and design-led company building by Raymond Gaius.'}
            </p>
          </div>
        </Reveal>

        {/* Filter & Search Bar */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-(--line)">
            {/* Tag Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none no-scrollbar w-full md:w-auto">
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-md shadow-primary/25 border border-primary'
                        : 'bg-[var(--glass-bg)] border border-(--line) text-mist-1 hover:text-paper hover:border-(--line-strong)'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-(--line) text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mist-2 hover:text-paper transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Featured Article Hero Banner */}
        {featuredPost && (
          <Reveal className="mb-14">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <GlassCard
                className="p-0 overflow-hidden border border-(--line) card-hover rounded-3xl"
                hover={false}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Image Column */}
                  <div className="lg:col-span-7 aspect-[16/10] sm:aspect-video lg:aspect-auto relative overflow-hidden bg-primary/5">
                    <PostCoverImage
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      className="h-full min-h-[300px] lg:min-h-[420px]"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-mono-tight uppercase tracking-wider bg-black/60 backdrop-blur-md text-secondary border border-white/10">
                        Featured Article
                      </span>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-mist-2 font-mono-tight">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-secondary" />
                          {new Date(featuredPost.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          {getReadingTime(featuredPost.content)} min read
                        </span>
                      </div>

                      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-paper group-hover:text-secondary transition-colors duration-300 mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>

                      <p className="text-mist-1 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                        {featuredPost.excerpt}
                      </p>

                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {featuredPost.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 border border-primary/20 text-secondary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-secondary group-hover:text-primary transition-colors">
                      <span>Read Featured Article</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </Reveal>
        )}

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <Reveal>
            <GlassCard className="py-16 text-center border border-(--line) max-w-lg mx-auto" hover={false}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-paper mb-2">
                No articles found
              </h3>
              <p className="text-mist-1 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any posts matching &ldquo;{searchQuery || selectedTag}&rdquo;.
                Try adjusting your search query or reset your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                Reset Filters
              </button>
            </GlassCard>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {gridPosts.map((post, index) => {
              const readingTime = getReadingTime(post.content);
              return (
                <Reveal key={post.id} index={index}>
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <GlassCard
                      className="p-0 h-full overflow-hidden border border-(--line) card-hover rounded-2xl flex flex-col justify-between"
                      hover={false}
                    >
                      <div>
                        {/* Cover Image Thumbnail */}
                        <div className="aspect-video w-full overflow-hidden relative bg-primary/5 border-b border-(--line)">
                          <PostCoverImage src={post.cover_image} alt={post.title} />
                          {post.tags && post.tags.length > 0 && (
                            <div className="absolute top-3 left-3 z-10">
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono-tight font-medium bg-black/60 backdrop-blur-md text-secondary border border-white/10">
                                {post.tags[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Article Info */}
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3 text-xs text-mist-2 font-mono-tight">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-secondary" />
                              {new Date(post.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-secondary" />
                              {readingTime} min read
                            </span>
                          </div>

                          <h3 className="font-display text-lg sm:text-xl font-semibold mb-2.5 text-paper group-hover:text-secondary transition-colors duration-300 line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          <p className="text-mist-1 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <div className="px-6 pb-6 pt-0">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary group-hover:text-primary transition-colors">
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </Container>

      {/* Newsletter Subscription Section */}
      <div className="mt-24 md:mt-32">
        <Newsletter
          headline={settings?.newsletter_headline}
          subtext={settings?.newsletter_subheadline}
        />
      </div>
    </main>
  );
}
