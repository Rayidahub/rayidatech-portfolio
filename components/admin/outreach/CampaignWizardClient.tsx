'use client';

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Sliders,
  Check,
  Search,
  Building,
  ShieldCheck,
  AlertCircle,
  Copy,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import {
  personalizeTemplate,
  buildHtmlEmail,
  isValidEmailAddress,
} from '@/lib/email/outreach-utils';
import {
  createEmailCampaign,
  sendTestEmailAction,
  launchCampaignBatch,
} from '@/app/actions/outreach-campaigns';
import type {
  OutreachContact,
  EmailTemplate,
  EmailSettings,
  EmailProvider,
} from '@/types/outreach';

interface CampaignWizardClientProps {
  contacts: OutreachContact[];
  templates: EmailTemplate[];
  settings: EmailSettings;
  preselectedContactIds?: string[];
}

const TEMPLATE_VARIABLES = [
  { token: '{{business_name}}', desc: 'Business / Company name' },
  { token: '{{contact_name}}', desc: 'Contact person (with business fallback)' },
  { token: '{{business_type}}', desc: 'Industry / Specialty' },
  { token: '{{location}}', desc: 'City / Area' },
  { token: '{{website}}', desc: 'Website address' },
  { token: '{{sender_name}}', desc: 'Sender full name' },
  { token: '{{company_name}}', desc: 'Rayida Tech' },
];

export default function CampaignWizardClient({
  contacts,
  templates,
  settings,
  preselectedContactIds = [],
}: CampaignWizardClientProps) {
  const router = useRouter();

  // Wizard Step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Recipients
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(preselectedContactIds.length > 0 ? preselectedContactIds : [])
  );

  // Step 2: Content & Provider
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState(templates[0]?.subject || 'A website idea for {{business_name}}');
  const [body, setBody] = useState(templates[0]?.body || '');
  const [provider, setProvider] = useState<EmailProvider>(settings.default_provider || 'resend');
  const [senderName, setSenderName] = useState(settings.sender_name || 'Raymond Gaius');
  const [senderEmail, setSenderEmail] = useState(settings.sender_email || 'info@rayidatech.name.ng');
  const [replyTo, setReplyTo] = useState(settings.reply_to || 'info@rayidatech.name.ng');

  // Step 3: Personalization preview index
  const [previewContactIdx, setPreviewContactIdx] = useState(0);

  // Step 4: Test email
  const [testEmailAddress, setTestEmailAddress] = useState(settings.test_recipient_email || 'rayidagaius@gmail.com');
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Step 6: Live dispatch telemetry
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'sending' | 'paused' | 'completed' | 'error'>('idle');
  const [dispatchProgress, setDispatchProgress] = useState({ sent: 0, failed: 0, total: 0 });
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();
  const [generalError, setGeneralError] = useState('');

  // Eligible contacts (have valid email, not missing)
  const eligibleContacts = useMemo(() => {
    return contacts.filter((c) => c.email && isValidEmailAddress(c.email) && c.outreach_status !== 'Unsubscribed');
  }, [contacts]);

  // Filtered contacts for Step 1
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (statusFilter !== 'All' && c.outreach_status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const m =
          c.business_name?.toLowerCase().includes(q) ||
          c.contact_name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q);
        if (!m) return false;
      }
      return true;
    });
  }, [contacts, search, statusFilter]);

  // Selected contact objects
  const selectedContacts = useMemo(() => {
    return contacts.filter((c) => selectedIds.has(c.id));
  }, [contacts, selectedIds]);

  const selectedValidCount = useMemo(() => {
    return selectedContacts.filter((c) => c.email && isValidEmailAddress(c.email) && c.outreach_status !== 'Unsubscribed').length;
  }, [selectedContacts]);

  const selectedInvalidCount = selectedContacts.length - selectedValidCount;

  // Step 1 selection helpers
  const handleSelectAllEligible = () => {
    const next = new Set(selectedIds);
    eligibleContacts.forEach((c) => next.add(c.id));
    setSelectedIds(next);
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Step 2 Template switcher
  const handleApplyTemplate = (tmpl: EmailTemplate) => {
    setSubject(tmpl.subject);
    setBody(tmpl.body);
    if (!campaignName) {
      setCampaignName(`${tmpl.name} — ${new Date().toLocaleDateString()}`);
    }
  };

  const handleInsertVariable = (variableToken: string) => {
    setBody((prev) => `${prev} ${variableToken}`);
  };

  // Step 3 Personalization preview
  const currentPreviewContact = selectedContacts[previewContactIdx] || selectedContacts[0] || {
    business_name: 'Pebbles Rentals & Events',
    contact_name: 'Amina Bello',
    business_type: 'Event Rentals',
    location: 'Wuse 2, Abuja',
    website: 'https://pebblesevents.com',
  };

  const renderedSubjectPreview = useMemo(() => {
    return personalizeTemplate(subject, currentPreviewContact, {
      senderName,
      companyName: 'Rayida Tech',
    });
  }, [subject, currentPreviewContact, senderName]);

  const renderedBodyPreview = useMemo(() => {
    return personalizeTemplate(body, currentPreviewContact, {
      senderName,
      companyName: 'Rayida Tech',
      unsubscribeUrl: '#',
    });
  }, [body, currentPreviewContact, senderName]);

  // Step 4 Send Test Email
  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !isValidEmailAddress(testEmailAddress)) {
      setTestStatus('error');
      setTestMessage('Please provide a valid test recipient email address.');
      return;
    }

    setTestStatus('sending');
    setTestMessage('');

    const res = await sendTestEmailAction({
      provider,
      senderName,
      senderEmail,
      replyTo,
      testRecipientEmail: testEmailAddress,
      subject,
      body,
      sampleContact: currentPreviewContact,
    });

    if (res.success) {
      setTestStatus('success');
      setTestMessage(
        res.simulated
          ? `Simulated test sent for ${testEmailAddress} (Logged to console).`
          : `Live test email dispatched successfully via ${provider.toUpperCase()} to ${testEmailAddress}!`
      );
    } else {
      setTestStatus('error');
      setTestMessage(res.error || 'Failed to dispatch test email.');
    }
  };

  // Step 5 Launch Campaign creation
  const handleConfirmAndLaunch = () => {
    setGeneralError('');
    startTransition(async () => {
      const res = await createEmailCampaign({
        name: campaignName || `Outreach Campaign — ${new Date().toLocaleDateString()}`,
        subject,
        body,
        provider,
        senderName,
        senderEmail,
        replyTo,
        contactIds: Array.from(selectedIds),
      });

      if (res.success && res.campaignId) {
        setCreatedCampaignId(res.campaignId);
        setDispatchProgress({
          sent: 0,
          failed: 0,
          total: res.recipientsCount || 0,
        });
        setCurrentStep(6);
        // Start first batch dispatch
        startBatchDispatch(res.campaignId, res.recipientsCount || 0);
      } else {
        setGeneralError(res.error || 'Failed to initialize campaign.');
      }
    });
  };

  // Step 6 Controlled batch dispatch loop
  const startBatchDispatch = async (campId: string, total: number) => {
    setDispatchStatus('sending');
    setDispatchLogs((prev) => [`[${new Date().toLocaleTimeString()}] Campaign initialized. Starting controlled queue processing...`, ...prev]);

    let remaining = total;
    let totalSent = 0;
    let totalFailed = 0;

    while (remaining > 0) {
      try {
        const batchRes = await launchCampaignBatch(campId, 6);

        if (!batchRes.success) {
          setDispatchStatus('error');
          setDispatchLogs((prev) => [`[${new Date().toLocaleTimeString()}] Batch error: ${batchRes.error}`, ...prev]);
          break;
        }

        totalSent += batchRes.sent;
        totalFailed += batchRes.failed;
        remaining = batchRes.remaining;

        setDispatchProgress({ sent: totalSent, failed: totalFailed, total });
        setDispatchLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Processed batch: ${batchRes.sent} sent, ${batchRes.failed} failed. (${remaining} remaining)`,
          ...prev,
        ]);

        if (batchRes.completed || remaining === 0) {
          setDispatchStatus('completed');
          setDispatchLogs((prev) => [`[${new Date().toLocaleTimeString()}] Campaign execution complete! All batches sent.`, ...prev]);
          router.refresh();
          break;
        }

        // Delay 1 second between batches to guarantee zero rate-limit blocks
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err: unknown) {
        setDispatchStatus('error');
        setDispatchLogs((prev) => [`[${new Date().toLocaleTimeString()}] Unexpected dispatch exception: ${String(err)}`, ...prev]);
        break;
      }
    }
  };

  return (
    <div>
      {/* 6-Step Visual Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {[
          { step: 1, label: '1. Recipients', icon: Users },
          { step: 2, label: '2. Create Email', icon: Mail },
          { step: 3, label: '3. Preview', icon: Eye },
          { step: 4, label: '4. Test Email', icon: Send },
          { step: 5, label: '5. Confirm', icon: CheckCircle2 },
          { step: 6, label: '6. Send & Queue', icon: Sparkles },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;
          const Icon = item.icon;

          return (
            <button
              key={item.step}
              type="button"
              disabled={item.step === 6 && !createdCampaignId}
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-primary/20 border-primary text-paper shadow-md shadow-primary/20'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-pointer'
                  : 'bg-white/[0.02] border-(--line) text-mist-2 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </div>
              <div className="text-[10px] font-mono-tight text-mist-2">
                {isDone ? 'Completed' : isActive ? 'Active Step' : 'Pending'}
              </div>
            </button>
          );
        })}
      </div>

      {generalError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* STEP 1: SELECT RECIPIENTS */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <GlassCard className="p-6 border border-(--line)">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--line) mb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-paper">
                  Select Campaign Recipients
                </h3>
                <p className="text-xs text-mist-2">
                  Choose from your imported prospect database. Only valid, non-unsubscribed emails will receive outreach.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllEligible}
                  className="px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-medium text-paper transition-all cursor-pointer"
                >
                  Select All Eligible ({eligibleContacts.length})
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 rounded-lg text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by business name, contact, email, location..."
                  className="w-full bg-white/5 border border-(--line) rounded-xl pl-10 pr-4 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 bg-white/5 border border-(--line) rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
              >
                <option value="All" className="bg-ink text-paper">All Statuses</option>
                <option value="Ready to Contact" className="bg-ink text-paper">Ready to Contact</option>
                <option value="New" className="bg-ink text-paper">New</option>
                <option value="Email Sent" className="bg-ink text-paper">Email Sent</option>
                <option value="Follow-Up Required" className="bg-ink text-paper">Follow-Up Required</option>
              </select>
            </div>

            {/* Contact Selector Table */}
            <div className="rounded-xl overflow-hidden border border-(--line) max-h-96 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[var(--ink-deep)] border-b border-(--line)">
                  <tr>
                    <th className="px-3 py-2.5 text-left w-8">
                      <input
                        type="checkbox"
                        checked={
                          filteredContacts.length > 0 &&
                          filteredContacts.every((c) => selectedIds.has(c.id))
                        }
                        onChange={() => {
                          const allSelected = filteredContacts.every((c) => selectedIds.has(c.id));
                          const next = new Set(selectedIds);
                          filteredContacts.forEach((c) => {
                            if (allSelected) next.delete(c.id);
                            else next.add(c.id);
                          });
                          setSelectedIds(next);
                        }}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-2.5 text-left text-mist-2">Business Name</th>
                    <th className="px-3 py-2.5 text-left text-mist-2">Contact Person</th>
                    <th className="px-3 py-2.5 text-left text-mist-2">Email</th>
                    <th className="px-3 py-2.5 text-left text-mist-2">Location</th>
                    <th className="px-3 py-2.5 text-center text-mist-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--line)">
                  {filteredContacts.map((contact) => {
                    const isSelected = selectedIds.has(contact.id);
                    const isInvalid = !contact.email || !isValidEmailAddress(contact.email) || contact.outreach_status === 'Unsubscribed';

                    return (
                      <tr
                        key={contact.id}
                        onClick={() => toggleSelect(contact.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary/10' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded accent-primary cursor-pointer pointer-events-none"
                          />
                        </td>
                        <td className="px-3 py-2.5 font-medium text-paper">
                          {contact.business_name}
                        </td>
                        <td className="px-3 py-2.5 text-mist-1">
                          {contact.contact_name || (
                            <span className="italic text-mist-2">Uses business name</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 font-mono-tight">
                          {contact.email ? (
                            <span>{contact.email}</span>
                          ) : (
                            <span className="text-rose-400 italic">Missing Email</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-mist-1">
                          {contact.location || '—'}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {isInvalid ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/20">
                              {contact.outreach_status}
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                              {contact.outreach_status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-(--line) mt-4">
              <div className="text-xs text-mist-1">
                <span className="font-semibold text-paper">{selectedIds.size}</span> selected &bull;{' '}
                <span className="text-emerald-400 font-semibold">{selectedValidCount}</span> eligible for email
                {selectedInvalidCount > 0 && (
                  <span className="text-rose-300 ml-1">({selectedInvalidCount} skipped)</span>
                )}
              </div>

              <button
                type="button"
                disabled={selectedValidCount === 0}
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>Proceed to Email Content</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 2: CREATE EMAIL CONTENT & PROVIDER */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8 border border-(--line)">
            {/* Template Selector Bar */}
            <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-(--line)">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-paper flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  <span>Load Pre-Built Outreach Template</span>
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs text-mist-1 hover:text-paper transition-all cursor-pointer"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Abuja Event Vendors Outreach — Nov 2026"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Sending Provider *
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as EmailProvider)}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                >
                  <option value="resend" className="bg-ink text-paper">
                    Resend API (Verified Domain)
                  </option>
                  <option value="zoho" className="bg-ink text-paper">
                    Zoho Mail (Business Mailbox)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Sender Identity Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Sender Email Address
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Email Subject Line */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-paper mb-1">
                Email Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="A website idea for {{business_name}}"
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-medium"
              />
            </div>

            {/* Variable Pills */}
            <div className="mb-2">
              <div className="text-[11px] font-mono-tight text-mist-2 uppercase mb-1.5 flex items-center justify-between">
                <span>Click to insert dynamic variable</span>
                <span>Substitutes per recipient</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {TEMPLATE_VARIABLES.map((v) => (
                  <button
                    key={v.token}
                    type="button"
                    onClick={() => handleInsertVariable(v.token)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/25 text-primary text-[11px] font-mono-tight transition-colors cursor-pointer"
                    title={v.desc}
                  >
                    <span>{v.token}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-xs font-medium text-paper mb-1">
                Email Body Text / Template *
              </label>
              <textarea
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl p-4 text-xs sm:text-sm text-paper focus:outline-none focus:border-primary/50 font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-(--line) mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
              >
                &larr; Back to Recipients
              </button>

              <button
                type="button"
                disabled={!subject.trim() || !body.trim()}
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>Preview Personalization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 3: PERSONALIZATION PREVIEW */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8 border border-(--line)">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--line) mb-6">
              <div>
                <h3 className="font-display text-base font-semibold text-paper">
                  Personalization Preview
                </h3>
                <p className="text-xs text-mist-2">
                  Verify how your email resolves variables for each individual prospect.
                </p>
              </div>

              {/* Recipient switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-mist-2">Previewing:</span>
                <select
                  value={previewContactIdx}
                  onChange={(e) => setPreviewContactIdx(Number(e.target.value))}
                  className="bg-white/5 border border-(--line) rounded-lg px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                >
                  {selectedContacts.slice(0, 30).map((c, idx) => (
                    <option key={c.id} value={idx} className="bg-ink text-paper">
                      {c.business_name} ({c.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Header Preview Box */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-2 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-mist-2 w-16">To:</span>
                <span className="font-mono-tight text-paper font-medium">
                  {currentPreviewContact.email || 'no-email@prospect.com'}
                </span>
                <span className="text-mist-2">({currentPreviewContact.business_name})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-mist-2 w-16">From:</span>
                <span className="text-mist-1">
                  {senderName} &lt;{senderEmail}&gt; via <strong className="uppercase text-secondary">{provider}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-(--line)">
                <span className="text-mist-2 w-16">Subject:</span>
                <span className="font-medium text-paper text-sm">
                  {renderedSubjectPreview}
                </span>
              </div>
            </div>

            {/* Rendered HTML preview container */}
            <div className="rounded-xl overflow-hidden border border-(--line) bg-white p-6 sm:p-8 text-neutral-800 shadow-xl">
              <div className="max-w-xl mx-auto space-y-4 text-sm leading-relaxed whitespace-pre-line font-sans">
                {renderedBodyPreview}
              </div>

              {/* Unsubscribe footer preview */}
              <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500 space-y-1">
                <p>
                  Sent to <strong>{currentPreviewContact.business_name}</strong> by {senderName} &bull; Rayida Tech<br/>
                  Abuja, Federal Capital Territory, Nigeria
                </p>
                <p className="text-[11px] text-neutral-400">
                  <span className="underline text-purple-600">Unsubscribe with 1 click</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-(--line) mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
              >
                &larr; Edit Content
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all cursor-pointer"
              >
                <span>Proceed to Test Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 4: TEST EMAIL */}
      {currentStep === 4 && (
        <div className="space-y-6 max-w-xl mx-auto">
          <GlassCard className="p-6 sm:p-8 border border-(--line) text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
              <Send className="w-7 h-7" />
            </div>

            <h3 className="font-display text-lg font-semibold text-paper mb-1">
              Send a Real Test Email to Yourself
            </h3>
            <p className="text-xs text-mist-2 max-w-md mx-auto mb-6">
              Before sending to {selectedValidCount} real businesses, dispatch an authentic test email to your inbox to inspect rendering, subject line, and formatting.
            </p>

            <div className="text-left mb-6">
              <label className="block text-xs font-medium text-paper mb-1.5">
                Destination Test Email Address
              </label>
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full bg-white/5 border border-(--line) rounded-xl px-4 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
              />
            </div>

            {testMessage && (
              <div
                className={`p-3 rounded-xl mb-6 text-xs text-left animate-fade-in ${
                  testStatus === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                }`}
              >
                {testMessage}
              </div>
            )}

            <button
              type="button"
              disabled={testStatus === 'sending'}
              onClick={handleSendTestEmail}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-ink font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {testStatus === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Test Email via {provider.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Test Email via {provider.toUpperCase()}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-6 border-t border-(--line) mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
              >
                &larr; Back to Preview
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all cursor-pointer"
              >
                <span>Proceed to Confirmation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 5: CONFIRM CAMPAIGN */}
      {currentStep === 5 && (
        <div className="space-y-6 max-w-xl mx-auto">
          <GlassCard className="p-6 sm:p-8 border border-(--line)">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-paper">
                Confirm &amp; Queue Campaign
              </h3>
              <p className="text-xs text-mist-2">
                Review your campaign parameters before the queue processor launches.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-(--line) text-xs mb-6">
              <div className="flex justify-between py-1.5 border-b border-(--line)">
                <span className="text-mist-2">Campaign Name:</span>
                <span className="font-semibold text-paper">{campaignName || 'Unnamed Campaign'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-(--line)">
                <span className="text-mist-2">Sending Provider:</span>
                <span className="font-mono-tight text-secondary uppercase font-semibold">{provider}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-(--line)">
                <span className="text-mist-2">Sender Identity:</span>
                <span className="text-paper">{senderName} &lt;{senderEmail}&gt;</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-(--line)">
                <span className="text-mist-2">Subject Template:</span>
                <span className="text-paper font-medium">{subject}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-(--line)">
                <span className="text-mist-2">Eligible Recipients:</span>
                <span className="text-emerald-400 font-bold font-mono-tight">{selectedValidCount} businesses</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-mist-2">Missing/Suppressed:</span>
                <span className="text-rose-300 font-mono-tight">{selectedInvalidCount} skipped</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-mist-1 mb-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Sending operates in controlled batches (6 emails at a time) to respect provider rate limits and prevent spam triggers.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
              >
                &larr; Back
              </button>

              <button
                type="button"
                disabled={isPending || selectedValidCount === 0}
                onClick={handleConfirmAndLaunch}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-lg shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Campaign Queue...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Campaign for {selectedValidCount} Recipients</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 6: SEND & LIVE PROGRESS */}
      {currentStep === 6 && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <GlassCard className="p-6 sm:p-8 border border-(--line)">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-paper">
                  Campaign Dispatch Progress
                </h3>
                <p className="text-xs text-mist-2">
                  Controlled background queue processing.
                </p>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono-tight font-medium ${
                  dispatchStatus === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : dispatchStatus === 'sending'
                    ? 'bg-secondary/20 text-secondary border border-secondary/30 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {dispatchStatus.toUpperCase()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 space-y-2">
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      dispatchProgress.total > 0
                        ? Math.round((dispatchProgress.sent / dispatchProgress.total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono-tight text-mist-1">
                <span>
                  {dispatchProgress.sent} of {dispatchProgress.total} dispatched
                </span>
                <span>
                  {dispatchProgress.total > 0
                    ? Math.round((dispatchProgress.sent / dispatchProgress.total) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>

            {/* Terminal Live Event Stream */}
            <div className="rounded-xl bg-black/60 border border-(--line) p-4 font-mono-tight text-xs text-mist-1 max-h-56 overflow-y-auto space-y-1 mb-6">
              {dispatchLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-(--line)">
              {createdCampaignId && (
                <Link
                  href={`/admin/outreach/campaigns/${createdCampaignId}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all"
                >
                  <span>Open Campaign Analytics &rarr;</span>
                </Link>
              )}

              <Link
                href="/admin/outreach"
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors"
              >
                Return to Outreach Hub
              </Link>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

