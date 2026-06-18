// app/blog/[slug]/page.tsx
import { supabase } from '@/lib/supabase/client';
import type { Post } from '@/types/post';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

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

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
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
                  className="bg-white/5 text-gray-400 text-xs px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-gray-400 text-lg mb-8 border-l-4 border-teal-500 pl-4">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  );
}
