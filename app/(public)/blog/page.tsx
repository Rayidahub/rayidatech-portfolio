import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types/post';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';

export const revalidate = 3600;

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return (data as Post[]) || [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-ink">
      <Section spacing="tight" className="pt-32">
        <Container size="wide">
          {/* Header */}
          <Reveal>
            <div className="mb-16">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
                Blog
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4 text-paper">
                Thoughts on Design, Tech &{' '}
                <span className="gradient-text">Growth</span>
              </h1>
              <p className="text-mist-1 text-lg max-w-2xl">
                Insights on design, development, and building a career in tech.
              </p>
            </div>
          </Reveal>

          {/* Posts */}
          {posts.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 glass rounded-2xl">
                <p className="text-mist-2">
                  No blog posts yet. Check back soon!
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <Reveal key={post.id} index={index}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block h-full"
                  >
                    <GlassCard className="p-0 h-full overflow-hidden card-hover">
                      {/* Cover Image */}
                      <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20">
                        {post.cover_image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="font-display text-2xl font-semibold text-paper/20">
                              RT
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-mist-2 text-xs flex items-center gap-1 font-mono-tight">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
                          {post.tags && post.tags.length > 0 && (
                            <span className="inline-flex items-center gap-1 glass text-mist-1 text-xs px-2 py-1 rounded-full">
                              <Tag className="w-3 h-3" />
                              {post.tags[0]}
                            </span>
                          )}
                        </div>

                        <h2 className="font-display text-xl font-semibold mb-2 text-paper group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-mist-1 text-sm line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary">
                          Read more <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
