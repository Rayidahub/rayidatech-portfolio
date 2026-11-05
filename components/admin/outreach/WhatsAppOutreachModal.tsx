'use client';

import { useState, useTransition } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Phone,
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import type { OutreachContact } from '@/types/outreach';
import {
  DEFAULT_WHATSAPP_TEMPLATES,
  formatWhatsAppPhoneNumber,
  isValidWhatsAppNumber,
  personalizeWhatsAppMessage,
  generateWhatsAppChatUrl,
} from '@/lib/whatsapp/whatsapp-utils';
import {
  recordWhatsAppOutreachAction,
  sendBulkWhatsAppApiAction,
  type WhatsAppSendResult,
} from '@/app/actions/outreach-whatsapp';

interface WhatsAppOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: OutreachContact[];
  onContactUpdated?: (contactId: string) => void;
}

export default function WhatsAppOutreachModal({
  isOpen,
  onClose,
  contacts,
  onContactUpdated,
}: WhatsAppOutreachModalProps) {
  // Filter contacts that have a phone number
  const eligibleContacts = contacts.filter((c) => Boolean(c.phone && c.phone.trim()));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_WHATSAPP_TEMPLATES[0].id);
  const [templateText, setTemplateText] = useState(DEFAULT_WHATSAPP_TEMPLATES[0].text);
  const [customPhone, setCustomPhone] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());

  // API mode states
  const [isApiMode, setIsApiMode] = useState(false);
  const [isApiSending, startApiTransition] = useTransition();
  const [apiResults, setApiResults] = useState<{
    sent: number;
    failed: number;
    total: number;
    apiConfigured: boolean;
    results: WhatsAppSendResult[];
  } | null>(null);

  if (!isOpen) return null;

  const currentContact = eligibleContacts[currentIndex] || contacts[0];
  const activeRawPhone = currentContact
    ? customPhone[currentContact.id] ?? (currentContact.phone || '')
    : '';
  const cleanPhone = formatWhatsAppPhoneNumber(activeRawPhone);
  const isValidPhone = isValidWhatsAppNumber(cleanPhone);

  const personalizedMessage = currentContact
    ? personalizeWhatsAppMessage(templateText, currentContact)
    : '';

  const whatsAppUrl = isValidPhone
    ? generateWhatsAppChatUrl(cleanPhone, personalizedMessage)
    : '';

  const handleSelectTemplate = (id: string) => {
    const tmpl = DEFAULT_WHATSAPP_TEMPLATES.find((t) => t.id === id);
    if (tmpl) {
      setSelectedTemplateId(tmpl.id);
      setTemplateText(tmpl.text);
    }
  };

  const handleCopyMessage = () => {
    if (!personalizedMessage) return;
    navigator.clipboard.writeText(personalizedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = (markAsContacted = true) => {
    if (!whatsAppUrl) return;

    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');

    if (markAsContacted && currentContact) {
      setContactedIds((prev) => new Set(prev).add(currentContact.id));
      recordWhatsAppOutreachAction(currentContact.id);
      if (onContactUpdated) onContactUpdated(currentContact.id);
    }
  };

  const handleOpenAndNext = () => {
    handleOpenWhatsApp(true);
    if (currentIndex < eligibleContacts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRunApiBulk = () => {
    startApiTransition(async () => {
      const ids = eligibleContacts.map((c) => c.id);
      const res = await sendBulkWhatsAppApiAction(ids, templateText);
      setApiResults({
        sent: res.sent,
        failed: res.failed,
        total: res.total,
        apiConfigured: res.apiConfigured,
        results: res.results,
      });
    });
  };

  const isMultiMode = eligibleContacts.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="glass-strong border border-(--line) rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-(--line) flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-semibold text-paper">
                  WhatsApp Direct Outreach
                </h2>
                <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  100% Ban-Free
                </span>
              </div>
              <p className="text-xs text-mist-2">
                Personalized direct WhatsApp messaging for Abuja prospects and team members.
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

        {/* Multi-Lead Sequence Tracker Bar */}
        {isMultiMode && (
          <div className="px-5 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-paper">
                Lead {currentIndex + 1} of {eligibleContacts.length}:
              </span>
              <span className="text-emerald-400 font-medium truncate max-w-[200px]">
                {currentContact?.business_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / eligibleContacts.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[11px] font-mono-tight text-mist-2">
                {Math.round(((currentIndex + 1) / eligibleContacts.length) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Target Lead Detail Card */}
          {currentContact ? (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-(--line) space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-semibold text-paper flex items-center gap-2">
                    <Building className="w-4 h-4 text-secondary shrink-0" />
                    <span>{currentContact.business_name}</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-mist-2 text-[11px] mt-1">
                    {currentContact.business_type && (
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                        {currentContact.business_type}
                      </span>
                    )}
                    {currentContact.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span>{currentContact.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone editor */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <label className="block text-[10px] font-mono-tight text-mist-2 uppercase">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={activeRawPhone}
                      onChange={(e) =>
                        setCustomPhone((prev) => ({
                          ...prev,
                          [currentContact.id]: e.target.value,
                        }))
                      }
                      placeholder="e.g. 08103905299"
                      className="bg-white/5 border border-(--line) rounded-lg px-2.5 py-1 text-xs text-paper font-mono-tight focus:outline-none focus:border-emerald-500/50 w-36"
                    />
                  </div>
                </div>
              </div>

              {!isValidPhone && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Please provide a valid 10 or 11 digit Nigerian phone number.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-mist-2">
              No contacts with phone numbers found in selection.
            </div>
          )}

          {/* Quick Pitch Templates */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono-tight text-mist-2 uppercase">
                Choose Pitch Template
              </span>
              <span className="text-[10px] text-secondary">
                Auto-personalizes variables
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEFAULT_WHATSAPP_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-paper shadow-sm'
                        : 'bg-white/[0.02] border-(--line) text-mist-2 hover:text-paper hover:bg-white/5'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-0.5">{tmpl.name}</div>
                    <div className="text-[10px] text-mist-2 line-clamp-1">{tmpl.text}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Template Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono-tight text-mist-2 uppercase">
                Message Body
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1 text-[11px] text-secondary hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full bg-white/5 border border-(--line) rounded-xl p-3 text-xs text-paper focus:outline-none focus:border-emerald-500/50 font-sans leading-relaxed"
            />
          </div>

          {/* WhatsApp Preview Bubble */}
          <div>
            <div className="text-[11px] font-mono-tight text-mist-2 uppercase mb-1.5 flex items-center justify-between">
              <span>WhatsApp Message Preview</span>
              <span className="text-emerald-400">Target: +{cleanPhone}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0b141a] border border-[#222e35] shadow-inner relative overflow-hidden">
              <div className="max-w-md ml-auto bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-xs p-3.5 shadow-md space-y-2 text-xs leading-relaxed whitespace-pre-line font-sans">
                {personalizedMessage}
                <div className="text-right text-[10px] text-[#8696a0] font-mono-tight pt-1">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Automated API Background Dispatcher Accordion */}
          <div className="pt-2 border-t border-(--line)">
            <button
              type="button"
              onClick={() => setIsApiMode(!isApiMode)}
              className="inline-flex items-center gap-1.5 text-xs text-mist-2 hover:text-paper transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Automated Background API Dispatch (Termii / Twilio / Meta)</span>
              <span className="text-[10px] text-mist-2">({isApiMode ? 'Hide' : 'Show'})</span>
            </button>

            {isApiMode && (
              <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-(--line) space-y-3 animate-fade-in">
                <p className="text-mist-2 leading-relaxed">
                  To send hundreds of messages silently in the background without clicking through WhatsApp Web, configure a Nigerian messaging gateway like <strong>Termii</strong> by adding your API key to <code>.env.local</code>:
                </p>
                <div className="p-2.5 rounded-lg bg-black/40 font-mono-tight text-[11px] text-secondary">
                  TERMII_API_KEY=your_termii_api_key<br />
                  TERMII_SENDER_ID=RayidaTech
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isApiSending || eligibleContacts.length === 0}
                    onClick={handleRunApiBulk}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/90 text-ink font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Automated API Dispatch ({eligibleContacts.length} leads)</span>
                  </button>
                </div>

                {apiResults && (
                  <div className="mt-2 p-3 rounded-lg bg-white/5 border border-(--line) text-[11px]">
                    <div className="font-semibold text-paper mb-1">
                      {apiResults.apiConfigured
                        ? `API Dispatch Complete: ${apiResults.sent} sent, ${apiResults.failed} failed.`
                        : `Simulated API Dispatch: Processed ${apiResults.sent} contacts. Add TERMII_API_KEY to send live.`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-(--line) flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
          {/* Navigation for sequence */}
          {isMultiMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl border border-(--line) text-mist-2 hover:text-paper hover:bg-white/5 disabled:opacity-40 transition-colors cursor-pointer"
                title="Previous Lead"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={currentIndex >= eligibleContacts.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(eligibleContacts.length - 1, prev + 1))}
                className="px-3 py-2 rounded-xl border border-(--line) text-mist-2 hover:text-paper hover:bg-white/5 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <span>Skip Lead</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
            >
              Close
            </button>
          )}

          {/* Primary Action Button */}
          <div className="flex items-center gap-2">
            {isMultiMode ? (
              <button
                type="button"
                disabled={!isValidPhone}
                onClick={handleOpenAndNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  Open WhatsApp &amp; Next Lead
                  {currentIndex < eligibleContacts.length - 1 ? ' →' : ' (Finish)'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled={!isValidPhone}
                onClick={() => handleOpenWhatsApp(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat in WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
