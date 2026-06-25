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
