/**
 * Hero slider content.
 *
 * The site pulls live slides from the `hero_slides` Supabase table. The array
 * below is used as a fallback when no active slides exist in the database or
 * when the fetch fails.
 */

export interface HeroSlide {
  label: string;
  words: string[];
  body: string;
  image: string;
}

export interface HeroSlideRow {
  id: string;
  label: string;
  words: string[];
  body: string;
  image: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const defaultHeroSlides: HeroSlide[] = [
  {
    label: 'Rayida Tech',
    words: ['Build.', 'Scale.', 'Dominate Your', 'Digital Presence'],
    body: 'We design and develop powerful digital solutions that help startups and businesses grow, stand out, and succeed.',
    image: '/img/about-portrait.png',
  },
  {
    label: 'AI Solutions',
    words: ['Automate.', 'Analyze.', 'Accelerate With', 'Intelligent Systems'],
    body: 'Leverage cutting-edge AI to streamline workflows, unlock insights, and scale your business faster.',
    image: '/img/about-portrait.png',
  },
  {
    label: 'Product Design',
    words: ['Research.', 'Design.', 'Craft', 'Trusted Experiences'],
    body: 'User-centered product design that turns complex problems into intuitive, beautiful interfaces.',
    image: '/img/about-portrait.png',
  },
  {
    label: 'Development',
    words: ['Engineer.', 'Deploy.', 'Ship', 'Reliable Products'],
    body: 'Full-stack development with modern frameworks, performance, accessibility, and scalability in mind.',
    image: '/img/about-portrait.png',
  },
  {
    label: 'Brand Identity',
    words: ['Define.', 'Differentiate.', 'Build A', 'Memorable Brand'],
    body: 'Strategic branding and visual systems that make your business recognizable and memorable.',
    image: '/img/about-portrait.png',
  },
  {
    label: 'Growth',
    words: ['Launch.', 'Optimize.', 'Grow Your', 'Digital Reach'],
    body: 'Data-driven growth strategies and digital marketing that attract, engage, and convert customers.',
    image: '/img/about-portrait.png',
  },
];

export function toHeroSlides(rows: HeroSlideRow[] | null): HeroSlide[] {
  if (!rows || rows.length === 0) return defaultHeroSlides;

  const active = rows
    .filter((row) => row.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (active.length === 0) return defaultHeroSlides;

  return active.map((row) => ({
    label: row.label,
    words: Array.isArray(row.words) && row.words.length > 0
      ? row.words
      : defaultHeroSlides[0].words,
    body: row.body,
    image: row.image,
  }));
}
