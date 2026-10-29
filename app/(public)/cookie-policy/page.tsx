'use client';

import Link from 'next/link';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { Cookie, Settings, ShieldCheck, Mail, RefreshCw } from 'lucide-react';
import { triggerOpenCookiePreferences } from '@/lib/privacy/cookie-consent';

export default function CookiePolicyPage() {
  const lastUpdated = 'October 29, 2026';

  return (
    <main className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-ink">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full opacity-25 blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(128, 0, 255, 0.4) 0%, rgba(0, 209, 255, 0.25) 50%, transparent 75%)',
          }}
        />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      </div>

      <Container size="default" className="relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono-tight uppercase tracking-wider mb-4">
              <Cookie className="w-3.5 h-3.5 text-secondary" />
              <span>Technical Storage & Consent Policy</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-paper mb-4">
              Cookie <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-mist-1 text-base sm:text-lg leading-relaxed">
              Transparent disclosure of all cookies, local storage mechanisms, and telemetry utilized across Rayida Tech in compliance with the Nigeria Data Protection Act 2023.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={triggerOpenCookiePreferences}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Customize Your Cookie Preferences</span>
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-mist-2 font-mono-tight">
              <span>Effective Date: {lastUpdated}</span>
              <span>•</span>
              <span>Policy Version: 2026.1</span>
              <span>•</span>
              <span>Jurisdiction: Nigeria (NDPA 2023)</span>
            </div>
          </div>
        </Reveal>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Table of Contents */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <GlassCard hover={false} className="p-6 border border-(--line)">
              <h3 className="font-display text-sm font-semibold text-paper mb-4 uppercase tracking-wider text-secondary">
                Document Sections
              </h3>
              <nav className="space-y-2 text-xs text-mist-1">
                {[
                  { id: 'what-are-cookies', label: '1. What Are Cookies?' },
                  { id: 'why-we-use-storage', label: '2. Why We Use Storage Technologies' },
                  { id: 'cookie-inventory', label: '3. Real Technical Storage Inventory' },
                  { id: 'categories', label: '4. Cookie Categories Explained' },
                  { id: 'managing-preferences', label: '5. Managing & Withdrawing Consent' },
                  { id: 'browser-controls', label: '6. Browser-Level Controls' },
                  { id: 'contact', label: '7. Inquiries & Data Rights' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-1 text-mist-1 hover:text-white hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-(--line) text-xs text-mist-2 space-y-3">
                <button
                  type="button"
                  onClick={triggerOpenCookiePreferences}
                  className="w-full py-2 px-3 rounded-lg bg-paper/5 border border-(--line) hover:bg-paper/10 text-paper text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-secondary" />
                  <span>Reopen Preference Center</span>
                </button>
                <Link
                  href="/privacy-policy"
                  className="block text-secondary hover:underline text-center"
                >
                  View full Privacy Policy
                </Link>
              </div>
            </GlassCard>
          </aside>

          {/* Legal Text */}
          <div className="lg:col-span-8 space-y-12 text-paper">
            {/* Section 1 */}
            <section id="what-are-cookies" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                1. What Are Cookies and Storage Technologies?
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Cookies are small data files placed on your computer or mobile device when you visit a website. Modern web applications also utilize browser storage mechanisms such as <strong>localStorage</strong> and <strong>sessionStorage</strong> to retain operational information.
                </p>
                <p>
                  These technologies allow websites to recognize your device, remember user interface preferences (such as light or dark theme), facilitate secure administrator logins, and gather anonymous performance metrics without resubmitting data on every page reload.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="why-we-use-storage" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                2. Why Rayida Tech Uses Storage Technologies
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>We deploy storage technologies strictly for specific, legitimate technical purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Operation:</strong> Ensuring the website loads securely, validating administrative authentication tokens, and remembering your privacy consent decisions.</li>
                  <li><strong>Functional Personalization:</strong> Remembering your chosen visual color theme (dark or light mode) to prevent visual flash on subsequent visits.</li>
                  <li><strong>Performance & Telemetry:</strong> Measuring page load performance, dwell time, and device types to diagnose technical bottlenecks (executed only with your explicit consent).</li>
                </ul>
                <p className="font-medium text-paper">
                  <strong>Notice:</strong> Rayida Tech does not deploy advertising trackers, retargeting pixels (e.g. Meta Pixel, Google AdSense), or commercial cross-site tracking scripts.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="cookie-inventory" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                3. Real Technical Storage Inventory
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  The following table represents the complete, factual inventory of cookies and local storage tokens utilized by the Rayida Tech application:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border border-(--line) rounded-xl overflow-hidden">
                    <thead className="bg-[#141428] text-paper font-semibold">
                      <tr>
                        <th className="p-3 border-b border-(--line)">Identifier</th>
                        <th className="p-3 border-b border-(--line)">Storage Type</th>
                        <th className="p-3 border-b border-(--line)">Category</th>
                        <th className="p-3 border-b border-(--line)">Duration</th>
                        <th className="p-3 border-b border-(--line)">Technical Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--line)/60">
                      <tr>
                        <td className="p-3 font-mono text-secondary text-xs">rayida_cookie_consent</td>
                        <td className="p-3">localStorage</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-primary/20 text-accent-soft text-[10px] font-mono-tight">Necessary</span></td>
                        <td className="p-3">12 months</td>
                        <td className="p-3">Stores the user&apos;s cookie consent preferences, policy version, and timestamp.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-secondary text-xs">sb-*-auth-token</td>
                        <td className="p-3">HTTP Cookie</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-primary/20 text-accent-soft text-[10px] font-mono-tight">Necessary</span></td>
                        <td className="p-3">Session / 7 Days</td>
                        <td className="p-3">Supabase authentication session token for authorized administrator dashboard logins.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-secondary text-xs">theme</td>
                        <td className="p-3">localStorage</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-mono-tight">Functional</span></td>
                        <td className="p-3">Persistent</td>
                        <td className="p-3">Remembers the visitor&apos;s preferred theme (&apos;dark&apos; or &apos;light&apos;).</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-secondary text-xs">theme_version</td>
                        <td className="p-3">localStorage</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-mono-tight">Functional</span></td>
                        <td className="p-3">Persistent</td>
                        <td className="p-3">Synchronizes theme schema versions across layout updates.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-secondary text-xs">rayida_visitor_id</td>
                        <td className="p-3">localStorage</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-mono-tight">Analytics</span></td>
                        <td className="p-3">90 days</td>
                        <td className="p-3">Anonymous visitor identifier. Only persisted if analytics consent is granted.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-secondary text-xs">rayida_session_id</td>
                        <td className="p-3">sessionStorage</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-mono-tight">Analytics</span></td>
                        <td className="p-3">Browser Session</td>
                        <td className="p-3">Correlates multi-page journeys within a single browser session. Only set if analytics consent is granted.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-secondary text-xs">rayida_client_geo</td>
                        <td className="p-3">sessionStorage</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-mono-tight">Analytics</span></td>
                        <td className="p-3">Browser Session</td>
                        <td className="p-3">Caches country/city data for current session to prevent redundant network lookups.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="categories" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                4. Cookie Categories Explained
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-paper text-sm">Strictly Necessary (Always Enabled)</h4>
                      <span className="text-[10px] font-mono-tight text-accent-soft uppercase">Non-negotiable</span>
                    </div>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      These storage items are fundamentally required for the website to function. They allow secure page navigation, load balancing, and the recording of your privacy preferences. You cannot opt out of strictly necessary storage through the website interface.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-paper text-sm">Functional & Preferences (Optional)</h4>
                      <span className="text-[10px] font-mono-tight text-secondary uppercase">Configurable</span>
                    </div>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      Enable enhanced website functionality by remembering your theme mode (dark vs. light mode) and interface preferences.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-paper text-sm">Analytics & Telemetry (Consent Required)</h4>
                      <span className="text-[10px] font-mono-tight text-secondary uppercase">Consent Required</span>
                    </div>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      Allows us to record aggregate visitor metrics such as most-read articles and device viewport distributions. Telemetry is routed privately into our authenticated Supabase database and is never shared with advertising networks.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-paper text-sm">Marketing & Advertising (Not Deployed)</h4>
                      <span className="text-[10px] font-mono-tight text-mist-2 uppercase">Inactive</span>
                    </div>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      Rayida Tech does not run third-party advertising cookies or cross-site tracking pixels.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="managing-preferences" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                5. Managing & Withdrawing Your Consent
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>, you have the right to withdraw your consent for non-essential cookies and analytics at any time without penalty.
                </p>
                <p>
                  To change your choices or withdraw consent immediately, click the button below:
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={triggerOpenCookiePreferences}
                    className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Open Cookie Preferences Center</span>
                  </button>
                </div>
                <p className="text-xs text-mist-2">
                  You can also reopen this modal at any time by clicking the &ldquo;Cookie Preferences&rdquo; link in the website footer.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="browser-controls" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                6. Browser-Level Cookie Management
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  In addition to our on-site Cookie Preferences center, most modern browsers allow you to manage or block cookies through browser settings:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies.</li>
                  <li><strong>Apple Safari:</strong> Settings &gt; Privacy &gt; Block all cookies / Prevent cross-site tracking.</li>
                  <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection.</li>
                  <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</li>
                </ul>
                <p className="text-xs text-mist-2">
                  Note that disabling all browser cookies may impair website layout persistence and administrative authentication.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="contact" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                7. Technical Inquiries & Contact
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  If you have technical questions regarding our cookie implementation or data handling practices, please contact us:
                </p>
                <div className="p-6 rounded-2xl bg-[#141428] border border-(--line) space-y-2 text-sm">
                  <div className="font-semibold text-paper">Rayida Tech — Privacy Architecture</div>
                  <div className="text-mist-1">Email: <a href="mailto:info@rayidatech.name.ng" className="text-secondary hover:underline">info@rayidatech.name.ng</a></div>
                  <div className="text-mist-1">Website: <a href="https://rayidatech.name.ng" className="text-secondary hover:underline">rayidatech.name.ng</a></div>
                  <div className="text-mist-1">Jurisdiction: Lagos, Federal Republic of Nigeria</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
