export interface Service {
  id: string;
  title: string;
  slug: string;
  headline: string;
  description: string;
  content: string;
  features: string[];
  icon_name: string;
  image_url?: string | null;
  order: number;
  created_at: string;
}
