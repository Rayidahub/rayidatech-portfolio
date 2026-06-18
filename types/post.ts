// types/post.ts
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  created_at: string;
  published: boolean;
  tags?: string[];
}