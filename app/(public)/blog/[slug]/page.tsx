import { createClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';
import type { Post } from '@/types/post';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { getReadingTime } from '@/lib/reading-time';

export const revalidate = 3600;

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data as Post;
}

export async function generateStaticParams() {
  const { data } = await supabase.from('posts').select('slug');

  if (!data) return [];

  return data.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Raymond Gaius`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const readingTime = getReadingTime(post.content);

  return (
    <main className="min-h-screen">
      <Section spacing="tight" className="pt-32">
        <Container size="narrow">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-mist-1 hover:text-secondary transition-colors mb-8 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Reveal>

          {/* Cover Image */}
          {post.cover_image && (
            <Reveal>
              <div className="rounded-2xl overflow-hidden mb-8 border border-(--line)">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </Reveal>
          )}

          {/* Meta Info */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-mist-2 font-mono-tight">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-secondary" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary" />
                {readingTime} min read
              </span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal>
            <h1 className="font-display text-3xl md:text-5xl font-semibold mb-6 text-paper tracking-tight">
              {post.title}
            </h1>
          </Reveal>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Reveal>
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-mist-1 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-mono-tight"
                  >
                    <Tag className="w-3 h-3 text-secondary" />
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {/* Excerpt */}
          <Reveal>
            <p className="text-mist-1 text-lg mb-8 border-l-2 border-secondary pl-4 italic leading-relaxed">
              {post.excerpt}
            </p>
          </Reveal>

          {/* Content */}
          <Reveal>
            <GlassCard className="p-6 md:p-10" hover={false}>
              <div className="max-w-none">
                <p className="text-mist-1 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            </GlassCard>
          </Reveal>

          {/* Bottom Navigation */}
          <Reveal>
            <div className="mt-12 pt-8 border-t border-(--line)">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-mist-1 hover:text-secondary transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all posts
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
