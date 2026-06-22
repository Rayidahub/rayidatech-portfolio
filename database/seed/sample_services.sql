-- Seed data for services table
-- Run after migration 004

INSERT INTO services (title, slug, headline, description, content, features, icon_name, "order") VALUES
(
  'UI/UX Design',
  'ui-ux-design',
  'Interfaces Users Actually Love',
  'Great design isnt just about pixels — its about psychology, usability, and results.',
  'I design interfaces that guide users seamlessly from point A to point B, reducing friction and increasing conversions. From fintech to e-commerce, every interaction is crafted with intent.',
  ARRAY[
    'User research & persona development',
    'Wireframes & low-fidelity prototypes',
    'High-fidelity UI design',
    'Design systems & component libraries',
    'Usability testing & iteration'
  ],
  'Palette',
  1
),
(
  'Product Design',
  'product-design',
  'Products Built With Purpose',
  'From fintech to real estate to e-commerce, I design products that solve real problems.',
  'Whether its MVP design or full product launch, I focus on usability, value, and impact. Every product is built with a deep understanding of user needs and business goals.',
  ARRAY[
    'Product strategy & roadmapping',
    'User flow & information architecture',
    'Rapid prototyping',
    'Visual design & branding integration',
    'Design handoff & developer collaboration'
  ],
  'Package',
  2
),
(
  'Brand Identity',
  'brand-identity',
  'Brands That Tell a Story',
  'Your brand is more than a logo — its how people feel about you.',
  'I create visual identities that communicate who you are, what you stand for, and why people should choose you. From startups to established businesses, every brand gets a unique voice.',
  ARRAY[
    'Logo design & visual systems',
    'Brand guidelines & style guides',
    'Business cards & stationery',
    'Color palettes & typography',
    'Brand strategy & positioning'
  ],
  'Fingerprint',
  3
),
(
  'Graphic Design',
  'graphic-design',
  'Visuals That Grab Attention',
  'In a crowded digital world, your visuals need to stop the scroll.',
  'I create flyers, banners, social media graphics, and marketing materials that are eye-catching and on-brand. Every design is crafted to communicate your message instantly.',
  ARRAY[
    'Social media graphics (Instagram, LinkedIn, TikTok)',
    'Flyers, posters & banners',
    'Brochures & marketing collateral',
    'Presentation decks & pitch decks',
    'Digital ads & promotional materials'
  ],
  'Image',
  4
),
(
  'Website Design',
  'website-design',
  'Modern Websites That Convert',
  'Your website is your digital storefront.',
  'I design responsive, user-friendly websites that look great on any device and guide visitors to take action. Every layout is optimized for engagement and conversion.',
  ARRAY[
    'Custom website design',
    'Responsive & mobile-first design',
    'E-commerce interfaces',
    'Landing pages',
    'Website redesign & optimization'
  ],
  'Monitor',
  5
),
(
  'Tech Education',
  'tech-education',
  'Skills That Pay the Bills',
  'The digital economy is growing fast.',
  'I offer practical training in design, productivity, and freelancing to help individuals build skills and earn income. From fundamentals to advanced concepts, every lesson is actionable.',
  ARRAY[
    'Computer fundamentals',
    'Microsoft Office (Word, Excel, PowerPoint)',
    'Graphic Design (CorelDRAW, Canva)',
    'Mobile productivity (WPS Office, Google Workspace)',
    'Freelancing & online income strategies'
  ],
  'GraduationCap',
  6
);
