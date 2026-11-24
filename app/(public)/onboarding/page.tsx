'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Building2,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Palette,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

export default function ClientOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    motto: '',
    whatsappNumber: '',
    email: '',
    address: '',
    offerings: '',
    brandColors: '',
    driveLink: '',
    testimonial: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate instant capture
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 600);
  };

  const whatsappKickoffUrl = `https://wa.me/2348100000000?text=${encodeURIComponent(
    `Hello Raymond, I have just completed the 24-Hour Rapid Onboarding Form for ${formData.businessName || 'our business'}. Let's kick off development!`
  )}`;

  return (
    <div className="min-h-screen bg-ink text-paper py-16 px-4 selection:bg-primary/30 selection:text-white">
      <Container size="narrow" className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono-tight uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Client Kickoff Portal
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            24-Hour Rapid Onboarding
          </h1>
          <p className="text-mist-1 text-sm max-w-lg mx-auto">
            Provide your organization assets below. This enables our engineering team to design, configure, and launch your digital system within 7 business days.
          </p>
        </div>

        {isCompleted ? (
          <GlassCard className="p-8 text-center space-y-6 border-emerald-500/30">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-white">
                Assets Received Successfully!
              </h2>
              <p className="text-mist-1 text-sm max-w-md mx-auto">
                Thank you for providing your details for <strong className="text-white">{formData.businessName}</strong>. Our team is now provisioning your dedicated staging server.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={whatsappKickoffUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Notify Raymond on WhatsApp
              </a>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Business Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-(--line)">
                  <Building2 className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-base font-semibold text-white">
                    1. Organization Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                      Official Organization Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Prestige Royal Academy"
                      className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                      Motto / Tagline
                    </label>
                    <input
                      type="text"
                      name="motto"
                      value={formData.motto}
                      onChange={handleChange}
                      placeholder="e.g. Excellence in Character & Learning"
                      className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                      Official WhatsApp Inquiries Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="e.g. 0812 345 6789"
                      className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                      Official Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. admissions@prestigeacademy.ng"
                      className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                    Physical Campus / Office Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Plot 12, Adetokunbo Ademola Crescent, Wuse 2, Abuja"
                    className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Step 2: Programs & Offerings */}
              <div className="space-y-4 pt-4 border-t border-(--line)">
                <div className="flex items-center gap-2 pb-2 border-b border-(--line)">
                  <Palette className="w-4 h-4 text-secondary" />
                  <h3 className="font-display text-base font-semibold text-white">
                    2. Programs, Services & Branding
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                    Programs / Sections / Key Services *
                  </label>
                  <textarea
                    required
                    rows={3}
                    name="offerings"
                    value={formData.offerings}
                    onChange={handleChange}
                    placeholder="e.g. Creche (3-18 months), Nursery (Pre-KG to KG2), Primary (Grades 1-6), Junior College (JSS1-3). Extracurriculars: Coding, Chess, Ballet."
                    className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl p-3.5 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                      Primary Brand Colors
                    </label>
                    <input
                      type="text"
                      name="brandColors"
                      value={formData.brandColors}
                      onChange={handleChange}
                      placeholder="e.g. Navy Blue and Gold"
                      className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                      Google Drive Link (Logo & Campus Photos) *
                    </label>
                    <input
                      required
                      type="url"
                      name="driveLink"
                      value={formData.driveLink}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tight uppercase text-mist-2 mb-1.5">
                    1 Parent or Client Testimonial (Optional)
                  </label>
                  <textarea
                    rows={2}
                    name="testimonial"
                    value={formData.testimonial}
                    onChange={handleChange}
                    placeholder='e.g. "Prestige Royal Academy has given my children the best moral foundation and academic confidence." — Mrs. Okonjo'
                    className="w-full bg-ink border border-(--line) focus:border-primary text-white rounded-xl p-3.5 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Saving Assets...'
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      Submit Onboarding Assets & Kick Off Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>
        )}
      </Container>
    </div>
  );
}
