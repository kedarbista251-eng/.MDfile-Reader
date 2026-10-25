import { marked } from 'marked';
import hljs from 'highlight.js';
import katex from 'katex';
import DOMPurify from 'dompurify';
import type { TocHeading, DocumentStats } from '../types';

// Slugify text for heading anchors
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[^\w\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-');
}

// Extract Table of Contents from markdown source
export function extractToc(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      // Remove inline markdown formatting from TOC text
      const cleanText = rawText
        .replace(/[*_~`]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
      const id = slugify(cleanText);
      headings.push({ id, text: cleanText, level });
    }
  }

  return headings;
}

// Calculate document reading statistics
export function calculateStats(markdown: string): DocumentStats {
  const cleanText = markdown
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/<[^>]*>/g, '') // remove HTML
    .replace(/[#*`~_[\]()]/g, ' ') // remove markdown syntax
    .trim();

  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const chars = markdown.length;
  const lines = markdown.split('\n').length;
  const readTimeMin = Math.max(1, Math.ceil(words / 200));

  return { words, chars, readTimeMin, lines };
}

// Pre-process math expressions to KaTeX placeholders before marked parsing
function processMath(markdown: string): { processed: string; mathMap: Map<string, string> } {
  const mathMap = new Map<string, string>();
  let placeholderIndex = 0;

  // Process Block Math: $$ ... $$
  let processed = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, formula) => {
    const key = `@@KATEX_BLOCK_${placeholderIndex++}@@`;
    try {
      const rendered = katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
      });
      mathMap.set(key, `<div class="katex-display-wrapper">${rendered}</div>`);
    } catch {
      mathMap.set(key, `<pre class="katex-error">${formula}</pre>`);
    }
    return key;
  });

  // Process Inline Math: $ ... $ (ensuring not matched with currency or empty spaces)
  processed = processed.replace(/(?<!\\)\$([^$\n]+?)\$(?!\$)/g, (_match, formula) => {
    // Skip if empty or starts/ends with space
    if (!formula.trim() || formula.startsWith(' ') || formula.endsWith(' ')) {
      return _match;
    }
    const key = `@@KATEX_INLINE_${placeholderIndex++}@@`;
    try {
      const rendered = katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
      });
      mathMap.set(key, `<span class="katex-inline-wrapper">${rendered}</span>`);
    } catch {
      mathMap.set(key, `<code>${formula}</code>`);
    }
    return key;
  });

  return { processed, mathMap };
}

// Process GitHub-style Callouts (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION])
function processCallouts(html: string): string {
  const calloutRegex = /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([\s\S]*?)<\/blockquote>/gi;

  return html.replace(calloutRegex, (_match, type, content) => {
    const lowerType = type.toLowerCase();
    const titles: Record<string, string> = {
      note: 'Note',
      tip: 'Tip',
      important: 'Important',
      warning: 'Warning',
      caution: 'Caution',
    };
    const title = titles[lowerType] || type;

    return `
      <div class="callout-card callout-${lowerType}">
        <div class="callout-header">
          <span class="callout-badge">${title}</span>
        </div>
        <div class="callout-body">
          <p>${content}
        </div>
      </div>
    `;
  });
}

// Main Markdown to HTML compiler
export async function parseMarkdown(markdown: string): Promise<string> {
  const { processed, mathMap } = processMath(markdown);

  // Configure marked renderer
  const renderer = new marked.Renderer();

  // Headings with IDs for TOC linking
  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    const cleanForSlug = text.replace(/<[^>]*>/g, '');
    const id = slugify(cleanForSlug);
    return `<h${depth} id="${id}" class="heading-anchor"><a href="#${id}" class="heading-link-icon" aria-label="Link to section">#</a><span>${text}</span></h${depth}>\n`;
  };

  // Code blocks: Highlight.js or Mermaid diagrams
  renderer.code = ({ text, lang }) => {
    const language = (lang || '').trim().toLowerCase();

    // Check for Mermaid diagram
    if (language === 'mermaid') {
      const encoded = encodeURIComponent(text);
      return `<div class="mermaid-diagram-container" data-mermaid="${encoded}"><div class="mermaid-loading">Rendering diagram...</div></div>`;
    }

    // Code syntax highlighting with highlight.js
    let highlighted: string;
    if (language && hljs.getLanguage(language)) {
      try {
        highlighted = hljs.highlight(text, { language, ignoreIllegals: true }).value;
      } catch {
        highlighted = hljs.highlightAuto(text).value;
      }
    } else if (language) {
      try {
        highlighted = hljs.highlightAuto(text).value;
      } catch {
        highlighted = text;
      }
    } else {
      highlighted = hljs.highlightAuto(text).value;
    }

    const safeCodeAttr = encodeURIComponent(text);
    const displayLang = language || 'text';

    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-label">${displayLang}</span>
          <button type="button" class="copy-code-btn" data-code="${safeCodeAttr}" title="Copy code">
            <span class="copy-text">Copy</span>
          </button>
        </div>
        <pre><code class="hljs ${displayLang}">${highlighted}</code></pre>
      </div>
    `;
  };

  // Set options on marked
  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
  });

  // Parse marked output
  let rawHtml = await marked.parse(processed);

  // Restore KaTeX placeholders
  for (const [placeholder, katexHtml] of mathMap.entries()) {
    rawHtml = rawHtml.replace(placeholder, katexHtml);
  }

  // Transform GitHub callouts
  const withCallouts = processCallouts(rawHtml);

  // Sanitize with DOMPurify allowing KaTeX, Mermaid and SVG tags
  const sanitized = DOMPurify.sanitize(withCallouts, {
    ADD_TAGS: [
      'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'ms', 'mspace', 'mtext',
      'mfrac', 'msqrt', 'mroot', 'msub', 'msup', 'msubsup', 'mtable', 'mtr',
      'mtd', 'annotation', 'svg', 'path', 'g', 'rect', 'circle', 'line',
      'polygon', 'polyline', 'text', 'foreignObject', 'button'
    ],
    ADD_ATTR: [
      'aria-hidden', 'viewBox', 'xmlns', 'fill', 'stroke', 'd', 'style',
      'data-mermaid', 'data-code', 'class', 'id', 'target', 'rel', 'title'
    ],
  });

  return sanitized;
}
