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
    <main>
      <Section>
        <Container size="narrow">
          <Reveal>
            <Link href="/blog">
              <ArrowLeft />
              Back to Blog
            </Link>
          </Reveal>

          {/* Cover Image */}
          {post.cover_image && (
            <Reveal>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_image} alt={post.title} />
              </div>
            </Reveal>
          )}

          {/* Meta Info */}
          <Reveal>
            <div>
              <span>
                <Calendar />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>
                <Clock />
                {readingTime} min read
              </span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal>
            <h1>
              {post.title}
            </h1>
          </Reveal>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Reveal>
              <div>
                {post.tags.map((tag, index) => (
                  <span key={index}>
                    <Tag />
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {/* Excerpt */}
          <Reveal>
            <p>
              {post.excerpt}
            </p>
          </Reveal>

          {/* Content */}
          <Reveal>
            <GlassCard hover={false}>
              <div>
                <p>
                  {post.content}
                </p>
              </div>
            </GlassCard>
          </Reveal>

          {/* Bottom Navigation */}
          <Reveal>
            <div>
              <Link href="/blog">
                <ArrowLeft />
                Back to all posts
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
