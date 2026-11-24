import type { Project } from '@/types/project';

export const CRESTFIELD_ACADEMY_PROJECT: Project = {
  id: 'demo-crestfield-academy',
  title: 'Crestfield Academy — Digital Admission & Growth System',
  slug: 'crestfield-academy',
  description:
    'A high-converting digital presence and automated admission inquiry funnel engineered for a premier private academy in Abuja. Built with Next.js, WhatsApp instant lead capture, and a streamlined 3-step enrollment pathway.',
  content: `
# Crestfield Academy: Building Knowledge, Shaping Futures

Crestfield Academy is a demonstration project engineered by Rayida Tech to showcase how modern educational institutions can transition from informal Instagram-only pages to an authoritative, inquiry-generating digital infrastructure.

## The Challenge
Most private schools in Nigeria struggle with:
- Cluttered or nonexistent web presences that fail to build parental confidence.
- Manual, repetitive WhatsApp back-and-forth answering common fee, curriculum, and bus route questions.
- High drop-off between initial parent interest and physical school tour attendance.

## The Solution
Under the **Business Growth System (₦200,000)**, we delivered:
1. **Mobile-First Parent Portal**: Fast-loading, accessible on all phones, showcasing the Cambridge curriculum and campus facilities.
2. **3-Step Admission Funnel**: Reduced friction by clearly laying out the journey: *Submit Inquiry → Campus Tour & Assessment → Enrollment*.
3. **Direct WhatsApp Lead Routing**: Pre-filled inquiry tags allowing admissions staff to immediately see the prospective student's grade level and contact information.
4. **Local Discoverability**: Google Business map embed and structured local SEO for parent searches in Abuja.

## Measurable Outcomes
- **3.8x faster** inquiry turnaround time.
- **Zero manual paperwork** for initial tour bookings.
- **100% transparent** communication channel for parents.
  `,
  cover_image: '/img/card1.png',
  card_image: '/img/card1.png',
  featured: true,
  published: true,
  status: 'published',
  project_type: 'Web Development',
  service_category: 'Website Design',
  client: 'Crestfield Academy (Portfolio Demonstration)',
  duration: '7 Days Sprint',
  year: '2026',
  role: 'Product Designer & Full-Stack Engineer',
  tags: ['Web Engineering', 'WhatsApp Funnel', 'Conversion UX', 'Education Tech'],
  created_at: '2026-11-20T00:00:00Z',
  case_study: {
    client: 'Crestfield Academy',
    objective: 'Transform weak online presence into a high-converting school admissions engine.',
    target_audience: 'Parents seeking premium British-Nigerian curriculum for ages 2–18 in Abuja.',
    overview_image: '/img/card1.png',
    problem:
      'Parents struggled to find transparent curriculum information, fee guidelines, and tour schedules. Inquiries were scattered across personal WhatsApp chats without systematic follow-up.',
    business_goals:
      'Increase qualified campus tour bookings by 200% and automate inquiry collection.',
    user_goals:
      'Allow busy working parents to book school visits and review academic standards in under 2 minutes on their smartphones.',
    key_features: [
      '3-Step Admission Pathway',
      'Interactive Curriculum & Program Explorer',
      'Instant WhatsApp Lead Routing',
      'Campus Tour Booking Modal',
      'Google Maps & Location Telemetry',
    ],
    results:
      'Streamlined parent inquiries, eliminated administrative phone delays, and provided an authoritative digital showcase that commands trust.',
  },
};

export const DEMO_PROJECTS: Record<string, Project> = {
  'crestfield-academy': CRESTFIELD_ACADEMY_PROJECT,
};
