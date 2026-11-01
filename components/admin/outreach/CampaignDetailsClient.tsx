'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Send,
  Pause,
  Play,
  XCircle,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Eye,
  ExternalLink,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import {
  launchCampaignBatch,
  pauseCampaignAction,
  resumeCampaignAction,
  cancelCampaignAction,
  createFollowUpCampaign,
} from '@/app/actions/outreach-campaigns';
import type { EmailCampaign, CampaignRecipient } from '@/types/outreach';

interface CampaignDetailsClientProps {
  campaign: EmailCampaign;
  recipients: CampaignRecipient[];
}

export default function CampaignDetailsClient({
  campaign,
  recipients,
}: CampaignDetailsClientProps) {
  const router = useRouter();

  const [currentCampaign, setCurrentCampaign] = useState<EmailCampaign>(campaign);
  const [recipientList, setRecipientList] = useState<CampaignRecipient[]>(recipients);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');
  const [selectedRecipientPreview, setSelectedRecipientPreview] = useState<CampaignRecipient | null>(null);

  // Follow-up modal
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpSubject, setFollowUpSubject] = useState(`Following up on {{business_name}}`);
  const [followUpBody, setFollowUpBody] = useState(`Hello {{contact_name}},

I wanted to quickly follow up on my earlier note regarding {{business_name}} and your digital presence in {{location}}.

I know how busy things get. If you are interested, I would be happy to share a brief 1-page visual concept or answer any questions you might have about building a high-performance web experience.

Let me know if this is something on your radar this quarter!

Best,
Raymond Gaius
Founder, Rayida Tech`);
  const [followUpDelay, setFollowUpDelay] = useState(3);
  const [followUpError, setFollowUpError] = useState('');
  const [isPending, startTransition] = useTransition();

  const queuedRecipients = recipientList.filter((r) => r.status === 'queued');
  const sentRecipients = recipientList.filter((r) => r.status === 'sent' || r.status === 'delivered');
  const failedRecipients = recipientList.filter((r) => r.status === 'failed');
  const bouncedRecipients = recipientList.filter((r) => r.status === 'bounced');

  // Launch batch sending
  const handleSendNextBatch = async () => {
    setIsProcessing(true);
    setProcessingMsg('Dispatching batch of 6 queued emails...');

    try {
      const res = await launchCampaignBatch(currentCampaign.id, 6);
      if (res.success) {
        setProcessingMsg(`Processed ${res.processed} emails (${res.sent} sent, ${res.failed} failed).`);
        router.refresh();
      } else {
        setProcessingMsg(`Error: ${res.error}`);
      }
    } catch (err: unknown) {
      setProcessingMsg(`Exception: ${String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendAllRemaining = async () => {
    setIsProcessing(true);
    setProcessingMsg('Starting continuous batch dispatch loop...');

    let remaining = queuedRecipients.length;

    while (remaining > 0) {
      const res = await launchCampaignBatch(currentCampaign.id, 6);
      if (!res.success) {
        setProcessingMsg(`Stopped due to error: ${res.error}`);
        break;
      }
      remaining = res.remaining;
      setProcessingMsg(`Dispatched batch. ${remaining} emails remaining in queue...`);

      if (res.completed || remaining === 0) {
        setProcessingMsg('All campaign emails sent successfully!');
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsProcessing(false);
    router.refresh();
  };

  const handlePause = () => {
    startTransition(async () => {
      await pauseCampaignAction(currentCampaign.id);
      setCurrentCampaign((prev) => ({ ...prev, status: 'paused' }));
      router.refresh();
    });
  };

  const handleResume = () => {
    startTransition(async () => {
      await resumeCampaignAction(currentCampaign.id);
      setCurrentCampaign((prev) => ({ ...prev, status: 'sending' }));
      router.refresh();
    });
  };

  const handleCancel = () => {
    if (!confirm('Are you sure you want to cancel remaining queued recipients?')) return;
    startTransition(async () => {
      await cancelCampaignAction(currentCampaign.id);
      setCurrentCampaign((prev) => ({ ...prev, status: 'cancelled' }));
      router.refresh();
    });
  };

  // Follow-up creation
  const handleCreateFollowUp = () => {
    setFollowUpError('');
    startTransition(async () => {
      const res = await createFollowUpCampaign(currentCampaign.id, {
        name: `Follow-Up #1: ${currentCampaign.name}`,
        subject: followUpSubject,
        body: followUpBody,
        delayDays: followUpDelay,
      });

      if (res.success && res.campaignId) {
        setIsFollowUpModalOpen(false);
        router.push(`/admin/outreach/campaigns/${res.campaignId}`);
      } else {
        setFollowUpError(res.error || 'Failed to create follow-up campaign.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <GlassCard className="p-4 border border-(--line) text-center">
          <span className="text-[10px] font-mono-tight text-mist-2 uppercase">Total</span>
          <div className="font-display text-2xl font-bold text-paper mt-1">
            {currentCampaign.total_recipients}
          </div>
          <span className="text-[10px] text-mist-2">recipients</span>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line) text-center">
          <span className="text-[10px] font-mono-tight text-mist-2 uppercase">Queued</span>
          <div className="font-display text-2xl font-bold text-amber-300 mt-1">
            {queuedRecipients.length}
          </div>
          <span className="text-[10px] text-mist-2">pending</span>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line) text-center">
          <span className="text-[10px] font-mono-tight text-mist-2 uppercase">Dispatched</span>
          <div className="font-display text-2xl font-bold text-secondary mt-1">
            {currentCampaign.sent_count}
          </div>
          <span className="text-[10px] text-mist-2">sent</span>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line) text-center">
          <span className="text-[10px] font-mono-tight text-mist-2 uppercase">Delivered</span>
          <div className="font-display text-2xl font-bold text-emerald-400 mt-1">
            {currentCampaign.delivered_count}
          </div>
          <span className="text-[10px] text-mist-2">verified</span>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line) text-center">
          <span className="text-[10px] font-mono-tight text-mist-2 uppercase">Opened</span>
          <div className="font-display text-2xl font-bold text-purple-300 mt-1">
            {currentCampaign.opened_count}
          </div>
          <span className="text-[10px] text-mist-2">telemetry</span>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line) text-center">
          <span className="text-[10px] font-mono-tight text-mist-2 uppercase">Failed/Bounced</span>
          <div className="font-display text-2xl font-bold text-rose-300 mt-1">
            {failedRecipients.length + bouncedRecipients.length}
          </div>
          <span className="text-[10px] text-mist-2">errors</span>
        </GlassCard>
      </div>

      {/* Campaign Actions Control Bar */}
      <GlassCard className="p-5 border border-(--line) flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentCampaign.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : currentCampaign.status === 'sending'
                  ? 'bg-secondary/15 text-secondary border border-secondary/20 animate-pulse'
                  : currentCampaign.status === 'paused'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  : 'bg-white/5 text-mist-2 border border-white/10'
              }`}
            >
              Status: {currentCampaign.status.toUpperCase()}
            </span>
            <span className="text-xs text-mist-2 font-mono-tight">
              Provider: <strong className="uppercase text-paper">{currentCampaign.provider}</strong>
            </span>
          </div>

          <p className="text-xs text-mist-1">
            Sender: {currentCampaign.sender_name} &lt;{currentCampaign.sender_email}&gt;
          </p>

          {processingMsg && (
            <p className="text-xs font-mono-tight text-secondary mt-2 animate-fade-in">
              &bull; {processingMsg}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {queuedRecipients.length > 0 && currentCampaign.status !== 'cancelled' && (
            <>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSendNextBatch}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-semibold text-paper transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send Next Batch (6)</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSendAllRemaining}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Send All ({queuedRecipients.length} Remaining)</span>
              </button>
            </>
          )}

          {currentCampaign.status === 'sending' && (
            <button
              type="button"
              disabled={isPending}
              onClick={handlePause}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Campaign</span>
            </button>
          )}

          {currentCampaign.status === 'paused' && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleResume}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-secondary/30 bg-secondary/10 text-secondary text-xs font-medium hover:bg-secondary/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume Campaign</span>
            </button>
          )}

          {queuedRecipients.length > 0 && currentCampaign.status !== 'cancelled' && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-medium hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Remainder</span>
            </button>
          )}

          {/* Schedule Follow-Up Button */}
          <button
            type="button"
            onClick={() => setIsFollowUpModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Schedule Follow-Up</span>
          </button>
        </div>
      </GlassCard>

      {/* Recipient Breakdown Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <div className="p-4 sm:p-5 border-b border-(--line) flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-paper">
              Recipient Breakdown &amp; Delivery Telemetry
            </h3>
            <p className="text-xs text-mist-2">
              Inspect each prospect&apos;s personalized subject, content, dispatch timestamp, and provider message ID.
            </p>
          </div>
          <span className="text-xs font-mono-tight text-mist-2">
            {recipientList.length} total recipients
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="px-4 py-3 text-left text-mist-2">Business / Contact</th>
                <th className="px-4 py-3 text-left text-mist-2">Destination Email</th>
                <th className="px-4 py-3 text-center text-mist-2">Status</th>
                <th className="px-4 py-3 text-left text-mist-2">Sent Timestamp</th>
                <th className="px-4 py-3 text-left text-mist-2">Provider Message ID</th>
                <th className="px-4 py-3 text-right text-mist-2">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {recipientList.map((recipient) => (
                <tr key={recipient.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-paper">{recipient.business_name}</div>
                    <div className="text-mist-2 text-[11px]">{recipient.contact_name || 'Business greeting'}</div>
                  </td>

                  <td className="px-4 py-3 font-mono-tight text-mist-1">
                    {recipient.email}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono-tight font-medium ${
                        recipient.status === 'delivered'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : recipient.status === 'sent'
                          ? 'bg-secondary/15 text-secondary border border-secondary/20'
                          : recipient.status === 'queued'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          : recipient.status === 'failed' || recipient.status === 'bounced'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                          : 'bg-white/5 text-mist-2'
                      }`}
                    >
                      {recipient.status.toUpperCase()}
                    </span>
                    {recipient.error_message && (
                      <div className="text-[10px] text-rose-300 line-clamp-1 mt-0.5" title={recipient.error_message}>
                        {recipient.error_message}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-mono-tight text-mist-2">
                    {recipient.sent_at ? new Date(recipient.sent_at).toLocaleString() : '—'}
                  </td>

                  <td className="px-4 py-3 font-mono-tight text-mist-2">
                    {recipient.provider_message_id ? (
                      <span className="truncate max-w-[140px] inline-block" title={recipient.provider_message_id}>
                        {recipient.provider_message_id}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedRecipientPreview(recipient)}
                      className="p-1.5 rounded-lg text-mist-2 hover:text-secondary hover:bg-white/5 transition-colors cursor-pointer"
                      title="Inspect personalized email content"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personalized Email Inspection Modal */}
      {selectedRecipientPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[var(--ink-deep)] border border-(--line) rounded-2xl p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-(--line) mb-4">
              <div>
                <h4 className="font-display text-base font-semibold text-paper">
                  Personalized Email for {selectedRecipientPreview.business_name}
                </h4>
                <p className="text-xs text-mist-2 font-mono-tight">
                  To: {selectedRecipientPreview.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecipientPreview(null)}
                className="p-1 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-(--line) text-xs mb-4">
              <span className="text-mist-2">Subject: </span>
              <span className="text-paper font-semibold">{selectedRecipientPreview.personalized_subject}</span>
            </div>

            <div className="p-5 rounded-xl bg-white text-neutral-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans shadow-inner">
              {selectedRecipientPreview.personalized_body}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecipientPreview(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-paper transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-Up Campaign Modal */}
      {isFollowUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[var(--ink-deep)] border border-(--line) rounded-2xl p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-(--line) mb-4">
              <div>
                <h4 className="font-display text-base font-semibold text-paper flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Create Smart Follow-Up Campaign</span>
                </h4>
                <p className="text-xs text-mist-2 mt-0.5">
                  Automatically targets recipients who received the first note and have not replied, bounced, or unsubscribed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFollowUpModalOpen(false)}
                className="p-1 text-mist-2 hover:text-paper cursor-pointer"
              >
                &times;
              </button>
            </div>

            {followUpError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {followUpError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Follow-Up Subject
                </label>
                <input
                  type="text"
                  value={followUpSubject}
                  onChange={(e) => setFollowUpSubject(e.target.value)}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Delay Interval (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={followUpDelay}
                  onChange={(e) => setFollowUpDelay(Number(e.target.value))}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
                <span className="text-[11px] text-mist-2 mt-0.5 block">
                  Recommended: 3 to 5 business days after initial outreach.
                </span>
              </div>

              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Follow-Up Body
                </label>
                <textarea
                  rows={8}
                  value={followUpBody}
                  onChange={(e) => setFollowUpBody(e.target.value)}
                  className="w-full bg-white/5 border border-(--line) rounded-xl p-3.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-(--line) mt-6">
              <button
                type="button"
                onClick={() => setIsFollowUpModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleCreateFollowUp}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Generate Follow-Up Campaign &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

