import { normalizeSlug } from '@/lib/slug';
import { DIGITAL_UPGRADE_PACKAGES } from '@/lib/data/pricing-packages';

export type InvoiceMilestoneType = 'kickoff_50' | 'handover_50' | 'full_payment' | 'care_retainer';
export type InvoicePaymentStatus = 'pending' | 'paid' | 'overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  formattedPrice: string;
}

export interface BankPaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  paymentReference: string;
  sortCodeOrBranch?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientCategory: string;
  clientArea: string;
  clientContactPerson?: string;
  packageId: string;
  packageName: string;
  milestoneType: InvoiceMilestoneType;
  milestoneTitle: string;
  totalAmount: number;
  formattedAmount: string;
  items: InvoiceItem[];
  paymentStatus: InvoicePaymentStatus;
  bankDetails: BankPaymentDetails;
  notes: string;
  whatsappConfirmationUrl: string;
}

export const RAYIDA_DEFAULT_BANK_DETAILS: BankPaymentDetails = {
  bankName: 'Guaranty Trust Bank (GTBank) / Kuda Microfinance Bank',
  accountName: 'Raymond Gaius (Rayida Tech)',
  accountNumber: '0123456789',
  paymentReference: 'RAYIDA-DIGITAL',
};

/**
 * Builds an official digital invoice data object for any client and milestone.
 */
export function generateMilestoneInvoice(
  clientName: string,
  milestoneType: InvoiceMilestoneType = 'kickoff_50',
  options?: {
    category?: string;
    area?: string;
    packageId?: string;
    contactPerson?: string;
    customReference?: string;
    isPaid?: boolean;
  }
): InvoiceData {
  const category = options?.category || 'Schools & Academies';
  const area = options?.area || 'Abuja, Nigeria';
  const packageId = options?.packageId || 'growth';
  const pkg = DIGITAL_UPGRADE_PACKAGES.find((p) => p.id === packageId) || DIGITAL_UPGRADE_PACKAGES[1];

  const slug = normalizeSlug(clientName);
  const now = new Date();
  const issueDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const due = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const dueDate = due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  let invoiceNumber = '';
  let milestoneTitle = '';
  let totalAmount = 0;
  let items: InvoiceItem[] = [];

  const halfPrice = Math.round(pkg.price / 2);

  if (milestoneType === 'kickoff_50') {
    invoiceNumber = `RT-INV-${slug.slice(0, 4).toUpperCase()}-01`;
    milestoneTitle = `Milestone 1 — 50% Project Kickoff (${pkg.name})`;
    totalAmount = halfPrice;
    items = [
      {
        description: `Kickoff Commitment Deposit (50%) for ${pkg.name}: Structural wireframing, bespoke design layouts, and dedicated staging server deployment.`,
        quantity: 1,
        unitPrice: halfPrice,
        formattedPrice: `₦${halfPrice.toLocaleString()}`,
      },
    ];
  } else if (milestoneType === 'handover_50') {
    invoiceNumber = `RT-INV-${slug.slice(0, 4).toUpperCase()}-02`;
    milestoneTitle = `Milestone 2 — 50% Final Handover & Live Release (${pkg.name})`;
    totalAmount = halfPrice;
    items = [
      {
        description: `Final Completion Balance (50%) for ${pkg.name}: Domain connection, SSL encryption, WhatsApp admissions/lead routing verification, and live handover.`,
        quantity: 1,
        unitPrice: halfPrice,
        formattedPrice: `₦${halfPrice.toLocaleString()}`,
      },
    ];
  } else if (milestoneType === 'care_retainer') {
    invoiceNumber = `RT-CARE-${slug.slice(0, 4).toUpperCase()}-01`;
    milestoneTitle = 'Monthly Digital Care & Maintenance Retainer';
    totalAmount = 35000;
    items = [
      {
        description: 'Business Care Monthly Retainer: 24/7 Uptime monitoring, cloud backups, monthly software updates, and up to 2 content updates.',
        quantity: 1,
        unitPrice: 35000,
        formattedPrice: '₦35,000',
      },
    ];
  } else {
    invoiceNumber = `RT-INV-${slug.slice(0, 4).toUpperCase()}-FULL`;
    milestoneTitle = `Full Investment (${pkg.name})`;
    totalAmount = pkg.price;
    items = [
      {
        description: `Complete Turnkey Development & Deployment: ${pkg.name}`,
        quantity: 1,
        unitPrice: pkg.price,
        formattedPrice: pkg.formattedPrice,
      },
    ];
  }

  const formattedAmount = `₦${totalAmount.toLocaleString()}`;
  const paymentRef = options?.customReference || `${invoiceNumber}-${slug.slice(0, 8).toUpperCase()}`;

  const bankDetails: BankPaymentDetails = {
    ...RAYIDA_DEFAULT_BANK_DETAILS,
    paymentReference: paymentRef,
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Raymond, I have processed the bank transfer of ${formattedAmount} for Invoice ${invoiceNumber} (${clientName}). Here is our proof of payment receipt.`
  );

  const whatsappConfirmationUrl = `https://wa.me/2348100000000?text=${whatsappMessage}`;

  return {
    id: `${slug}-${milestoneType}`,
    invoiceNumber,
    issueDate,
    dueDate,
    clientName,
    clientCategory: category,
    clientArea: area,
    clientContactPerson: options?.contactPerson,
    packageId: pkg.id,
    packageName: pkg.name,
    milestoneType,
    milestoneTitle,
    totalAmount,
    formattedAmount,
    items,
    paymentStatus: options?.isPaid ? 'paid' : 'pending',
    bankDetails,
    notes: 'Please quote the Payment Reference above on your transfer narration to ensure instant reconciliation and same-day project kickoff.',
    whatsappConfirmationUrl,
  };
}

/**
 * Pre-seeded invoices for immediate viewing and testing.
 */
export const PRE_SEEDED_INVOICES: InvoiceData[] = [
  generateMilestoneInvoice('Prestige Royal Academy', 'kickoff_50', {
    category: 'Schools & Academies',
    area: 'Wuse 2, Abuja',
    contactPerson: 'School Director',
  }),
  generateMilestoneInvoice('Capital Crest International School', 'kickoff_50', {
    category: 'Schools & Academies',
    area: 'Gwarinpa, Abuja',
    contactPerson: 'Proprietor',
  }),
  generateMilestoneInvoice('1420 Events & Decor', 'kickoff_50', {
    category: 'Event Planning & Decor',
    area: 'Maitama, Abuja',
  }),
];

/**
 * Retrieves an invoice by ID, falling back to dynamically synthesizing one.
 */
export function getInvoiceById(id: string): InvoiceData {
  const found = PRE_SEEDED_INVOICES.find((i) => i.id === id);
  if (found) {
    return found;
  }

  // Parse ID (e.g. "kingsgate-academy-kickoff_50" or "prestige-royal-academy")
  const parts = id.split('-');
  const milestoneType: InvoiceMilestoneType = id.includes('handover')
    ? 'handover_50'
    : id.includes('care')
    ? 'care_retainer'
    : id.includes('full')
    ? 'full_payment'
    : 'kickoff_50';

  const cleanSlug = id
    .replace('-kickoff_50', '')
    .replace('-handover_50', '')
    .replace('-care_retainer', '')
    .replace('-full_payment', '');

  const words = cleanSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  const humanName = words.join(' ');
  const isSchool = cleanSlug.includes('school') || cleanSlug.includes('academy');

  return generateMilestoneInvoice(humanName, milestoneType, {
    category: isSchool ? 'Schools & Academies' : 'Business Enterprise',
  });
}
