import type { Service } from '@/types/service';

export const SERVICE_CATEGORIES = [
  'UI/UX Design',
  'Product Design',
  'Brand Identity',
  'Graphic Design',
  'Website Design',
  'Tech Education',
  'Social Media Management',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const defaultServices: Service[] = [
  {
    id: 'srv-1',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    headline: 'Interfaces Users Actually Love',
    description:
      'Great design isn’t just about pixels — it’s about psychology, usability, and measurable results.',
    content:
      'I design interfaces that guide users seamlessly from point A to point B, reducing friction and increasing conversions. From fintech dashboards to high-converting mobile applications, every interaction is crafted with intent, accessibility, and visual elegance.',
    features: [
      'User research & persona development',
      'Wireframes & low-fidelity prototypes',
      'High-fidelity interactive UI design',
      'Design systems & scalable token libraries',
      'Usability testing & feedback iteration',
    ],
    icon_name: 'Palette',
    image_url: '/img/card1.png',
    order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-2',
    title: 'Product Design',
    slug: 'product-design',
    headline: 'Products Built With Purpose & Scale',
    description:
      'From fintech to real estate to e-commerce, I design digital products that solve real problems.',
    content:
      'Whether you are building an early-stage MVP or scaling a multi-tiered platform, I bridge user needs with business KPIs. We architect intuitive flows, eliminate operational bottlenecks, and create product experiences that retain users.',
    features: [
      'Product strategy & feature roadmapping',
      'User journey mapping & information architecture',
      'Rapid clickable prototyping',
      'Visual design & brand integration',
      'Developer handoff specs & token synchronization',
    ],
    icon_name: 'Package',
    image_url: '/img/card2.png',
    order: 2,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-3',
    title: 'Brand Identity',
    slug: 'brand-identity',
    headline: 'Visual Identities That Command Trust',
    description:
      'Your brand is more than a logo — it’s how people perceive, remember, and feel about your business.',
    content:
      'I craft comprehensive visual identity systems that communicate who you are, what you stand for, and why clients should choose you. From modern tech startups to enterprise firms, every brand receives a distinct, cohesive, and memorable voice.',
    features: [
      'Logomarks, wordmarks & emblem systems',
      'Brand guidelines & comprehensive style manuals',
      'Color palette architecture & typography hierarchies',
      'Stationery, business cards & collateral design',
      'Brand positioning & strategic visual storytelling',
    ],
    icon_name: 'Fingerprint',
    image_url: '/img/abt.jpg',
    order: 3,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-4',
    title: 'Graphic Design',
    slug: 'graphic-design',
    headline: 'High-Impact Visuals That Stop The Scroll',
    description:
      'In a crowded digital feed, your visuals need immediate clarity and compelling aesthetic punch.',
    content:
      'I create marketing assets, digital ads, and publication materials that captivate audiences and deliver messages instantly. Every graphic asset is tailored to platform specifications and aligned with your broader brand aesthetic.',
    features: [
      'Social media creative suites (Instagram, LinkedIn, X)',
      'Event flyers, posters & large-format banners',
      'Investor pitch decks & executive presentation decks',
      'Brochures, reports & digital whitepapers',
      'Performance marketing ads & promotional creatives',
    ],
    icon_name: 'Image',
    image_url: '/img/11.jpeg',
    order: 4,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-5',
    title: 'Website Design & Engineering',
    slug: 'website-design',
    headline: 'Modern, Blazing-Fast Web Experiences',
    description:
      'Your website is your premier digital asset — engineered for lightning speed, responsiveness, and conversions.',
    content:
      'We design and build bespoke, responsive web applications leveraging Next.js, TypeScript, and modern styling. Every layout is optimized for Core Web Vitals, accessible on every device, and engineered to turn casual visitors into loyal clients.',
    features: [
      'Custom bespoke website design & development',
      'Mobile-first responsive architecture',
      'High-converting landing pages & marketing funnels',
      'Headless CMS & database integration',
      'SEO optimization & Core Web Vitals tuning',
    ],
    icon_name: 'Monitor',
    image_url: '/img/bgmain.jpg',
    order: 5,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-6',
    title: 'Tech Education & Mentorship',
    slug: 'tech-education',
    headline: 'Practical Skills For The Digital Economy',
    description:
      'Actionable training in design, modern tools, and digital freelancing to unlock real earning potential.',
    content:
      'The modern digital economy demands practical, industry-proven competencies. I provide hands-on workshops and tailored mentorship covering UI/UX design tools, digital productivity, and career positioning for aspiring tech professionals.',
    features: [
      'UI/UX design fundamentals with Figma',
      'Graphic design mastery (CorelDRAW & Canva)',
      'Digital productivity workflows & cloud tools',
      'Freelancing, portfolio building & client acquisition',
      'One-on-one portfolio reviews & career coaching',
    ],
    icon_name: 'GraduationCap',
    image_url: '/img/wwu.jpeg',
    order: 6,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-7',
    title: 'Social Media Management',
    slug: 'social-media-management',
    headline: 'Consistent Voices That Build Communities',
    description:
      'Turn social channels into active growth engines through strategic content creation and engagement.',
    content:
      'Your audience is online right now — make sure your business communicates with authority and consistency. I craft content calendars, produce multimedia assets, and oversee community interactions that build trust and drive organic reach.',
    features: [
      'Content strategy & monthly editorial calendars',
      'Channel-optimized visual & copy production',
      'Active community engagement & response management',
      'Growth analytics, audience insights & monthly reporting',
      'Brand tone moderation & cross-platform consistency',
    ],
    icon_name: 'Megaphone',
    image_url: '/img/hero.jpg',
    order: 7,
    created_at: '2025-01-01T00:00:00Z',
  },
];

export function getDefaultService(slug: string): Service | undefined {
  return defaultServices.find((s) => s.slug === slug);
}

export function getServiceImage(service: Partial<Service> | null | undefined): string {
  if (!service) return '/img/card1.png';
  if (service.image_url) return service.image_url;

  // Check if content embeds image tag: <!--image:URL--> or ![...](URL)
  if (service.content) {
    const commentMatch = service.content.match(/<!--image:(.*?)-->/);
    if (commentMatch && commentMatch[1]) return commentMatch[1].trim();

    const mdMatch = service.content.match(/!\[.*?\]\((.*?)\)/);
    if (mdMatch && mdMatch[1]) return mdMatch[1].trim();
  }

  // Fallback by slug
  const matched = defaultServices.find((s) => s.slug === service.slug);
  if (matched?.image_url) return matched.image_url;

  return '/img/card1.png';
}

export function cleanServiceContent(content?: string | null): string {
  if (!content) return '';
  return content.replace(/<!--image:(.*?)-->\n?/g, '').trim();
}
