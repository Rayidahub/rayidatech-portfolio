export interface PricingPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  formattedPrice: string;
  badge?: string;
  isPopular?: boolean;
  deliveryTime: string;
  targetAudience: string;
  deliverables: string[];
  ctaLabel: string;
  whatsappMessage: string;
}

export interface CarePlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  formattedPrice: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  whatsappMessage: string;
}

export const DIGITAL_UPGRADE_PACKAGES: PricingPackage[] = [
  {
    id: 'starter',
    name: 'Digital Presence Starter',
    tagline: 'For businesses that need a credible, professional online presence quickly.',
    price: 100000,
    formattedPrice: '₦100,000',
    badge: 'Entry Offer',
    deliveryTime: '3–5 Business Days',
    targetAudience: 'New businesses, solo practices & local service providers',
    deliverables: [
      'One-page high-converting business website',
      'Mobile-first responsive architecture',
      'Structured business information & service showcase',
      'Direct WhatsApp inquiry button & contact integration',
      'Inquiry contact section & lead capture',
      'Basic SEO & Google Maps embed',
      '1 revision round + full deployment & handover',
    ],
    ctaLabel: 'Choose Starter (₦100k)',
    whatsappMessage: 'Hello Raymond, I am interested in the Digital Presence Starter (₦100,000) for my business.',
  },
  {
    id: 'growth',
    name: 'Business Growth System',
    tagline: 'Our flagship product: Built to capture high-intent inquiries and establish market authority.',
    price: 200000,
    formattedPrice: '₦200,000',
    badge: 'Most Popular · Core Offer',
    isPopular: true,
    deliveryTime: '7–10 Business Days',
    targetAudience: 'Schools, academies, clinics & growing commercial brands',
    deliverables: [
      'Up to 5-page bespoke business website',
      'Custom UI/UX crafted around your specific brand',
      'Dedicated programs/services presentation',
      'High-conversion WhatsApp & lead form integration',
      'Lead routing directly to email or Google Sheets',
      'Testimonials, social proof & FAQ section',
      'Google Maps & local SEO discoverability',
      'Analytics & telemetry setup',
      '2 revision rounds + 30 days dedicated support',
    ],
    ctaLabel: 'Choose Growth System (₦200k)',
    whatsappMessage: 'Hello Raymond, I want to get started with the Business Growth System (₦200,000) for my organization.',
  },
  {
    id: 'transformation',
    name: 'Digital Transformation',
    tagline: 'Comprehensive digital infrastructure for organizations with operational workflows.',
    price: 350000,
    formattedPrice: '₦350,000+',
    badge: 'Premium Enterprise',
    deliveryTime: '10–15 Business Days',
    targetAudience: 'Institutions, real estate firms & multi-branch businesses',
    deliverables: [
      'Up to 8 custom website pages & multi-step flows',
      'Advanced admissions / registration or booking workflow',
      'Automated transactional email response system',
      'Basic CRM or customer inquiry pipeline setup',
      'Professional copywriting & structure assistance',
      'Advanced analytics, telemetry & visitor audit trail',
      'Staff handover training session (recorded)',
      '3 revision rounds + 30 days priority technical support',
    ],
    ctaLabel: 'Inquire for Transformation',
    whatsappMessage: 'Hello Raymond, I would like to discuss the Business Digital Transformation package (₦350,000+) for our company.',
  },
];

export const CARE_RETAINER_PLANS: CarePlan[] = [
  {
    id: 'essential',
    name: 'Essential Care',
    tagline: 'Basic peace of mind: Keep your website live, healthy, and secure.',
    monthlyPrice: 15000,
    formattedPrice: '₦15,000/mo',
    features: [
      '24/7 Uptime & security monitoring',
      'Cloud backups & fast disaster recovery',
      'Monthly software & dependency updates',
      '1 Minor content update per month',
      'Direct WhatsApp emergency technical line',
    ],
    ctaLabel: 'Start Essential Care',
    whatsappMessage: 'Hello Raymond, I would like to subscribe to the Essential Care Plan (₦15,000/mo).',
  },
  {
    id: 'business',
    name: 'Business Care',
    tagline: 'Active digital maintenance to keep your business presentation fresh and active.',
    monthlyPrice: 35000,
    formattedPrice: '₦35,000/mo',
    badge: 'Recommended Retainer',
    isPopular: true,
    features: [
      'Everything in Essential Care',
      'Monthly performance & visitor summary report',
      'Up to 2 small update requests (text, images, banners)',
      'Broken link & form submission delivery audit',
      'Priority response within 24 business hours',
    ],
    ctaLabel: 'Start Business Care',
    whatsappMessage: 'Hello Raymond, I would like to subscribe to the Business Care Plan (₦35,000/mo).',
  },
  {
    id: 'growth-care',
    name: 'Growth Care',
    tagline: 'Strategic continuous improvement to drive more inquiries and optimize conversions.',
    monthlyPrice: 75000,
    formattedPrice: '₦75,000/mo',
    features: [
      'Everything in Business Care',
      'Up to 4 custom update requests or landing page tweaks',
      'Campaign & promotional banner integration',
      'Lead-flow & conversion rate audit recommendations',
      'Direct priority Slack / WhatsApp access to Raymond',
    ],
    ctaLabel: 'Start Growth Care',
    whatsappMessage: 'Hello Raymond, I would like to subscribe to the Growth Care Plan (₦75,000/mo).',
  },
];
