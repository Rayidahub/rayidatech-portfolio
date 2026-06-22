import { supabase } from '@/lib/supabase/client';
import type { Post } from '@/types/post';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-teal-400">Blog</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Thoughts on design, development, and building a career in tech.
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block group bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-teal-500/30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Cover Image */}
                  {post.cover_image && (
                    <div className="md:w-48 h-32 md:h-auto rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-teal-500/20 to-purple-500/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <span className="inline-flex items-center gap-1 bg-white/5 text-gray-400 text-xs px-2 py-1 rounded-full">
                          <Tag className="w-3 h-3" />
                          {post.tags[0]}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors duration-300">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 text-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] line-clamp-2 group-hover:line-clamp-none">
                      {post.excerpt}
                    </p>

                    {/* Revealed on hover */}
                    <div className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100">
                      {post.tags && post.tags.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.slice(1).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-400 mt-3 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        Read more <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
