// types/project.ts
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string;
  featured: boolean;
  created_at: string;
  tags?: string[];
  role?: string;
  duration?: string;
  link?: string;
}