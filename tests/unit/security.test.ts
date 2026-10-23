import type React from 'react';
import { describe, it, expect } from 'vitest';
import { renderInlineMarkdown } from '@/components/ui/MarkdownContent';

describe('Security: Markdown Link Sanitization', () => {
  it('neutralizes javascript: URIs in Markdown links', () => {
    const rawMarkdown = '[Click Me](javascript:alert(document.cookie))';
    const tokens = renderInlineMarkdown(rawMarkdown);

    // Finding anchor tag in rendered tokens
    const anchor = tokens.find(
      (t: any) => t && t.type === 'a'
    ) as React.ReactElement<{ href?: string }>;

    expect(anchor).toBeDefined();
    expect(anchor.props.href).toBe('#');
  });

  it('neutralizes data:text/html URIs in Markdown links', () => {
    const rawMarkdown = '[Click Me](data:text/html,<script>alert(1)</script>)';
    const tokens = renderInlineMarkdown(rawMarkdown);

    const anchor = tokens.find(
      (t: any) => t && t.type === 'a'
    ) as React.ReactElement<{ href?: string }>;

    expect(anchor).toBeDefined();
    expect(anchor.props.href).toBe('#');
  });

  it('allows safe HTTPS, HTTP, relative, anchor, and mailto links', () => {
    const links = [
      '[Google](https://google.com)',
      '[Internal](/projects)',
      '[Section](#contact)',
      '[Email](mailto:hello@rayidatech.com)',
    ];

    for (const md of links) {
      const tokens = renderInlineMarkdown(md);
      const anchor = tokens.find(
        (t: any) => t && t.type === 'a'
      ) as React.ReactElement<{ href?: string }>;

      expect(anchor).toBeDefined();
      expect(anchor.props.href).not.toBe('#');
    }
  });
});

describe('Security: SVG XSS Detection & File Security', () => {
  function isDangerousSvg(content: string): boolean {
    const lower = content.toLowerCase();
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /xlink:href\s*=\s*["']javascript:/i,
      /\bon\w+\s*=/i,
      /<foreignobject/i,
    ];
    return dangerousPatterns.some((pattern) => pattern.test(lower));
  }

  it('detects embedded script tags in SVG payloads', () => {
    const maliciousSvg = '<svg><script>alert("XSS")</script></svg>';
    expect(isDangerousSvg(maliciousSvg)).toBe(true);
  });

  it('detects event handlers in SVG elements', () => {
    const onloadSvg = '<svg onload="fetch(\'/api/steal\')"></svg>';
    const onerrorSvg = '<svg><image href="x" onerror="alert(1)" /></svg>';
    expect(isDangerousSvg(onloadSvg)).toBe(true);
    expect(isDangerousSvg(onerrorSvg)).toBe(true);
  });

  it('detects javascript: pseudo-protocol in xlink:href', () => {
    const xlinkSvg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="javascript:alert(1)"><rect /></a></svg>';
    expect(isDangerousSvg(xlinkSvg)).toBe(true);
  });

  it('allows clean, non-executable SVG icons', () => {
    const cleanSvg = '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>';
    expect(isDangerousSvg(cleanSvg)).toBe(false);
  });
});

