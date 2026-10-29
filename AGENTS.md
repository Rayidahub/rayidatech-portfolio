# Rayida Tech Portfolio — Agent Briefing

This file is auto-loaded at the start of every session. Read it before making any changes.

## Stack (verify against actual package.json — versions move fast)
- Next.js 16.x, App Router, TypeScript, Tailwind CSS v4
- React 19.x
- Supabase (`@supabase/supabase-js`) — tables: `projects`, `posts`, `contacts`,
  `testimonials`, `subscribers`, `hero_slides`, `services`, `ecosystem_products`,
  `team_members`, `contact_settings`, `blog_settings`, `hero_settings`, `admin_users`,
  `site_settings`, `visitor_logs`
- Framer Motion for animation
- lucide-react for icons
- Vitest for automated unit testing
- Playwright config for end-to-end testing

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
- `lib/slug.ts` — `normalizeSlug(title)`, URL-safe slug generator.
- `lib/email/index.ts` — Transactional email service (Resend REST API).

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
- Home page: Hero, TrustBar, StatsBar, WhatWeDo, Services, ComingSoon, WhyRayidaTech,
  Team, PortfolioTeaser, Testimonials, Newsletter, FinalCTA
- About page fully rewritten — bio, journey timeline, approach, skills
  (grouped), beliefs, featured projects, certifications, and final CTA.
  Uses Container, GlassCard, Reveal, brand tokens throughout.
- Project Detail page with full case-study layout (`app/(public)/projects/[slug]/page.tsx`).
- Projects list page (`app/(public)/projects/page.tsx`) ported to violet/cyan tokens with filter pills and responsive grid.
- Blog list (`app/(public)/blog/page.tsx`) with search, categories, and settings; Blog Detail page with reading time, table of contents, and rich Markdown reader.
- Services list and individual service detail pages (`app/(public)/services/`, `[slug]`).
- Dedicated Team page (`app/(public)/team/page.tsx`) with reference-inspired slanted card layout.
- Contact page rebuilt in brand design system (`app/(public)/contact/page.tsx`) with Supabase insertion, WhatsApp direct link, and transactional auto-reply/alert trigger.
- Generic branded 404 page (`app/not-found.tsx` & `app/(public)/not-found.tsx`).
- Hero section split-screen layout with dynamic Supabase slides (`hero_slides`) and customizable settings (`hero_settings`).
- ComingSoon section fetching from `ecosystem_products` with launch dates and status.
- Services section dynamically fetching from Supabase `services` with curated fallbacks.
- PortfolioTeaser dynamically fetching featured projects (`featured = true`) from Supabase.
- Testimonials section fetching active testimonials (`testimonials`).
- StatsBar with counter animation and dynamic data support.
- Newsletter section with real-time validation, duplicate handling, and direct Supabase insertion.
- Transactional email service (`lib/email/index.ts`, `POST /api/email/notify`) powered by Resend REST API — sends admin lead alerts directly to Zoho (`info@rayidatech.name.ng`), customer inquiry auto-replies from verified domain (`contact@rayidatech.name.ng`), and newsletter welcome emails.
- Admin dashboard pages: Projects, Services, Blog, Hero Slides, Contacts, Coming Soon, Testimonials, Subscribers, Team, Users, Logs, and Settings (full CRUD + CSV/XLSX batch imports).
- Visitor telemetry & analytics (`app/admin/(dashboard)/logs/`) tracking ISP, location, and hardware telemetry.
- Automated testing suite with Vitest (`npm test`) covering slugs, reading time, email dispatch simulation, and user-agent parsing.
- Consolidated production database schema (`database/consolidated_schema_production.sql`) fully applied and verified on live Supabase across all 15 tables.
- Database verification CLI (`npm run db:verify`) to check table connectivity and row counts on live Supabase.
- Clean Next.js 16 (Turbopack) builds with zero warnings across all 45 routes.
- Security hardening: centralized admin authentication guard (`lib/supabase/auth-guard.ts`) across all mutating Server Actions; authenticated and folder-whitelisted `/api/upload` with SVG XSS sanitizer; strict theme whitelist in `layout.tsx`; HTTP security headers (CSP, HSTS, X-Frame-Options) in `next.config.ts`; IP sliding-window rate limiting & honeypot in `/api/email/notify`; Markdown `javascript:` URI neutralization in `MarkdownContent.tsx`; encrypted HTTPS telemetry via `ipwhois.app`; and `public.visitor_logs` RLS lockdown migration (`023_secure_visitor_logs_rls.sql`).

## What's NOT done yet / Future enhancements
- Run `npx playwright install` if automated browser E2E testing is desired in CI pipelines.
- Production custom domain (`rayidatech.name.ng`) DNS verification and SSL deployment.

## Suggested next
- Deploy and verify live website contact form with Resend + Zoho integration.

## Working agreement
- Make one focused change per task. Don't refactor unrelated files
  "while you're in there."
- If a task requires touching a file outside its obvious scope (e.g. a
  shared data file, a type definition), say so explicitly before doing it.
- Never invent brand colors, copy, or content not present in this file or
  explicitly given in the task prompt.
- Flag any structural Next.js/React/Supabase API assumption you're not
  100% certain about, rather than silently guessing.
