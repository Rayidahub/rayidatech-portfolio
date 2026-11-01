'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import {
  saveEmailSettings,
  testProviderConnectionAction,
} from '@/app/actions/outreach-templates';
import type { EmailSettings, EmailProvider } from '@/types/outreach';

interface ProviderSettingsClientProps {
  initialSettings: EmailSettings;
}

export default function ProviderSettingsClient({ initialSettings }: ProviderSettingsClientProps) {
  const router = useRouter();
  const [form, setForm] = useState<EmailSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Diagnostic states
  const [testingProvider, setTestingProvider] = useState<EmailProvider | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    provider: EmailProvider;
    connected: boolean;
    mode: 'live' | 'simulated';
    message: string;
  } | null>(null);

  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const handleTestConnection = async (provider: EmailProvider) => {
    setTestingProvider(provider);
    setDiagnosticResult(null);

    const res = await testProviderConnectionAction(provider);
    setDiagnosticResult(res);
    setTestingProvider(null);
  };

  const handleSave = () => {
    setErrorMsg('');
    setSaveSuccess(false);

    startTransition(async () => {
      const res = await saveEmailSettings(form);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to save email settings.');
      }
    });
  };

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhooks/resend`
    : 'https://rayidatech.name.ng/api/webhooks/resend';

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Provider Connectivity Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Resend Diagnostic Card */}
        <GlassCard className="p-6 border border-(--line) flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                  R
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-paper">Resend API</h3>
                  <span className="text-[10px] font-mono-tight text-mist-2">Official REST API</span>
                </div>
              </div>

              <span className="text-[11px] font-mono-tight px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
                Recommended
              </span>
            </div>

            <p className="text-xs text-mist-1 mb-4 leading-relaxed">
              High-throughput transactional &amp; outreach delivery with verified DKIM/SPF domain (<code className="text-secondary">rayidatech.name.ng</code>).
            </p>
          </div>

          <div className="pt-4 border-t border-(--line) flex items-center justify-between">
            <button
              type="button"
              disabled={testingProvider === 'resend'}
              onClick={() => handleTestConnection('resend')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-semibold text-paper transition-all disabled:opacity-50 cursor-pointer"
            >
              {testingProvider === 'resend' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              )}
              <span>Test Resend Connection</span>
            </button>

            <a
              href="https://resend.com/domains"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-mist-2 hover:text-paper inline-flex items-center gap-1"
            >
              <span>Domains</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </GlassCard>

        {/* Zoho Mail Diagnostic Card */}
        <GlassCard className="p-6 border border-(--line) flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400">
                  Z
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-paper">Zoho Mail</h3>
                  <span className="text-[10px] font-mono-tight text-mist-2">Business Mailbox / SMTP</span>
                </div>
              </div>

              <span className="text-[11px] font-mono-tight px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                Business Mail
              </span>
            </div>

            <p className="text-xs text-mist-1 mb-4 leading-relaxed">
              Direct dispatch from your Zoho business mailbox (<code className="text-amber-300">info@rayidatech.name.ng</code>) via secure SSL (port 465) or OAuth2 API.
            </p>
          </div>

          <div className="pt-4 border-t border-(--line) flex items-center justify-between">
            <button
              type="button"
              disabled={testingProvider === 'zoho'}
              onClick={() => handleTestConnection('zoho')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-semibold text-paper transition-all disabled:opacity-50 cursor-pointer"
            >
              {testingProvider === 'zoho' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Test Zoho SMTP</span>
            </button>

            <a
              href="https://mail.zoho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-mist-2 hover:text-paper inline-flex items-center gap-1"
            >
              <span>Mailbox</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </GlassCard>
      </div>

      {/* Diagnostic Alert Box */}
      {diagnosticResult && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-3 animate-fade-in ${
            diagnosticResult.connected
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          {diagnosticResult.connected ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div>
            <div className="font-semibold uppercase tracking-wider mb-0.5">
              {diagnosticResult.provider} Diagnostic: {diagnosticResult.connected ? 'Connected' : 'Connection Failed'} ({diagnosticResult.mode} mode)
            </div>
            <div>{diagnosticResult.message}</div>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <GlassCard className="p-6 sm:p-8 border border-(--line)">
        <h3 className="font-display text-base font-semibold text-paper mb-1">
          Default Outreach Sender Identity &amp; Provider
        </h3>
        <p className="text-xs text-mist-2 mb-6">
          These settings pre-populate every new cold email campaign you create.
        </p>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs mb-6">
          <div>
            <label className="block text-mist-1 font-medium mb-1.5">
              Default Provider for New Campaigns
            </label>
            <select
              value={form.default_provider}
              onChange={(e) =>
                setForm((p) => ({ ...p, default_provider: e.target.value as EmailProvider }))
              }
              className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
            >
              <option value="resend" className="bg-ink text-paper">Resend API (Recommended)</option>
              <option value="zoho" className="bg-ink text-paper">Zoho Mail</option>
            </select>
          </div>

          <div>
            <label className="block text-mist-1 font-medium mb-1.5">
              Default Sender Name
            </label>
            <input
              type="text"
              value={form.sender_name}
              onChange={(e) => setForm((p) => ({ ...p, sender_name: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-mist-1 font-medium mb-1.5">
              Default Sender Email (Must match verified domain)
            </label>
            <input
              type="email"
              value={form.sender_email}
              onChange={(e) => setForm((p) => ({ ...p, sender_email: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
            />
          </div>

          <div>
            <label className="block text-mist-1 font-medium mb-1.5">
              Default Reply-To Email
            </label>
            <input
              type="email"
              value={form.reply_to}
              onChange={(e) => setForm((p) => ({ ...p, reply_to: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
            />
          </div>

          <div>
            <label className="block text-mist-1 font-medium mb-1.5">
              Default Test Recipient Email
            </label>
            <input
              type="email"
              value={form.test_recipient_email}
              onChange={(e) => setForm((p) => ({ ...p, test_recipient_email: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
            />
            <span className="text-[11px] text-mist-2 mt-1 block">
              Where preview test emails are dispatched by default.
            </span>
          </div>

          <div>
            <label className="block text-mist-1 font-medium mb-1.5">
              Company / Brand Name
            </label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))}
              className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-(--line)">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </span>
          ) : (
            <div />
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Outreach Settings</span>
          </button>
        </div>
      </GlassCard>

      {/* Webhook Configuration Guide */}
      <GlassCard className="p-6 border border-(--line)">
        <h4 className="font-display text-sm font-semibold text-paper mb-1">
          Resend Webhook Endpoint URL
        </h4>
        <p className="text-xs text-mist-2 mb-4">
          Add this webhook endpoint in your Resend Dashboard (Webhooks &rarr; Add Webhook) to track real-time deliveries, bounces, opens, and clicks.
        </p>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-(--line)">
          <code className="text-xs font-mono-tight text-secondary flex-1 break-all">
            {webhookUrl}
          </code>
          <button
            type="button"
            onClick={handleCopyWebhook}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs text-paper transition-all cursor-pointer shrink-0"
          >
            {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

