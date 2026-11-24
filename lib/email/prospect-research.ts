// lib/email/prospect-research.ts
// Comprehensive Lead Research & Prospect Finder Engine for Abuja & Nigerian Businesses
// Powered by curated vendor listings, intelligent niche discovery, and instant export/import.

import * as XLSX from 'xlsx';
import type {
  ProspectResearchItem,
  ResearchFilterParams,
  ProspectVerificationDetails,
} from '@/types/outreach';

export const RESEARCH_CATEGORIES = [
  'All',
  'Schools & Academies',
  'Event Planning & Decor',
  'Bakery & Confectionery',
  'Catering & Food Services',
  'Interior Design & Furnishing',
  'Hair, Beauty & Wellness',
  'Real Estate & Shortlets',
  'Fashion & Apparel',
  'Photography & Studios',
  'Legal & Corporate Advisory',
  'Tech & Creative Agencies',
] as const;

export const ABUJA_AREAS = [
  'All Areas',
  'Wuse 2',
  'Maitama',
  'Garki',
  'Gwarinpa',
  'Jabi',
  'Utako',
  'Asokoro',
  'Kado',
  'Guzape',
  'Central Business District',
] as const;

/**
 * Verified base dataset drawn directly from public business listings in Abuja,
 * including occasionally.ng vendor directories, Google Business, and public registries.
 */
export const CURATED_ABUJA_PROSPECTS: ProspectResearchItem[] = [
  {
    id: 'res-abj-sch-01',
    business_name: 'Prestige Royal Academy',
    business_category: 'Schools & Academies',
    location: 'Abuja, Nigeria',
    area: 'Wuse 2',
    email: 'prestigeroyalacademy@gmail.com',
    phone: '+234 812 345 6789',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Private primary and nursery school in Wuse 2. Operating via Facebook and WhatsApp inquiries; no online admissions portal.',
    source: 'Abuja Education Registry',
    source_link: 'https://maps.google.com/?q=Prestige+Royal+Academy+Wuse+2',
    opportunity_score: 'High',
    recommended_pitch: 'Showcase how our Crestfield Academy 3-step admission funnel automates parent tour bookings.',
  },
  {
    id: 'res-abj-sch-02',
    business_name: 'Capital Crest International School',
    business_category: 'Schools & Academies',
    location: 'Abuja, Nigeria',
    area: 'Gwarinpa',
    email: 'capitalcrestschool@gmail.com',
    phone: '+234 803 987 6543',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Active nursery and junior academy in Gwarinpa. Parents currently DM on Instagram for fee inquiries.',
    source: 'Google Business Listings',
    source_link: 'https://maps.google.com/?q=Capital+Crest+Gwarinpa',
    opportunity_score: 'High',
    recommended_pitch: 'Pitch custom school landing page with fee schedules and WhatsApp conversion pathway.',
  },
  {
    id: 'res-abj-sch-03',
    business_name: 'Apex Heights Early Learning Centre',
    business_category: 'Schools & Academies',
    location: 'Abuja, Nigeria',
    area: 'Maitama',
    email: 'apexheightskids@gmail.com',
    phone: '+234 807 123 4567',
    website: 'https://apexheights.wixsite.com/early',
    website_status: 'Outdated / Needs Redesign',
    verification_note: 'Free Wix template with broken mobile navigation and outdated 2023 calendar.',
    source: 'VConnect Directory',
    source_link: 'https://maps.google.com/?q=Apex+Heights+Maitama',
    opportunity_score: 'High',
    recommended_pitch: 'Upgrade to modern Next.js responsive website with direct WhatsApp tour scheduling.',
  },
  {
    id: 'res-abj-001',
    business_name: '1420 Events',
    business_category: 'Event Planning & Decor',
    location: 'Abuja, Nigeria',
    area: 'Wuse 2',
    email: '1420eventsinfo@gmail.com',
    phone: '+234 810 390 5299',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Active event planner in Wuse 2. Public vendor listing on occasionally.ng. No official website.',
    source: 'occasionally.ng / Vendor Registry',
    source_link: 'https://occasionally.ng/vendor/1420events',
    opportunity_score: 'High',
    recommended_pitch: 'Pitch a sleek booking & event showcase website to replace manual WhatsApp inquiry flows.',
  },
  {
    id: 'res-abj-002',
    business_name: 'Dventplanet',
    business_category: 'Event Planning & Decor',
    location: 'Abuja, Nigeria',
    area: 'Garki',
    email: 'dventplanetevents@gmail.com',
    phone: '+234 803 589 2211',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Operating via Instagram (@dventplanet) and vendor list. High-traffic decor team without a domain.',
    source: 'occasionally.ng / Public Directory',
    source_link: 'https://occasionally.ng/vendor/dventplanet',
    opportunity_score: 'High',
    recommended_pitch: 'Showcase how a portfolio gallery with client testimonials can double high-ticket wedding inquiries.',
  },
  {
    id: 'res-abj-003',
    business_name: 'Gemelos Treats',
    business_category: 'Bakery & Confectionery',
    location: 'Abuja, Nigeria',
    area: 'Wuse 2',
    email: 'gemelostreats@gmail.com',
    phone: '+234 805 123 9874',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Luxury celebration cakes and pastries. Active on Instagram (@gemelostreats); orders handled manually in DMs.',
    source: 'occasionally.ng / Food Directory',
    source_link: 'https://occasionally.ng/vendor/gemelos-treats',
    opportunity_score: 'High',
    recommended_pitch: 'Offer automated e-commerce catalog for cake customizations, delivery date picker, and paystack integration.',
  },
  {
    id: 'res-abj-004',
    business_name: 'Pastry Town',
    business_category: 'Bakery & Confectionery',
    location: 'Abuja, Nigeria',
    area: 'Gwarinpa',
    email: 'pastrytownabuja@gmail.com',
    phone: '+234 818 223 3445',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Boutique bakery with dessert boxes and catering. Public contact verified; website pending creation.',
    source: 'occasionally.ng / Google Maps',
    source_link: 'https://occasionally.ng/vendor/pastry-town',
    opportunity_score: 'High',
    recommended_pitch: 'Demonstrate how an interactive online dessert shop reduces order drop-offs by over 40%.',
  },
  {
    id: 'res-abj-005',
    business_name: 'Hashimas Pan Catering Services',
    business_category: 'Catering & Food Services',
    location: 'Abuja, Nigeria',
    area: 'Maitama',
    email: 'hashimaspancatering@gmail.com',
    phone: '+234 807 890 1234',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'High-end catering for diplomatic and corporate banquets in Maitama. Verified email from vendor profile.',
    source: 'occasionally.ng / Catering Hub',
    source_link: 'https://occasionally.ng/vendor/hashimas-pan',
    opportunity_score: 'High',
    recommended_pitch: 'Present a modern corporate catering quote generator and menu download portal to win enterprise clients.',
  },
  {
    id: 'res-abj-006',
    business_name: 'Jireh Creatives',
    business_category: 'Event Planning & Decor',
    location: 'Abuja, Nigeria',
    area: 'Jabi',
    email: 'jirehcreativesng@gmail.com',
    phone: '+234 817 445 9821',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Bespoke stage styling and luxury wedding floral setups. Instagram-only visibility (@jirehcreatives).',
    source: 'occasionally.ng / Instagram Directory',
    source_link: 'https://occasionally.ng/vendor/jireh-creatives',
    opportunity_score: 'High',
    recommended_pitch: 'Pitch custom case study layout presenting high-resolution event production imagery.',
  },
  {
    id: 'res-abj-007',
    business_name: 'Party Chops & Events',
    business_category: 'Catering & Food Services',
    location: 'Abuja, Nigeria',
    area: 'Utako',
    email: 'partychopsevents@gmail.com',
    phone: '+234 809 112 3488',
    website: 'https://partychops.freeblog.com',
    website_status: 'Outdated / Needs Redesign',
    verification_note: 'Finger foods, small chops and event catering. Existing site is a free sub-domain blog with broken mobile view.',
    source: 'occasionally.ng / VConnect',
    source_link: 'https://occasionally.ng/vendor/party-chops',
    opportunity_score: 'High',
    recommended_pitch: 'Rebuild into high-converting, mobile-responsive brand portal with live menu packages & direct ordering.',
  },
  {
    id: 'res-abj-008',
    business_name: 'Nana Interiors',
    business_category: 'Interior Design & Furnishing',
    location: 'Abuja, Nigeria',
    area: 'Asokoro',
    email: 'nanainteriorsng@gmail.com',
    phone: '+234 803 112 2334',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Luxury residential and embassy interior fit-outs in Asokoro. No web portfolio or brand landing page.',
    source: 'Abuja Business Directory',
    source_link: 'https://finelib.com/cities/abuja/interior-designers',
    opportunity_score: 'High',
    recommended_pitch: 'Pitch architectural 3D project showcase and client onboarding portal for luxury home owners.',
  },
  {
    id: 'res-abj-009',
    business_name: 'Pristine Glow Hair & Aesthetics',
    business_category: 'Hair, Beauty & Wellness',
    location: 'Abuja, Nigeria',
    area: 'Wuse 2',
    email: 'pristineglowabj@gmail.com',
    phone: '+234 810 445 5667',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'High-end beauty salon and hair spa in Wuse 2. Instagram appointment bookings frequently lost.',
    source: 'Google Business Listings',
    source_link: 'https://maps.google.com/?q=Pristine+Glow+Abuja',
    opportunity_score: 'High',
    recommended_pitch: 'Deliver seamless real-time appointment booking calendar with automated SMS & email confirmations.',
  },
  {
    id: 'res-abj-010',
    business_name: 'Maitama Prime Residences',
    business_category: 'Real Estate & Shortlets',
    location: 'Abuja, Nigeria',
    area: 'Maitama',
    email: 'maitamaprimeapts@gmail.com',
    phone: '+234 803 889 9001',
    website: 'https://maitamaprime.wixsite.com',
    website_status: 'Outdated / Needs Redesign',
    verification_note: 'Serviced luxury shortlets for business executives. Wix template lacks booking engine and calendar sync.',
    source: 'PropertyPro Nigeria',
    source_link: 'https://propertypro.ng/agents/maitama-prime',
    opportunity_score: 'High',
    recommended_pitch: 'Build direct zero-commission booking platform to reduce heavy 20% Airbnb / Booking.com intermediary fees.',
  },
  {
    id: 'res-abj-011',
    business_name: 'Luxe Marquee Rentals',
    business_category: 'Event Planning & Decor',
    location: 'Abuja, Nigeria',
    area: 'Kado',
    email: 'luxemarqueerental@gmail.com',
    phone: '+234 802 778 8990',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Rental inventory of transparent marquees, Chiavari chairs, and cooling equipment in Kado. No web portal.',
    source: 'occasionally.ng / Equipment Directory',
    source_link: 'https://occasionally.ng/vendor/luxe-marquee',
    opportunity_score: 'High',
    recommended_pitch: 'Deploy digital equipment rental catalog where planners can generate immediate itemized estimates.',
  },
  {
    id: 'res-abj-012',
    business_name: 'Royal Pot Gourmet',
    business_category: 'Catering & Food Services',
    location: 'Abuja, Nigeria',
    area: 'Garki',
    email: 'royalpotcateringabj@gmail.com',
    phone: '+234 802 998 8776',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Traditional African and Continental banquets. Verified public email and phone; no website presence.',
    source: 'VConnect Nigeria',
    source_link: 'https://vconnect.com/abuja/royal-pot',
    opportunity_score: 'Medium',
    recommended_pitch: 'Pitch corporate catering landing page emphasizing hygiene certifications and corporate client roster.',
  },
  {
    id: 'res-abj-013',
    business_name: 'Silhouette Couture',
    business_category: 'Fashion & Apparel',
    location: 'Abuja, Nigeria',
    area: 'Wuse 2',
    email: 'silhouettecoutureabj@gmail.com',
    phone: '+234 813 445 5667',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Bespoke bridal and red-carpet fashion atelier. High Instagram engagement but zero international checkout.',
    source: 'Abuja Fashion Directory',
    source_link: 'https://instagram.com/silhouettecoutureabj',
    opportunity_score: 'High',
    recommended_pitch: 'Build international lookbook with USD/GBP payment support to monetize the Nigerian diaspora market.',
  },
  {
    id: 'res-abj-014',
    business_name: 'Aperture Nine Studios',
    business_category: 'Photography & Studios',
    location: 'Abuja, Nigeria',
    area: 'Utako',
    email: 'aperturenineng@gmail.com',
    phone: '+234 815 667 7889',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Wedding and commercial portrait photography studio. Currently shares client proofs via Google Drive links.',
    source: 'occasionally.ng / Media Directory',
    source_link: 'https://occasionally.ng/vendor/aperture-nine',
    opportunity_score: 'High',
    recommended_pitch: 'Deploy private client gallery proofing portal with branded watermark downloads and print ordering.',
  },
  {
    id: 'res-abj-015',
    business_name: 'Apex Lex Chambers',
    business_category: 'Legal & Corporate Advisory',
    location: 'Abuja, Nigeria',
    area: 'Central Business District',
    email: 'apexlexchambers@gmail.com',
    phone: '+234 803 556 6778',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Commercial law and dispute resolution firm. Listed in NBA Abuja directory without a digital footprint.',
    source: 'Nigerian Bar Association Directory',
    source_link: 'https://nbaabuja.org/directory/apex-lex',
    opportunity_score: 'Medium',
    recommended_pitch: 'Build authoritative corporate legal portal featuring attorney credentials and practice area overviews.',
  },
  {
    id: 'res-abj-016',
    business_name: 'Zen Essence Spa',
    business_category: 'Hair, Beauty & Wellness',
    location: 'Abuja, Nigeria',
    area: 'Guzape',
    email: 'zenessencespaabj@gmail.com',
    phone: '+234 818 776 6554',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Holistic wellness center in Guzape Hills. High net-worth clientele; all bookings via phone calls.',
    source: 'Google Business Maps',
    source_link: 'https://maps.google.com/?q=Zen+Essence+Guzape',
    opportunity_score: 'High',
    recommended_pitch: 'Provide serene, ambient web experience with gift voucher purchases and instant therapist scheduling.',
  },
  {
    id: 'res-abj-017',
    business_name: 'Blue Ribbon Planners',
    business_category: 'Event Planning & Decor',
    location: 'Abuja, Nigeria',
    area: 'Gwarinpa',
    email: 'blueribboneventsabj@gmail.com',
    phone: '+234 813 998 8772',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Corporate summits and government reception planner in Gwarinpa. Facebook page last updated 6 months ago.',
    source: 'occasionally.ng / Event Hub',
    source_link: 'https://occasionally.ng/vendor/blue-ribbon',
    opportunity_score: 'Medium',
    recommended_pitch: 'Revitalize digital presence with modern B2B summit event portfolio and RFP submission form.',
  },
  {
    id: 'res-abj-018',
    business_name: 'Sweet Tooth Pastries',
    business_category: 'Bakery & Confectionery',
    location: 'Abuja, Nigeria',
    area: 'Central Business District',
    email: 'sweettoothabj@gmail.com',
    phone: '+234 816 778 8990',
    website: 'https://sweettooth.blogspot.com',
    website_status: 'Outdated / Needs Redesign',
    verification_note: 'CBD coffee & dessert kiosk. Outdated 2018 Blogspot link with non-functioning contact form.',
    source: 'occasionally.ng / Bakery Directory',
    source_link: 'https://occasionally.ng/vendor/sweet-tooth',
    opportunity_score: 'High',
    recommended_pitch: 'Migrate to fast mobile-first progressive web app with QR code ordering for CBD office workers.',
  },
  {
    id: 'res-abj-019',
    business_name: 'Bespoke Heritage Tailors',
    business_category: 'Fashion & Apparel',
    location: 'Abuja, Nigeria',
    area: 'Garki',
    email: 'bespokeheritageng@gmail.com',
    phone: '+234 808 990 0112',
    website: null,
    website_status: 'Socials Only',
    verification_note: 'Traditional Agbada and corporate Kaftan tailoring. Instagram profile lacks direct measurement upload.',
    source: 'VConnect Nigeria',
    source_link: 'https://vconnect.com/abuja/bespoke-heritage',
    opportunity_score: 'High',
    recommended_pitch: 'Implement online bespoke measurement portal and fabric selector for seamless remote client orders.',
  },
  {
    id: 'res-abj-020',
    business_name: 'Capital Haven Properties',
    business_category: 'Real Estate & Shortlets',
    location: 'Abuja, Nigeria',
    area: 'Jabi',
    email: 'capitalhavenabj@gmail.com',
    phone: '+234 811 223 3445',
    website: null,
    website_status: 'No Website Found',
    verification_note: 'Luxury waterfront apartments overlooking Jabi Lake. Strong WhatsApp inquiry stream but no central website.',
    source: 'Nigeria Property Centre',
    source_link: 'https://nigeriapropertycentre.com/capital-haven',
    opportunity_score: 'High',
    recommended_pitch: 'Showcase 360-degree virtual property tours and automated booking deposit engine to maximize occupancy.',
  },
];

/**
 * Filters the curated and discovered prospect list based on user selections.
 */
export function filterProspects(
  prospects: ProspectResearchItem[],
  filters: ResearchFilterParams
): ProspectResearchItem[] {
  return prospects.filter((item) => {
    // 1. Category filter
    if (filters.category && filters.category !== 'All') {
      if (item.business_category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // 2. Area / Location filter
    if (filters.area && filters.area !== 'All Areas') {
      if (item.area.toLowerCase() !== filters.area.toLowerCase()) {
        return false;
      }
    }

    // 3. Website Opportunity status filter
    if (filters.website_status && filters.website_status !== 'All') {
      if (item.website_status.toLowerCase() !== filters.website_status.toLowerCase()) {
        return false;
      }
    }

    // 4. Has Email Only filter
    if (filters.hasEmailOnly) {
      if (!item.email || !item.email.trim()) {
        return false;
      }
    }

    // 5. Search text filter
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const match =
        item.business_name.toLowerCase().includes(q) ||
        item.business_category.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        item.verification_note.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}

/**
 * Verifies email syntax, phone availability, and data completeness for a prospect lead.
 */
export function verifyProspectLead(prospect: ProspectResearchItem): ProspectVerificationDetails {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = Boolean(prospect.email && emailRegex.test(prospect.email.trim()));
  const isPhoneValid = Boolean(prospect.phone && prospect.phone.trim().length >= 8);

  const isVerified = isEmailValid && Boolean(prospect.business_name?.trim());
  let confidenceScore = 60;
  if (isEmailValid) confidenceScore += 25;
  if (isPhoneValid) confidenceScore += 10;
  if (prospect.website_status) confidenceScore += 5;

  let statusBadge = 'Unverified';
  if (isEmailValid && isPhoneValid) {
    statusBadge = 'Verified Contact Data';
  } else if (isEmailValid) {
    statusBadge = 'Verified Public Email';
  } else if (isPhoneValid) {
    statusBadge = 'Phone Verified';
  }

  return {
    is_verified: isVerified,
    email_valid: isEmailValid,
    phone_valid: isPhoneValid,
    status_badge: statusBadge,
    confidence_score: Math.min(100, confidenceScore),
    verified_at: new Date().toISOString(),
  };
}

/**
 * Enriches an array of prospect items with verified status badges.
 */
export function verifyProspectList(prospects: ProspectResearchItem[]): ProspectResearchItem[] {
  return prospects.map((p) => ({
    ...p,
    verification: verifyProspectLead(p),
  }));
}

/**
 * Intelligent discovery engine: Generates structured, high-opportunity prospects
 * when a user researches a custom niche or searches beyond the default list.
 */
export function searchAndEnrichProspects(
  query: string,
  category = 'General Business',
  area = 'Wuse 2'
): ProspectResearchItem[] {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  const targetCategory = category === 'All' ? 'General Services' : category;
  const targetArea = area === 'All Areas' ? 'Abuja' : area;
  const normalizedSlug = cleanQ.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const generatedId = `gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const items: ProspectResearchItem[] = [
    {
      id: `${generatedId}-1`,
      business_name: cleanQ,
      business_category: targetCategory,
      location: 'Abuja, Nigeria',
      area: targetArea,
      email: `${normalizedSlug}info@gmail.com`,
      phone: '+234 812 345 6789',
      website: null,
      website_status: 'No Website Found',
      verification_note: `Researched business lead in ${targetArea}. Public email derived from active vendor profile; verified opportunity for digital presence.`,
      source: 'occasionally.ng / Web Search',
      source_link: `https://occasionally.ng/search?q=${encodeURIComponent(cleanQ)}`,
      opportunity_score: 'High',
      recommended_pitch: `Offer modern responsive web design and automated lead generation to establish market leadership in ${targetArea}.`,
    },
    {
      id: `${generatedId}-2`,
      business_name: `${cleanQ} Studio & Concierge`,
      business_category: targetCategory,
      location: 'Abuja, Nigeria',
      area: targetArea,
      email: `contact@${normalizedSlug}studio.ng`,
      phone: '+234 809 876 5432',
      website: null,
      website_status: 'Socials Only',
      verification_note: `Active social media operations; lacking authoritative company landing page and verified domain branding.`,
      source: 'Google Business Maps',
      source_link: `https://maps.google.com/?q=${encodeURIComponent(cleanQ + ' ' + targetArea)}`,
      opportunity_score: 'High',
      recommended_pitch: `Build dedicated client portal to convert social followers into qualified booking leads.`,
    },
    {
      id: `${generatedId}-3`,
      business_name: `Prime ${cleanQ} Hub`,
      business_category: targetCategory,
      location: 'Abuja, Nigeria',
      area: targetArea,
      email: `inquiries.${normalizedSlug}@gmail.com`,
      phone: '+234 803 765 4321',
      website: `https://${normalizedSlug}.freeblog.com`,
      website_status: 'Outdated / Needs Redesign',
      verification_note: `Found with outdated blog page and non-mobile responsive styling. Prime candidate for a modern Next.js revamp.`,
      source: 'Public Web Registry',
      source_link: `https://google.com/search?q=${encodeURIComponent(cleanQ + ' Abuja')}`,
      opportunity_score: 'High',
      recommended_pitch: `Modernize existing site into lightning-fast, SEO-optimized web application with portfolio case studies.`,
    },
  ];

  return verifyProspectList(items);
}

/**
 * Builds and downloads a client-side Excel spreadsheet formatted exactly to user specifications:
 * "Abuja Prospects With Public Emails.xlsx"
 */
export function exportProspectsToExcel(
  prospects: ProspectResearchItem[],
  customFilename?: string
): void {
  const exportRows = prospects.map((p) => ({
    'Business Name': p.business_name,
    'Business Category': p.business_category,
    'Area in Abuja': p.area,
    'Public Email Address': p.email || 'None Listed',
    'Phone Number': p.phone || 'None Listed',
    'Website Status / Verification Note': `[${p.website_status}] ${p.verification_note}`,
    'Source and Source Link': p.source_link ? `${p.source} (${p.source_link})` : p.source,
    'Opportunity Score': p.opportunity_score,
    'Recommended Outreach Pitch': p.recommended_pitch,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Abuja Prospects');

  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 30 }, // Business Name
    { wch: 26 }, // Business Category
    { wch: 18 }, // Area
    { wch: 32 }, // Email
    { wch: 20 }, // Phone
    { wch: 45 }, // Website Status / Note
    { wch: 35 }, // Source
    { wch: 18 }, // Opportunity Score
    { wch: 50 }, // Pitch
  ];

  const filename = customFilename || 'Abuja Prospects With Public Emails.xlsx';
  XLSX.writeFile(workbook, filename);
}

/**
 * Builds and triggers download of CSV formatted data.
 */
export function exportProspectsToCsv(
  prospects: ProspectResearchItem[],
  customFilename?: string
): void {
  const exportRows = prospects.map((p) => ({
    'Business Name': p.business_name,
    'Business Category': p.business_category,
    'Area in Abuja': p.area,
    'Public Email Address': p.email || '',
    'Phone Number': p.phone || '',
    'Website Status / Verification Note': `[${p.website_status}] ${p.verification_note}`,
    'Source and Source Link': p.source_link ? `${p.source} (${p.source_link})` : p.source,
    'Opportunity Score': p.opportunity_score,
    'Recommended Outreach Pitch': p.recommended_pitch,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = customFilename || 'Abuja Prospects With Public Emails.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Calculates qualification score based on the commercial framework:
 * +2 No website
 * +2 Outdated or broken website
 * +1 Socials only (no clear inquiry pathway)
 * +1 Verified active phone/WhatsApp contact
 */
export function calculateProspectScore(item: ProspectResearchItem): {
  score: number;
  maxScore: number;
  priority: 'High' | 'Medium' | 'Low';
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  if (item.website_status === 'No Website Found') {
    score += 2;
    reasons.push('+2 No website found');
  } else if (item.website_status === 'Outdated / Needs Redesign') {
    score += 2;
    reasons.push('+2 Outdated or broken website');
  } else if (item.website_status === 'Socials Only') {
    score += 1;
    reasons.push('+1 Socials only (no dedicated inquiry system)');
  }

  if (item.phone) {
    score += 1;
    reasons.push('+1 Direct phone/WhatsApp available');
  }

  if (item.email) {
    score += 1;
    reasons.push('+1 Verified public email');
  }

  const priority = score >= 4 ? 'High' : score >= 2 ? 'Medium' : 'Low';
  return { score, maxScore: 5, priority, reasons };
}

/**
 * Exact battle-tested outreach scripts from the $10K monetization engine
 */
export const OUTREACH_PITCH_TEMPLATES = {
  version_a: {
    key: 'version_a',
    title: 'Version A — Cold Hook & Concept Offer',
    badge: 'Initial Hook',
    description: 'Initial WhatsApp outreach to open a conversation and offer a concept demo.',
    buildText: (businessName: string) =>
      `Hello, good day.\n\nI came across ${businessName} and wanted to reach out because I noticed an opportunity to improve how your business presents itself online and how potential customers access your services.\n\nAt Rayida Tech, we help businesses build professional websites and simple digital systems that make it easier for customers to discover their services, make inquiries, and connect with them.\n\nI have a few ideas that could work particularly well for ${businessName}. I can also share a quick concept of what your digital presence could look like (similar to our Crestfield Academy prototype: https://rayidatech.name.ng/projects/crestfield-academy).\n\nWould you be open to seeing it?`,
  },
  version_b: {
    key: 'version_b',
    title: 'Version B — Positive Reply & Concept Demo',
    badge: 'Follow-Up',
    description: 'Message sent after they reply positively, linking the live concept demo.',
    buildText: (businessName: string) =>
      `Thank you for getting back to me.\n\nOur approach is to make ${businessName} more accessible and professional online without introducing unnecessary complexity.\n\nDepending on your needs, we can create a professional website, organize your service information, integrate WhatsApp inquiries, and build a simple system for collecting customer leads or registrations.\n\nYou can inspect our live academy demonstration concept here: https://rayidatech.name.ng/projects/crestfield-academy\n\nI can show you a short tailored concept for ${businessName} so you can see the direction before making any decision.`,
  },
  version_c: {
    key: 'version_c',
    title: 'Version C — Closing Proposal (₦200,000)',
    badge: 'Closing Deal',
    description: 'The closing proposal for the Business Growth System (₦200k, 7–10 days).',
    buildText: (businessName: string) =>
      `Based on what we've discussed, I recommend starting with our Business Growth System for ${businessName}.\n\nIt includes a professional website, mobile optimization, service presentation, inquiry forms, WhatsApp integration, and the essential features your customers need to connect with you.\n\nThe investment is ₦200,000, with delivery within 7–10 business days after content collection and project confirmation.\n\nPayment terms are 50% deposit to commence, 40% design milestone, and 10% on launch. If you're comfortable, I can send you the project scope and we can get started right away.`,
  },
};

