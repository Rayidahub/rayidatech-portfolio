'use client';

import type { CaseStudy } from '@/types/project';

interface CaseStudyFieldsProps {
  value: CaseStudy;
  onChange: (value: CaseStudy) => void;
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const inputClasses =
    'w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors';

  return (
    <div>
      <label className="block text-sm text-mist-1 mb-1.5">{label}</label>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field
      label={label}
      value={value}
      onChange={onChange}
      placeholder="https://..."
    />
  );
}

export default function CaseStudyFields({ value, onChange }: CaseStudyFieldsProps) {
  const update = <K extends keyof CaseStudy>(key: K, newValue: CaseStudy[K]) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Project Overview
        </h3>
        <Field
          label="Client / Business"
          value={value.client || ''}
          onChange={(v) => update('client', v)}
        />
        <Field
          label="Objective"
          value={value.objective || ''}
          onChange={(v) => update('objective', v)}
          textarea
        />
        <Field
          label="Target Audience"
          value={value.target_audience || ''}
          onChange={(v) => update('target_audience', v)}
          textarea
        />
        <ImageField
          label="Overview Image URL"
          value={value.overview_image || ''}
          onChange={(v) => update('overview_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Problem & Goals
        </h3>
        <Field
          label="Challenge"
          value={value.problem || ''}
          onChange={(v) => update('problem', v)}
          textarea
          rows={4}
        />
        <Field
          label="Business Goals"
          value={value.business_goals || ''}
          onChange={(v) => update('business_goals', v)}
          textarea
        />
        <Field
          label="User Goals"
          value={value.user_goals || ''}
          onChange={(v) => update('user_goals', v)}
          textarea
        />
        <ImageField
          label="Problem Image URL"
          value={value.problem_image || ''}
          onChange={(v) => update('problem_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Research & Strategy
        </h3>
        <Field
          label="Research & Strategy"
          value={value.research || ''}
          onChange={(v) => update('research', v)}
          textarea
          rows={5}
        />
        <ImageField
          label="Research Image URL"
          value={value.research_image || ''}
          onChange={(v) => update('research_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Design Process
        </h3>
        <Field
          label="Design Process"
          value={value.design_process || ''}
          onChange={(v) => update('design_process', v)}
          textarea
          rows={5}
        />
        <ImageField
          label="Design Process Image URL"
          value={value.design_process_image || ''}
          onChange={(v) => update('design_process_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Design System
        </h3>
        <Field
          label="Design System"
          value={value.design_system || ''}
          onChange={(v) => update('design_system', v)}
          textarea
          rows={5}
        />
        <ImageField
          label="Design System Image URL"
          value={value.design_system_image || ''}
          onChange={(v) => update('design_system_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Final Solution
        </h3>
        <Field
          label="Final Solution"
          value={value.final_solution || ''}
          onChange={(v) => update('final_solution', v)}
          textarea
          rows={5}
        />
        <ImageField
          label="Final Mobile Screens URL"
          value={value.final_mobile_image || ''}
          onChange={(v) => update('final_mobile_image', v)}
        />
        <ImageField
          label="Final Desktop Screens URL"
          value={value.final_desktop_image || ''}
          onChange={(v) => update('final_desktop_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Key Features
        </h3>
        <Field
          label="Key Features (one per line)"
          value={(value.key_features || []).join('\n')}
          onChange={(v) =>
            update(
              'key_features',
              v.split('\n').map((s) => s.trim()).filter(Boolean)
            )
          }
          textarea
          rows={5}
        />
        <ImageField
          label="Key Features Image URL"
          value={value.key_features_image || ''}
          onChange={(v) => update('key_features_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Results & Impact
        </h3>
        <Field
          label="Results & Impact"
          value={value.results || ''}
          onChange={(v) => update('results', v)}
          textarea
          rows={5}
        />
        <ImageField
          label="Results Image URL"
          value={value.results_image || ''}
          onChange={(v) => update('results_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Reflection & Learnings
        </h3>
        <Field
          label="Reflection & Learnings"
          value={value.reflection || ''}
          onChange={(v) => update('reflection', v)}
          textarea
          rows={5}
        />
        <ImageField
          label="Reflection Image URL"
          value={value.reflection_image || ''}
          onChange={(v) => update('reflection_image', v)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-paper">
          Next Project CTA
        </h3>
        <Field
          label="Next Project Slug"
          value={value.next_project_slug || ''}
          onChange={(v) => update('next_project_slug', v)}
          placeholder="another-project-slug"
        />
      </div>
    </div>
  );
}
