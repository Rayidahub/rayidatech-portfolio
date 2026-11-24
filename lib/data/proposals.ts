import { normalizeSlug } from '@/lib/slug';
import { DIGITAL_UPGRADE_PACKAGES, CARE_RETAINER_PLANS } from '@/lib/data/pricing-packages';

export interface ProposalDeliverable {
  title: string;
  description: string;
  badge: string;
}

export interface ProposalMilestone {
  stage: string;
  percentage: number;
  amount: number;
  formattedAmount: string;
  description: string;
  trigger: string;
}

export interface ProposalData {
  slug: string;
  clientName: string;
  contactPerson?: string;
  category: string;
  targetCity: string;
  dateCreated: string;
  validityDays: number;
  packageId: string;
  packageName: string;
  deliveryTimeline: string;
  totalPrice: number;
  formattedPrice: string;
  objective: string;
  deliverables: ProposalDeliverable[];
  milestones: ProposalMilestone[];
  carePlan: {
    name: string;
    formattedPrice: string;
    features: string[];
  };
  demoProject: {
    title: string;
    url: string;
    description: string;
  };
  whatsappAcceptanceUrl: string;
}

/**
 * Default deliverables customized for schools/education organizations.
 */
const SCHOOL_DELIVERABLES: ProposalDeliverable[] = [
  {
    title: 'High-Performance Mobile Web Portal',
    description: 'Sub-second loading, clean typography, designed for iPhone & Android parents looking for admission details.',
    badge: 'Mobile First',
  },
  {
    title: 'Curriculum & Program Explorer',
    description: 'Interactive breakdown of early years, primary, and secondary programs to showcase academic standards.',
    badge: 'Academics',
  },
  {
    title: '1-Click WhatsApp Admission Routing',
    description: 'Direct enquiry modal that funnels prospective parents into your admissions desk with pre-filled child details.',
    badge: 'Admissions Funnel',
  },
  {
    title: 'Google Maps & Local Search Optimization',
    description: 'Structured metadata and local business schema so Abuja parents searching "best schools near me" find you.',
    badge: 'Local SEO',
  },
  {
    title: 'Campus Tour & Facilities Showcase',
    description: 'High-resolution photo gallery highlighting smart classrooms, laboratories, play parks, and extracurriculars.',
    badge: 'Trust & Proof',
  },
];

/**
 * General commercial business deliverables (e.g. event planners, caterers, medical clinics).
 */
const GENERAL_DELIVERABLES: ProposalDeliverable[] = [
  {
    title: 'Bespoke Brand Web Showcase',
    description: 'Custom UI/UX reflecting the premium quality of your services and differentiating you from competitors.',
    badge: 'Brand Authority',
  },
  {
    title: 'Interactive Services & Pricing Tiers',
    description: 'Clear, elegant presentation of your offerings so clients know your value before making contact.',
    badge: 'Service Catalog',
  },
  {
    title: 'Instant WhatsApp Booking Integration',
    description: 'Floating booking trigger and inquiry form that routes client booking requests directly to your phone.',
    badge: 'Direct Booking',
  },
  {
    title: 'Local SEO & Google Discoverability',
    description: 'Properly indexed site structure with meta descriptions, open graph social tags, and Google Maps embed.',
    badge: 'SEO & Reach',
  },
  {
    title: 'Client Reviews & Social Proof Wall',
    description: 'Prominently positioned testimonials and past work photos that establish instant trust with new prospects.',
    badge: 'Social Proof',
  },
];

/**
 * Builds standard 50/50 milestones based on package total price.
 */
export function buildProposalMilestones(totalPrice: number): ProposalMilestone[] {
  const half = Math.round(totalPrice / 2);
  const formattedHalf = `₦${half.toLocaleString()}`;

  return [
    {
      stage: 'Milestone 1 — Project Kickoff',
      percentage: 50,
      amount: half,
      formattedAmount: formattedHalf,
      description: 'Initial structural architecture, layout prototype, and dedicated staging link.',
      trigger: 'Due upon proposal approval to initiate development',
    },
    {
      stage: 'Milestone 2 — Final Handover & Launch',
      percentage: 50,
      amount: half,
      formattedAmount: formattedHalf,
      description: 'Domain connection, SSL activation, admissions/WhatsApp routing testing, and live release.',
      trigger: 'Due upon client review & approval prior to final public live launch',
    },
  ];
}

/**
 * Generates an end-to-end ProposalData object for any prospect.
 */
export function generateProposalData(
  clientName: string,
  options?: {
    category?: string;
    contactPerson?: string;
    packageId?: string;
    targetCity?: string;
    validityDays?: number;
  }
): ProposalData {
  const category = options?.category || 'General Business';
  const isSchool = category.toLowerCase().includes('school') || category.toLowerCase().includes('academ');
  const packageId = options?.packageId || 'growth';
  const pkg = DIGITAL_UPGRADE_PACKAGES.find((p) => p.id === packageId) || DIGITAL_UPGRADE_PACKAGES[1]; // default to ₦200k growth
  const care = CARE_RETAINER_PLANS.find((c) => c.id === 'business') || CARE_RETAINER_PLANS[1]; // default ₦35k/mo

  const slug = normalizeSlug(clientName);
  const milestones = buildProposalMilestones(pkg.price);
  const deliverables = isSchool ? SCHOOL_DELIVERABLES : GENERAL_DELIVERABLES;

  const acceptanceMessage = encodeURIComponent(
    `Hello Raymond, I have reviewed the Digital Upgrade Proposal for ${clientName} (${pkg.formattedPrice}). We are pleased to accept it. Please send the kickoff invoice of ${milestones[0].formattedAmount} to get started.`
  );

  const whatsappAcceptanceUrl = `https://wa.me/2348100000000?text=${acceptanceMessage}`;

  return {
    slug,
    clientName,
    contactPerson: options?.contactPerson,
    category,
    targetCity: options?.targetCity || 'Abuja, Nigeria',
    dateCreated: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    validityDays: options?.validityDays || 7,
    packageId: pkg.id,
    packageName: pkg.name,
    deliveryTimeline: pkg.deliveryTime,
    totalPrice: pkg.price,
    formattedPrice: pkg.formattedPrice,
    objective: isSchool
      ? `Transform ${clientName}’s online presence from a static profile into an automated admissions and trust-building engine that captures prospective parents on mobile.`
      : `Elevate ${clientName}’s digital presence with a modern, high-converting digital portal designed to win high-ticket clients and streamline direct WhatsApp bookings.`,
    deliverables,
    milestones,
    carePlan: {
      name: care.name,
      formattedPrice: care.formattedPrice,
      features: care.features.slice(0, 4),
    },
    demoProject: {
      title: 'Crestfield Academy Interactive Demo',
      url: '/projects/crestfield-academy',
      description: 'Explore a live simulation of a modern educational admissions portal built to convert mobile visitors.',
    },
    whatsappAcceptanceUrl,
  };
}

/**
 * Pre-seeded sample proposals for immediate testing & demoing.
 */
export const PRE_SEEDED_PROPOSALS: ProposalData[] = [
  generateProposalData('Prestige Royal Academy', {
    category: 'Schools & Academies',
    contactPerson: 'School Director / Head of Admissions',
    packageId: 'growth',
    targetCity: 'Wuse 2, Abuja',
  }),
  generateProposalData('Capital Crest International School', {
    category: 'Schools & Academies',
    contactPerson: 'Proprietor',
    packageId: 'growth',
    targetCity: 'Gwarinpa, Abuja',
  }),
  generateProposalData('1420 Events & Decor', {
    category: 'Event Planning & Decor',
    contactPerson: 'Lead Event Architect',
    packageId: 'growth',
    targetCity: 'Maitama, Abuja',
  }),
];

/**
 * Retrieves a proposal by slug, falling back to dynamically synthesizing one if not in pre-seeded list.
 */
export function getProposalBySlug(slug: string): ProposalData {
  const found = PRE_SEEDED_PROPOSALS.find((p) => p.slug === slug);
  if (found) {
    return found;
  }

  // De-slugify to generate a human-readable name
  const words = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  const humanName = words.join(' ');
  const isSchool = slug.includes('school') || slug.includes('academy') || slug.includes('college');

  return generateProposalData(humanName, {
    category: isSchool ? 'Schools & Academies' : 'Business Upgrade',
  });
}
