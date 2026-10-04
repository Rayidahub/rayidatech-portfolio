import type { Post } from '@/types/post';

export const fallbackPosts: Post[] = [
  {
    id: 'post-1',
    title: 'The Convergence of AI and Product Design: What Changes in 2026',
    slug: 'convergence-of-ai-and-product-design',
    excerpt:
      'AI is no longer just a feature bolted onto software; it is reshaping interface paradigms, design systems, and how digital products build user trust.',
    content: `## A New Era for Interface Design

Over the past few years, the role of artificial intelligence in digital products has transitioned from novelty autocomplete features to autonomous, context-aware user agents. For product designers and engineers, this shift requires a fundamental reconsideration of how interfaces communicate intent and state.

Traditional graphical user interfaces (GUIs) were built around explicit commands: users click buttons, navigate hierarchical menus, and fill out static forms. In contrast, generative and agentic systems operate probabilistically. They interpret ambiguity, predict next steps, and generate dynamic content in real time.

### The Problem of Trust in AI Interfaces

When users interact with deterministic software, predictability creates confidence. If a user clicks a "Submit" button, they expect a known outcome. With intelligent agents, output variability introduces cognitive friction.

Building trust in AI-driven experiences requires three core design principles:

1. **State Transparency:** Never leave the user guessing what the model is doing. Distinct visual states for thinking, querying, and synthesizing reassure the user.
2. **Reversible Autonomy:** Always provide clear undo pathways and human-in-the-loop verification for consequential actions.
3. **Structured Context:** Instead of unstructured chat boxes, integrate contextual action pills, preview cards, and progressive disclosure.

### Moving Forward

As product creators, our responsibility is to balance technical capability with human ergonomics. The next generation of exceptional software will not be defined by who uses the biggest model, but by who crafts the most trustworthy, frictionless user experience.`,
    cover_image: '/img/card1.png',
    created_at: '2026-03-15T10:00:00Z',
    published: true,
    tags: ['AI Engineering', 'Product Design', 'UI/UX'],
  },
  {
    id: 'post-2',
    title: 'Building High-Performance Next.js 16 Web Applications with Tailwind CSS',
    slug: 'building-high-performance-nextjs-16-web-apps',
    excerpt:
      'An in-depth guide to modern web architecture: optimizing server components, minimizing layout shifts, and crafting fluid micro-interactions.',
    content: `## Modern Frontend Architecture

The web development landscape has matured rapidly. With Next.js App Router and Tailwind CSS v4, we can achieve sub-second initial page loads and 60fps animations while maintaining complete code clarity.

### Server Components by Default

One of the greatest architectural advantages in modern Next.js is React Server Components (RSC). By fetching data directly on the server and streaming rendered HTML down to the browser, client bundles remain minuscule.

\`\`\`tsx
// Server Component data fetching pattern
export const revalidate = 3600; // Hourly ISR

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  return <ProjectDetail project={project} />;
}
\`\`\`

### Design Systems and Token Architecture

Maintaining design tokens across dark and light themes can easily devolve into messy CSS overrides. By defining CSS custom properties under \`:root\` and mapping them through Tailwind's inline theme tokens, switching between themes becomes instantaneous with zero hydration mismatch.

### Key Takeaways

Speed is not just a technical metric; it is an emotional feature. Users perceive fast, responsive applications as more reliable and professional.`,
    cover_image: '/img/card2.png',
    created_at: '2026-02-20T14:30:00Z',
    published: true,
    tags: ['Next.js', 'Frontend', 'Tailwind CSS'],
  },
  {
    id: 'post-3',
    title: 'Crafting Brand Identity That Scales Across Physical and Digital Touchpoints',
    slug: 'crafting-brand-identity-that-scales',
    excerpt:
      'How to establish a cohesive brand identity that feels equally confident on mobile screens, enterprise dashboards, and print materials.',
    content: `## Brand Beyond Logos

A brand is not simply a logo or a color scheme; it is the sum of feelings, expectations, and memories that a customer associates with your product. When building digital brands, consistency is the foundation of trust.

### Visual Ratios and Color Psychology

In digital experiences, colors convey hierarchy and urgency:
- **Primary Violet:** Conveys technical sophistication, modern ambition, and depth.
- **Electric Cyan:** Serves as a high-contrast accent for interactive states and focus rings.
- **Deep Navy/Ink:** Grounds the experience, offering visual comfort and focus for long sessions.

### Design Tokens as the Bridge

The bridge between brand guidelines and engineering implementation is the token system. When typography scales, border radii, and spacing variables are codified into tokens, design consistency remains uncompromised even as products expand into multi-platform ecosystems.`,
    cover_image: '/img/hero.jpg',
    created_at: '2026-01-10T09:15:00Z',
    published: true,
    tags: ['Branding', 'Design Systems', 'Strategy'],
  },
];
