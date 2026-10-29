import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { ShieldCheck, Mail, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Rayida Tech Privacy Policy. Details how we collect, process, and protect your personal data in accordance with the Nigeria Data Protection Act (NDPA) 2023.',
};

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>Legal & Data Protection Framework</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-paper mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-mist-1 text-base sm:text-lg leading-relaxed">
              How Rayida Tech collects, safeguards, and processes personal information in full compliance with the Nigeria Data Protection Act (NDPA) 2023.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-mist-2 font-mono-tight">
              <span>Effective Date: {lastUpdated}</span>
              <span>•</span>
              <span>Jurisdiction: Federal Republic of Nigeria</span>
              <span>•</span>
              <span>Framework: NDPA 2023 / NDPC</span>
            </div>
          </div>
        </Reveal>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Quick Navigation / Table of Contents */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <GlassCard hover={false} className="p-6 border border-(--line)">
              <h3 className="font-display text-sm font-semibold text-paper mb-4 uppercase tracking-wider text-secondary">
                Table of Contents
              </h3>
              <nav className="space-y-2 text-xs text-mist-1">
                {[
                  { id: 'introduction', label: '1. Introduction & Scope' },
                  { id: 'data-controller', label: '2. Controller vs. Processor Roles' },
                  { id: 'information-collected', label: '3. Information We Collect' },
                  { id: 'collection-methods', label: '4. How We Collect Data' },
                  { id: 'processing-purposes', label: '5. Why We Process Your Data' },
                  { id: 'lawful-bases', label: '6. Lawful Bases for Processing' },
                  { id: 'data-sharing', label: '7. Data Sharing & Third Parties' },
                  { id: 'international-transfers', label: '8. International Data Transfers' },
                  { id: 'retention-periods', label: '9. Data Retention Schedule' },
                  { id: 'security-controls', label: '10. Security Controls' },
                  { id: 'user-rights', label: '11. Your Data Subject Rights' },
                  { id: 'childrens-privacy', label: "12. Children's Privacy" },
                  { id: 'cookies-tracking', label: '13. Cookies & Telemetry' },
                  { id: 'updates-contact', label: '14. Updates & Contact' },
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

              <div className="mt-6 pt-6 border-t border-(--line) text-xs text-mist-2">
                <p className="mb-2">Questions regarding your personal information?</p>
                <a
                  href="mailto:info@rayidatech.name.ng"
                  className="inline-flex items-center gap-1.5 text-secondary hover:underline font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>info@rayidatech.name.ng</span>
                </a>
              </div>
            </GlassCard>
          </aside>

          {/* Main Legal Sections */}
          <div className="lg:col-span-8 space-y-12 text-paper">
            {/* Section 1 */}
            <section id="introduction" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                1. Introduction & Scope
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Rayida Tech (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is a digital technology studio and engineering consultancy registered and operating in Nigeria. We specialize in bespoke product design, artificial intelligence systems, full-stack software development, and technical consultation.
                </p>
                <p>
                  This Privacy Policy outlines how we collect, store, utilize, protect, and disclose personal data when you interact with our website (<Link href="https://rayidatech.name.ng" className="text-secondary hover:underline">rayidatech.name.ng</Link>), submit project inquiries, engage our engineering services, or communicate with our team.
                </p>
                <p>
                  We are deeply committed to respecting your privacy, upholding data minimization, and complying with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and the regulatory directives issued by the <strong>Nigeria Data Protection Commission (NDPC)</strong>.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="data-controller" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                2. Rayida Tech as Data Controller vs. Data Processor
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Under the NDPA 2023, personal data responsibilities differ based on the processing context:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Rayida Tech as Data Controller:</strong> When you visit our website, submit inquiries, subscribe to our newsletter, or enter into direct client contracts with us, we determine the purposes and means of processing your personal data.
                  </li>
                  <li>
                    <strong>Rayida Tech as Data Processor:</strong> When we build, host, or manage software applications, databases, or API infrastructure on behalf of our enterprise clients, our clients act as the Data Controllers, and we process personal data strictly in accordance with their contractual instructions and our B2B <Link href="/legal/data-processing-agreement" className="text-secondary hover:underline">Data Processing Agreement</Link>.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="information-collected" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                3. Information We Collect
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  We collect only information reasonably necessary to achieve legitimate business and technical objectives. The data categories include:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border border-(--line) rounded-xl overflow-hidden">
                    <thead className="bg-[#141428] text-paper font-semibold">
                      <tr>
                        <th className="p-3.5 border-b border-(--line)">Data Category</th>
                        <th className="p-3.5 border-b border-(--line)">Specific Data Items</th>
                        <th className="p-3.5 border-b border-(--line)">Collection Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--line)/60">
                      <tr>
                        <td className="p-3.5 font-medium text-paper">Contact Inquiries</td>
                        <td className="p-3.5">Full name, email address, phone/WhatsApp number, company name, project brief, estimated budget.</td>
                        <td className="p-3.5">Reviewing project scopes, preparing feasibility proposals, and replying to client requests.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-medium text-paper">Newsletter Subscribers</td>
                        <td className="p-3.5">Email address, subscription timestamp.</td>
                        <td className="p-3.5">Sending engineering articles, product case studies, and occasional studio announcements.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-medium text-paper">Technical Telemetry</td>
                        <td className="p-3.5">IP address, browser type, operating system, screen dimensions, referrer URL, dwell time.</td>
                        <td className="p-3.5">Detecting infrastructure bottlenecks, diagnosing errors, preventing malicious cyberattacks, and optimizing UI performance.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-medium text-paper">Admin Authentication</td>
                        <td className="p-3.5">Admin user email, encrypted password hashes, session tokens.</td>
                        <td className="p-3.5">Restricting access to the internal portfolio content management system to verified administrators.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="collection-methods" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                4. How We Collect Personal Data
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>We collect personal information through the following mechanisms:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Direct Submission:</strong> Information submitted via our website contact form (<Link href="/contact" className="text-secondary hover:underline">/contact</Link>) or newsletter subscription input.</li>
                  <li><strong>Electronic Communications:</strong> Communications conducted via email (<a href="mailto:info@rayidatech.name.ng" className="text-secondary hover:underline">info@rayidatech.name.ng</a>) or verified business messaging channels (WhatsApp).</li>
                  <li><strong>Automated Technologies:</strong> Client-side logging and session beacons triggered during page visits (only activated upon your consent via our Cookie Preferences system).</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="processing-purposes" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                5. Why We Process Your Data
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>Your personal data is processed strictly for clear, legitimate operational purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To review technical project briefs and formulate accurate delivery timelines and budgets.</li>
                  <li>To execute contracts, deliverables, milestones, and design handoffs.</li>
                  <li>To provide post-launch warranties, code maintenance, and ongoing client support.</li>
                  <li>To safeguard our application from denial-of-service (DoS) attacks, injection vulnerabilities, and malicious automated bot activity.</li>
                  <li>To dispatch transactional email notifications regarding inquiries or newsletter subscriptions.</li>
                  <li>To comply with statutory legal, accounting, tax, or regulatory obligations in Nigeria.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="lawful-bases" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                6. Lawful Bases for Processing (NDPA 2023)
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  In accordance with <strong>Section 25 of the Nigeria Data Protection Act 2023</strong>, we process personal information only when at least one lawful basis applies:
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper mb-1 text-sm">A. Contractual Necessity (NDPA Sec. 25(1)(b))</h4>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      Processing is necessary to take steps at your request prior to entering into a contract (e.g. scoping briefs, proposals) or to perform an existing engineering contract.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper mb-1 text-sm">B. Consent (NDPA Sec. 25(1)(a))</h4>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      Where you have given specific, informed, and unambiguous consent, such as opting into our newsletter or accepting analytics telemetry via our Cookie Consent banner. You may withdraw consent at any time.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper mb-1 text-sm">C. Legitimate Interests (NDPA Sec. 25(1)(f))</h4>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      Where processing is necessary for the genuine business interests of Rayida Tech (e.g. maintaining network security, preventing fraud, and optimizing application responsiveness), provided such interests do not override your fundamental rights.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper mb-1 text-sm">D. Legal Obligation (NDPA Sec. 25(1)(c))</h4>
                    <p className="text-xs text-mist-2 leading-relaxed">
                      Where processing is required to comply with statutory legal, tax, or regulatory reporting duties under Nigerian law.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="data-sharing" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                7. Data Sharing & Third-Party Service Providers
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  <strong>Rayida Tech never sells, leases, or trades personal data to third parties.</strong>
                </p>
                <p>
                  We share personal information strictly with vetted third-party infrastructure and service providers operating as data processors under confidentiality agreements:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Supabase Inc.:</strong> Cloud-hosted managed PostgreSQL database providing authenticated Row-Level Security (RLS) data storage.</li>
                  <li><strong>Resend Inc.:</strong> Transactional email delivery service utilized to dispatch administrative alerts and confirmation messages.</li>
                  <li><strong>Zoho Corporation:</strong> Professional business email hosting (<code className="text-secondary font-mono text-xs">info@rayidatech.name.ng</code>) for client correspondence.</li>
                  <li><strong>Vercel Inc.:</strong> Cloud application hosting, edge middleware routing, and deployment infrastructure.</li>
                  <li><strong>Public Authorities:</strong> Law enforcement, courts, or regulatory bodies (including the NDPC) solely when compelled by applicable Nigerian law or court order.</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section id="international-transfers" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                8. International Data Transfers
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Because Rayida Tech utilizes modern global cloud infrastructure (such as Vercel and Supabase cloud nodes and Resend European infrastructure), personal data may be stored or transferred outside Nigeria.
                </p>
                <p>
                  In compliance with <strong>Part VIII of the NDPA 2023</strong>, all cross-border data transfers are executed under recognized legal safeguards, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Transfers to jurisdictions recognized by the NDPC as providing adequate levels of personal data protection.</li>
                  <li>Standard Contractual Clauses (SCCs) and binding data processing terms guaranteeing equivalent protection.</li>
                  <li>Strict end-to-end encryption in transit (TLS 1.3) and at rest (AES-256).</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section id="retention-periods" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                9. Data Retention Schedule
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, subject to legitimate business needs and statutory retention requirements:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border border-(--line) rounded-xl overflow-hidden">
                    <thead className="bg-[#141428] text-paper font-semibold">
                      <tr>
                        <th className="p-3 border-b border-(--line)">Record Type</th>
                        <th className="p-3 border-b border-(--line)">Retention Period</th>
                        <th className="p-3 border-b border-(--line)">Disposal Mechanism</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--line)/60">
                      <tr>
                        <td className="p-3 font-medium text-paper">Contact Inquiries (Uncontracted)</td>
                        <td className="p-3">12 months from inquiry date</td>
                        <td className="p-3">Automated database purge</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-paper">Active Client Contracts & Invoices</td>
                        <td className="p-3">6 years following project completion (statutory accounting)</td>
                        <td className="p-3">Archived securely; purged upon expiry</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-paper">Newsletter Subscribers</td>
                        <td className="p-3">Until user unsubscription or consent withdrawal</td>
                        <td className="p-3">Immediate deactivation upon unsubscribe</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-paper">Technical Visitor Logs & Telemetry</td>
                        <td className="p-3">90 days rolling window</td>
                        <td className="p-3">Truncated and purged automatically</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="security-controls" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                10. Technical & Organizational Security Controls
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Rayida Tech implements robust technical safeguards to prevent unauthorized access, alteration, disclosure, or accidental destruction of your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption in Transit:</strong> Strict HTTPS enforcement, HSTS headers, and TLS 1.3 protocol usage across all public and API routes.</li>
                  <li><strong>Database Security:</strong> Row-Level Security (RLS) policies isolating database tables; no direct client write access to administrative logs.</li>
                  <li><strong>Centralized Access Guards:</strong> Mutating administrative actions protected by server-side cryptographic session verification (<code className="text-secondary font-mono text-xs">requireAdminSession</code>).</li>
                  <li><strong>Injection Protection:</strong> Strict email header sanitization, HTML entity escaping in dynamic templates, and parameterized SQL queries.</li>
                  <li><strong>Rate Limiting & Anti-Spam:</strong> Sliding-window IP rate limiting on public endpoints and hidden honeypot fields to neutralize automated bot abuse.</li>
                  <li><strong>Zero Secret Exposure:</strong> API credentials (such as Resend API keys) are stored strictly in server-side environment variables without frontend exposure.</li>
                </ul>
              </div>
            </section>

            {/* Section 11 */}
            <section id="user-rights" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                11. Your Data Subject Rights (NDPA 2023)
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Under <strong>Part VI of the Nigeria Data Protection Act 2023</strong>, you are entitled to exercise the following rights regarding your personal information:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper text-xs uppercase tracking-wider mb-1">Right to Access</h4>
                    <p className="text-xs text-mist-2">Request confirmation and a copy of the personal data we hold about you.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper text-xs uppercase tracking-wider mb-1">Right to Rectification</h4>
                    <p className="text-xs text-mist-2">Request immediate correction of inaccurate or incomplete personal records.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper text-xs uppercase tracking-wider mb-1">Right to Erasure</h4>
                    <p className="text-xs text-mist-2">Request deletion of personal data where retention is no longer legally justified.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper text-xs uppercase tracking-wider mb-1">Right to Restrict Processing</h4>
                    <p className="text-xs text-mist-2">Request that processing be temporarily suspended while accuracy is contested.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper text-xs uppercase tracking-wider mb-1">Right to Data Portability</h4>
                    <p className="text-xs text-mist-2">Receive your personal information in a structured, commonly used machine-readable format.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141428] border border-(--line)">
                    <h4 className="font-semibold text-paper text-xs uppercase tracking-wider mb-1">Right to Withdraw Consent</h4>
                    <p className="text-xs text-mist-2">Withdraw consent at any time for activities based on consent (e.g. newsletter or telemetry).</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/25 mt-4">
                  <h4 className="font-semibold text-paper text-sm mb-1">How to Exercise Your Rights</h4>
                  <p className="text-xs text-mist-1 leading-relaxed">
                    To exercise any of your statutory rights, please send an email to <a href="mailto:info@rayidatech.name.ng" className="text-secondary font-medium hover:underline">info@rayidatech.name.ng</a> with the subject line <em>&ldquo;Data Subject Rights Request&rdquo;</em>. We will acknowledge your request within 48 hours and provide a full resolution within 30 calendar days as required by the NDPA 2023.
                  </p>
                  <p className="text-xs text-mist-2 mt-2">
                    You also have the right to lodge a complaint with the <strong>Nigeria Data Protection Commission (NDPC)</strong> at <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">ndpc.gov.ng</a> if you believe your rights have been violated.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section id="childrens-privacy" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                12. Children&apos;s Privacy
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Our website and technology services are directed exclusively at business professionals, adult clients, and individuals aged 18 and older. We do not knowingly collect, solicit, or maintain personal data from minors under the age of 18 without verifiable parental or guardian consent.
                </p>
                <p>
                  If you become aware that a minor has provided us with personal information, please notify us immediately at <a href="mailto:info@rayidatech.name.ng" className="text-secondary hover:underline">info@rayidatech.name.ng</a> so we can delete such records.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="cookies-tracking" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                13. Cookies & Telemetry
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  We deploy cookies and local storage tokens to provide a seamless browsing experience. We categorize our storage mechanisms into:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Strictly Necessary:</strong> Required for site navigation, security, and consent retention.</li>
                  <li><strong>Functional:</strong> Stores user interface preferences such as dark or light theme mode.</li>
                  <li><strong>Analytics:</strong> Measures aggregate performance metrics (requires explicit consent).</li>
                  <li><strong>Marketing:</strong> We do not deploy third-party advertising cookies.</li>
                </ul>
                <p>
                  For a complete technical breakdown and to update your consent choices at any time, please visit our dedicated <Link href="/cookie-policy" className="text-secondary hover:underline">Cookie Policy</Link>.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section id="updates-contact" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                14. Policy Updates & Official Contact
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  We may periodically revise this Privacy Policy to reflect evolving technical capabilities, regulatory requirements, or changes to Nigerian law. Any modifications will be posted directly to this page with an updated &ldquo;Effective Date&rdquo;.
                </p>
                <div className="p-6 rounded-2xl bg-[#141428] border border-(--line) space-y-2 text-sm">
                  <div className="font-semibold text-paper">Rayida Tech — Data Protection Desk</div>
                  <div className="text-mist-1">Email: <a href="mailto:info@rayidatech.name.ng" className="text-secondary hover:underline">info@rayidatech.name.ng</a></div>
                  <div className="text-mist-1">Data Protection Officer Designation: <span className="font-mono text-xs text-mist-2">[Designated Privacy Officer — info@rayidatech.name.ng]</span></div>
                  <div className="text-mist-1">Website: <a href="https://rayidatech.name.ng" className="text-secondary hover:underline">rayidatech.name.ng</a></div>
                  <div className="text-mist-1">Operating Jurisdiction: Lagos, Federal Republic of Nigeria</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
