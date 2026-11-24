import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FileText,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MessageCircle,
  Printer,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { getInvoiceById } from '@/lib/data/invoices';

export const revalidate = 3600;

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = getInvoiceById(id);

  return {
    title: `Invoice ${invoice.invoiceNumber} — ${invoice.clientName} | Rayida Tech`,
    description: `Official digital milestone invoice and bank remittance instructions for ${invoice.clientName} issued by Rayida Tech.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function InvoiceDetailPage({ params }: InvoicePageProps) {
  const { id } = await params;
  if (!id) notFound();

  const invoice = getInvoiceById(id);

  return (
    <div className="min-h-screen bg-ink text-paper selection:bg-primary/30 selection:text-white">
      {/* Top Banner Header */}
      <div className="border-b border-(--line) bg-ink-deep/90 backdrop-blur-md sticky top-0 z-40">
        <Container size="wide" className="py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-2 w-2 rounded-full ${
                invoice.paymentStatus === 'paid' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="font-mono-tight text-mist-1">Official Milestone Invoice</span>
            <span className="text-mist-2 hidden sm:inline">•</span>
            <span className="text-white font-medium hidden sm:inline">{invoice.invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`font-mono-tight text-[11px] px-2.5 py-0.5 rounded-full border ${
                invoice.paymentStatus === 'paid'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              }`}
            >
              {invoice.paymentStatus === 'paid' ? '✓ Paid & Confirmed' : '• Payment Pending'}
            </span>
          </div>
        </Container>
      </div>

      <Container size="narrow" className="py-12 md:py-20 space-y-12">
        {/* Printable/Saveable Invoice Document Paper */}
        <Reveal index={0}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 text-slate-900 shadow-2xl border border-slate-100 space-y-8">
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-slate-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    R
                  </div>
                  <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                    Rayida Tech
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  RC Registered Enterprise &bull; Abuja, Nigeria
                  <br />
                  Digital Architecture &amp; Conversion Systems
                  <br />
                  contact@rayidatech.name.ng
                </p>
              </div>

              <div className="sm:text-right space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Invoice Number
                </span>
                <p className="font-mono font-bold text-lg text-slate-900">{invoice.invoiceNumber}</p>
                <div className="text-xs text-slate-500 space-y-0.5">
                  <p>Issue Date: {invoice.issueDate}</p>
                  <p className="text-rose-600 font-medium">Due Date: {invoice.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Billed To / Client Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 border-b border-slate-200 text-xs">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Billed To (Client)
                </span>
                <p className="font-display text-base font-bold text-slate-900">
                  {invoice.clientName}
                </p>
                <p className="text-slate-600">{invoice.clientCategory}</p>
                <p className="text-slate-500">{invoice.clientArea}</p>
              </div>

              <div className="sm:text-right space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Milestone Details
                </span>
                <p className="font-semibold text-slate-800">{invoice.milestoneTitle}</p>
                <p className="text-slate-500">{invoice.packageName}</p>
                <p className="text-[11px] font-mono text-blue-600">Standard 50/50 Milestone Contract</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5">Scope / Deliverable Description</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-slate-900">{item.description}</p>
                        </td>
                        <td className="py-3.5 text-center font-mono text-slate-600">{item.quantity}</td>
                        <td className="py-3.5 text-right font-mono font-bold text-slate-900">
                          {item.formattedPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <div className="w-full sm:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono">{invoice.formattedAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT / Processing Fee</span>
                    <span className="font-mono text-emerald-600">₦0.00 (Waived)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Total Amount Due</span>
                    <span className="font-display text-xl text-blue-600">
                      {invoice.formattedAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Remittance Details */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Bank Remittance &amp; Wire Instructions
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Bank Name</span>
                  <span className="font-semibold text-slate-800">{invoice.bankDetails.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Account Name</span>
                  <span className="font-semibold text-slate-800">{invoice.bankDetails.accountName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Account Number</span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {invoice.bankDetails.accountNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Reference / Narration</span>
                  <span className="font-mono font-bold text-xs text-blue-600">
                    {invoice.bankDetails.paymentReference}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 leading-relaxed">
                {invoice.notes}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <a
                href={invoice.whatsappConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Notify Raymond / Send Transfer Receipt</span>
              </a>

              <Link
                href={`/proposals/${invoice.id.replace('-kickoff_50', '').replace('-handover_50', '')}`}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1"
              >
                <span>View Full Scope of Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
