'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
  className?: string;
  onPlaceholderClick?: (placeholderText: string) => void;
}

// Inline formatting parser for bold, italic, strikethrough, inline code, links, and placeholders
export function renderInlineMarkdown(
  text: string,
  onPlaceholderClick?: (placeholderText: string) => void
): React.ReactNode[] {
  // Tokenize string for links, bold, italic, strike, code, placeholders
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // 1. Image placeholder pattern: [IMAGE_PLACEHOLDER...]
    const placeholderMatch = remaining.match(/^\[IMAGE_PLACEHOLDER[^\]]*\]/i);
    if (placeholderMatch) {
      const phText = placeholderMatch[0];
      tokens.push(
        <span
          key={`ph-${keyIndex++}`}
          onClick={() => onPlaceholderClick && onPlaceholderClick(phText)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono-tight my-1 ${
            onPlaceholderClick ? 'cursor-pointer hover:bg-amber-500/25 transition-colors' : ''
          }`}
          title="Click to upload image and replace placeholder"
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{phText} (Image To Be Added)</span>
        </span>
      );
      remaining = remaining.slice(phText.length);
      continue;
    }

    // 2. Links: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [full, linkText, linkUrl] = linkMatch;
      const cleanUrl = linkUrl.trim();
      const isSafeProtocol = /^(https?:|\/|#|mailto:|tel:)/i.test(cleanUrl);
      const safeHref = isSafeProtocol ? cleanUrl : '#';
      const isExternal = cleanUrl.startsWith('http') || cleanUrl.startsWith('//');
      tokens.push(
        <a
          key={`link-${keyIndex++}`}
          href={safeHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-secondary hover:text-secondary/80 underline underline-offset-4 font-medium transition-colors inline-flex items-baseline gap-0.5"
        >
          <span>{linkText}</span>
          {isExternal && <ExternalLink className="w-3 h-3 ml-0.5 inline opacity-70" />}
        </a>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // 3. Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      const [full, , boldContent] = boldMatch;
      tokens.push(
        <strong key={`bold-${keyIndex++}`} className="font-bold text-paper">
          {renderInlineMarkdown(boldContent, onPlaceholderClick)}
        </strong>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // 4. Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      const [full, , italicContent] = italicMatch;
      tokens.push(
        <em key={`italic-${keyIndex++}`} className="italic text-paper/90">
          {renderInlineMarkdown(italicContent, onPlaceholderClick)}
        </em>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // 5. Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~(.*?)~~/);
    if (strikeMatch) {
      const [full, strikeContent] = strikeMatch;
      tokens.push(
        <del key={`strike-${keyIndex++}`} className="line-through text-mist-2">
          {renderInlineMarkdown(strikeContent, onPlaceholderClick)}
        </del>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // 6. Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      const [full, codeContent] = codeMatch;
      tokens.push(
        <code
          key={`code-${keyIndex++}`}
          className="font-mono-tight text-xs bg-white/10 text-secondary px-1.5 py-0.5 rounded border border-white/10 mx-0.5"
        >
          {codeContent}
        </code>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // Regular character: find next special token start
    const nextSpecial = remaining.search(/(\[|\*\*|__|\*|_|~~|`)/);
    if (nextSpecial === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Just a literal symbol
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      tokens.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="my-6 rounded-2xl bg-black/70 border border-(--line) overflow-hidden group shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="font-mono-tight text-xs text-mist-2 uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-mist-2 hover:text-paper transition-colors py-1 px-2 rounded-md hover:bg-white/5"
          title="Copy code to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-mono-tight">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 font-mono-tight text-xs sm:text-sm text-cyan-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function MarkdownContent({
  content,
  className = '',
  onPlaceholderClick,
}: MarkdownContentProps) {
  if (!content) return null;

  // Split by double line breaks to get paragraphs & blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={`prose-rayida space-y-5 ${className}`}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code block: ```lang\ncode\n```
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const firstLine = lines[0].replace(/^```/, '').trim();
          const code = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n');
          return <CodeBlock key={`block-${bIdx}`} code={code} language={firstLine} />;
        }

        // Image: ![alt](url)
        const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          const [, alt, url] = imageMatch;
          const isPlaceholder =
            url.includes('IMAGE_PLACEHOLDER') ||
            url.toLowerCase().includes('placeholder') ||
            url.startsWith('[') ||
            !url.trim();

          if (isPlaceholder) {
            return (
              <div
                key={`block-${bIdx}`}
                onClick={() => onPlaceholderClick && onPlaceholderClick(alt || 'Image Placeholder')}
                className={`my-6 p-6 rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 flex flex-col items-center justify-center text-center space-y-2 group transition-all ${
                  onPlaceholderClick ? 'cursor-pointer hover:border-amber-400 hover:bg-amber-500/10' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-semibold text-paper text-sm">
                    {alt || 'Visual Showcase Image Placeholder'}
                  </p>
                  <p className="text-xs text-amber-300/80 font-mono-tight mt-0.5">
                    Placeholder ready — upload image from device in editor to replace
                  </p>
                </div>
              </div>
            );
          }

          return (
            <figure key={`block-${bIdx}`} className="my-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={alt || 'Article visual'}
                className="w-full max-h-[550px] object-cover rounded-2xl border border-(--line) shadow-xl bg-ink-deep"
                loading="lazy"
              />
              {alt && (
                <figcaption className="text-xs text-mist-2 text-center mt-2 font-mono-tight">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        }

        // Headings: #, ##, ###, ####
        if (trimmed.startsWith('# ')) {
          return (
            <h1
              key={`block-${bIdx}`}
              className="font-display text-3xl sm:text-4xl font-bold text-paper mt-10 mb-4 tracking-tight"
            >
              {renderInlineMarkdown(trimmed.replace(/^# /, ''), onPlaceholderClick)}
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={`block-${bIdx}`}
              className="font-display text-2xl sm:text-3xl font-semibold text-paper mt-10 mb-4 tracking-tight"
            >
              {renderInlineMarkdown(trimmed.replace(/^## /, ''), onPlaceholderClick)}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={`block-${bIdx}`}
              className="font-display text-xl sm:text-2xl font-semibold text-paper mt-8 mb-3 tracking-tight"
            >
              {renderInlineMarkdown(trimmed.replace(/^### /, ''), onPlaceholderClick)}
            </h3>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={`block-${bIdx}`}
              className="font-display text-lg font-semibold text-paper mt-6 mb-2"
            >
              {renderInlineMarkdown(trimmed.replace(/^#### /, ''), onPlaceholderClick)}
            </h4>
          );
        }

        // Blockquote: > text
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map((line) => line.replace(/^>\s?/, ''))
            .join(' ');
          return (
            <blockquote
              key={`block-${bIdx}`}
              className="my-6 pl-5 border-l-2 border-primary bg-primary/5 py-3 pr-4 rounded-r-xl italic text-mist-1 text-base sm:text-lg leading-relaxed"
            >
              {renderInlineMarkdown(quoteLines, onPlaceholderClick)}
            </blockquote>
          );
        }

        // Horizontal rule: --- or ***
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return (
            <hr
              key={`block-${bIdx}`}
              className="my-8 border-t border-(--line) opacity-60"
            />
          );
        }

        // Bullet / Numbered / Checklist Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const lines = trimmed.split('\n');
          const isOrdered = /^\d+\.\s/.test(trimmed);

          if (isOrdered) {
            return (
              <ol key={`block-${bIdx}`} className="my-5 space-y-2 pl-6 list-decimal text-mist-1">
                {lines.map((line, lIdx) => (
                  <li key={`li-${lIdx}`} className="leading-relaxed">
                    {renderInlineMarkdown(line.replace(/^\d+\.\s*/, ''), onPlaceholderClick)}
                  </li>
                ))}
              </ol>
            );
          }

          return (
            <ul key={`block-${bIdx}`} className="my-5 space-y-2.5 pl-2">
              {lines.map((line, lIdx) => {
                const cleaned = line.replace(/^[-*]\s*/, '');
                const isChecklist = cleaned.startsWith('[ ] ') || cleaned.startsWith('[x] ');
                const isChecked = cleaned.startsWith('[x] ');

                if (isChecklist) {
                  return (
                    <li key={`task-${lIdx}`} className="flex items-start gap-2.5 text-mist-1 leading-relaxed">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-1 rounded accent-primary border-(--line) cursor-default"
                      />
                      <span className={isChecked ? 'line-through text-mist-2' : ''}>
                        {renderInlineMarkdown(cleaned.replace(/^\[[ x]\]\s*/, ''), onPlaceholderClick)}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={`bullet-${lIdx}`} className="flex items-start gap-2.5 text-mist-1 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span>{renderInlineMarkdown(cleaned, onPlaceholderClick)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Table detection: | col | col |
        if (trimmed.includes('|') && trimmed.includes('\n') && trimmed.includes('---')) {
          const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
          if (lines.length >= 2) {
            const headerCells = lines[0]
              .split('|')
              .map((c) => c.trim())
              .filter(Boolean);
            const dataRows = lines
              .slice(2)
              .map((row) =>
                row
                  .split('|')
                  .map((c) => c.trim())
                  .filter(Boolean)
              );

            return (
              <div key={`block-${bIdx}`} className="my-6 glass rounded-2xl overflow-x-auto border border-(--line)">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-(--line) bg-white/[0.04]">
                      {headerCells.map((h, hIdx) => (
                        <th key={`th-${hIdx}`} className="p-3 font-semibold text-paper font-display">
                          {renderInlineMarkdown(h, onPlaceholderClick)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--line)">
                    {dataRows.map((row, rIdx) => (
                      <tr key={`tr-${rIdx}`} className="hover:bg-white/[0.02]">
                        {row.map((cell, cIdx) => (
                          <td key={`td-${cIdx}`} className="p-3 text-mist-1">
                            {renderInlineMarkdown(cell, onPlaceholderClick)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Standard Paragraph
        return (
          <p key={`block-${bIdx}`} className="my-4 text-mist-1 text-base sm:text-lg leading-relaxed">
            {renderInlineMarkdown(trimmed, onPlaceholderClick)}
          </p>
        );
      })}
    </div>
  );
}

