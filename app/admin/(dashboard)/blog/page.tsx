import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, Edit, ExternalLink, Settings, BookOpen } from 'lucide-react';
import DeleteButton from './DeleteButton';
import SeedBlogButton from './SeedBlogButton';
import BlogImportButton from './BlogImportButton';

export default async function AdminBlog() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, published, created_at')
    .order('created_at', { ascending: false });

  const count = posts?.length || 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">Blog Articles</h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Manage your articles, drafts, and publication status ({count} article{count === 1 ? '' : 's'}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <BlogImportButton />
          <SeedBlogButton />

          <Link
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) text-mist-1 hover:text-paper text-xs font-medium transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/blog/settings"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) bg-[var(--glass-bg)] hover:bg-white/[0.05] text-mist-1 hover:text-paper text-xs font-medium transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Page Content</span>
          </Link>

          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 text-xs font-medium transition-all shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="text-left text-mist-2 font-medium px-4 py-3">Title</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Slug</th>
              <th className="text-center text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Published</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center text-mist-2 px-4 py-12">
                  No posts yet.
                </td>
              </tr>
            )}
            {posts?.map((post) => (
              <tr
                key={post.id}
                className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-paper font-medium">{post.title}</td>
                <td className="px-4 py-3 text-mist-1 hidden sm:table-cell">{post.slug}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      post.published
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-white/5 text-mist-2'
                    }`}
                  >
                    {post.published ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="inline-flex p-1.5 text-mist-2 hover:text-paper transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="inline-flex p-1.5 text-mist-2 hover:text-secondary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton id={post.id} title={post.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
