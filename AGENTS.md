# Rayida Tech Portfolio — Agent Briefing

This file is auto-loaded at the start of every session. Read it before making any changes.

## Stack (verify against actual package.json — versions move fast)
- Next.js 16.x, App Router, TypeScript, Tailwind CSS v4
- React 19.x
- Supabase (`@supabase/supabase-js`) — tables: `projects`, `posts`, `contacts`,
  `testimonials`, `subscribers`, `hero_slides`, `services`, `ecosystem_products`
- Framer Motion for animation
- lucide-react for icons

**Do not trust claims about "breaking changes" or fake doc paths from old context.**
If unsure about a current Next.js/React API (e.g. whether `params` in a dynamic
route is a Promise), verify against the real installed version in
`node_modules/next/package.json` and official Next.js docs — not assumptions.

## Brand
- Name: Raymond Gaius
- Title: Product Designer & AI Engineer
- Company: Rayida Tech
- Tagline: "Building digital experiences people can trust"
- Email: rayidagaius@gmail.com
- WhatsApp: https://wa.link/tlezg8
- GitHub: https://github.com/Rayidahub
- Domain: rayidatech.name.ng

## Design system (current — do not revert to black/teal, that was an earlier draft)
- Background (`ink`): `#1a1a2e`
- Text (`paper`): `#f2f2f2`
- Primary accent (`primary`): `#8000ff` (violet)
- Secondary accent (`secondary`): `#00d1ff` (cyan)
- Soft accent (`accent-soft`): `#ccccff`
- Muted text: `mist-1` (#b8b8c8), `mist-2` (#7d7d92)
- Tokens live in `app/globals.css` under `:root` and are exposed as Tailwind
  utilities via `@theme inline` (e.g. `bg-ink`, `text-primary`, `text-secondary`).
- Borders/dividers should use `border-(--line)` (Tailwind v4 syntax), not hardcoded
  `border-white/...` — this repo had that bug before and it's been fixed
  everywhere; don't reintroduce it.
- Glass surfaces: use the `.glass` / `.glass-strong` utility classes, not
  ad-hoc `bg-white/5 backdrop-blur` — defined once in `globals.css`.
- One signature accent text: `.gradient-text` (solid violet `#8000ff`), used
  **once per page maximum** on a key word. Don't overuse it.
- Fonts: `font-display` (Geist) for headings, default body font is Inter,
  `font-mono-tight` (Geist Mono) for metadata/timestamps/labels.
- Motion: use the shared `<Reveal>` component (`components/ui/Reveal.tsx`)
  for scroll-triggered entrance animation, not one-off Framer Motion blocks,
  so timing/easing stays consistent across the site.

## Shared primitives (reuse, don't duplicate)
- `components/ui/Container.tsx` — width wrapper (`size="narrow"|"default"|"wide"`)
- `components/ui/Section.tsx` — vertical rhythm wrapper
- `components/ui/GlassCard.tsx` — glass card surface
- `components/ui/StatusPill.tsx` — the pulsing "Available for projects" pill
- `components/ui/Reveal.tsx` — scroll-reveal motion wrapper
- `lib/data/skills.ts` — single source of truth for the skills list, used by
  both `app/about/page.tsx` and `components/sections/Skills.tsx`. If the
  skills list changes, edit only this file.
- `lib/reading-time.ts` — `getReadingTime(content)`, used on blog pages.

## Data fetching pattern
- Server components fetch directly from Supabase (`lib/supabase/server.ts`),
  no API routes for read paths.
- Dynamic detail pages (`app/projects/[slug]/page.tsx`,
  `app/blog/[slug]/page.tsx`) export `revalidate = 3600` (hourly ISR) —
  keep this consistent on any new data-fetching page unless deliberately
  changed.
- **Next.js 16: `params` and `searchParams` in page components are
  `Promise`s.** Always type as `Promise<{ slug: string }>` and `await` them
  inside an `async` component. Do not write synchronous `params.slug`
  destructuring — that was a real bug already fixed twice in this repo.

## What's done (do not rebuild from scratch — extend/fix, don't replace blindly)
- Design tokens, fonts, Navbar, Footer
- Home page: Hero, TrustBar, StatsBar, WhatWeDo, Services, WhyRayidaTech,
  PortfolioTeaser, Testimonials, ComingSoon, FinalCTA
- About page fully rewritten — bio, journey timeline, approach, skills
  (grouped), beliefs, featured projects, certifications, and final CTA.
  Uses Container, GlassCard, Reveal, brand tokens throughout. No teal
  remaining. Build confirmed passing.
- Project Detail page (moved from broken path, case-study layout)
- Blog Detail page (reading time added)
- Projects grid with filter pills (All/Featured/Fintech/Design — filters by
  `featured` boolean and by tag string match, case-insensitive)
- Blog list with client-side search
- `subscribers` table migration (`database/migrations/002_subscribers.sql`)
- Sample/test project seed data (`database/seed/sample_projects.sql`)
- Contact page rebuilt in current design system — uses Container, GlassCard,
  Reveal, StatusPill, WhatsApp link, gradient-text heading, violet/cyan
  tokens. Form insert logic unchanged. Build confirmed passing.
- Hero section rebuilt as split-screen layout — left text, right abstract
  silhouette with violet/cyan glow. Uses font-display, gradient-text,
  StatusPill, glass ornament, brand tokens throughout. No teal remaining.
- Admin dashboard pages for Projects, Services, Blog, Hero Slides, Contacts,
  Coming Soon, and Testimonials (list/create/edit/delete).
- `ecosystem_products` table + seed data + admin CRUD; ComingSoon section
  fetches from Supabase and supports `coming_soon` / `live` status and
  `launch_date`.
- `testimonials` table management migration (adds `is_active`, `sort_order`)
  + seed data + admin CRUD; Testimonials section fetches from Supabase.
- Subtle background variation across homepage sections (alternating
  `bg-ink-deep`, dot patterns, radial glows, gradient lines).

## What's NOT done yet
- Projects list page (`app/projects/page.tsx`) still has teal-era styling
- `not-found.tsx` only mentions "Project Not Found" — should be generic
- PortfolioTeaser section still hardcodes 3 projects; should pull featured
  projects from Supabase like FeaturedProjects does
- Services section still hardcodes the service list; admin CRUD exists but
  the public section isn't wired up
- StatsBar still hardcodes numbers
- Newsletter UI doesn't exist yet (only the `subscribers` table migration)

## Suggested next
- **Projects list port** — update `app/projects/page.tsx` to use violet/cyan
  tokens
- **Project detail port** — update `app/(public)/projects/[slug]/page.tsx` to
  use violet/cyan tokens
- **Blog list port** — update `app/blog/page.tsx` to use violet/cyan tokens
- **Generic 404** — rewrite `not-found.tsx` to handle any missing page

## Working agreement
- Make one focused change per task. Don't refactor unrelated files
  "while you're in there."
- If a task requires touching a file outside its obvious scope (e.g. a
  shared data file, a type definition), say so explicitly before doing it.
- Never invent brand colors, copy, or content not present in this file or
  explicitly given in the task prompt.
- Flag any structural Next.js/React/Supabase API assumption you're not
  100% certain about, rather than silently guessing.
