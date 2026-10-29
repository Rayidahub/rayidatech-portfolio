import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { FileText, Shield, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Terms and Conditions governing the use of the Rayida Tech website and public services. Operating under the laws of the Federal Republic of Nigeria.',
};

export default function TermsAndConditionsPage() {
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
              <FileText className="w-3.5 h-3.5 text-secondary" />
              <span>Website Terms of Use</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-paper mb-4">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p className="text-mist-1 text-base sm:text-lg leading-relaxed">
              Rules and stipulations governing the access and use of the Rayida Tech website, digital assets, and public consultation channels.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-mist-2 font-mono-tight">
              <span>Effective Date: {lastUpdated}</span>
              <span>•</span>
              <span>Governing Law: Federal Republic of Nigeria</span>
              <span>•</span>
              <span>Scope: Public Web Services</span>
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
                  { id: 'acceptance', label: '1. Acceptance of Terms' },
                  { id: 'eligibility', label: '2. Eligibility & Access' },
                  { id: 'permitted-use', label: '3. Permitted Website Use' },
                  { id: 'prohibited-activities', label: '4. Prohibited Conduct' },
                  { id: 'intellectual-property', label: '5. Intellectual Property Rights' },
                  { id: 'client-agreements', label: '6. Distinct Project Agreements' },
                  { id: 'content-accuracy', label: '7. Content & Availability' },
                  { id: 'third-party-links', label: '8. External Services & Links' },
                  { id: 'disclaimer', label: '9. Disclaimer of Warranties' },
                  { id: 'limitation-liability', label: '10. Limitation of Liability' },
                  { id: 'indemnification', label: '11. Indemnification' },
                  { id: 'privacy-ndpa', label: '12. Privacy & Data Protection' },
                  { id: 'governing-law', label: '13. Governing Law & Dispute Resolution' },
                  { id: 'contact', label: '14. Contact Information' },
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
                <p className="mb-2">Need a formal enterprise Master Services Agreement?</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-secondary hover:underline font-medium"
                >
                  <span>Request Contract Scoping</span>
                </Link>
              </div>
            </GlassCard>
          </aside>

          {/* Legal Text */}
          <div className="lg:col-span-8 space-y-12 text-paper">
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                1. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Visitor&rdquo;, or &ldquo;Client&rdquo;) and <strong>Rayida Tech</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
                </p>
                <p>
                  By accessing, browsing, or utilizing our website (<Link href="https://rayidatech.name.ng" className="text-secondary hover:underline">rayidatech.name.ng</Link>), or by submitting inquiries through our contact forms, you confirm that you have read, understood, and agreed to be bound by these Terms and our <Link href="/privacy-policy" className="text-secondary hover:underline">Privacy Policy</Link>. If you do not agree, you must immediately cease using the website.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="eligibility" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                2. Eligibility & Representation
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  You must be at least 18 years of age or the age of legal majority in your jurisdiction to use this website or initiate business inquiries. If you are accessing this website on behalf of a corporation, organization, or other legal entity, you represent and warrant that you possess the requisite authority to bind that entity to these Terms.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="permitted-use" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                3. Permitted Website Use
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>Rayida Tech grants you a non-exclusive, non-transferable, revocable license to access and use the website strictly for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Evaluating our design, artificial intelligence, and software engineering capabilities.</li>
                  <li>Reviewing our published case studies, research articles, and portfolio artifacts.</li>
                  <li>Submitting project briefs, quotation requests, and contacting our technical team.</li>
                  <li>Subscribing to our technical newsletter.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="prohibited-activities" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                4. Prohibited Conduct
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>When interacting with this website, you agree not to engage in any of the following activities:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Security Interference:</strong> Probing, scanning, or testing the vulnerability of our application, servers, or networks, or circumventing any security or authentication measures.</li>
                  <li><strong>Automated Scraping:</strong> Deploying automated spiders, bots, scrapers, or extraction crawlers to copy website content without prior written permission.</li>
                  <li><strong>Denial of Service:</strong> Submitting malicious payloads, spamming contact forms, executing denial-of-service (DoS) attacks, or overloading server infrastructure.</li>
                  <li><strong>Header Injection:</strong> Injecting carriage returns, line feeds, or forged header values into communication forms.</li>
                  <li><strong>Misrepresentation:</strong> Impersonating another person or entity, or submitting falsified contact information.</li>
                  <li><strong>Malicious Code:</strong> Uploading or transmitting viruses, trojan horses, worms, or any other code designed to disrupt software or hardware.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="intellectual-property" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                5. Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  All intellectual property rights associated with this website—including but not limited to brand identity, logos, vector icons, visual layouts, design systems, proprietary code, written articles, case studies, and multimedia—are the exclusive property of Rayida Tech and Raymond Gaius, protected by Nigerian copyright and trademark laws as well as applicable international treaties.
                </p>
                <p>
                  No portion of this website may be copied, reproduced, republished, modified, downloaded, or distributed in any commercial form without express prior written consent from Rayida Tech.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="client-agreements" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                6. Distinction from Client Service Agreements
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  <strong>These Terms govern only your access to and use of this public marketing website.</strong>
                </p>
                <p>
                  Any formal engagement for professional design, AI engineering, full-stack software development, or technical support is governed by an independent, signed contract—such as a <strong>Master Services Agreement (MSA)</strong>, <strong>Statement of Work (SOW)</strong>, or <strong>B2B Data Processing Agreement (DPA)</strong>.
                </p>
                <p>
                  Submission of an inquiry through this website does not obligate Rayida Tech to undertake a project, nor does it create a client, agency, partnership, or fiduciary relationship until formal agreements are countersigned by both parties.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="content-accuracy" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                7. Content Accuracy & Website Availability
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  While we endeavor to keep all information on this website current, accurate, and reliable, we do not warrant that all specifications, case studies, or timeline estimates are entirely error-free or exhaustive.
                </p>
                <p>
                  We reserve the right to alter, update, suspend, or discontinue any portion of this website or service offering at any time without prior notice. We shall not be liable to you or any third party for any temporary unavailability resulting from routine maintenance, hosting updates, or unforeseen network disruptions.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="third-party-links" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                8. External Services & Third-Party Links
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Our website may feature links to external third-party platforms, such as GitHub, LinkedIn, WhatsApp, or reference tools. These external resources operate under their own independent terms and privacy protocols.
                </p>
                <p>
                  Rayida Tech exercises no control over, and accepts no responsibility or legal liability for, the content, security, or practices of any third-party website. Accessing third-party resources is done entirely at your own risk.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="disclaimer" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                9. Disclaimer of Warranties
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  THIS WEBSITE AND ALL MATERIALS, CONTENT, AND FEATURES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p>
                  TO THE FULLEST EXTENT PERMISSIBLE UNDER NIGERIAN LAW, RAYIDA TECH DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE WEBSITE WILL OPERATE UNINTERRUPTED OR ERROR-FREE, OR THAT DEFECTS WILL BE PROMPTLY RECTIFIED.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="limitation-liability" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                10. Limitation of Liability
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL RAYIDA TECH, RAYMOND GAIUS, OR OUR COLLABORATORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES—INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR BUSINESS OPPORTUNITIES—ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THIS WEBSITE.
                </p>
                <p>
                  WHERE STATUTORY CONSUMER OR DATA PROTECTION RIGHTS CANNOT BE EXCLUDED BY NIGERIAN LAW, OUR AGGREGATE LIABILITY ARISING UNDER THESE WEBSITE TERMS SHALL BE LIMITED TO THE AMOUNT OF ONE HUNDRED NIGERIAN NAIRA (NGN 100) OR THE MINIMUM AMOUNT PERMITTED BY APPLICABLE STATUTE.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="indemnification" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                11. Indemnification
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  You agree to defend, indemnify, and hold harmless Rayida Tech, its principals, contractors, and agents from and against any third-party claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising from or relating to your violation of these Terms, unauthorized website conduct, or infringement upon any third-party intellectual property or privacy right.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="privacy-ndpa" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                12. Privacy & Data Protection Compliance
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Our collection, utilization, and safeguarding of personal data is governed strictly by our <Link href="/privacy-policy" className="text-secondary hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
                </p>
                <p>
                  Both parties commit to complying with their respective obligations under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> in all communications and information processing.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="governing-law" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                13. Governing Law & Dispute Resolution
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  These Terms, their interpretation, and any disputes arising out of or related to them shall be governed exclusively by and construed in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>, without regard to conflict of law principles.
                </p>
                <p>
                  In the event of any controversy or dispute, the parties agree to first engage in good-faith informal negotiations for a minimum period of thirty (30) days from written notice. If unresolved, the dispute shall be submitted to the exclusive jurisdiction of the competent courts sitting in Lagos State, Nigeria.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section id="contact" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                14. Contact Information & Legal Inquiries
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  If you have questions, feedback, or legal inquiries regarding these Terms and Conditions, please contact us:
                </p>
                <div className="p-6 rounded-2xl bg-[#141428] border border-(--line) space-y-2 text-sm">
                  <div className="font-semibold text-paper">Rayida Tech — Legal Desk</div>
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
