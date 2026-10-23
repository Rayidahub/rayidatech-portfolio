import { describe, it, expect } from 'vitest';
import { parseUserAgent } from '@/lib/data/visitor-logs';

describe('Visitor User Agent Parsing', () => {
  it('correctly detects Windows Desktop Chrome', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const parsed = parseUserAgent(ua);
    expect(parsed.device_type).toBe('desktop');
    expect(parsed.os).toBe('Windows');
    expect(parsed.browser).toBe('Chrome');
  });

  it('correctly detects Mobile Safari on iPhone', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const parsed = parseUserAgent(ua);
    expect(parsed.device_type).toBe('mobile');
    expect(parsed.os).toBe('iOS');
    expect(parsed.browser).toBe('Safari');
  });

  it('correctly detects iPad / Tablet', () => {
    const ua =
      'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1';
    const parsed = parseUserAgent(ua);
    expect(parsed.device_type).toBe('tablet');
  });
});

