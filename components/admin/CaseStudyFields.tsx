'use client';

import { useState } from 'react';
import type { CaseStudy } from '@/types/project';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { getCaseStudyConfig } from '@/lib/data/case-study-templates';
import {
  Palette,
  Package,
  Sparkles,
  PenTool,
  Globe,
  GraduationCap,
  Share2,
  Info,
  ChevronDown,
} from 'lucide-react';
import type { ServiceCategory } from '@/lib/data/services';


interface CaseStudyFieldsProps {
  value: CaseStudy;
  onChange: (value: CaseStudy) => void;
  category?: string;
}

const CATEGORY_ICONS: Record<ServiceCategory, React.ComponentType<{ className?: string }>> = {
  'UI/UX Design': Palette,
  'Product Design': Package,
  'Brand Identity': Sparkles,
  'Graphic Design': PenTool,
  'Website Design': Globe,
  'Tech Education': GraduationCap,
  'Social Media Management': Share2,
};

function Field({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  placeholder,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  helperText?: string;
}) {
  const inputClasses =
    'w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm text-mist-1">{label}</label>
        {helperText && (
          <span className="text-[11px] font-mono-tight text-mist-2">{helperText}</span>
        )}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputClasses} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}) {
  return (
    <ImageUploadField
      label={label}
      value={value}
      onChange={onChange}
      folder="projects"
      description={description || 'Upload case study image from your device (PNG, JPG, WebP)'}
    />
  );
}

function CaseStudySectionCard({
  title,
  stepNumber,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  stepNumber: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-(--line) bg-white/[0.02] overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25 shrink-0">
            {stepNumber}
          </span>
          <h3 className="font-display text-base font-semibold text-paper truncate">
            {title}
          </h3>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-mist-2 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-(--line) space-y-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}


export default function CaseStudyFields({
  value,
  onChange,
  category,
}: CaseStudyFieldsProps) {
  const config = getCaseStudyConfig(category);
  const Icon = CATEGORY_ICONS[config.category] || Palette;
  const f = config.fields;

  // Collapsible section states - All collapsed by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: false,
    problem: false,
    research: false,
    process: false,
    designSystem: false,
    solution: false,
    features: false,
    results: false,
    reflection: false,
    cta: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const areAnyOpen = Object.values(openSections).some(Boolean);
  const toggleAll = () => {
    const next = !areAnyOpen;
    setOpenSections({
      overview: next,
      problem: next,
      research: next,
      process: next,
      designSystem: next,
      solution: next,
      features: next,
      results: next,
      reflection: next,
      cta: next,
    });
  };

  const update = <K extends keyof CaseStudy>(key: K, newValue: CaseStudy[K]) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-6">
      {/* Category Indicator Banner */}
      <div className="p-4 rounded-xl glass border border-primary/30 bg-primary/5 flex items-start justify-between gap-3.5 flex-wrap">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="p-2 rounded-lg bg-primary/20 text-secondary shrink-0 mt-0.5">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-paper">
                Customized Form for {config.displayName}
              </h4>
              <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                Category Mode
              </span>
            </div>
            <p className="text-xs text-mist-2 mt-1 leading-relaxed">
              {config.description} All section titles, helper placeholders, and showcase image slots below are customized to highlight{' '}
              <strong className="text-paper">{config.displayName}</strong> deliverables.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-mist-1 hover:text-paper text-xs font-mono-tight transition-colors cursor-pointer shrink-0 self-start sm:self-center"
        >
          {areAnyOpen ? 'Collapse All Sections' : 'Expand All Sections'}
        </button>
      </div>

      {/* ── 1. OVERVIEW & AUDIENCE ── */}
      <CaseStudySectionCard
        title={f.overview.sectionTitle}
        stepNumber="01"
        isOpen={openSections.overview}
        onToggle={() => toggleSection('overview')}
      >
        <Field
          label={f.overview.clientLabel}
          value={value.client || ''}
          onChange={(v) => update('client', v)}
          placeholder={f.overview.clientPlaceholder}
        />
        <Field
          label={f.overview.objectiveLabel}
          value={value.objective || ''}
          onChange={(v) => update('objective', v)}
          placeholder={f.overview.objectivePlaceholder}
          textarea
          rows={3}
        />
        <Field
          label={f.overview.targetAudienceLabel}
          value={value.target_audience || ''}
          onChange={(v) => update('target_audience', v)}
          placeholder={f.overview.targetAudiencePlaceholder}
          textarea
          rows={3}
          helperText="Supports **Persona**: Description formatting"
        />
        <ImageField
          label={f.overview.overviewImageLabel}
          value={value.overview_image || ''}
          onChange={(v) => update('overview_image', v)}
          description={f.overview.overviewImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 2. PROBLEM & GOALS ── */}
      <CaseStudySectionCard
        title={f.problem.sectionTitle}
        stepNumber="02"
        isOpen={openSections.problem}
        onToggle={() => toggleSection('problem')}
      >
        <Field
          label={f.problem.problemLabel}
          value={value.problem || ''}
          onChange={(v) => update('problem', v)}
          placeholder={f.problem.problemPlaceholder}
          textarea
          rows={4}
          helperText="Use bullet points (•) for card breakdown"
        />
        <Field
          label={f.problem.userGoalsLabel}
          value={value.user_goals || ''}
          onChange={(v) => update('user_goals', v)}
          placeholder={f.problem.userGoalsPlaceholder}
          textarea
          rows={3}
          helperText="Use bullet points (•) for checklist view"
        />
        <Field
          label={f.problem.businessGoalsLabel}
          value={value.business_goals || ''}
          onChange={(v) => update('business_goals', v)}
          placeholder={f.problem.businessGoalsPlaceholder}
          textarea
          rows={3}
          helperText="Use bullet points (•) for checklist view"
        />
        <ImageField
          label={f.problem.problemImageLabel}
          value={value.problem_image || ''}
          onChange={(v) => update('problem_image', v)}
          description={f.problem.problemImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 3. RESEARCH & STRATEGY ── */}
      <CaseStudySectionCard
        title={f.research.sectionTitle}
        stepNumber="03"
        isOpen={openSections.research}
        onToggle={() => toggleSection('research')}
      >
        <Field
          label={f.research.researchLabel}
          value={value.research || ''}
          onChange={(v) => update('research', v)}
          placeholder={f.research.researchPlaceholder}
          textarea
          rows={5}
          helperText="Lines formatted as 'Insight: ...' render as insight cards"
        />
        <ImageField
          label={f.research.researchImageLabel}
          value={value.research_image || ''}
          onChange={(v) => update('research_image', v)}
          description={f.research.researchImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 4. PROCESS & CONSTRUCTION ── */}
      <CaseStudySectionCard
        title={f.process.sectionTitle}
        stepNumber="04"
        isOpen={openSections.process}
        onToggle={() => toggleSection('process')}
      >
        <Field
          label={f.process.processLabel}
          value={value.design_process || ''}
          onChange={(v) => update('design_process', v)}
          placeholder={f.process.processPlaceholder}
          textarea
          rows={6}
          helperText="Step 1 → Step 2 → Step 3 renders an interactive visual stepper"
        />
        <ImageField
          label={f.process.processImageLabel}
          value={value.design_process_image || ''}
          onChange={(v) => update('design_process_image', v)}
          description={f.process.processImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 5. DESIGN SYSTEM & IDENTITY ── */}
      <CaseStudySectionCard
        title={f.designSystem.sectionTitle}
        stepNumber="05"
        isOpen={openSections.designSystem}
        onToggle={() => toggleSection('designSystem')}
      >
        <Field
          label={f.designSystem.systemLabel}
          value={value.design_system || ''}
          onChange={(v) => update('design_system', v)}
          placeholder={f.designSystem.systemPlaceholder}
          textarea
          rows={6}
          helperText="Hex codes (#8000FF) auto-render as clickable color swatches"
        />
        <ImageField
          label={f.designSystem.systemImageLabel}
          value={value.design_system_image || ''}
          onChange={(v) => update('design_system_image', v)}
          description={f.designSystem.systemImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 6. FINAL SOLUTION & DELIVERABLES ── */}
      <CaseStudySectionCard
        title={f.solution.sectionTitle}
        stepNumber="06"
        isOpen={openSections.solution}
        onToggle={() => toggleSection('solution')}
      >
        <Field
          label={f.solution.solutionLabel}
          value={value.final_solution || ''}
          onChange={(v) => update('final_solution', v)}
          placeholder={f.solution.solutionPlaceholder}
          textarea
          rows={5}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageField
            label={f.solution.mobileImageLabel}
            value={value.final_mobile_image || ''}
            onChange={(v) => update('final_mobile_image', v)}
            description={f.solution.mobileImageDesc}
          />
          <ImageField
            label={f.solution.desktopImageLabel}
            value={value.final_desktop_image || ''}
            onChange={(v) => update('final_desktop_image', v)}
            description={f.solution.desktopImageDesc}
          />
        </div>
      </CaseStudySectionCard>

      {/* ── 7. KEY FEATURES & DELIVERABLES KIT ── */}
      <CaseStudySectionCard
        title={f.features.sectionTitle}
        stepNumber="07"
        isOpen={openSections.features}
        onToggle={() => toggleSection('features')}
      >
        <Field
          label={f.features.featuresLabel}
          value={(value.key_features || []).join('\n')}
          onChange={(v) =>
            update(
              'key_features',
              v.split('\n').map((s) => s.trim()).filter(Boolean)
            )
          }
          placeholder={f.features.featuresPlaceholder}
          textarea
          rows={6}
          helperText="Alternate line 1 (Title) and line 2 (Description) for feature cards"
        />
        <ImageField
          label={f.features.featuresImageLabel}
          value={value.key_features_image || ''}
          onChange={(v) => update('key_features_image', v)}
          description={f.features.featuresImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 8. RESULTS & IMPACT ── */}
      <CaseStudySectionCard
        title={f.results.sectionTitle}
        stepNumber="08"
        isOpen={openSections.results}
        onToggle={() => toggleSection('results')}
      >
        <Field
          label={f.results.resultsLabel}
          value={value.results || ''}
          onChange={(v) => update('results', v)}
          placeholder={f.results.resultsPlaceholder}
          textarea
          rows={5}
          helperText="Format with 'Achievements:' and 'Outcomes:' for dual impact cards"
        />
        <ImageField
          label={f.results.resultsImageLabel}
          value={value.results_image || ''}
          onChange={(v) => update('results_image', v)}
          description={f.results.resultsImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 9. REFLECTION & RETROSPECTIVE ── */}
      <CaseStudySectionCard
        title={f.reflection.sectionTitle}
        stepNumber="09"
        isOpen={openSections.reflection}
        onToggle={() => toggleSection('reflection')}
      >
        <Field
          label={f.reflection.reflectionLabel}
          value={value.reflection || ''}
          onChange={(v) => update('reflection', v)}
          placeholder={f.reflection.reflectionPlaceholder}
          textarea
          rows={5}
        />
        <ImageField
          label={f.reflection.reflectionImageLabel}
          value={value.reflection_image || ''}
          onChange={(v) => update('reflection_image', v)}
          description={f.reflection.reflectionImageDesc}
        />
      </CaseStudySectionCard>

      {/* ── 10. NEXT PROJECT CTA ── */}
      <CaseStudySectionCard
        title="Next Project CTA Link"
        stepNumber="10"
        isOpen={openSections.cta}
        onToggle={() => toggleSection('cta')}
      >
        <Field
          label="Next Project Slug"
          value={value.next_project_slug || ''}
          onChange={(v) => update('next_project_slug', v)}
          placeholder="e.g. abuja-health-hub"
          helperText="Slug of the project to suggest at the bottom of the case study"
        />
      </CaseStudySectionCard>
    </div>
  );
}

