'use client';

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

export default function CaseStudyFields({
  value,
  onChange,
  category,
}: CaseStudyFieldsProps) {
  const config = getCaseStudyConfig(category);
  const Icon = CATEGORY_ICONS[config.category] || Palette;
  const f = config.fields;

  const update = <K extends keyof CaseStudy>(key: K, newValue: CaseStudy[K]) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-10">
      {/* Category Indicator Banner */}
      <div className="p-4 rounded-xl glass border border-primary/30 bg-primary/5 flex items-start gap-3.5">
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

      {/* ── 1. OVERVIEW & AUDIENCE ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper flex items-center gap-2">
          <span>{f.overview.sectionTitle}</span>
        </h3>
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
      </div>

      {/* ── 2. PROBLEM & GOALS ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.problem.sectionTitle}
        </h3>
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
      </div>

      {/* ── 3. RESEARCH & STRATEGY ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.research.sectionTitle}
        </h3>
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
      </div>

      {/* ── 4. PROCESS & CONSTRUCTION ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.process.sectionTitle}
        </h3>
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
      </div>

      {/* ── 5. DESIGN SYSTEM & IDENTITY ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.designSystem.sectionTitle}
        </h3>
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
      </div>

      {/* ── 6. FINAL SOLUTION & DELIVERABLES ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.solution.sectionTitle}
        </h3>
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
      </div>

      {/* ── 7. KEY FEATURES & DELIVERABLES KIT ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.features.sectionTitle}
        </h3>
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
      </div>

      {/* ── 8. RESULTS & IMPACT ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.results.sectionTitle}
        </h3>
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
      </div>

      {/* ── 9. REFLECTION & RETROSPECTIVE ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          {f.reflection.sectionTitle}
        </h3>
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
      </div>

      {/* ── 10. NEXT PROJECT CTA ── */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Next Project CTA Link
        </h3>
        <Field
          label="Next Project Slug"
          value={value.next_project_slug || ''}
          onChange={(v) => update('next_project_slug', v)}
          placeholder="e.g. abuja-health-hub"
          helperText="Slug of the project to suggest at the bottom of the case study"
        />
      </div>
    </div>
  );
}
