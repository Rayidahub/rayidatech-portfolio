export interface TeamMemberSocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string | null;
  social_links: TeamMemberSocialLinks;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
