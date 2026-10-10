import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import type { ReaderSettings, TocHeading } from '../types';

interface ReaderViewProps {
  htmlContent: string;
  settings: ReaderSettings;
  headings: TocHeading[];
  onActiveHeadingChange: (id: string) => void;
  scrollTargetId: string | null;
  onClearScrollTarget: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  htmlContent,
  settings,
  headings,
  onActiveHeadingChange,
  scrollTargetId,
  onClearScrollTarget,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Initialize and render Mermaid diagrams whenever htmlContent or theme changes
  useEffect(() => {
    if (!articleRef.current) return;

    const mermaidTheme =
      settings.theme === 'dark' || settings.theme === 'dracula' ? 'dark' : 'default';

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: mermaidTheme,
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
      });

      const diagramContainers = articleRef.current.querySelectorAll('.mermaid-diagram-container');
      diagramContainers.forEach(async (container, index) => {
        const rawEncoded = container.getAttribute('data-mermaid');
        if (!rawEncoded) return;
        const code = decodeURIComponent(rawEncoded);
        const uniqueId = `mermaid-render-${Date.now()}-${index}`;

        try {
          const { svg } = await mermaid.render(uniqueId, code);
          container.innerHTML = svg;
        } catch (err) {
          console.warn('Mermaid render error:', err);
          container.innerHTML = `<div class="mermaid-error">⚠️ Diagram syntax error</div>`;
        }
      });
    } catch (e) {
      console.error('Failed to initialize mermaid:', e);
    }
  }, [htmlContent, settings.theme]);

  // Attach click listener for code copy buttons
  useEffect(() => {
    if (!articleRef.current) return;

    const copyButtons = articleRef.current.querySelectorAll<HTMLButtonElement>('.copy-code-btn');
    const handleCopyClick = async (btn: HTMLButtonElement) => {
      const codeAttr = btn.getAttribute('data-code');
      if (!codeAttr) return;
      const code = decodeURIComponent(codeAttr);

      try {
        await navigator.clipboard.writeText(code);
        const textSpan = btn.querySelector('.copy-text');
        if (textSpan) {
          const original = textSpan.textContent;
          textSpan.textContent = 'Copied!';
          btn.style.backgroundColor = 'var(--callout-tip)';
          btn.style.color = '#ffffff';

          setTimeout(() => {
            textSpan.textContent = original;
            btn.style.backgroundColor = '';
            btn.style.color = '';
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    };

    const listeners: { btn: HTMLButtonElement; fn: () => void }[] = [];
    copyButtons.forEach((btn) => {
      const fn = () => handleCopyClick(btn);
      btn.addEventListener('click', fn);
      listeners.push({ btn, fn });
    });

    return () => {
      listeners.forEach(({ btn, fn }) => btn.removeEventListener('click', fn));
    };
  }, [htmlContent]);

  // Handle smooth scroll when a TOC item is clicked
  useEffect(() => {
    if (!scrollTargetId || !containerRef.current) return;

    const element = containerRef.current.querySelector<HTMLElement>(`#${CSS.escape(scrollTargetId)}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onClearScrollTarget();
    }
  }, [scrollTargetId, onClearScrollTarget]);

  // ScrollSpy and reading progress tracking
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    setReadingProgress(Math.min(100, Math.max(0, progress)));

    // Detect currently visible heading
    if (headings.length > 0) {
      let currentActive = headings[0].id;
      for (const heading of headings) {
        const el = container.querySelector<HTMLElement>(`#${CSS.escape(heading.id)}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If heading is near top of viewport
          if (rect.top <= 140) {
            currentActive = heading.id;
          }
        }
      }
      onActiveHeadingChange(currentActive);
    }
  };

  const widthClass = `width-${settings.readingWidth}`;
  const fontClass = `font-${settings.fontFamily}`;
  const lineClass = `line-${settings.lineHeight}`;

  return (
    <>
      {/* Top progress bar */}
      <div className="reading-progress-track">
        <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />
      </div>

      <div
        className="reader-scroll-container"
        ref={containerRef}
        onScroll={handleScroll}
        id="reader-viewport"
      >
        <article
          ref={articleRef}
          className={`reader-article markdown-body ${widthClass} ${fontClass} ${lineClass}`}
          style={{ fontSize: `${settings.fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </>
  );
};
