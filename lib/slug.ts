/**
 * Normalize a raw string into a URL-safe slug.
 * Lowercases, replaces non-alphanumeric runs with hyphens, and trims edges.
 */
export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a canonical slug from a title.
 * Alias of normalizeSlug for semantic clarity.
 */
export function generateSlug(title: string): string {
  return normalizeSlug(title);
}
