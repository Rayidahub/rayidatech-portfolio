# Design Reference: scalient.webflow.io

Analysis of the reference template's design system, layout patterns, and
animation techniques — for use as a structural/stylistic reference on this
project. This documents **patterns and technique**, not verbatim copy or
assets; none of the source site's marketing text, images, or code should be
reproduced directly — only the underlying design language described below.

## 1. Color system

| Role | Value | Usage |
|---|---|---|
| Page background (light sections) | `#FFFFFF` (white) | Alternates with dark sections between page blocks |
| Page background (dark sections) | `#080D0D` (near-black, slightly warm) | Hero, footer, several full-bleed sections |
| Secondary dark surface | `#111616` | Nested cards/panels inside dark sections, one shade lighter than the section background |
| Primary text on light | `#080D0D` (near-black) | Headings and body text on white sections |
| Body copy (muted) | `rgb(111, 119, 129)` — a cool mid-gray | Paragraph/subtext, secondary information |
| Accent color | `#BCEA3E` (lime/chartreuse green) | The single, high-contrast accent — CTA button fills, badges, highlighted numerals, active states |
| Overlay | `rgba(0,0,0,0.8)` | Modal/menu scrims |

**Palette philosophy**: strictly two-tone (black/white) for structure, with
exactly one saturated accent color used sparingly and consistently — never
introduces a second accent hue. High contrast throughout (near-black on
white, or the lime accent on near-black), no mid-tone color fields.

## 2. Typography

- **Typeface**: a single custom grotesk/display font ("Interdisplay") used
  for everything — headings, body, labels, buttons. No serif or secondary
  typeface pairing.
- **Heading scale**: H1 ≈ 54px / weight 700 / line-height 59px / letter-spacing
  **-2px** (tight tracking is a signature detail — large headlines are
  noticeably condensed). H2 ≈ 32px / weight 600 / line-height 35px, normal
  tracking.
- **Body copy**: 16px / line-height 22px, muted gray color (not full-contrast
  black), keeping paragraphs visually secondary to headings.
- **Labels/eyebrows**: small, uppercase or sentence-case tags in pill badges
  (see Components) rather than plain letter-spaced text — the badge *is* the
  label treatment here, not a bare uppercase caption.

## 3. Layout & spacing

- **Alternating section backgrounds**: dark → light → dark → light down the
  page, used to segment content without needing borders or dividers. Each
  section is a full-bleed block of one flat color.
- **Generous section padding**, wide max-width containers, consistent
  column gutters — nothing feels cramped; whitespace does most of the
  visual organizing.
- **Border radius is a scale, not a single value**: small UI elements (tags,
  small icons) ≈ 9–12px, cards ≈ 15–25px, pills/buttons/badges ≈ 999px (fully
  rounded). Rounding increases with element size, and pills are always
  fully round, never partially.
- **Grid patterns**: 3-up and 4-up card grids for services/works/pricing:
  content blocks are equal-width cards in a single row on desktop,
  collapsing to fewer columns on smaller viewports (standard responsive
  grid — no unusual reflow behavior observed).

## 4. Component patterns

- **Pill badge**: a rounded-full, two-part badge — a small solid tag (e.g.
  a short label) directly followed by a chevron/arrow-suffixed phrase, all
  inside one pill container. Used above the hero headline as an
  attention-grabbing eyebrow, distinct from plain text eyebrows.
- **Buttons**: two variants seen throughout — a solid lime-accent pill
  (primary action) and a dark/black pill with a small icon (secondary
  action, e.g. a "watch demo" play button). Both are fully rounded, never
  square or subtly-rounded rectangles.
- **Floating accent cards near the hero**: small, elevated card elements
  (a photographic card, a big-number stat card, an icon+headline card)
  positioned overlapping the hero imagery rather than confined to a grid —
  they read as "pinned" decorative accents rather than structured content.
- **Hover-reveal work/case-study cards**: a card shows a default state
  (image + minimal label) and swaps to a richer state on hover/interaction
  (title, description, metrics, CTA) — content-dense information is
  deferred until the user engages with the card.
- **Numeric stat blocks**: large numerals (with a `+`/`%`/`K` suffix)
  paired with a short label underneath — no icon, the number itself is the
  focal point, rendered at a much larger scale than any surrounding text.
- **Testimonial cards**: simple bordered/flat cards — quote text, then a
  name + title line below a subtle divider. No avatar photos used; the
  quote itself carries the visual weight.
- **Pricing cards**: three-tier card row, one visually emphasized (typically
  the middle "recommended" tier via a filled/accent treatment while the
  others stay outline/flat), each listing a price, a short description, and
  a checklist of included features.
- **Blog/article cards**: a category tag pill, a headline, a short excerpt,
  then an author + date line — consistent with the testimonial card's
  "tag → content → attribution" rhythm.

## 5. Animation & motion patterns

- **Pinned / scroll-jacked horizontal card rail**: directly after the hero,
  a row of cards (photo, stat, icon-content) is pinned to the viewport while
  the user scrolls vertically, translating the row horizontally over the
  scroll distance — a "scrub"-style scroll-linked animation, not a
  time-based autoplay. This is the site's signature motion moment.
- **Count-up numerals**: stat numbers animate from 0 up to their final value
  when the stat section scrolls into view, rather than appearing static.
- **Scroll-reveal entrances**: standard fade/slide-in-on-scroll for section
  headings and card grids as they enter the viewport (subtle, short
  duration, not a major motion signature on its own — mostly used to add
  polish to otherwise static content).
- **Hover-state transitions on cards**: the default → hover content swap on
  work cards is animated (cross-fade/slide), not an instant toggle.
- **Repeating marquee bands**: two distinct marquee uses — a horizontal
  logo-strip marquee (continuous, slow, for "trusted by" logos) and a
  large-type repeating text marquee (fast, bold, used as a full-width visual
  break before the footer, alternating plain/accent-colored repeats of a
  short CTA phrase).
- **Sticky/transparent-to-solid navbar**: nav bar is transparent over the
  hero and gains a solid/blurred background once the page scrolls — a
  common but effective "arrival" cue.

## 6. How this maps to the current project

This project already implements the direct equivalents of most of the
above, adapted to its own violet/cyan/ink palette instead of black/lime:
`StatusPill` (pill badge), `.btn-glow` (accent pill button), `PremiumCard`
(hover-reveal work card), `TrustBar` (logo marquee), `MarqueeCTA` (repeating
text marquee), the `Reveal` component (scroll-reveal entrances), and the
`StatsBar` count-up/scroll-linked stat strip. The main structural pattern
**not yet mirrored** is the alternating flat dark/light full-bleed section
backgrounds — this project currently varies background via glows/gradients
on a mostly-consistent dark base, rather than hard-alternating between two
flat tones per section.
