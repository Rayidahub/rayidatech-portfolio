import { describe, it, expect } from 'vitest';
import {
  generateProposalData,
  getProposalBySlug,
  buildProposalMilestones,
  PRE_SEEDED_PROPOSALS,
} from '@/lib/data/proposals';

describe('Proposal Architecture & Engine', () => {
  it('correctly calculates 50/50 milestones for standard packages', () => {
    const milestones200k = buildProposalMilestones(200000);
    expect(milestones200k).toHaveLength(2);
    expect(milestones200k[0].amount).toBe(100000);
    expect(milestones200k[0].formattedAmount).toBe('₦100,000');
    expect(milestones200k[1].amount).toBe(100000);
    expect(milestones200k[1].formattedAmount).toBe('₦100,000');

    const milestones100k = buildProposalMilestones(100000);
    expect(milestones100k[0].amount).toBe(50000);
    expect(milestones100k[0].formattedAmount).toBe('₦50,000');

    const milestones350k = buildProposalMilestones(350000);
    expect(milestones350k[0].amount).toBe(175000);
    expect(milestones350k[0].formattedAmount).toBe('₦175,000');
  });

  it('generates education-tailored deliverables for schools and academies', () => {
    const schoolProposal = generateProposalData('Kingsgate International School', {
      category: 'Schools & Academies',
      packageId: 'growth',
    });

    expect(schoolProposal.clientName).toBe('Kingsgate International School');
    expect(schoolProposal.slug).toBe('kingsgate-international-school');
    expect(schoolProposal.totalPrice).toBe(200000);
    expect(schoolProposal.packageName).toBe('Business Growth System');
    expect(schoolProposal.deliverables.some((d) => d.badge === 'Admissions Funnel')).toBe(true);
    expect(schoolProposal.deliverables.some((d) => d.badge === 'Academics')).toBe(true);
    expect(schoolProposal.whatsappAcceptanceUrl).toContain('wa.me');
    expect(schoolProposal.whatsappAcceptanceUrl).toContain('Kingsgate%20International%20School');
  });

  it('generates commercial brand deliverables for general businesses', () => {
    const cateringProposal = generateProposalData('Royal Velvet Catering', {
      category: 'Catering & Confectionery',
      packageId: 'growth',
    });

    expect(cateringProposal.deliverables.some((d) => d.badge === 'Brand Authority')).toBe(true);
    expect(cateringProposal.deliverables.some((d) => d.badge === 'Service Catalog')).toBe(true);
  });

  it('retrieves pre-seeded proposals by slug', () => {
    const prestige = getProposalBySlug('prestige-royal-academy');
    expect(prestige).toBeDefined();
    expect(prestige.clientName).toBe('Prestige Royal Academy');
    expect(prestige.category).toBe('Schools & Academies');
    expect(prestige.targetCity).toContain('Wuse 2');
  });

  it('dynamically synthesizes proposals for unknown slugs gracefully', () => {
    const unknown = getProposalBySlug('abuja-summit-academy');
    expect(unknown).toBeDefined();
    expect(unknown.clientName).toBe('Abuja Summit Academy');
    expect(unknown.category).toBe('Schools & Academies');
    expect(unknown.totalPrice).toBe(200000);
  });
});
