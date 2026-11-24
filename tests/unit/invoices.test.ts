import { describe, it, expect } from 'vitest';
import {
  generateMilestoneInvoice,
  getInvoiceById,
  PRE_SEEDED_INVOICES,
  RAYIDA_DEFAULT_BANK_DETAILS,
} from '@/lib/data/invoices';
import { OBJECTION_BATTLECARDS } from '@/components/admin/outreach/ObjectionBattlecardsModal';

describe('Digital Milestone Invoicing & Bank Remittance System', () => {
  it('generates Milestone 1 (50% Kickoff) invoice with accurate half-pricing', () => {
    const invoice = generateMilestoneInvoice('Prestige Royal Academy', 'kickoff_50', {
      packageId: 'growth',
    });

    expect(invoice.clientName).toBe('Prestige Royal Academy');
    expect(invoice.totalAmount).toBe(100000);
    expect(invoice.formattedAmount).toBe('₦100,000');
    expect(invoice.milestoneType).toBe('kickoff_50');
    expect(invoice.invoiceNumber).toContain('RT-INV-');
    expect(invoice.bankDetails.bankName).toBe(RAYIDA_DEFAULT_BANK_DETAILS.bankName);
    expect(invoice.bankDetails.accountNumber).toBe(RAYIDA_DEFAULT_BANK_DETAILS.accountNumber);
    expect(invoice.whatsappConfirmationUrl).toContain('wa.me');
  });

  it('generates Milestone 2 (50% Handover) invoice with completion line item', () => {
    const invoice = generateMilestoneInvoice('Capital Crest School', 'handover_50', {
      packageId: 'growth',
    });

    expect(invoice.totalAmount).toBe(100000);
    expect(invoice.milestoneType).toBe('handover_50');
    expect(invoice.items[0].description).toContain('Final Completion Balance');
  });

  it('generates Monthly Care Retainer invoice for ₦35,000', () => {
    const careInvoice = generateMilestoneInvoice('1420 Events', 'care_retainer');

    expect(careInvoice.totalAmount).toBe(35000);
    expect(careInvoice.formattedAmount).toBe('₦35,000');
    expect(careInvoice.milestoneType).toBe('care_retainer');
    expect(careInvoice.invoiceNumber).toContain('RT-CARE-');
  });

  it('retrieves pre-seeded invoices by id', () => {
    const found = getInvoiceById('prestige-royal-academy-kickoff_50');
    expect(found).toBeDefined();
    expect(found.clientName).toBe('Prestige Royal Academy');
    expect(found.totalAmount).toBe(100000);
  });

  it('dynamically synthesizes invoices for arbitrary client slugs', () => {
    const custom = getInvoiceById('zenith-heights-academy-kickoff_50');
    expect(custom).toBeDefined();
    expect(custom.clientName).toContain('Zenith Heights Academy');
    expect(custom.totalAmount).toBe(100000);
  });
});

describe('Objection Battlecards System', () => {
  it('covers the critical 6 sales objection scenarios', () => {
    expect(OBJECTION_BATTLECARDS.length).toBeGreaterThanOrEqual(6);

    const categories = OBJECTION_BATTLECARDS.map((b) => b.id);
    expect(categories).toContain('instagram_enough');
    expect(categories).toContain('economy_hard');
    expect(categories).toContain('it_teacher');
    expect(categories).toContain('cheaper_competitor');
    expect(categories).toContain('call_me_next_term');
    expect(categories).toContain('build_first_pay_later');
  });

  it('provides detailed word-for-word response scripts with Crestfield reference', () => {
    const instagramCard = OBJECTION_BATTLECARDS.find((b) => b.id === 'instagram_enough');
    expect(instagramCard).toBeDefined();
    expect(instagramCard?.wordForWordScript).toContain('crestfield-academy');
    expect(instagramCard?.wordForWordScript).toContain('rented land');
  });
});
