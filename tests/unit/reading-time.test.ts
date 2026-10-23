import { describe, it, expect } from 'vitest';
import { getReadingTime } from '@/lib/reading-time';

describe('Reading Time Calculator', () => {
  it('returns at least 1 minute for short content', () => {
    expect(getReadingTime('A quick design note.')).toBe(1);
    expect(getReadingTime('')).toBe(1);
  });

  it('accurately calculates minutes for longer articles (~200 words per minute)', () => {
    const text200Words = Array(200).fill('word').join(' ');
    expect(getReadingTime(text200Words)).toBe(1);

    const text450Words = Array(450).fill('word').join(' ');
    expect(getReadingTime(text450Words)).toBe(3); // 450 / 200 = 2.25 => ceil 3
  });

  it('handles multiline text with irregular whitespace', () => {
    const multiLine = `
      Paragraph one with several words.
      
      Paragraph two with extra indentation and \t tabs.
    `;
    expect(getReadingTime(multiLine)).toBe(1);
  });
});

