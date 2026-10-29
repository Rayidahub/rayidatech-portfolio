import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { Shield, FileCheck, Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Processing Agreement (DPA)',
  description:
    'Rayida Tech Standard B2B Data Processing Agreement for enterprise client engagements under the Nigeria Data Protection Act (NDPA) 2023.',
};

export default function DataProcessingAgreementPage() {
  const version = '2026.1';
  const effectiveDate = 'October 29, 2026';

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
              <FileCheck className="w-3.5 h-3.5 text-secondary" />
              <span>B2B Enterprise Agreement Template</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-paper mb-4">
              Data Processing <span className="gradient-text">Agreement</span>
            </h1>
            <p className="text-mist-1 text-base sm:text-lg leading-relaxed">
              Standard B2B Data Processing Terms applicable when Rayida Tech processes personal data on behalf of enterprise clients as a Data Processor under the Nigeria Data Protection Act (NDPA) 2023.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-mist-2 font-mono-tight">
              <span>Standard Form DPA — Version {version}</span>
              <span>•</span>
              <span>Effective Date: {effectiveDate}</span>
              <span>•</span>
              <span>Governing Law: Federal Republic of Nigeria</span>
            </div>
          </div>
        </Reveal>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Table of Contents */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <GlassCard hover={false} className="p-6 border border-(--line)">
              <h3 className="font-display text-sm font-semibold text-paper mb-4 uppercase tracking-wider text-secondary">
                DPA Clauses
              </h3>
              <nav className="space-y-2 text-xs text-mist-1">
                {[
                  { id: 'preamble', label: '1. Parties & Context' },
                  { id: 'definitions', label: '2. Definitions' },
                  { id: 'scope-nature', label: '3. Scope & Nature of Processing' },
                  { id: 'controller-obligations', label: '4. Controller Responsibilities' },
                  { id: 'processor-obligations', label: '5. Processor Commitments' },
                  { id: 'security-measures', label: '6. Technical Security Measures' },
                  { id: 'subprocessors', label: '7. Sub-processors' },
                  { id: 'cross-border', label: '8. International Transfers' },
                  { id: 'dsar-assistance', label: '9. Data Subject Rights Assistance' },
                  { id: 'breach-notification', label: '10. Incident & Breach Notification' },
                  { id: 'audits-inspections', label: '11. Audit Rights' },
                  { id: 'termination-deletion', label: '12. Data Return & Deletion' },
                  { id: 'schedule-1', label: 'Schedule 1: Processing Details' },
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

              <div className="mt-6 pt-6 border-t border-(--line) text-xs text-mist-2 space-y-2">
                <p>Executing an enterprise client contract?</p>
                <a
                  href="mailto:info@rayidatech.name.ng?subject=DPA%20Execution%20Request"
                  className="inline-flex items-center gap-1.5 text-secondary hover:underline font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Request Executable DPA</span>
                </a>
              </div>
            </GlassCard>
          </aside>

          {/* Legal Text */}
          <div className="lg:col-span-8 space-y-12 text-paper">
            {/* Clause 1 */}
            <section id="preamble" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                1. Parties & Context
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  This Data Processing Agreement (&ldquo;DPA&rdquo;) supplements the Master Services Agreement, Statement of Work, or professional engineering agreement (&ldquo;Principal Agreement&rdquo;) entered into by and between:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>The Client:</strong> The entity identified as the client or customer in the Principal Agreement, acting in the capacity of a <strong>Data Controller</strong> (&ldquo;Controller&rdquo;).</li>
                  <li><strong>Rayida Tech:</strong> A digital technology and software engineering consultancy registered in Nigeria, acting in the capacity of a <strong>Data Processor</strong> (&ldquo;Processor&rdquo;).</li>
                </ul>
                <p>
                  This Agreement sets out the data protection and security commitments required under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> whenever Rayida Tech processes personal data on behalf of the Controller during the provision of software engineering, artificial intelligence integration, web application development, or managed hosting services.
                </p>
              </div>
            </section>

            {/* Clause 2 */}
            <section id="definitions" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                2. Definitions
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>Terms used in this DPA shall have the meanings ascribed to them under the NDPA 2023:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>&ldquo;Personal Data&rdquo;:</strong> Any information relating to an identified or identifiable natural person processed by the Processor on behalf of the Controller.</li>
                  <li><strong>&ldquo;Data Controller&rdquo;:</strong> An individual, private entity, or public body that determines the purposes and means of processing personal data.</li>
                  <li><strong>&ldquo;Data Processor&rdquo;:</strong> An individual, private entity, or public body that processes personal data on behalf of and in accordance with the instructions of a Data Controller.</li>
                  <li><strong>&ldquo;Data Subject&rdquo;:</strong> The natural person to whom personal data relates.</li>
                  <li><strong>&ldquo;Personal Data Breach&rdquo;:</strong> A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to personal data.</li>
                  <li><strong>&ldquo;NDPC&rdquo;:</strong> The Nigeria Data Protection Commission, the statutory regulatory authority established under the NDPA 2023.</li>
                  <li><strong>&ldquo;Sub-processor&rdquo;:</strong> Any vetted third party appointed by the Processor to process personal data on behalf of the Controller.</li>
                </ul>
              </div>
            </section>

            {/* Clause 3 */}
            <section id="scope-nature" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                3. Scope, Subject Matter & Instructions
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  The Processor shall process personal data solely on documented, written instructions from the Controller, including with respect to international transfers, unless required to do so by applicable Nigerian or international law.
                </p>
                <p>
                  The subject matter, duration, nature, and purpose of processing, alongside categories of data subjects and data types, are defined in <strong>Schedule 1</strong> of this DPA and the applicable Statement of Work.
                </p>
              </div>
            </section>

            {/* Clause 4 */}
            <section id="controller-obligations" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                4. Controller Responsibilities
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>The Controller represents, warrants, and agrees that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>It possesses a lawful basis under Section 25 of the NDPA 2023 for collecting and transferring personal data to the Processor.</li>
                  <li>It has provided appropriate statutory privacy notices to data subjects regarding processing by technology vendors.</li>
                  <li>Its instructions to the Processor comply with all applicable Nigerian and international data privacy laws.</li>
                </ul>
              </div>
            </section>

            {/* Clause 5 */}
            <section id="processor-obligations" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                5. Processor Commitments
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>The Processor agrees and commits to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process personal data strictly to deliver the agreed services defined in the Principal Agreement.</li>
                  <li>Ensure that all personnel, software engineers, and contractors authorized to process personal data are subject to binding statutory or contractual confidentiality obligations.</li>
                  <li>Promptly notify the Controller if, in its technical assessment, an instruction given by the Controller infringes the NDPA 2023 or other applicable privacy rules.</li>
                </ul>
              </div>
            </section>

            {/* Clause 6 */}
            <section id="security-measures" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                6. Technical & Organizational Security Measures
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  In accordance with <strong>Section 39 of the NDPA 2023</strong>, the Processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cryptographic Protections:</strong> Encryption of data in transit using modern TLS 1.3 standards and encryption at rest using AES-256 for persistent database storage.</li>
                  <li><strong>Access Controls:</strong> Role-based access controls (RBAC), multi-factor authentication (MFA), and least-privilege credentials.</li>
                  <li><strong>Data Isolation:</strong> Logical separation of client data stores and database Row-Level Security (RLS) enforcement.</li>
                  <li><strong>Vulnerability Management:</strong> Automated static code analysis, dependency auditing, and strict input validation to prevent SQL injection, cross-site scripting (XSS), and header injection.</li>
                  <li><strong>Resilience & Recovery:</strong> Automated database backups and tested incident recovery procedures.</li>
                </ul>
              </div>
            </section>

            {/* Clause 7 */}
            <section id="subprocessors" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                7. Sub-processors
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  The Controller grants general written authorization to the Processor to engage vetted infrastructure sub-processors (including cloud hosting providers such as Vercel, Supabase, and transactional email providers such as Resend).
                </p>
                <p>
                  The Processor shall ensure that each sub-processor is bound by written contractual obligations no less protective than those imposed under this DPA, and remains fully liable to the Controller for the performance of its sub-processors.
                </p>
              </div>
            </section>

            {/* Clause 8 */}
            <section id="cross-border" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                8. International Data Transfers
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Any transfer of personal data outside the Federal Republic of Nigeria shall be conducted strictly in accordance with <strong>Part VIII of the NDPA 2023</strong>, utilizing recognized transfer mechanisms such as Standard Contractual Clauses, transfers to jurisdictions with adequate data protection frameworks, or explicit Controller authorization.
                </p>
              </div>
            </section>

            {/* Clause 9 */}
            <section id="dsar-assistance" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                9. Data Subject Rights Assistance
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Taking into account the nature of the processing, the Processor shall assist the Controller by appropriate technical and organizational measures, insofar as this is possible, in fulfilling the Controller&apos;s statutory obligation to respond to requests from data subjects exercising their rights under Part VI of the NDPA 2023.
                </p>
                <p>
                  If the Processor receives a direct data subject request relating to Controller data, it shall promptly forward such request to the Controller without responding directly, unless specifically authorized.
                </p>
              </div>
            </section>

            {/* Clause 10 */}
            <section id="breach-notification" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                10. Incident & Personal Data Breach Notification
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  The Processor shall notify the Controller in writing <strong>without undue delay and in any event within forty-eight (48) hours</strong> of becoming aware of a confirmed Personal Data Breach affecting the Controller&apos;s data.
                </p>
                <p>
                  This prompt notification period is established to enable the Controller to meet its statutory duty under <strong>Section 40 of the NDPA 2023</strong> to notify the Nigeria Data Protection Commission (NDPC) within seventy-two (72) hours of becoming aware of a high-risk breach.
                </p>
              </div>
            </section>

            {/* Clause 11 */}
            <section id="audits-inspections" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                11. Audit Rights & Compliance Verification
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  The Processor shall make available to the Controller all information reasonably necessary to demonstrate compliance with the obligations laid down in this DPA, and allow for and contribute to audits or technical reviews conducted by the Controller or an independent auditor mandated by the Controller, subject to reasonable advance notice, non-disclosure agreements, and security protocols.
                </p>
              </div>
            </section>

            {/* Clause 12 */}
            <section id="termination-deletion" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                12. Data Return & Deletion
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <p>
                  Upon termination of the Principal Agreement or completion of the contracted services, the Processor shall, at the Controller&apos;s written choice, securely delete or return all personal data to the Controller, and delete all existing copies, unless Nigerian statutory law requires continued retention.
                </p>
              </div>
            </section>

            {/* Schedule 1 */}
            <section id="schedule-1" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-(--line) pb-3">
                Schedule 1: Processing Details
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-mist-1">
                <div className="p-5 rounded-2xl bg-[#141428] border border-(--line) space-y-3 text-xs sm:text-sm">
                  <div><strong>Subject Matter:</strong> Provision of custom software development, cloud infrastructure integration, AI systems, and technical support.</div>
                  <div><strong>Duration:</strong> The duration of the active client Statement of Work plus any agreed warranty or post-launch support period.</div>
                  <div><strong>Nature & Purpose:</strong> Storing, structuring, querying, authenticating, and backing up data to execute client software applications.</div>
                  <div><strong>Categories of Data Subjects:</strong> Client employees, end-users of client web/mobile applications, business partners, or consumers as defined by the Controller.</div>
                  <div><strong>Types of Personal Data:</strong> Names, contact emails, usernames, identification records, and user transaction logs as configured in the client&apos;s application schema.</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
