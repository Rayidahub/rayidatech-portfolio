export interface EcosystemProduct {
  id: string;
  name: string;
  emoji: string;
  description: string;
  status: 'coming_soon' | 'live';
  launch_date: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
