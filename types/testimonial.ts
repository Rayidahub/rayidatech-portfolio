export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  testimonial: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}
