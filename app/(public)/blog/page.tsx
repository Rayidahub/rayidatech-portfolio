import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types/post';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Thoughts on product design, AI engineering, and building digital experiences people can trust — by Raymond Gaius.',
};

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
    <main>
      <Section>
        <Container size="wide">
          {/* Header */}
          <Reveal>
            <div>
              <p>
                Blog
              </p>
              <h1>
                Thoughts on Design, Tech &{' '}
                <span>Growth</span>
              </h1>
              <p>
                Insights on design, development, and building a career in tech.
              </p>
            </div>
          </Reveal>

          {/* Posts */}
          {posts.length === 0 ? (
            <Reveal>
              <div>
                <p>
                  No blog posts yet. Check back soon!
                </p>
              </div>
            </Reveal>
          ) : (
            <div>
              {posts.map((post, index) => (
                <Reveal key={post.id} index={index}>
                  <Link href={`/blog/${post.slug}`}>
                    <GlassCard>
                      {/* Cover Image */}
                      <div>
                        {post.cover_image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={post.cover_image} alt={post.title} />
                        ) : (
                          <div>
                            <span>
                              RT
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div>
                          <span>
                            <Calendar />
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
                            <span>
                              <Tag />
                              {post.tags[0]}
                            </span>
                          )}
                        </div>

                        <h2>
                          {post.title}
                        </h2>

                        <p>
                          {post.excerpt}
                        </p>

                        <span>
                          Read more <ArrowRight />
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
