import { describe, it, expect } from 'vitest';
import { normalizeSlug, generateSlug } from '@/lib/slug';

describe('Slug Generator Utility', () => {
  it('converts titles to lowercase hyphenated slugs', () => {
    expect(normalizeSlug('FlavorEase Mobile App')).toBe('flavorease-mobile-app');
    expect(generateSlug('AI-Driven Financial Analytics')).toBe('ai-driven-financial-analytics');
  });

  it('strips special characters and punctuation', () => {
    expect(normalizeSlug('Hello, World! #2026?')).toBe('hello-world-2026');
    expect(normalizeSlug('Product Design & Engineering @ Rayida')).toBe('product-design-engineering-rayida');
  });

  it('trims leading and trailing hyphens', () => {
    expect(normalizeSlug('---test-title---')).toBe('test-title');
    expect(normalizeSlug('...special start and end...')).toBe('special-start-and-end');
  });

  it('handles multiple consecutive spaces and symbols', () => {
    expect(normalizeSlug('Multiple    spaces    between')).toBe('multiple-spaces-between');
    expect(normalizeSlug('Under___scores___and---hyphens')).toBe('under-scores-and-hyphens');
  });
});

