// types/project.ts
export interface CaseStudy {
  client?: string;
  objective?: string;
  target_audience?: string;
  overview_image?: string;

  problem?: string;
  business_goals?: string;
  user_goals?: string;
  problem_image?: string;

  research?: string;
  research_image?: string;

  design_process?: string;
  design_process_image?: string;

  design_system?: string;
  design_system_image?: string;

  final_solution?: string;
  final_mobile_image?: string;
  final_desktop_image?: string;

  key_features?: string[];
  key_features_image?: string;

  results?: string;
  results_image?: string;

  reflection?: string;
  reflection_image?: string;

  next_project_slug?: string;
}

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
  case_study?: CaseStudy;
}