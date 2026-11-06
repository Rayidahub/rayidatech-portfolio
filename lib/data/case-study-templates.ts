// lib/data/case-study-templates.ts
// Category-tailored case study configurations for Admin forms and Public details rendering

import { SERVICE_CATEGORIES, type ServiceCategory } from './services';

export interface CaseStudySectionMeta {
  title: string;
  badge: string;
  stepNumber: string;
  subtitle: string;
}

export interface CategoryCaseStudyConfig {
  category: ServiceCategory;
  displayName: string;
  iconName: 'Palette' | 'Package' | 'Sparkles' | 'PenTool' | 'Globe' | 'GraduationCap' | 'Share2';
  themeColor: 'primary' | 'secondary' | 'emerald' | 'amber';
  tagline: string;
  description: string;

  // Form Fields Customization
  fields: {
    overview: {
      sectionTitle: string;
      clientLabel: string;
      clientPlaceholder: string;
      objectiveLabel: string;
      objectivePlaceholder: string;
      targetAudienceLabel: string;
      targetAudiencePlaceholder: string;
      overviewImageLabel: string;
      overviewImageDesc: string;
    };
    problem: {
      sectionTitle: string;
      problemLabel: string;
      problemPlaceholder: string;
      userGoalsLabel: string;
      userGoalsPlaceholder: string;
      businessGoalsLabel: string;
      businessGoalsPlaceholder: string;
      problemImageLabel: string;
      problemImageDesc: string;
    };
    research: {
      sectionTitle: string;
      researchLabel: string;
      researchPlaceholder: string;
      researchImageLabel: string;
      researchImageDesc: string;
    };
    process: {
      sectionTitle: string;
      processLabel: string;
      processPlaceholder: string;
      processImageLabel: string;
      processImageDesc: string;
    };
    designSystem: {
      sectionTitle: string;
      systemLabel: string;
      systemPlaceholder: string;
      systemImageLabel: string;
      systemImageDesc: string;
    };
    solution: {
      sectionTitle: string;
      solutionLabel: string;
      solutionPlaceholder: string;
      mobileImageLabel: string;
      mobileImageDesc: string;
      desktopImageLabel: string;
      desktopImageDesc: string;
    };
    features: {
      sectionTitle: string;
      featuresLabel: string;
      featuresPlaceholder: string;
      featuresImageLabel: string;
      featuresImageDesc: string;
    };
    results: {
      sectionTitle: string;
      resultsLabel: string;
      resultsPlaceholder: string;
      resultsImageLabel: string;
      resultsImageDesc: string;
    };
    reflection: {
      sectionTitle: string;
      reflectionLabel: string;
      reflectionPlaceholder: string;
      reflectionImageLabel: string;
      reflectionImageDesc: string;
    };
  };

  // Public View Labels & Captions
  publicView: {
    sections: {
      overview: CaseStudySectionMeta;
      problem: CaseStudySectionMeta;
      research: CaseStudySectionMeta;
      process?: CaseStudySectionMeta;
      designSystem: CaseStudySectionMeta;
      features: CaseStudySectionMeta;
      solution: CaseStudySectionMeta;
      results: CaseStudySectionMeta;
      reflection: CaseStudySectionMeta;
    };
    mockupLabels: {
      slot1: { title: string; subtitle: string; icon: 'smartphone' | 'palette' | 'book' | 'layers' };
      slot2: { title: string; subtitle: string; icon: 'laptop' | 'monitor' | 'image' | 'award' | 'palette' };
    };
    resultsLabels: {
      leftCardTitle: string;
      leftCardSubtitle: string;
      rightCardTitle: string;
      rightCardSubtitle: string;
    };
  };
}

export const CATEGORY_CASE_STUDY_CONFIGS: Record<ServiceCategory, CategoryCaseStudyConfig> = {
  'UI/UX Design': {
    category: 'UI/UX Design',
    displayName: 'UI/UX Design',
    iconName: 'Palette',
    themeColor: 'primary',
    tagline: 'Interfaces Users Actually Love',
    description: 'Human-centered interfaces, user journey flows, interactive wireframes, and conversion-focused design systems.',
    fields: {
      overview: {
        sectionTitle: 'Project Overview & Target Audience',
        clientLabel: 'Client / Product Name',
        clientPlaceholder: 'e.g. PayFlex Fintech, HealthTrack Mobile',
        objectiveLabel: 'Product Objective',
        objectivePlaceholder: 'What core user need or product opportunity was this digital interface designed to address?',
        targetAudienceLabel: 'Target Audience & Personas (Use **Persona Name**: description format)',
        targetAudiencePlaceholder: '👨‍💼 **Busy Professionals**: Need rapid 1-click payments\n🛍️ **First-time Shoppers**: Need clear onboarding without cognitive overload',
        overviewImageLabel: 'Interface Hero Overview Image',
        overviewImageDesc: 'Upload a high-fidelity hero banner or product UI showcase',
      },
      problem: {
        sectionTitle: 'The Problem & Strategic Goals',
        problemLabel: 'User Pain Points & Usability Friction (one per line)',
        problemPlaceholder: '• 64% drop-off rate during multi-step checkout\n• Cluttered navigation menu confusing first-time users\n• Lack of visual payment status feedback',
        userGoalsLabel: 'User Goals (What users need to accomplish)',
        userGoalsPlaceholder: '• Complete money transfer in under 30 seconds\n• Transparent transaction fee breakdown\n• Instant push notification receipts',
        businessGoalsLabel: 'Business Goals (Platform KPIs)',
        businessGoalsPlaceholder: '• Boost month-over-month checkout conversions by 35%\n• Cut customer onboarding support tickets in half\n• Elevate brand trust with bank-grade security badges',
        problemImageLabel: 'Usability Audit & Friction Points Image',
        problemImageDesc: 'Upload user friction map, drop-off heatmaps, or previous UI audit',
      },
      research: {
        sectionTitle: 'Research Insights & Strategy',
        researchLabel: 'Research Insights & Findings (one per line for cards)',
        researchPlaceholder: 'Insight 1: 78% of active users perform all tasks on mobile phones in transit\nInsight 2: Biometric authentication increased login frequency by 40%\nInsight 3: Users trust transparent progress steppers over single long forms',
        researchImageLabel: 'Research & User Affinity Map Image',
        researchImageDesc: 'Upload interview affinity board, survey synthesis, or competitive benchmark',
      },
      process: {
        sectionTitle: 'UX Architecture & Design Process',
        processLabel: 'User Journey Flow (Use step → step format) & Wireframing Process',
        processPlaceholder: 'App Launch → Biometric Auth → Smart Dashboard → Instant Transfer → Success Receipt\n\n### Wireframes\n• Low-fidelity pencil sketches explored 4 layout alternatives\n• Clickable wireframe prototypes tested with 12 target users\n\n### Iterations\n• Simplified 5-step checkout into a 2-step modular sheet\n• Added contextual haptic feedback for confirmed transactions',
        processImageLabel: 'Wireframes & User Flow Architecture Image',
        processImageDesc: 'Upload low-fi wireframe boards, user journey flows, or prototyping iterations',
      },
      designSystem: {
        sectionTitle: 'Design System & Component Architecture',
        systemLabel: 'Color Tokens, Typography & Component Tokens',
        systemPlaceholder: 'Primary: #8000ff\nSecondary: #00d1ff\nAccent: #ccccff\nBackground: #1a1a2e\n\nHeading: Poppins Bold\nBody: Inter Regular\n\nComponents:\n• Accessible Button States (Default, Hover, Active, Disabled)\n• Glass Card Surface Tokens with backdrop blur\n• Custom Segmented Form Controls and Form Feedback Badges',
        systemImageLabel: 'Design System & Component Library Image',
        systemImageDesc: 'Upload design system specimen, UI kit tokens, or component matrix',
      },
      solution: {
        sectionTitle: 'Final Solution & Deliverables',
        solutionLabel: 'Final Solution Overview',
        solutionPlaceholder: 'Describe the finalized high-fidelity interface, micro-interactions, responsive adaptability, and core delight moments.',
        mobileImageLabel: 'Final Mobile Experience Mockup URL',
        mobileImageDesc: 'Upload high-res mobile app screens, responsive phone frames, or carousel flows',
        desktopImageLabel: 'Final Desktop / Tablet Screen Mockup URL',
        desktopImageDesc: 'Upload tablet or desktop web dashboard mockups',
      },
      features: {
        sectionTitle: 'Key UI/UX Features',
        featuresLabel: 'Key Features (Title on one line, Description on next)',
        featuresPlaceholder: 'Biometric Fast Login\nInstant face recognition and fingerprint authentication under 200ms.\n\nSmart Transaction Feed\nIntelligent auto-categorization of personal spending with live analytics.\n\nOne-Tap Virtual Card\nGenerate disposable single-use virtual Mastercard for safe online payments.',
        featuresImageLabel: 'Key Features Showcase Mockup URL',
        featuresImageDesc: 'Upload detailed feature zoom, interactive component breakdown, or UI highlights',
      },
      results: {
        sectionTitle: 'Results, Usability Metrics & UX Outcomes',
        resultsLabel: 'Product Achievements & Outcomes (one per line)',
        resultsPlaceholder: 'Achievements:\n• 42% increase in completed transactions within 30 days\n• 4.8 / 5.0 App Store rating across 1,200+ user reviews\n• Onboarding time dropped from 4 minutes to 85 seconds\n\nOutcomes:\n• Zero reported critical usability issues in post-launch audit\n• 91% user satisfaction rating in follow-up usability surveys',
        resultsImageLabel: 'Results & Post-Launch Validation Image',
        resultsImageDesc: 'Upload analytics dashboards, App Store review snippets, or conversion charts',
      },
      reflection: {
        sectionTitle: 'Reflection & Future Roadmap',
        reflectionLabel: 'Learnings, Retrospective & Next Steps',
        reflectionPlaceholder: 'Reflect on design tradeoffs made, accessibility considerations, and future feature roadmap...',
        reflectionImageLabel: 'Reflection & Roadmap Visual',
        reflectionImageDesc: 'Upload product roadmap diagram or team retrospective visual',
      },
    },
    publicView: {
      sections: {
        overview: {
          stepNumber: '01 / Context & Audience',
          title: 'Project Overview & Target Audience',
          badge: 'Human-Centered UX',
          subtitle: 'Context, user archetypes, and project foundations',
        },
        problem: {
          stepNumber: '02 / Problem Discovery',
          title: 'The Challenge & Strategic Goals',
          badge: 'Pain Points & Friction',
          subtitle: 'Friction points identified and alignment between user and business objectives',
        },
        research: {
          stepNumber: '03 / Strategy & Flow',
          title: 'Research Insights & User Journey',
          badge: 'Strategy & Wireframes',
          subtitle: 'Synthesis of user behavioral data, flow architectures, and rapid iterations',
        },
        designSystem: {
          stepNumber: '04 / Visual Architecture',
          title: 'Design System & Component Kit',
          badge: 'UI Tokens & Typography',
          subtitle: 'Scalable color tokens, typographical hierarchy, and reusable component libraries',
        },
        features: {
          stepNumber: '05 / Interactive Capabilities',
          title: 'Key UI Features & Micro-Interactions',
          badge: 'Core Features',
          subtitle: 'Signature product capabilities designed for maximum user delight and speed',
        },
        solution: {
          stepNumber: '06 / Final Deliverable',
          title: 'Final Solution & Screen Showcase',
          badge: 'High-Fidelity Screens',
          subtitle: 'The fully realized product experience across mobile and responsive desktop form factors',
        },
        results: {
          stepNumber: '07 / Impact & Metrics',
          title: 'Results & Usability Outcomes',
          badge: 'Quantified Impact',
          subtitle: 'Measurable conversion metrics, usability survey scores, and business outcomes',
        },
        reflection: {
          stepNumber: '08 / Retrospective',
          title: 'Reflection & Future Roadmap',
          badge: 'Next Evolution',
          subtitle: 'Key technical tradeoffs, user feedback learnings, and feature roadmap',
        },
      },
      mockupLabels: {
        slot1: { title: 'Mobile Experience', subtitle: 'Native Mobile UI & Flow', icon: 'smartphone' },
        slot2: { title: 'Desktop / Tablet Experience', subtitle: 'Large Screen Adaptations & Layout', icon: 'laptop' },
      },
      resultsLabels: {
        leftCardTitle: 'Product Achievements',
        leftCardSubtitle: 'Design Impact & KPIs',
        rightCardTitle: 'User Experience Outcomes',
        rightCardSubtitle: 'Usability Validation',
      },
    },
  },

  'Product Design': {
    category: 'Product Design',
    displayName: 'Product Design',
    iconName: 'Package',
    themeColor: 'primary',
    tagline: 'Products Built With Purpose & Scale',
    description: 'End-to-end digital product design, MVP roadmaps, user journeys, interaction architectures, and scalable token systems.',
    fields: {
      overview: {
        sectionTitle: 'Product Overview & Market Opportunity',
        clientLabel: 'Client / Product Platform',
        clientPlaceholder: 'e.g. Apex Enterprise ERP, UrbanLogistics Hub',
        objectiveLabel: 'Strategic Product Vision',
        objectivePlaceholder: 'What market gap does this product bridge, and what scalable value proposition does it deliver?',
        targetAudienceLabel: 'User Segments & Personas (Use **Persona**: description)',
        targetAudiencePlaceholder: '🏭 **Operations Directors**: Require real-time telemetry across warehouse nodes\n🚚 **Fleet Drivers**: Need fast zero-distraction route dispatching',
        overviewImageLabel: 'Product Platform Hero Showcase',
        overviewImageDesc: 'Upload a hero shot of the product ecosystem or key dashboards',
      },
      problem: {
        sectionTitle: 'Operational Bottlenecks & Product KPIs',
        problemLabel: 'Operational Pain Points & Workflow Inefficiencies (one per line)',
        problemPlaceholder: '• Fragmented data silos across legacy desktop software\n• Manual spreadsheet entry causing 18% inventory mismatch\n• Steep learning curve for non-technical warehouse workers',
        userGoalsLabel: 'Operator Goals (Efficiency & Ergonomics)',
        userGoalsPlaceholder: '• Complete dispatch workflows with 3 taps or fewer\n• Clear visual warnings before stock anomalies occur\n• Offline mode for low-connectivity loading bays',
        businessGoalsLabel: 'Commercial & Operational Objectives',
        businessGoalsPlaceholder: '• Reduce shipment turnaround time by 30 minutes per dispatch\n• Scale smoothly from 5 to 50 regional distribution hubs\n• Eliminate 90% of manual paper manifests',
        problemImageLabel: 'Legacy Architecture / Bottleneck Map Image',
        problemImageDesc: 'Upload workflow bottleneck diagram or previous operational audit',
      },
      research: {
        sectionTitle: 'Market Discovery & User Research',
        researchLabel: 'Strategic Insights & User Research Findings (one per line)',
        researchPlaceholder: 'Insight 1: Operators prioritize keyboard shortcuts and rapid bulk actions over decorative visuals\nInsight 2: High ambient warehouse glare requires high-contrast UI tokens\nInsight 3: Shift handoffs suffer from missing status context',
        researchImageLabel: 'Competitive Analysis & Research Synthesis Image',
        researchImageDesc: 'Upload market landscape matrix or field observation synthesis',
      },
      process: {
        sectionTitle: 'Product Architecture & Interaction Blueprint',
        processLabel: 'System Journey & Technical Wireframing',
        processPlaceholder: 'Order Ingestion → Automated Routing → Driver Assignment → Live Telemetry → Verified Delivery\n\n### Wireframes\n• Architected a unified multi-pane dashboard layout for complex inventory streams\n• Tested low-friction barcode scanning workflows in real-world lighting\n\n### Iterations\n• Replaced deep nested modals with an ambient split-screen inspector\n• Added audible feedback and haptics for critical inventory alerts',
        processImageLabel: 'Information Architecture & System Wireframes Image',
        processImageDesc: 'Upload system architecture blueprints, user journeys, or sprint iterations',
      },
      designSystem: {
        sectionTitle: 'Product Design System & Scalable Tokens',
        systemLabel: 'Color Tokens, Typography & Component Library',
        systemPlaceholder: 'Primary: #8000ff\nSecondary: #00d1ff\nAccent: #ccccff\nBackground: #1a1a2e\n\nHeading: Geist Bold\nBody: Inter Regular\n\nComponents:\n• Real-time Data Table with dynamic sorting and infinite scroll\n• Telemetry Status Badges (Normal, Warning, Critical Fault)\n• Modular Split-Inspector Panel for granular order details',
        systemImageLabel: 'Scalable Component Architecture Image',
        systemImageDesc: 'Upload component token library, data-grid specs, or UI architecture',
      },
      solution: {
        sectionTitle: 'Final Product Solution & Ecosystem',
        solutionLabel: 'Product Ecosystem Narrative',
        solutionPlaceholder: 'Summarize how the finalized product platform solves operational bottlenecks, unifies fragmented workflows, and drives user adoption.',
        mobileImageLabel: 'Mobile / Handheld Companion UI Mockup URL',
        mobileImageDesc: 'Upload handheld scanner or mobile companion UI screens',
        desktopImageLabel: 'Enterprise Web Platform / Control Deck Mockup URL',
        desktopImageDesc: 'Upload desktop control deck or primary dashboard screens',
      },
      features: {
        sectionTitle: 'Signature Product Capabilities',
        featuresLabel: 'Key Product Capabilities (Title on one line, Description on next)',
        featuresPlaceholder: 'Live Telemetry Engine\nReal-time GPS and container temperature tracking with sub-second latency.\n\nAutomated Manifest Generator\nInstantly compiles and exports regulatory freight documentation with 1 click.\n\nMulti-Tenant Access Control\nGranular role-based permissions tailored for operators, managers, and external auditors.',
        featuresImageLabel: 'Product Capabilities Showcase Image',
        featuresImageDesc: 'Upload modular feature breakdown or workflow screenshot',
      },
      results: {
        sectionTitle: 'Operational Impact & Scalability Metrics',
        resultsLabel: 'Product Achievements & Measurable Outcomes (one per line)',
        resultsPlaceholder: 'Achievements:\n• 40% reduction in average dispatch processing time\n• Processed $12M+ in freight volume with 99.98% inventory accuracy\n• Scaled across 14 regional fulfillment centers in 6 months\n\nOutcomes:\n• Zero reported data-loss incidents during peak holiday volume\n• User training time decreased from 2 weeks to 2 days',
        resultsImageLabel: 'Metrics & Performance Dashboard Image',
        resultsImageDesc: 'Upload production metrics, throughput charts, or executive KPIs',
      },
      reflection: {
        sectionTitle: 'Retrospective & Product Evolution',
        reflectionLabel: 'Engineering Tradeoffs & Future Feature Roadmap',
        reflectionPlaceholder: 'Key technical tradeoffs between client-side computation and server sync, and next quarter roadmap items...',
        reflectionImageLabel: 'Roadmap & Future Vision Visual',
        reflectionImageDesc: 'Upload product roadmap or future platform milestone timeline',
      },
    },
    publicView: {
      sections: {
        overview: {
          stepNumber: '01 / Market Context',
          title: 'Product Overview & Opportunity',
          badge: 'Scalable Product Strategy',
          subtitle: 'Market context, operator archetypes, and product value proposition',
        },
        problem: {
          stepNumber: '02 / Operational Bottlenecks',
          title: 'Operational Friction & Platform Goals',
          badge: 'Bottlenecks Solved',
          subtitle: 'Legacy software inefficiencies and alignment between user workflows and commercial KPIs',
        },
        research: {
          stepNumber: '03 / Strategy & Systems',
          title: 'Field Research & System Blueprint',
          badge: 'System Architecture',
          subtitle: 'Observational research synthesis, operational flows, and rapid prototyping',
        },
        designSystem: {
          stepNumber: '04 / Scalable Architecture',
          title: 'Component Tokens & Data System',
          badge: 'Enterprise Design Tokens',
          subtitle: 'Robust component library optimized for data density and ergonomic clarity',
        },
        features: {
          stepNumber: '05 / Core Capabilities',
          title: 'Signature Product Capabilities',
          badge: 'Product Engine',
          subtitle: 'Purpose-built capabilities engineered to automate operational throughput',
        },
        solution: {
          stepNumber: '06 / Platform Deliverables',
          title: 'Complete Product Ecosystem',
          badge: 'Full Platform Ecosystem',
          subtitle: 'The fully realized product platform deployed across handheld and desktop environments',
        },
        results: {
          stepNumber: '07 / Operational Metrics',
          title: 'Operational Impact & Scalability',
          badge: 'Verified Throughput',
          subtitle: 'Demonstrated reduction in cycle times, inventory accuracy gains, and business ROI',
        },
        reflection: {
          stepNumber: '08 / Future Roadmap',
          title: 'Product Evolution & Next Milestones',
          badge: 'Scale Strategy',
          subtitle: 'Technical trade-offs, architecture decisions, and next-phase roadmap milestones',
        },
      },
      mockupLabels: {
        slot1: { title: 'Mobile / Handheld Experience', subtitle: 'Field Operator Companion UI', icon: 'smartphone' },
        slot2: { title: 'Enterprise Control Deck', subtitle: 'Central Operations Platform', icon: 'laptop' },
      },
      resultsLabels: {
        leftCardTitle: 'Operational Achievements',
        leftCardSubtitle: 'Throughput & Efficiency',
        rightCardTitle: 'Platform Reliability',
        rightCardSubtitle: 'Adoption & System Health',
      },
    },
  },

  'Brand Identity': {
    category: 'Brand Identity',
    displayName: 'Brand Identity',
    iconName: 'Sparkles',
    themeColor: 'primary',
    tagline: 'Distinctive Visual Identity Systems',
    description: 'Comprehensive brand positioning, logo concept construction, typography, color palettes, stationery collateral, and brand guidelines.',
    fields: {
      overview: {
        sectionTitle: 'Brand Context & Vision',
        clientLabel: 'Brand / Company Name',
        clientPlaceholder: 'e.g. Lumina Luxury Real Estate, Kofa Artisanal Coffee',
        objectiveLabel: 'Brand Vision & Core Purpose',
        objectivePlaceholder: 'What does this brand stand for? What emotional connection, prestige, or market shift was it created to champion?',
        targetAudienceLabel: 'Target Market & Customer Archetypes (Use **Archetype**: description)',
        targetAudiencePlaceholder: '💎 **Affluent Homebuyers**: Seek architectural sophistication and discretion\n🏛️ **Institutional Investors**: Look for proven heritage and rock-solid credibility',
        overviewImageLabel: 'Brand Identity Hero Presentation Image',
        overviewImageDesc: 'Upload a hero shot of the logo mark, 3D emblem, or master brand presentation',
      },
      problem: {
        sectionTitle: 'The Brand Challenge & Positioning',
        problemLabel: 'Brand Identity Challenge & Inconsistency Audit (one per line)',
        problemPlaceholder: '• Fragmented visual presence across social, print, and physical signage\n• Previous logo failed to convey premium market positioning\n• Lack of unified brand guidelines causing partner agencies to dilute visual standards',
        userGoalsLabel: 'Customer Perception Goals (How the audience should feel)',
        userGoalsPlaceholder: '• Experience an immediate sense of elegance and bespoke craftsmanship\n• Feel proud carrying brand collateral and associating with the brand\n• Instantly recognize the visual mark across all touchpoints',
        businessGoalsLabel: 'Brand Positioning Goals (Market Impact)',
        businessGoalsPlaceholder: '• Establish brand recognition as the premier luxury leader in Abuja\n• Enable 25% pricing premium through elevated brand equity\n• Secure consistent visual execution across all marketing channels',
        problemImageLabel: 'Brand Audit / Problem Context Image',
        problemImageDesc: 'Upload previous brand audit, competitor visual matrix, or brand repositioning chart',
      },
      research: {
        sectionTitle: 'Brand Strategy & Market Positioning',
        researchLabel: 'Brand Strategy, Core Values & Tone of Voice (one per line for cards)',
        researchPlaceholder: 'Brand Archetype: The Creator & The Ruler — timeless elegance fused with modern precision\nTone of Voice: Confident, refined, articulate, and welcoming without unnecessary pretension\nCore Values: Craftsmanship, Architectural Harmony, Uncompromising Integrity',
        researchImageLabel: 'Brand Moodboard & Strategy Visual',
        researchImageDesc: 'Upload inspiration moodboard, brand archetype diagram, or material textures',
      },
      process: {
        sectionTitle: 'Logo Concept & Construction',
        processLabel: 'Logo Ideation, Symbology & Grid Geometry',
        processPlaceholder: 'Abstract Heritage Monogram → Golden Ratio Grid Alignment → Optical Balance → Wordmark Kerning\n\n### Geometric Construction\n• Constructed on a strict geometric circular grid to ensure mathematical balance\n• Scalable from a 16px favicon up to monumental architectural signage\n\n### Exploration Iterations\n• Explored 3 distinct visual directions: Classic Serif Monogram, Modern Minimalist Glyphs, and Architectural Crest\n• Selected Direction 2 for its unmatched recognition and timeless digital versatility',
        processImageLabel: 'Logo Construction & Grid Geometry Image',
        processImageDesc: 'Upload geometric grid sketches, vector outlines, or symbology evolution',
      },
      designSystem: {
        sectionTitle: 'Visual Identity System & Guidelines',
        systemLabel: 'Color Psychology, Typography Hierarchy & Brand Rules',
        systemPlaceholder: 'Primary Gold: #D4AF37 (Elegance, prestige, warmth)\nObsidian Black: #111116 (Depth, authority, timelessness)\nAlabaster White: #F8F8FA (Clean breathing room)\n\nHeading Font: Playfair Display Bold\nSubheading Font: Cormorant Garamond\nBody Font: Montserrat Regular\n\nBrand Asset Rules:\n• Minimum clear space equal to 1.5x the height of the primary monogram\n• Strictly prohibited from drop-shadows, non-brand gradients, or squishing',
        systemImageLabel: 'Brand Style Guide & Specimen Sheet Image',
        systemImageDesc: 'Upload typography specimen, color swatch library, or brand guideline spread',
      },
      solution: {
        sectionTitle: 'Brand Collateral & Stationery Applications',
        solutionLabel: 'Brand Execution & Application Narrative',
        solutionPlaceholder: 'Detail how the identity comes to life across tactile print materials, luxury stationery, packaging, merchandise, and environmental signage.',
        mobileImageLabel: 'Stationery & Packaging Mockup URL',
        mobileImageDesc: 'Upload business cards, foil-stamped stationery, bags, or packaging mockups',
        desktopImageLabel: 'Signage & Environmental Brand Showcase URL',
        desktopImageDesc: 'Upload outdoor signage, architectural facades, merchandise, or brand collateral sets',
      },
      features: {
        sectionTitle: 'Brand Deliverables & Asset Kit',
        featuresLabel: 'Brand Assets Delivered (Title on one line, Description on next)',
        featuresPlaceholder: 'Primary & Secondary Marks\nComplete responsive logo suite including master mark, stacked lockup, and favicon.\n\nCorporate Stationery Suite\nEmbossed business cards, executive letterhead, wax-seal envelopes, and presentation folders.\n\nBrand Identity Guidelines Book\nComprehensive 48-page brand manual detailing typography, color ratios, and usage rules.',
        featuresImageLabel: 'Brand Deliverables Kit Image',
        featuresImageDesc: 'Upload complete brand kit showcase, flat lay, or icon set mockup',
      },
      results: {
        sectionTitle: 'Market Reception & Brand Equity',
        resultsLabel: 'Brand Launch Achievements & Reception (one per line)',
        resultsPlaceholder: 'Achievements:\n• 100% positive executive board and investor reception at private reveal\n• Brand assets implemented across 8 branch locations and 4 luxury developments\n• Inbound premium client inquiries jumped 68% following the rebrand\n\nOutcomes:\n• Recognized as best-in-class real estate visual identity at Abuja Design Awards\n• Flawless execution across print, web, and physical architectural signage',
        resultsImageLabel: 'Final Brand Showcase & Launch Image',
        resultsImageDesc: 'Upload launch photography, exhibition booth, or live signage photos',
      },
      reflection: {
        sectionTitle: 'Reflection & Identity Evolution',
        reflectionLabel: 'Creative Learnings & Long-Term Identity Strategy',
        reflectionPlaceholder: 'Reflect on finding the perfect balance between timeless heritage and modern digital agility, and guidelines for sub-brands...',
        reflectionImageLabel: 'Brand Evolution Visual',
        reflectionImageDesc: 'Upload brand roadmap or future sub-brand extension diagram',
      },
    },
    publicView: {
      sections: {
        overview: {
          stepNumber: '01 / Brand Context',
          title: 'Brand Vision & Heritage',
          badge: 'Identity Architecture',
          subtitle: 'Strategic brand foundations, audience archetypes, and market vision',
        },
        problem: {
          stepNumber: '02 / Brand Challenge',
          title: 'The Brand Challenge & Positioning',
          badge: 'Strategic Repositioning',
          subtitle: 'Visual identity fragmentation resolved through cohesive market differentiation',
        },
        research: {
          stepNumber: '03 / Strategy & Persona',
          title: 'Brand Strategy & Archetype',
          badge: 'Brand Essence',
          subtitle: 'Brand personality, values, tone of voice, and emotional connection',
        },
        designSystem: {
          stepNumber: '04 / Identity System',
          title: 'Visual Identity System & Style Guide',
          badge: 'Color & Typography Hierarchy',
          subtitle: 'Mathematically balanced color psychology, typography pairing, and clear space rules',
        },
        features: {
          stepNumber: '05 / Deliverables Kit',
          title: 'Delivered Brand Asset Ecosystem',
          badge: 'Complete Brand Kit',
          subtitle: 'Master marks, wordmarks, stationery assets, and comprehensive brand guidelines',
        },
        solution: {
          stepNumber: '06 / Real-World Execution',
          title: 'Brand Collateral & Packaging Showcase',
          badge: 'Tactile Execution',
          subtitle: 'Physical applications: luxury stationery, foil-stamped business cards, and environmental signage',
        },
        results: {
          stepNumber: '07 / Brand Reception',
          title: 'Market Reception & Brand Equity',
          badge: 'Elevated Presence',
          subtitle: 'Customer perception shift, commercial premium unlocked, and multi-channel consistency',
        },
        reflection: {
          stepNumber: '08 / Identity Roadmap',
          title: 'Identity Evolution & Extension',
          badge: 'Timeless Integrity',
          subtitle: 'Creative reflections on timelessness versus trends, and future sub-brand expansions',
        },
      },
      mockupLabels: {
        slot1: { title: 'Stationery & Packaging', subtitle: 'Tactile Print & Collateral Suite', icon: 'palette' },
        slot2: { title: 'Signage & Environmental', subtitle: 'Architectural & Digital Presence', icon: 'award' },
      },
      resultsLabels: {
        leftCardTitle: 'Brand Achievements',
        leftCardSubtitle: 'Market Distinction',
        rightCardTitle: 'Brand Equity',
        rightCardSubtitle: 'Reception & Growth',
      },
    },
  },

  'Graphic Design': {
    category: 'Graphic Design',
    displayName: 'Graphic Design',
    iconName: 'PenTool',
    themeColor: 'primary',
    tagline: 'High-Impact Visual Storytelling',
    description: 'Editorial design, marketing collateral, event branding, promotional posters, vector illustrations, and print-ready typography.',
    fields: {
      overview: {
        sectionTitle: 'Creative Brief & Scope',
        clientLabel: 'Client / Event / Publication Name',
        clientPlaceholder: 'e.g. Abuja Tech Summit 2026, Horizon Magazine',
        objectiveLabel: 'Creative Objective & Scope',
        objectivePlaceholder: 'What story, campaign message, or aesthetic feeling was this graphic design project created to convey?',
        targetAudienceLabel: 'Target Audience & Demographic Appeal (Use **Segment**: description)',
        targetAudiencePlaceholder: '🎨 **Creative Professionals**: Respond to bold typographic hierarchy\n🎟️ **Event Attendees**: Need rapid comprehension of dates, venues, and keynote speakers',
        overviewImageLabel: 'Key Visual / Hero Artwork Image',
        overviewImageDesc: 'Upload the primary promotional poster, cover design, or key visual artwork',
      },
      problem: {
        sectionTitle: 'The Creative Challenge & Communication Goals',
        problemLabel: 'Visual Clutter & Communication Challenges (one per line)',
        problemPlaceholder: '• Competing for attention in noisy high-density urban environments\n• Dense schedule information needed without sacrificing artistic punch\n• Required versatile formats spanning print billboards, flyers, and Instagram reels',
        userGoalsLabel: 'Audience Visual Goals (Readability & Emotion)',
        userGoalsPlaceholder: '• Instantly grasp the headline and event date in under 2 seconds\n• Feel captivated by unique illustrative craftsmanship\n• Scan QR code seamlessly from a distance of 2 meters',
        businessGoalsLabel: 'Campaign Marketing Goals',
        businessGoalsPlaceholder: '• Drive 10,000+ early-bird ticket registrations within 14 days\n• Establish an iconic visual aesthetic that spurs organic social sharing\n• Ensure 100% color accuracy and sharpness across all large-format printing',
        problemImageLabel: 'Brief / Competitive Visual Matrix Image',
        problemImageDesc: 'Upload creative brief synthesis, event inspiration, or competitor poster grid',
      },
      research: {
        sectionTitle: 'Art Direction & Visual Inspiration',
        researchLabel: 'Art Direction, References & Aesthetic Synthesis (one per line)',
        researchPlaceholder: 'Visual Style: Neo-Brutalist typography merged with organic African vector motifs\nComposition: Asymmetric diagonal grid creating dynamic eye motion\nColor Mood: Electric ultraviolet juxtaposed with warm sunburst yellow',
        researchImageLabel: 'Moodboard & Visual References Image',
        researchImageDesc: 'Upload curated moodboard, texture reference board, or art direction spread',
      },
      process: {
        sectionTitle: 'Composition, Grid & Vector Construction',
        processLabel: 'Creative Exploration & Vector Drafting',
        processPlaceholder: 'Thumbnails → Modular Grid Setup → Custom Vector Line Art → Typography Hierarchy → Color Proofing\n\n### Layout Architecture\n• Built upon an 8-column layout with bold vertical text blocks\n• Vector elements hand-crafted in Adobe Illustrator for lossless multi-scale output\n\n### Iterations\n• Refined title kerning to prevent awkward optical gaps in large 48pt display type\n• Adjusted CMYK values to prevent muddy black rendering in offset web presses',
        processImageLabel: 'Layout Sketches & Vector Iterations Image',
        processImageDesc: 'Upload hand sketches, vector wireframe outlines, or composition iterations',
      },
      designSystem: {
        sectionTitle: 'Color Palette & Typographic Hierarchy',
        systemLabel: 'Color Formulas (CMYK / Hex) & Typography Specimens',
        systemPlaceholder: 'Electric Violet: #8000FF (C70 M100 Y0 K0)\nCyber Cyan: #00D1FF (C65 M0 Y0 K0)\nSunburst Gold: #FFB800 (C0 M30 Y100 K0)\nDeep Charcoal: #1A1A2E (C80 M75 Y50 K60)\n\nPrimary Display Typeface: Druk Wide Heavy\nEditorial Body Typeface: Neue Montreal Medium\nAccent Metadata Typeface: Space Mono Bold',
        systemImageLabel: 'Graphic Specimen & Palette Sheet Image',
        systemImageDesc: 'Upload typography specimen card, CMYK color swatch test, or vector icon grid',
      },
      solution: {
        sectionTitle: 'Final Artwork & Multi-Format Variations',
        solutionLabel: 'Final Artwork & Print Production Narrative',
        solutionPlaceholder: 'Detail the completed artwork suite, print finishes (spot UV, foil, matte lamination), and multi-format adaptations.',
        mobileImageLabel: 'Editorial / Print Collateral Mockup URL',
        mobileImageDesc: 'Upload editorial magazine spread, flyer, or handheld print mockup',
        desktopImageLabel: 'Large Format Billboard / Exhibition Showcase URL',
        desktopImageDesc: 'Upload outdoor billboard, roll-up banner, or exhibition booth mockup',
      },
      features: {
        sectionTitle: 'Campaign Deliverables Package',
        featuresLabel: 'Artwork Deliverables (Title on one line, Description on next)',
        featuresPlaceholder: 'Large Format Billboard Suite\n300dpi print-ready vector artwork optimized for high-impact 6m x 3m city billboards.\n\nPromotional Poster Series\nSet of 4 collectible event posters with custom foil-stamped accents.\n\nDigital & Social Media Pack\nAnimated story graphics, square Instagram carousels, and YouTube event banners.',
        featuresImageLabel: 'Deliverables Showcase Image',
        featuresImageDesc: 'Upload complete deliverables bundle or multi-format collage',
      },
      results: {
        sectionTitle: 'Campaign Reception & Print Quality',
        resultsLabel: 'Campaign Results & Client Feedback (one per line)',
        resultsPlaceholder: 'Achievements:\n• Event sold out completely 6 days ahead of schedule\n• Over 4,200 organic social shares of the promotional posters\n• Zero printing errors or color shifts reported across 15,000+ print copies\n\nOutcomes:\n• Recognized with Best Cultural Poster nomination at West African Creative Awards\n• Client renewed annual retainer for subsequent event series',
        resultsImageLabel: 'Live Exhibition / In-Use Showcase Image',
        resultsImageDesc: 'Upload real-world photos of posters on streets, exhibition halls, or attendee hands',
      },
      reflection: {
        sectionTitle: 'Production Retrospective & Learnings',
        reflectionLabel: 'Print Tradeoffs & Creative Takeaways',
        reflectionPlaceholder: 'Reflect on managing complex ink saturations across recycled paper stocks and digital format adaptations...',
        reflectionImageLabel: 'Creative Process Retrospective Image',
        reflectionImageDesc: 'Upload production proof sheet or creative summary visual',
      },
    },
    publicView: {
      sections: {
        overview: {
          stepNumber: '01 / Creative Brief',
          title: 'Creative Brief & Narrative',
          badge: 'Visual Storytelling',
          subtitle: 'The artistic concept, core message, and target demographic appeal',
        },
        problem: {
          stepNumber: '02 / Visual Challenge',
          title: 'The Communication Challenge',
          badge: 'Cutting Through Noise',
          subtitle: 'Overcoming visual noise and establishing immediate emotional resonance',
        },
        research: {
          stepNumber: '03 / Art Direction',
          title: 'Art Direction & Moodboard',
          badge: 'Creative Exploration',
          subtitle: 'Aesthetic references, stylistic choices, and composition studies',
        },
        designSystem: {
          stepNumber: '04 / Typography & Color',
          title: 'Graphic Language & Specimen',
          badge: 'CMYK & Typography',
          subtitle: 'Precision typographic pairing, print ink formulations, and visual motifs',
        },
        features: {
          stepNumber: '05 / Deliverables',
          title: 'Delivered Campaign Artwork Suite',
          badge: 'Production Assets',
          subtitle: 'Comprehensive package spanning outdoor print, editorial, and digital formats',
        },
        solution: {
          stepNumber: '06 / Real-World Showcase',
          title: 'Final Artwork & Environmental Display',
          badge: 'Print & Digital Execution',
          subtitle: 'High-resolution print collaterals, poster mockups, and large-format outdoor displays',
        },
        results: {
          stepNumber: '07 / Campaign Impact',
          title: 'Campaign Performance & Reception',
          badge: 'Demonstrated Reach',
          subtitle: 'Sold-out turnout, viral social resonance, and flawless print fidelity',
        },
        reflection: {
          stepNumber: '08 / Creative Retrospective',
          title: 'Production Insights & Reflections',
          badge: 'Artistic Craftsmanship',
          subtitle: 'Lessons learned in material finishes, color separations, and layout balance',
        },
      },
      mockupLabels: {
        slot1: { title: 'Editorial & Print Suite', subtitle: 'Posters, Flyers & Handheld Collaterals', icon: 'palette' },
        slot2: { title: 'Outdoor & Environmental Display', subtitle: 'Billboards, Banners & Exhibition', icon: 'image' },
      },
      resultsLabels: {
        leftCardTitle: 'Campaign Achievements',
        leftCardSubtitle: 'Reach & Engagement',
        rightCardTitle: 'Print Production Fidelity',
        rightCardSubtitle: 'Craftsmanship & Execution',
      },
    },
  },

  'Website Design': {
    category: 'Website Design',
    displayName: 'Website Design',
    iconName: 'Globe',
    themeColor: 'secondary',
    tagline: 'High-Converting Digital Experiences',
    description: 'Modern responsive websites, lightning-fast Next.js architecture, interactive motion, SEO optimization, and automated lead capture.',
    fields: {
      overview: {
        sectionTitle: 'Web Project Overview & Target Visitors',
        clientLabel: 'Client / Business Name',
        clientPlaceholder: 'e.g. Skyline Architecture Abuja, PrimeHealth Clinic',
        objectiveLabel: 'Website Mission & Conversion Purpose',
        objectivePlaceholder: 'What primary commercial goal does this website accomplish? (e.g. Lead generation, automated bookings, portfolio showcase)',
        targetAudienceLabel: 'Target Visitors & Customer Journeys (Use **Visitor Type**: description)',
        targetAudiencePlaceholder: '💼 **Corporate Clients**: Need fast proof of past work and immediate consultation booking\n📱 **Mobile Visitors**: Seek transparent pricing, WhatsApp direct chat, and rapid contact form',
        overviewImageLabel: 'Website Hero Browser Showcase Image',
        overviewImageDesc: 'Upload desktop browser mockup showing the hero section and primary value proposition',
      },
      problem: {
        sectionTitle: 'Digital Bottlenecks & Conversion Goals',
        problemLabel: 'Previous Website Pain Points (one per line)',
        problemPlaceholder: '• 5.4-second load time causing 58% mobile visitor bounce rate\n• Broken layout on modern iPhone and Android screen aspect ratios\n• Missing automated booking flow requiring cumbersome manual phone calls',
        userGoalsLabel: 'Visitor Experience Goals',
        userGoalsPlaceholder: '• Find pricing and service offerings in 2 clicks or fewer\n• Browse past case studies smoothly with zero lag or stutter\n• Send an inquiry or chat directly on WhatsApp in under 30 seconds',
        businessGoalsLabel: 'Business Conversion Goals',
        businessGoalsPlaceholder: '• Increase verified inbound contact inquiries by 50%\n• Achieve a perfect 95+ Google Lighthouse Core Web Vitals rating\n• Automate email confirmation auto-responders to establish immediate trust',
        problemImageLabel: 'Old Site Audit / Lighthouse Score Image',
        problemImageDesc: 'Upload previous site performance audit, mobile break points, or analytics screenshots',
      },
      research: {
        sectionTitle: 'Information Architecture & Sitemap Strategy',
        researchLabel: 'Sitemap Hierarchy, User Flow & SEO Strategy (one per line)',
        researchPlaceholder: 'Architecture: 3-tier shallow sitemap ensuring every critical page is accessible within 2 clicks\nSEO Strategy: Localized keyword targeting for high-intent search terms\nConversion Funnel: Sticky header CTA → Trust badges → Social proof → Interactive contact form',
        researchImageLabel: 'Sitemap & Information Architecture Flow Image',
        researchImageDesc: 'Upload sitemap diagram, conversion funnel diagram, or page layout map',
      },
      process: {
        sectionTitle: 'Wireframing, Prototyping & Tech Stack',
        processLabel: 'Development Workflow & Interactive Prototyping',
        processPlaceholder: 'Figma Wireframing → Component Architecture → Next.js App Router → Tailwind CSS → Supabase CMS\n\n### Responsive Prototyping\n• Designed mobile-first layouts with fluid typography and scalable token units\n• Implemented scroll-triggered entrance animations with Framer Motion\n\n### Performance Engineering\n• Optimized images to modern WebP format with automated responsive sizing\n• Integrated Server-Side Rendering (SSR) for instantaneous page loads and optimal SEO',
        processImageLabel: 'Wireframes & Development Progress Image',
        processImageDesc: 'Upload Figma wireframes, component hierarchy diagram, or code architecture snapshot',
      },
      designSystem: {
        sectionTitle: 'Web Design System & Interactive Tokens',
        systemLabel: 'Color Tokens, Glass Surfaces & Interactive States',
        systemPlaceholder: 'Primary Accent: #8000FF (Brand Violet)\nSecondary Accent: #00D1FF (Digital Cyan)\nDark Ink Background: #1A1A2E\nPaper Text: #F2F2F2\n\nHeading Font: Geist Sans / Poppins Bold\nBody Font: Inter Regular\nMetadata Font: Geist Mono\n\nInteractive Components:\n• Glassmorphic cards with subtle hover glow borders\n• High-contrast accessible input fields with real-time validation\n• Mobile drawer navigation with smooth spring physics',
        systemImageLabel: 'Web UI Kit & Component Library Image',
        systemImageDesc: 'Upload web UI kit, button state matrix, or interactive component sheet',
      },
      solution: {
        sectionTitle: 'Responsive Web Experience & Showcase',
        solutionLabel: 'Live Website Experience Narrative',
        solutionPlaceholder: 'Summarize the completed website experience: speed, aesthetic sophistication, mobile responsiveness, and client reception.',
        mobileImageLabel: 'Mobile Responsive View Mockup URL',
        mobileImageDesc: 'Upload responsive mobile browser frames showing touch-friendly navigation',
        desktopImageLabel: 'Full Desktop Browser View Mockup URL',
        desktopImageDesc: 'Upload wide desktop browser screenshot showing complete layout harmony',
      },
      features: {
        sectionTitle: 'Key Web Features & Integrations',
        featuresLabel: 'Core Features & Integrations (Title on one line, Description on next)',
        featuresPlaceholder: 'Direct WhatsApp Live Chat\nSeamless 1-click floating WhatsApp integration that auto-populates service inquiries.\n\nDynamic Supabase CMS\nEmpowers client team to publish new portfolio projects and blog insights with zero code.\n\nAutomated Email Lead Dispatcher\nInstant transactional lead notification sent to admin email plus automated client thank-you note.',
        featuresImageLabel: 'Web Features Showcase Image',
        featuresImageDesc: 'Upload feature breakdown, interactive widget zoom, or CMS dashboard snapshot',
      },
      results: {
        sectionTitle: 'Launch Performance, Speed & SEO Metrics',
        resultsLabel: 'Launch Outcomes & Performance Lift (one per line)',
        resultsPlaceholder: 'Achievements:\n• 99/100 Google Lighthouse Performance, Accessibility & Best Practices score\n• 47% increase in monthly qualified client lead submissions\n• Page load time slashed from 5.4s to 0.7s on mobile 4G networks\n\nOutcomes:\n• Client reports saving 8 hours weekly through automated contact intake\n• Ranked on Google Page 1 for core local service keywords within 60 days',
        resultsImageLabel: 'Lighthouse Audit & Analytics Verification Image',
        resultsImageDesc: 'Upload Google Lighthouse audit score, Google Analytics graph, or conversion metrics',
      },
      reflection: {
        sectionTitle: 'Technical Retrospective & Future Roadmap',
        reflectionLabel: 'Engineering Reflections & Scalability Roadmap',
        reflectionPlaceholder: 'Reflect on caching strategies, edge delivery, and roadmap for future customer portal integration...',
        reflectionImageLabel: 'Roadmap & Future Scaling Image',
        reflectionImageDesc: 'Upload future tech architecture roadmap or milestone graphic',
      },
    },
    publicView: {
      sections: {
        overview: {
          stepNumber: '01 / Web Context',
          title: 'Project Purpose & Visitor Personas',
          badge: 'High-Converting Web',
          subtitle: 'Commercial objectives, visitor journeys, and platform positioning',
        },
        problem: {
          stepNumber: '02 / Digital Bottlenecks',
          title: 'Legacy Challenges & Web Goals',
          badge: 'Conversion Bottlenecks',
          subtitle: 'Eliminating slow load times, bounce rates, and broken mobile UX',
        },
        research: {
          stepNumber: '03 / Information Architecture',
          title: 'Sitemap & Conversion Funnel',
          badge: 'Structured Journey',
          subtitle: 'Frictionless sitemap architecture, keyword mapping, and user flow routing',
        },
        designSystem: {
          stepNumber: '04 / Web Design System',
          title: 'Interactive Tokens & Components',
          badge: 'Design System & Motion',
          subtitle: 'Fluid typography, glass surfaces, accessible inputs, and micro-interactions',
        },
        features: {
          stepNumber: '05 / Integrations',
          title: 'Core Features & Technical Integrations',
          badge: 'Modern Web Stack',
          subtitle: 'Supabase dynamic database, automated lead routing, and WhatsApp instant booking',
        },
        solution: {
          stepNumber: '06 / Responsive Showcase',
          title: 'Complete Responsive Experience',
          badge: 'Desktop & Mobile Ready',
          subtitle: 'Flawlessly optimized layouts across mobile smartphones, tablets, and wide desktop screens',
        },
        results: {
          stepNumber: '07 / Verified Performance',
          title: 'Speed, SEO & Conversion Outcomes',
          badge: '99+ Lighthouse Score',
          subtitle: 'Sub-second load times, dramatic bounce rate reduction, and surging client inquiries',
        },
        reflection: {
          stepNumber: '08 / Tech Retrospective',
          title: 'Engineering Retrospective & Scale',
          badge: 'Edge Scalability',
          subtitle: 'Next-phase capabilities, headless CMS evolution, and technical insights',
        },
      },
      mockupLabels: {
        slot1: { title: 'Mobile Responsive View', subtitle: 'Touch-Optimized Mobile Experience', icon: 'smartphone' },
        slot2: { title: 'Desktop Browser Experience', subtitle: 'Full Desktop Platform Layout', icon: 'laptop' },
      },
      resultsLabels: {
        leftCardTitle: 'Speed & SEO Metrics',
        leftCardSubtitle: 'Core Web Vitals & Rank',
        rightCardTitle: 'Conversion Lift',
        rightCardSubtitle: 'Inbound Leads Generated',
      },
    },
  },

  'Tech Education': {
    category: 'Tech Education',
    displayName: 'Tech Education',
    iconName: 'GraduationCap',
    themeColor: 'emerald',
    tagline: 'Practical, Hands-on Technical Mastery',
    description: 'Developer bootcamps, UI/UX workshops, practical project-based curriculums, code mentorship, and verifiable student outcomes.',
    fields: {
      overview: {
        sectionTitle: 'Program Overview & Student Cohort',
        clientLabel: 'Program / Cohort / Institution Name',
        clientPlaceholder: 'e.g. Rayida Tech Full-Stack Accelerator, Abuja Youth Design Lab',
        objectiveLabel: 'Educational Mission & Training Goal',
        objectivePlaceholder: 'What career transformation or practical skill competency was this program designed to instill in participants?',
        targetAudienceLabel: 'Student Cohort Profile (Use **Student Segment**: description)',
        targetAudiencePlaceholder: '🎓 **University Graduates**: Looking for practical job-ready industry skills\n💻 **Self-Taught Devs**: Need structured full-stack architecture and production best practices\n🎨 **Graphic Designers**: Wanting to transition into high-paying UI/UX product design',
        overviewImageLabel: 'Cohort / Workshop Hero Banner Image',
        overviewImageDesc: 'Upload a hero shot of the cohort classroom, graduation ceremony, or certificate mockup',
      },
      problem: {
        sectionTitle: 'Skill Gap & Learning Challenges',
        problemLabel: 'Learning Hurdles & Industry Gaps (one per line)',
        problemPlaceholder: '• Tutorial overload where students can follow videos but cannot build from scratch\n• Lack of code review and real-world collaboration workflows (Git, PRs, sprints)\n• Disconnect between academic theory and high-demand modern tech frameworks',
        userGoalsLabel: 'Student Learning Goals',
        userGoalsPlaceholder: '• Build 3 production-grade portfolio projects deployed to live URLs\n• Gain confidence presenting technical decisions to engineering leads\n• Master Git, Next.js, TypeScript, and modern database patterns',
        businessGoalsLabel: 'Program Success & Placement Metrics',
        businessGoalsPlaceholder: '• Achieve 90%+ course completion rate without drop-offs\n• 70%+ graduate employment or freelance client acquisition within 90 days\n• Produce verifiable, live-hosted student capstone projects',
        problemImageLabel: 'Skill Gap / Learning Landscape Image',
        problemImageDesc: 'Upload industry skill gap diagram, student baseline assessment, or curriculum map',
      },
      research: {
        sectionTitle: 'Pedagogical Framework & Methodology',
        researchLabel: 'Pedagogical Framework & Training Principles (one per line)',
        researchPlaceholder: 'Project-First Learning: Theory taught strictly in context of building real apps\nContinuous Code Reviews: Every PR receives line-by-line feedback and optimization tips\nPair Programming Sprints: Students collaborate in simulated Agile sprint cycles',
        researchImageLabel: 'Curriculum & Learning Roadmap Image',
        researchImageDesc: 'Upload modular syllabus graphic, training roadmap, or milestone matrix',
      },
      process: {
        sectionTitle: 'Teaching Methodology & Hands-on Labs',
        processLabel: 'Sprint Architecture & Lab Execution',
        processPlaceholder: 'Foundations → Live Demonstration → Hands-on Coding Lab → Peer Code Review → Live Deployment\n\n### Lab Structure\n• Daily 2-hour interactive code-along sessions tackling real-world bugs\n• Weekly hackathon sprints where student teams build working MVPs in 48 hours\n\n### Mentorship Iterations\n• Introduced automated linting and GitHub CI checks to give students instant feedback\n• Hosted 1-on-1 portfolio review clinics to polish graduate case studies',
        processImageLabel: 'Classroom / Live Workshop Snapshot Image',
        processImageDesc: 'Upload photo of live workshop in progress, Discord community discussion, or code review session',
      },
      designSystem: {
        sectionTitle: 'Technologies & Tooling Mastered',
        systemLabel: 'Technologies, Frameworks & Industry Tools Taught',
        systemPlaceholder: 'Frontend Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4\nBackend & Data: Supabase, PostgreSQL, REST APIs, Server Actions\nDesign Tools: Figma, FigJam, Component Token Systems\nDevOps & Workflow: Git, GitHub Actions, Vercel, Turbopack, Vitest',
        systemImageLabel: 'Tech Stack & Tools Specimen Image',
        systemImageDesc: 'Upload graphic showcasing the technology stack, architecture diagrams, or student tools',
      },
      solution: {
        sectionTitle: 'Student Capstones & Demonstrations',
        solutionLabel: 'Capstone Projects & Graduate Competency',
        solutionPlaceholder: 'Highlight the impressive real-world applications students engineered from scratch during the program.',
        mobileImageLabel: 'Student Project Showcase 1 URL',
        mobileImageDesc: 'Upload screenshot of a top student web or mobile application',
        desktopImageLabel: 'Student Project Showcase 2 URL',
        desktopImageDesc: 'Upload second featured student project or full cohort demo day collage',
      },
      features: {
        sectionTitle: 'Curriculum Modules Covered',
        featuresLabel: 'Core Curriculum Modules (Title on one line, Description on next)',
        featuresPlaceholder: 'Module 1: Modern Component Architecture\nDeep dive into React Server Components, TypeScript interfaces, and resilient state.\n\nModule 2: Database Modeling & Auth\nRelational database schema design in PostgreSQL, Row Level Security, and user sessions.\n\nModule 3: Production Deployment & Testing\nAutomated CI/CD pipelines, Vitest unit testing, performance optimization, and custom domains.',
        featuresImageLabel: 'Curriculum / Certification Showcase Image',
        featuresImageDesc: 'Upload course curriculum syllabus spread, certificate mockup, or module breakdown',
      },
      results: {
        sectionTitle: 'Student Outcomes, Testimonials & Impact',
        resultsLabel: 'Graduation Metrics & Alumni Success (one per line)',
        resultsPlaceholder: 'Achievements:\n• 94% graduation rate across 45 enrolled students\n• 38 live web applications successfully built and deployed to production\n• 14 graduates hired as full-time junior developers or UI designers within 60 days\n\nOutcomes:\n• 4.9 / 5.0 overall student satisfaction rating across anonymous exit surveys\n• 100% of graduates reported feeling confident building custom apps without tutorials',
        resultsImageLabel: 'Graduation Group Photo / Testimonials Image',
        resultsImageDesc: 'Upload photo of smiling graduates, certificate ceremony, or student review quotes',
      },
      reflection: {
        sectionTitle: 'Instructor Retrospective & Future Cohorts',
        reflectionLabel: 'Pedagogical Learnings & Next Cohort Enhancements',
        reflectionPlaceholder: 'Reflections on curriculum pacing, hands-on lab efficacy, and planned AI tooling modules for the upcoming cohort...',
        reflectionImageLabel: 'Next Cohort Vision Visual',
        reflectionImageDesc: 'Upload next cohort roadmap or expanded training timeline',
      },
    },
    publicView: {
      sections: {
        overview: {
          stepNumber: '01 / Program Mission',
          title: 'Program Overview & Student Cohort',
          badge: 'Practical Mentorship',
          subtitle: 'Educational philosophy, student archetypes, and career transformation mission',
        },
        problem: {
          stepNumber: '02 / The Skill Gap',
          title: 'The Practical Skill Gap Addressed',
          badge: 'Bridging Industry Needs',
          subtitle: 'Moving past theoretical tutorials to instill real-world production engineering competencies',
        },
        research: {
          stepNumber: '03 / Pedagogical Method',
          title: 'Curriculum Architecture & Labs',
          badge: 'Hands-on Learning',
          subtitle: 'Project-first pedagogy, continuous code reviews, and collaborative team sprints',
        },
        designSystem: {
          stepNumber: '04 / Stack Mastered',
          title: 'Technologies & Tooling Mastered',
          badge: 'Industry-Standard Tooling',
          subtitle: 'Modern framework mastery spanning Next.js, TypeScript, PostgreSQL, and Git',
        },
        features: {
          stepNumber: '05 / Curriculum Modules',
          title: 'Core Training Modules Covered',
          badge: 'Comprehensive Syllabus',
          subtitle: 'End-to-end curriculum modules engineered for rapid real-world application',
        },
        solution: {
          stepNumber: '06 / Student Work',
          title: 'Featured Student Capstone Projects',
          badge: 'Production-Grade Demos',
          subtitle: 'Live-hosted production applications conceptualized, designed, and deployed by students',
        },
        results: {
          stepNumber: '07 / Student Outcomes',
          title: 'Graduation Metrics & Career Impact',
          badge: 'Verifiable Success',
          subtitle: 'Graduation rates, successful job placements, and authentic alumni feedback',
        },
        reflection: {
          stepNumber: '08 / Future Cohorts',
          title: 'Instructor Retrospective & Expansion',
          badge: 'Continuous Growth',
          subtitle: 'Pedagogical insights and roadmap for next-generation technology workshops',
        },
      },
      mockupLabels: {
        slot1: { title: 'Student Capstone Demo 1', subtitle: 'Featured Student Web / Mobile Application', icon: 'layers' },
        slot2: { title: 'Student Capstone Demo 2', subtitle: 'Interactive Group Project & Demo', icon: 'laptop' },
      },
      resultsLabels: {
        leftCardTitle: 'Graduation Metrics',
        leftCardSubtitle: 'Completion & Portfolio Demos',
        rightCardTitle: 'Career Outcomes',
        rightCardSubtitle: 'Job Placements & Growth',
      },
    },
  },

  'Social Media Management': {
    category: 'Social Media Management',
    displayName: 'Social Media Management',
    iconName: 'Share2',
    themeColor: 'secondary',
    tagline: 'Audience Growth & Organic Engagement',
    description: 'Data-driven content strategy, viral carousel design, high-converting copy, community engagement, and measurable account growth.',
    fields: {
      overview: {
        sectionTitle: 'Brand & Social Media Scope',
        clientLabel: 'Brand / Company Name',
        clientPlaceholder: 'e.g. TasteBites Gourmet, FitZone Fitness Hub',
        objectiveLabel: 'Campaign Mission & Growth Goal',
        objectivePlaceholder: 'What brand awareness, customer acquisition, or community building objective was this campaign launched to achieve?',
        targetAudienceLabel: 'Target Demographics & Follower Personas (Use **Persona**: description)',
        targetAudiencePlaceholder: '🥗 **Health Enthusiasts (Ages 22-38)**: Love quick meal prep tips and nutritional carousel hacks\n🏋️ **Gym Members**: Driven by transformational before/after testimonials and workout routines',
        overviewImageLabel: 'Social Grid / Campaign Hero Overview Image',
        overviewImageDesc: 'Upload a 9-post Instagram grid mockup, viral post hero, or campaign announcement asset',
      },
      problem: {
        sectionTitle: 'Account Challenges & Commercial Goals',
        problemLabel: 'Previous Social Media Obstacles (one per line)',
        problemPlaceholder: '• Stagnant follower growth with engagement rate under 1.2%\n• Inconsistent posting schedule with erratic brand colors and typography\n• Low lead conversion with almost zero inbound inquiries via direct messages',
        userGoalsLabel: 'Follower Value Goals (Content Resonance)',
        userGoalsPlaceholder: '• Save bite-sized, actionable educational carousels for easy reference\n• Experience genuine, interactive responses to comments and story polls\n• Access exclusive community discounts and booking perks',
        businessGoalsLabel: 'Commercial Social KPIs',
        businessGoalsPlaceholder: '• Triple organic monthly reach and profile visits within 90 days\n• Drive 30+ qualified booking inquiries directly through Instagram DMs monthly\n• Maintain a cohesive, recognizable aesthetic that builds instant brand trust',
        problemImageLabel: 'Account Audit & Stagnant Metrics Image',
        problemImageDesc: 'Upload previous analytics audit, engagement dip chart, or unbranded grid screenshot',
      },
      research: {
        sectionTitle: 'Content Pillars & Competitor Strategy',
        researchLabel: 'Content Strategy, Pillars & Tone (one per line for cards)',
        researchPlaceholder: 'Pillar 1: Educational Carousel Guides (40% of schedule) — Saves & shares driver\nPillar 2: Behind-The-Scenes & Team Stories (30% of schedule) — Relatability & trust\nPillar 3: Social Proof & Client Transformations (20% of schedule) — Direct conversion\nPillar 4: Interactive Polls & Community Q&A (10% of schedule) — Algorithm velocity',
        researchImageLabel: 'Content Strategy & Calendar Map Image',
        researchImageDesc: 'Upload monthly content calendar visual, competitor audit matrix, or hashtag strategy spread',
      },
      process: {
        sectionTitle: 'Content Production Cadence & Workflow',
        processLabel: 'Content Creation Workflow & Scheduling Cadence',
        processPlaceholder: 'Topic Ideation → Copywriting & Hooks → Figma Carousel Design → Reel Scripting → Approval → Automated Scheduling\n\n### Production System\n• Batched 2 weeks of high-value graphic carousels in single creative sprints\n• Formatted all visuals for 4:5 vertical feed ratio to maximize mobile screen real estate\n\n### Optimization Refinements\n• Tested punchy 3-second hook headlines on slide 1, boosting swipe-through rate by 52%\n• Standardized CTA slide directing viewers to drop a specific keyword in DMs for automated resources',
        processImageLabel: 'Content Planning Board & Sprint Workflow Image',
        processImageDesc: 'Upload editorial planning board, Notion content pipeline, or carousel design file',
      },
      designSystem: {
        sectionTitle: 'Visual Grid Aesthetic & Template Kit',
        systemLabel: 'Brand Palette, Template Styles & Typography Rules',
        systemPlaceholder: 'Brand Primary: #8000FF (Punchy Violet)\nBrand Secondary: #00D1FF (Vibrant Cyan)\nBackground Ink: #1A1A2E\nHighlight Accent: #FFB800\n\nHeadline Font: Poppins Bold (All-caps hooks with high kerning)\nBody Font: Inter Medium (Crisp readability on mobile screens)\n\nTemplates:\n• 10-slide Educational Carousel Master Template\n• Quote & Testimonial Card Frame with subtle glass borders\n• High-energy Announcement Story Sticker Overlays',
        systemImageLabel: 'Template Kit & Grid Preview Image',
        systemImageDesc: 'Upload post template kit, carousel layout system, or 3x3 feed preview',
      },
      solution: {
        sectionTitle: 'Executed Campaigns & Creative Highlights',
        solutionLabel: 'Campaign Execution & Viral Creative Highlights',
        solutionPlaceholder: 'Summarize top performing posts, high-reach carousels, video reels, and community interaction highlights.',
        mobileImageLabel: 'Top Performing Carousel / Reel Mockup URL',
        mobileImageDesc: 'Upload smartphone frame showing the highest-performing carousel or reel',
        desktopImageLabel: 'Curated 9-Post Profile Grid Mockup URL',
        desktopImageDesc: 'Upload complete cohesive 9-post feed grid mockup showing visual harmony',
      },
      features: {
        sectionTitle: 'Monthly Output & Deliverables',
        featuresLabel: 'Monthly Content Deliverables (Title on one line, Description on next)',
        featuresPlaceholder: '16 Custom High-Fidelity Carousels\nFully branded 7-10 slide educational carousels with irresistible hook titles.\n\n8 Short-Form Video Reels\nDynamic scripted reels with synchronized captions and trending audio.\n\nActive Community DM Management\nDaily interaction handling customer inquiries and sending automated resource links.',
        featuresImageLabel: 'Content Highlights Showcase Image',
        featuresImageDesc: 'Upload collage of published posts, story highlights, or top reels',
      },
      results: {
        sectionTitle: 'Growth Metrics, Reach & Inbound Conversions',
        resultsLabel: 'Account Growth & Commercial Results (one per line)',
        resultsPlaceholder: 'Achievements:\n• 280% organic follower growth from 2,100 to 8,000+ targeted local followers\n• 450,000+ monthly impressions with average engagement rate exceeding 5.8%\n• Generated 72 qualified customer booking inquiries directly via Instagram DMs\n\nOutcomes:\n• Client experienced 35% surge in monthly revenue attributable directly to social channels\n• Account featured in industry roundup as a benchmark local brand aesthetic',
        resultsImageLabel: 'Analytics Dashboard Verification Image',
        resultsImageDesc: 'Upload Instagram Insights screenshot, growth graph, or reach surge chart',
      },
      reflection: {
        sectionTitle: 'Retrospective & Next Growth Cycle',
        reflectionLabel: 'Algorithm Learnings & Next Quarter Strategy',
        reflectionPlaceholder: 'Reflect on evolving video vs carousel reach trends, audience retention curves, and plans for influencer partnerships...',
        reflectionImageLabel: 'Growth Strategy Roadmap Visual',
        reflectionImageDesc: 'Upload future growth roadmap or multichannel marketing diagram',
      },
    },
    publicView: {
      sections: {
        overview: {
          stepNumber: '01 / Brand Presence',
          title: 'Brand Scope & Follower Persona',
          badge: 'Organic Growth',
          subtitle: 'Target demographics, social positioning, and campaign objectives',
        },
        problem: {
          stepNumber: '02 / Growth Bottlenecks',
          title: 'Account Stagnation & Commercial Goals',
          badge: 'Algorithm Velocity',
          subtitle: 'Overcoming low engagement, erratic posting, and stagnant follower counts',
        },
        research: {
          stepNumber: '03 / Content Strategy',
          title: 'Content Pillars & Competitive Strategy',
          badge: 'Strategic Cadence',
          subtitle: 'Save-driven educational carousels, behind-the-scenes stories, and interactive polls',
        },
        designSystem: {
          stepNumber: '04 / Visual Grid Kit',
          title: 'Feed Aesthetic & Template Kit',
          badge: 'Brand Continuity',
          subtitle: 'Consistent color psychology, 4:5 vertical framing, and high-retention hook styling',
        },
        features: {
          stepNumber: '05 / Deliverables',
          title: 'Monthly Deliverables & Output',
          badge: 'Content Output',
          subtitle: 'High-frequency branded carousels, short-form reels, and proactive community management',
        },
        solution: {
          stepNumber: '06 / Campaign Highlights',
          title: 'Featured Posts & Harmonized Feed',
          badge: 'Executed Campaigns',
          subtitle: 'Top-performing viral carousel assets and curated cohesive 9-post profile aesthetic',
        },
        results: {
          stepNumber: '07 / Growth Analytics',
          title: 'Impressions, Reach & Lead Inquiries',
          badge: 'Verified ROI',
          subtitle: 'Triple-digit follower expansion, viral reach spikes, and direct revenue generation',
        },
        reflection: {
          stepNumber: '08 / Algorithm Evolution',
          title: 'Retrospective & Scaling Strategy',
          badge: 'Future Strategy',
          subtitle: 'Insights into evolving platform algorithms and next-phase audience expansion',
        },
      },
      mockupLabels: {
        slot1: { title: 'Viral Carousel / Reel Feature', subtitle: 'Highest-Performing Content Asset', icon: 'smartphone' },
        slot2: { title: 'Cohesive Profile Grid', subtitle: 'Unified 9-Post Aesthetic Harmony', icon: 'palette' },
      },
      resultsLabels: {
        leftCardTitle: 'Audience Expansion',
        leftCardSubtitle: 'Followers & Impressions',
        rightCardTitle: 'Commercial Impact',
        rightCardSubtitle: 'Inbound Inquiries & Revenue',
      },
    },
  },
};

/**
 * Returns the category configuration for a given category name,
 * falling back gracefully to UI/UX Design if unspecified or unknown.
 */
export function getCaseStudyConfig(category?: string | null): CategoryCaseStudyConfig {
  if (!category) return CATEGORY_CASE_STUDY_CONFIGS['UI/UX Design'];
  const matched = (SERVICE_CATEGORIES as readonly string[]).find(
    (c) => c.toLowerCase() === category.trim().toLowerCase()
  );
  if (matched && matched in CATEGORY_CASE_STUDY_CONFIGS) {
    return CATEGORY_CASE_STUDY_CONFIGS[matched as ServiceCategory];
  }
  return CATEGORY_CASE_STUDY_CONFIGS['UI/UX Design'];
}

