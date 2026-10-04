export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ContactFaq {
  question: string;
  answer: string;
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
}

export interface WorkingPrinciple {
  title: string;
  description: string;
}

export interface ContactSettings {
  id?: string;
  badge_text: string;
  headline_prefix: string;
  headline_accent: string;
  headline_suffix: string;
  subheadline: string;
  whatsapp_number: string;
  whatsapp_url: string;
  email: string;
  website_url: string;
  working_hours: string;
  location: string;
  principles: WorkingPrinciple[];
  process_steps: ProcessStep[];
  faqs: ContactFaq[];
  social_links: SocialLink[];
  updated_at?: string;
}
