import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types/post';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fallbackPosts } from '@/lib/data/posts';
import { getBlogSettings } from '@/lib/data/blog-settings';
import BlogPostClient from '@/components/blog/BlogPostClient';

export const revalidate = 3600;

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (!error && data) {
      return data as Post;
    }
  } catch {
    // Supabase query error fallback
  }

  // Check fallback posts
  const fallback = fallbackPosts.find((p) => p.slug === slug);
  return fallback || null;
}

async function getRelatedPosts(currentSlug: string): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .neq('slug', currentSlug)
      .limit(2);

    if (data && data.length > 0) {
      return data as Post[];
    }
  } catch {
    // Supabase fallback
  }

  return fallbackPosts.filter((p) => p.slug !== currentSlug).slice(0, 2);
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('posts').select('slug').eq('published', true);

    const dbSlugs = data ? data.map((p) => ({ slug: p.slug })) : [];
    const fallbackSlugs = fallbackPosts.map((p) => ({ slug: p.slug }));

    const unique = new Set([...dbSlugs.map((s) => s.slug), ...fallbackSlugs.map((s) => s.slug)]);
    return Array.from(unique).map((slug) => ({ slug }));
  } catch {
    return fallbackPosts.map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: 'Article Not Found | Raymond Gaius' };

  return {
    title: `${post.title} | Raymond Gaius`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
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

  const [relatedPosts, settings] = await Promise.all([
    getRelatedPosts(slug),
    getBlogSettings(),
  ]);

  return <BlogPostClient post={post} relatedPosts={relatedPosts} settings={settings} />;
}
