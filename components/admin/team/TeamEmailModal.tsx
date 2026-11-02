'use client';

import { useState, useTransition } from 'react';
import {
  X,
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  Edit3,
  Users,
} from 'lucide-react';
import {
  sendTeamDirectEmailAction,
  type TeamMemberRecipient,
  type SendTeamEmailResult,
} from '@/app/actions/team-email';
import {
  personalizeTeamMessage,
  buildTeamHtmlEmail,
} from '@/lib/email/team-email-utils';
import type { EmailProvider } from '@/types/outreach';

interface TeamEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Array<{
    id: string;
    name: string;
    role?: string;
    email?: string | null;
  }>;
}

const PRESET_TEMPLATES = [
  {
    id: 'announcement',
    name: 'Team Announcement',
    subject: 'Company Briefing & Project Updates — {{company_name}}',
    body: `Hello {{name}},

I wanted to share a quick internal briefing regarding our upcoming project rollouts and client delivery milestones at {{company_name}}.

Please review your active tasks and let me know if there are any blockers or resources needed to ensure smooth execution this week.

Thank you for your dedication to building experiences people can trust!

Best regards,
{{sender_name}}
{{company_name}}`,
  },
  {
    id: 'sprint_sync',
    name: 'Sprint & Role Sync',
    subject: 'Sprint Sync & Priorities — {{role}}',
    body: `Hi {{name}},

As we push forward with our current design and engineering deliverables, I would like to quickly sync on your key priorities for this cycle.

Could you share a brief bulleted update on your current progress and expected timeline?

Thanks for your hard work!

Warm regards,
{{sender_name}}
{{company_name}}`,
  },
  {
    id: 'checkin',
    name: '1-on-1 Check-in',
    subject: 'Quick 1-on-1 check-in with {{sender_name}}',
    body: `Hi {{name}},

I'd love to set aside 15–20 minutes this week for a casual 1-on-1 check-in to discuss how things are going, your recent work in {{role}}, and any ideas you'd like to explore.

Let me know what day and time works best for your schedule.

Best,
{{sender_name}}
{{company_name}}`,
  },
  {
    id: 'custom',
    name: 'Custom Note',
    subject: 'Note from {{sender_name}}',
    body: `Hi {{name}},

`,
  },
];

const VARIABLE_PILLS = [
  { token: '{{name}}', label: 'Member Name' },
  { token: '{{role}}', label: 'Member Role' },
  { token: '{{email}}', label: 'Member Email' },
  { token: '{{sender_name}}', label: 'Raymond Gaius' },
  { token: '{{company_name}}', label: 'Rayida Tech' },
];

export default function TeamEmailModal({
  isOpen,
  onClose,
  members,
}: TeamEmailModalProps) {
  const [recipientList, setRecipientList] = useState<TeamMemberRecipient[]>(() =>
    members.map((m) => ({
      memberId: m.id,
      name: m.name,
      role: m.role || '',
      email: m.email || '',
    }))
  );

  const [provider, setProvider] = useState<EmailProvider>('resend');
  const [senderName, setSenderName] = useState('Raymond Gaius');
  const [senderEmail, setSenderEmail] = useState('info@rayidatech.name.ng');
  const [subject, setSubject] = useState(PRESET_TEMPLATES[0].subject);
  const [body, setBody] = useState(PRESET_TEMPLATES[0].body);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewMemberIdx, setPreviewMemberIdx] = useState(0);

  const [isSending, startTransition] = useTransition();
  const [result, setResult] = useState<SendTeamEmailResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleEmailChange = (memberId: string, newEmail: string) => {
    setRecipientList((prev) =>
      prev.map((r) => (r.memberId === memberId ? { ...r, email: newEmail } : r))
    );
  };

  const handleApplyPreset = (tmpl: (typeof PRESET_TEMPLATES)[0]) => {
    setSubject(tmpl.subject);
    setBody(tmpl.body);
  };

  const handleInsertVariable = (token: string) => {
    setBody((prev) => `${prev} ${token}`);
  };

  const handleSend = () => {
    setErrorMsg('');
    setResult(null);

    // Validation
    const invalidRecipients = recipientList.filter(
      (r) => !r.email.trim() || !r.email.includes('@')
    );

    if (invalidRecipients.length > 0) {
      setErrorMsg(
        `Please specify a valid email address for ${invalidRecipients.map((r) => r.name).join(', ')}.`
      );
      return;
    }

    if (!subject.trim() || !body.trim()) {
      setErrorMsg('Subject and message body are required.');
      return;
    }

    startTransition(async () => {
      const res = await sendTeamDirectEmailAction({
        recipients: recipientList,
        subject,
        body,
        provider,
        senderName,
        senderEmail,
      });

      setResult(res);
      if (!res.success && res.error) {
        setErrorMsg(res.error);
      }
    });
  };

  const previewMember = recipientList[previewMemberIdx] || recipientList[0] || {
    memberId: 'sample',
    name: 'Team Member',
    role: 'Product Engineer',
    email: 'team@rayidatech.name.ng',
  };

  const renderedSubjectPreview = personalizeTeamMessage(subject, previewMember, {
    senderName,
    companyName: 'Rayida Tech',
  });

  const renderedBodyPreview = personalizeTeamMessage(body, previewMember, {
    senderName,
    companyName: 'Rayida Tech',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong border border-(--line) rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-(--line) flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-paper flex items-center gap-2">
                <span>Message Team Member{recipientList.length > 1 ? 's' : ''}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                  {recipientList.length} recipient{recipientList.length === 1 ? '' : 's'}
                </span>
              </h2>
              <p className="text-xs text-mist-2">
                Dispatches branded direct internal email via {provider.toUpperCase()} engine.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {result && (
            <div
              className={`p-4 rounded-xl border ${
                result.sent > 0
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-medium mb-1">
                {result.sent > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  Dispatched {result.sent} of {result.total} message{result.total === 1 ? '' : 's'} successfully!
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] font-mono-tight">
                {result.results.map((r, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>
                      {r.name} &lt;{r.email}&gt;
                    </span>
                    <span className={r.success ? 'text-emerald-400' : 'text-rose-400'}>
                      {r.success ? 'Sent' : r.error || 'Failed'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recipient Cards with Inline Email Editor */}
          <div>
            <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-2">
              Recipients ({recipientList.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-40 overflow-y-auto p-1">
              {recipientList.map((r) => (
                <div
                  key={r.memberId}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-(--line) flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-paper truncate">{r.name}</span>
                    <span className="text-[10px] text-mist-2 truncate">{r.role}</span>
                  </div>
                  <input
                    type="email"
                    value={r.email}
                    onChange={(e) => handleEmailChange(r.memberId, e.target.value)}
                    placeholder="Enter email address..."
                    className="w-full bg-white/5 border border-(--line) rounded-lg px-2.5 py-1 text-xs text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sending Provider & Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-1">
                Dispatch Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as EmailProvider)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
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
              <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-1">
                Sender Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-1">
                Sender Address
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
              />
            </div>
          </div>

          {/* Quick Preset Templates */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono-tight text-mist-2 uppercase">
                Quick Template Presets
              </span>
              <span className="text-[10px] text-secondary">Loads pre-written message</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyPreset(tmpl)}
                  className="px-2.5 py-1 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs text-paper transition-all cursor-pointer"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-1">
              Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Internal Briefing for {{name}}"
              className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-medium"
            />
          </div>

          {/* Variable Pills */}
          <div>
            <div className="text-[10px] font-mono-tight text-mist-2 uppercase mb-1 flex items-center justify-between">
              <span>Insert Dynamic Variable</span>
              <span>Replaces per recipient</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {VARIABLE_PILLS.map((v) => (
                <button
                  key={v.token}
                  type="button"
                  onClick={() => handleInsertVariable(v.token)}
                  className="px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/25 text-primary text-[10px] font-mono-tight transition-colors cursor-pointer"
                  title={v.label}
                >
                  {v.token}
                </button>
              ))}
            </div>
          </div>

          {/* Body Editor or HTML Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono-tight text-mist-2 uppercase">
                Message Body *
              </label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="inline-flex items-center gap-1 text-[11px] text-secondary hover:underline cursor-pointer"
              >
                {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{previewMode ? 'Return to Editor' : 'Live Branded Preview'}</span>
              </button>
            </div>

            {previewMode ? (
              <div className="rounded-xl border border-(--line) bg-white p-5 text-neutral-800 shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 text-xs text-neutral-500">
                  <span>
                    Previewing for: <strong>{previewMember.name}</strong> ({previewMember.email || 'no email'})
                  </span>
                  {recipientList.length > 1 && (
                    <select
                      value={previewMemberIdx}
                      onChange={(e) => setPreviewMemberIdx(Number(e.target.value))}
                      className="border border-neutral-300 rounded px-2 py-0.5 text-xs text-neutral-700 bg-white"
                    >
                      {recipientList.map((m, i) => (
                        <option key={m.memberId} value={i}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="text-xs font-semibold text-neutral-900 mb-2">
                  Subject: {renderedSubjectPreview}
                </div>
                <div className="space-y-3 text-xs leading-relaxed whitespace-pre-line text-neutral-800 font-sans">
                  {renderedBodyPreview}
                </div>
              </div>
            ) : (
              <textarea
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl p-3 text-xs text-paper focus:outline-none focus:border-primary/50 font-sans leading-relaxed"
                placeholder="Type your direct message to the team member..."
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-(--line) flex items-center justify-between bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSending}
            onClick={handleSend}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching Email...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>
                  Send to {recipientList.length} Member{recipientList.length === 1 ? '' : 's'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

