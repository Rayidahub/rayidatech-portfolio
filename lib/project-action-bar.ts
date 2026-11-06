// lib/project-action-bar.ts

export type ProjectFormMode = 'new' | 'edit';
export type ProjectFormStatus = 'draft' | 'published';

/**
 * Returns human-readable label for the draft save button.
 */
export function getDraftButtonLabel(
  mode: ProjectFormMode,
  status: ProjectFormStatus,
  isSaving: boolean
): string {
  if (isSaving) return 'Saving...';
  if (mode === 'new') return 'Save as Draft';
  return status === 'draft' ? 'Update Draft' : 'Switch to Draft';
}

/**
 * Returns human-readable label for the publish button.
 */
export function getPublishButtonLabel(
  mode: ProjectFormMode,
  status: ProjectFormStatus,
  isSaving: boolean
): string {
  if (isSaving) return 'Publishing...';
  if (mode === 'new') return 'Publish Project';
  return status === 'published' ? 'Save Changes' : 'Publish Project';
}
