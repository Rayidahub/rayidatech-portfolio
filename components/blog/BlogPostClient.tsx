'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Check,
  Copy,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { getReadingTime } from '@/lib/reading-time';
import type { Post } from '@/types/post';
import type { BlogSettings } from '@/types/blog-settings';

interface BlogPostClientProps {
  post: Post;
  relatedPosts: Post[];
  settings?: BlogSettings;
}

function DetailCoverImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);

  const isImageValid =
    Boolean(src) &&
    !error &&
    (src?.startsWith('/') ||
      src?.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)($|\?)/i) ||
      src?.includes('images.unsplash.com') ||
      src?.includes('supabase.co'));

  if (!isImageValid) {
    return (
      <div className="w-full aspect-[21/9] min-h-[220px] sm:min-h-[300px] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/20 via-ink-deep to-secondary/20 border border-(--line) shadow-2xl">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-secondary mb-3 shadow-inner">
            <BookOpen className="w-6 h-6 text-secondary" />
          </div>
          <span className="font-display text-sm font-semibold tracking-wider text-paper/70">
            RAYIDA TECH ESSAY
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-(--line) shadow-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="w-full h-auto max-h-[500px] object-cover"
      />
    </div>
  );
}

export default function BlogPostClient({ post, relatedPosts, settings }: BlogPostClientProps) {
  const [copied, setCopied] = useState(false);
  const readingTime = getReadingTime(post.content);

  const authorName = settings?.author_name || 'Raymond Gaius';
  const authorRole = settings?.author_role || 'Author';
  const authorBio =
    settings?.author_bio ||
    'Product Designer & AI Engineer at Rayida Tech. Building digital experiences people can trust across fintech, AI interfaces, and scalable SaaS ecosystems.';
  const authorTwitter = settings?.author_twitter || 'https://twitter.com/rayidatech';
  const authorGithub = settings?.author_github || 'https://github.com/Rayidahub';
  const authorLinkedin = settings?.author_linkedin || 'https://linkedin.com/in/rayida-tech';

  const authorInitials =
    authorName
      .split(' ')
      .filter(Boolean)
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'RG';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" by ${authorName}:`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  // Render article content with clean typography
  const renderFormattedContent = (content: string) => {
    const sections = content.split('\n\n');

    return sections.map((section, idx) => {
      const trimmed = section.trim();

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="font-display text-2xl sm:text-3xl font-semibold text-paper mt-10 mb-4 tracking-tight"
          >
            {trimmed.replace(/^## /, '')}
          </h2>
        );
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="font-display text-xl sm:text-2xl font-semibold text-paper mt-8 mb-3"
          >
            {trimmed.replace(/^### /, '')}
          </h3>
        );
      }

      // Code blocks
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const code = lines.slice(1, -1).join('\n');
        return (
          <pre
            key={idx}
            className="my-6 p-4 rounded-xl bg-black/60 border border-(--line) font-mono-tight text-xs sm:text-sm text-mist-1 overflow-x-auto leading-relaxed"
          >
            <code>{code}</code>
          </pre>
        );
      }

      // Bullet list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
        const items = trimmed.split('\n').map((l) => l.replace(/^[-*] |\d+\. /, ''));
        return (
          <ul key={idx} className="my-5 space-y-2.5 pl-2">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="flex items-start gap-2.5 text-mist-1 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p key={idx} className="my-4 text-mist-1 text-base sm:text-lg leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <main className="relative min-h-screen pt-28 pb-24 overflow-hidden bg-ink">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-35 blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 75%)',
          }}
        />
      </div>

      <Container size="narrow" className="relative z-10">
        {/* Navigation Breadcrumb */}
        <Reveal>
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-mist-2 hover:text-paper transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to all articles</span>
            </Link>
          </div>
        </Reveal>

        {/* Article Meta Header */}
        <Reveal>
          <div className="space-y-4 mb-8">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tight uppercase tracking-wider bg-primary/10 border border-primary/20 text-secondary"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-paper leading-[1.12]">
              {post.title}
            </h1>

            {/* Info Row: Date, Reading Time, Author */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-mist-2 font-mono-tight pt-2 border-b border-(--line) pb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-secondary" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary" />
                {readingTime} min read
              </span>
              <span>•</span>
              <span className="text-paper">By {authorName}</span>
            </div>
          </div>
        </Reveal>

        {/* Featured Cover Image */}
        {post.cover_image && (
          <Reveal className="mb-10">
            <DetailCoverImage src={post.cover_image} alt={post.title} />
          </Reveal>
        )}

        {/* Pullquote Excerpt */}
        {post.excerpt && (
          <Reveal className="mb-10">
            <div className="p-6 sm:p-7 rounded-2xl bg-primary/5 border-l-4 border-primary border-t border-r border-b border-(--line)">
              <p className="text-paper text-base sm:text-lg italic font-medium leading-relaxed">
                &ldquo;{post.excerpt}&rdquo;
              </p>
            </div>
          </Reveal>
        )}

        {/* Article Body */}
        <Reveal className="mb-12">
          <GlassCard className="p-6 sm:p-10 md:p-12 border border-(--line)" hover={false}>
            <div className="prose prose-invert max-w-none">
              {renderFormattedContent(post.content)}
            </div>
          </GlassCard>
        </Reveal>

        {/* Share & Feedback Bar */}
        <Reveal className="mb-14">
          <div className="p-6 rounded-2xl glass border border-(--line) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-display text-sm font-semibold text-paper">Enjoyed this article?</h4>
              <p className="text-xs text-mist-2 mt-0.5">Share it with fellow designers & engineers.</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-(--line) bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-xs font-medium text-paper transition-all cursor-pointer"
                title="Copy article link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                className="px-3.5 py-2 rounded-xl border border-(--line) bg-[var(--glass-bg)] hover:border-primary/40 text-xs font-medium text-paper transition-all cursor-pointer"
              >
                Share on X
              </button>

              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="px-3.5 py-2 rounded-xl border border-(--line) bg-[var(--glass-bg)] hover:border-primary/40 text-xs font-medium text-paper transition-all cursor-pointer"
              >
                LinkedIn
              </button>
            </div>
          </div>
        </Reveal>

        {/* Author Card */}
        <Reveal className="mb-16">
          <GlassCard className="p-6 sm:p-8 border border-(--line)" hover={false}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 shrink-0 shadow-lg shadow-primary/20">
                <div className="w-full h-full rounded-[14px] bg-ink-deep flex items-center justify-center font-display text-xl font-bold text-paper">
                  {authorInitials}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-lg font-semibold text-paper">{authorName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-secondary font-mono-tight">
                    {authorRole}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-mist-1 leading-relaxed mb-3">
                  {authorBio}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  {authorTwitter && (
                    <a
                      href={authorTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Follow on X</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {authorGithub && (
                    <a
                      href={authorGithub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mist-2 hover:text-paper transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                  {authorLinkedin && (
                    <a
                      href={authorLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mist-2 hover:text-paper transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-(--line)">
            <Reveal>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-mono-tight uppercase tracking-wider text-secondary">
                    Continue Reading
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-paper mt-1">
                    Related Articles
                  </h3>
                </div>

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary hover:text-primary transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related, idx) => (
                <Reveal key={related.id} index={idx}>
                  <Link href={`/blog/${related.slug}`} className="group block h-full">
                    <GlassCard
                      className="p-5 h-full border border-(--line) card-hover rounded-2xl flex flex-col justify-between"
                      hover={false}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-xs text-mist-2 font-mono-tight">
                          <Calendar className="w-3 h-3 text-secondary" />
                          <span>
                            {new Date(related.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span>{getReadingTime(related.content)} min read</span>
                        </div>

                        <h4 className="font-display text-base font-semibold text-paper group-hover:text-secondary transition-colors line-clamp-2 mb-2">
                          {related.title}
                        </h4>

                        <p className="text-mist-1 text-xs line-clamp-2 leading-relaxed">
                          {related.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-(--line)/40 inline-flex items-center gap-1 text-xs font-medium text-secondary group-hover:text-primary">
                        <span>Read article</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
