import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types/post';
import { fallbackPosts } from '@/lib/data/posts';
import { getBlogSettings } from '@/lib/data/blog-settings';
import BlogClient from '@/components/blog/BlogClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Thoughts on product design, AI engineering, and building digital experiences people can trust — by Raymond Gaius.',
};

async function getPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackPosts;
    }

    // If database has fewer than 3 posts, supplement with curated articles
    if (data.length < 3) {
      const existingSlugs = new Set(data.map((p) => p.slug));
      const supplements = fallbackPosts.filter((p) => !existingSlugs.has(p.slug));
      return [...data, ...supplements];
    }

    return data as Post[];
  } catch {
    return fallbackPosts;
  }
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getPosts(),
    getBlogSettings(),
  ]);

  return <BlogClient posts={posts} settings={settings} />;
}
