import { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck, AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { processPublicUnsubscribe } from '@/app/actions/outreach-suppressions';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import BrandLogo from '@/components/ui/BrandLogo';

export const metadata: Metadata = {
  title: 'Unsubscribe Preferences | Rayida Tech',
  description: 'Manage your email outreach and communication preferences with Rayida Tech.',
  robots: 'noindex, nofollow',
};

export default async function UnsubscribePage(props: {
  searchParams: Promise<{ email?: string; token?: string; cid?: string }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams.email || '';
  const token = searchParams.token || '';
  const campaignId = searchParams.cid || '';

  let result = {
    success: false,
    message: 'Missing email or security token. Please check your link.',
  };

  if (email && token) {
    result = await processPublicUnsubscribe(email, token, campaignId);
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Container size="narrow" className="relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <BrandLogo className="h-8 w-auto mx-auto" />
          </Link>
        </div>

        <GlassCard className="p-8 sm:p-10 text-center border border-(--line) shadow-2xl">
          {result.success ? (
            <div>
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MailCheck className="w-8 h-8" />
              </div>
              <h1 className="font-display text-2xl font-semibold text-paper mb-2">
                Preferences Updated
              </h1>
              <p className="text-sm text-mist-1 max-w-md mx-auto mb-6 leading-relaxed">
                {result.message}
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-(--line) text-xs text-mist-2 mb-8 max-w-sm mx-auto flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Your address has been placed on our permanent suppression list.</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h1 className="font-display text-2xl font-semibold text-paper mb-2">
                Unable to Process Request
              </h1>
              <p className="text-sm text-mist-1 max-w-md mx-auto mb-6 leading-relaxed">
                {result.message}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-(--line)">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-mist-1 hover:text-paper transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Rayida Tech Home</span>
            </Link>
          </div>
        </GlassCard>

        <p className="text-center text-xs text-mist-2 mt-6">
          Rayida Tech &bull; Raymond Gaius &bull; Abuja, Nigeria
        </p>
      </Container>
    </main>
  );
}

