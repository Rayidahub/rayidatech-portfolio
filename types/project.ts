// types/project.ts

export const PROJECT_TYPES = [
  'UI/UX Design',
  'Brand Identity',
  'Web Development',
  'Other / General',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

/* ─────────────────────────────────────────────────────────────
   UI/UX & PRODUCT CASE STUDY SCHEMA (PRESERVED)
   ───────────────────────────────────────────────────────────── */
export interface CaseStudy {
export interface CaseStudy { [key: string]: any; }
