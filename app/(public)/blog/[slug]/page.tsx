import { supabase } from '@/lib/supabase/client';
import type { Post } from '@/types/post';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';

async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data;
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

  return (
    <main className="pt-32 pb-20">
      <Container size="narrow">
        <Reveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-mist-1 hover:text-secondary transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </Reveal>

        {/* Cover Image */}
        {post.cover_image && (
          <Reveal>
            <div className="rounded-xl overflow-hidden mb-8 border border-(--line)">
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
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-mist-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-secondary" />
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-mist-1 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-mono-tight"
                  >
                    <Tag className="w-3 h-3 text-secondary" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Title */}
        <Reveal>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-6 text-paper">
            {post.title}
          </h1>
        </Reveal>

        {/* Excerpt */}
        <Reveal>
          <p className="text-mist-1 text-lg mb-8 border-l-4 border-secondary pl-4 italic">
            {post.excerpt}
          </p>
        </Reveal>

        {/* Content */}
        <Reveal>
          <div className="max-w-none">
            <p className="text-mist-1 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </Reveal>

        {/* Bottom Navigation */}
        <Reveal>
          <div className="mt-12 pt-8 border-t border-(--line)">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-mist-1 hover:text-secondary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </Link>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
