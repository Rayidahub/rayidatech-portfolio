'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cookie,
  ShieldCheck,
  Check,
  X,
  Settings,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  getStoredConsent,
  saveConsent,
  OPEN_PREFERENCES_EVENT,
  CookieConsentState,
} from '@/lib/privacy/cookie-consent';

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference switches
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getStoredConsent();

    if (!existing) {
      // First-time visitor: display banner
      setShowBanner(true);
    } else {
      // Populate preference state with existing selections
      setFunctional(existing.categories.functional);
      setAnalytics(existing.categories.analytics);
      setMarketing(existing.categories.marketing);
    }

    // Global listener for "Cookie Preferences" button clicks (e.g. from footer)
    const handleOpenModal = () => {
      const current = getStoredConsent();
      if (current) {
        setFunctional(current.categories.functional);
        setAnalytics(current.categories.analytics);
        setMarketing(current.categories.marketing);
      }
      setShowModal(true);
    };

    window.addEventListener(OPEN_PREFERENCES_EVENT, handleOpenModal);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handleOpenModal);
  }, []);

  if (!mounted) return null;

  const handleAcceptAll = () => {
    saveConsent('all');
    setShowBanner(false);
    setShowModal(false);
    setFunctional(true);
    setAnalytics(true);
    setMarketing(true);
  };

  const handleRejectNonEssential = () => {
    saveConsent('essential');
    setShowBanner(false);
    setShowModal(false);
    setFunctional(true);
    setAnalytics(false);
    setMarketing(false);
  };

  const handleSavePreferences = () => {
    saveConsent('custom', { functional, analytics, marketing });
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {/* =====================================================================
          1. FLOATING COOKIE CONSENT BANNER (Bottom-left/center on first visit)
          ===================================================================== */}
      {showBanner && !showModal && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-[#181832]/95 backdrop-blur-2xl border border-(--line) p-5 sm:p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-paper">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-display text-base font-semibold text-paper">
                    Privacy & Cookie Choices
                  </h3>
                  <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/25">
                    NDPA 2023
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-mist-1 leading-relaxed mb-4">
                  We use strictly necessary cookies to keep our website secure and operational. With your consent, we also use functional and privacy-focused analytics to improve technical performance. We never run third-party advertising cookies. Learn more in our{' '}
                  <Link
                    href="/cookie-policy"
                    className="text-secondary hover:underline underline-offset-2 font-medium"
                  >
                    Cookie Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-secondary hover:underline underline-offset-2 font-medium"
                  >
                    Privacy Policy
                  </Link>.
                </p>

                {/* Buttons Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectNonEssential}
                    className="px-4 py-2 rounded-xl bg-paper/10 hover:bg-paper/15 border border-(--line) text-paper text-xs font-medium transition-all cursor-pointer"
                  >
                    Reject Non-Essential
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-3 py-2 rounded-xl text-mist-1 hover:text-paper hover:bg-paper/5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                  >
                    <Settings className="w-3.5 h-3.5 text-secondary" />
                    <span>Manage Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* =====================================================================
          2. DETAILED COOKIE PREFERENCES MODAL
          ===================================================================== */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-[#181832] border border-(--line) rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-(--line) flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-secondary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="cookie-preferences-title"
                    className="font-display text-lg sm:text-xl font-bold text-paper"
                  >
                    Cookie & Data Preferences
                  </h2>
                  <p className="text-xs text-mist-2">
                    Governed by the Nigeria Data Protection Act (NDPA) 2023
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-mist-2 hover:text-paper hover:bg-paper/10 transition-colors cursor-pointer"
                aria-label="Close preferences"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Categories */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-mist-1">
              <p className="text-xs sm:text-sm leading-relaxed text-mist-1">
                Customize which storage categories you allow Rayida Tech to use. Strictly necessary
                cookies cannot be disabled as they are required for security, session verification,
                and basic site navigation.
              </p>

              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-[#141428] border border-(--line) flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-paper">1. Strictly Necessary</span>
                    <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-primary/20 text-accent-soft border border-primary/30 uppercase">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-mist-2 leading-relaxed">
                    Essential for website security, user authentication, and storing your consent preferences.
                    These do not store personally identifiable advertising information.
                  </p>
                </div>
                <div className="shrink-0 mt-1">
                  <div className="w-11 h-6 bg-primary/60 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-80">
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>

              {/* Category 2: Functional & Preferences */}
              <div className="p-4 rounded-2xl bg-[#141428] border border-(--line) flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-paper">2. Functional & Theme</span>
                    <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25 uppercase">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-mist-2 leading-relaxed">
                    Remembers your visual preferences (such as light or dark theme choice) and UI states across sessions.
                  </p>
                </div>
                <div className="shrink-0 mt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={functional}
                    onClick={() => setFunctional(!functional)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                      functional ? 'bg-primary justify-end' : 'bg-paper/20 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>

              {/* Category 3: Analytics & Performance */}
              <div className="p-4 rounded-2xl bg-[#141428] border border-(--line) flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-paper">3. Analytics & Telemetry</span>
                    <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25 uppercase">
                      Consent Required
                    </span>
                  </div>
                  <p className="text-xs text-mist-2 leading-relaxed">
                    Helps us understand aggregated page views and device performance to diagnose bottlenecks.
                    Data is stored securely in our private Supabase database and never sold to third parties.
                  </p>
                </div>
                <div className="shrink-0 mt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={analytics}
                    onClick={() => setAnalytics(!analytics)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                      analytics ? 'bg-primary justify-end' : 'bg-paper/20 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>

              {/* Category 4: Marketing & Advertising */}
              <div className="p-4 rounded-2xl bg-[#141428] border border-(--line) flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-paper">4. Marketing & Ad Tracking</span>
                    <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-paper/10 text-mist-2 border border-(--line) uppercase">
                      Not Used
                    </span>
                  </div>
                  <p className="text-xs text-mist-2 leading-relaxed">
                    Rayida Tech does not run third-party advertising pixels, cross-site trackers, or commercial data brokers. This category is disabled by default.
                  </p>
                </div>
                <div className="shrink-0 mt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={marketing}
                    onClick={() => setMarketing(!marketing)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                      marketing ? 'bg-primary justify-end' : 'bg-paper/20 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>

              {/* Legal links */}
              <div className="pt-2 flex items-center justify-between text-xs text-mist-2 border-t border-(--line)/50">
                <Link
                  href="/cookie-policy"
                  className="inline-flex items-center gap-1 text-secondary hover:underline"
                  onClick={() => setShowModal(false)}
                >
                  <span>Read full Cookie Policy</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-1 text-secondary hover:underline"
                  onClick={() => setShowModal(false)}
                >
                  <span>Privacy Policy (NDPA 2023)</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-(--line) bg-[#141428]/50 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2.5 rounded-xl border border-(--line) hover:bg-paper/5 text-paper text-xs font-medium transition-colors cursor-pointer"
              >
                Reject All Optional
              </button>
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 rounded-xl bg-paper/10 hover:bg-paper/20 border border-(--line) text-paper text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
