import type { ReaderSettings } from '../types';

export function exportStandaloneHtml(title: string, htmlContent: string, settings: ReaderSettings): void {
  const standaloneHtml = `<!DOCTYPE html>
<html lang="en" data-theme="${settings.theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - LightMD Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <style>
    :root {
      --font-sans: 'Inter', sans-serif;
      --font-serif: 'Merriweather', serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    body {
      margin: 0;
      padding: 3rem 1.5rem;
      background-color: ${settings.theme === 'dark' ? '#090a0f' : settings.theme === 'sepia' ? '#f5efe6' : settings.theme === 'dracula' ? '#181926' : '#ffffff'};
      color: ${settings.theme === 'dark' ? '#f3f4f6' : settings.theme === 'sepia' ? '#33261c' : settings.theme === 'dracula' ? '#cad3f5' : '#0f172a'};
      font-family: var(--font-${settings.fontFamily});
      font-size: ${settings.fontSize}px;
      line-height: ${settings.lineHeight === 'compact' ? '1.45' : settings.lineHeight === 'relaxed' ? '2.0' : '1.75'};
      display: flex;
      justify-content: center;
    }
    .article-container {
      width: 100%;
      max-width: ${settings.readingWidth === 'compact' ? '680px' : settings.readingWidth === 'wide' ? '1080px' : settings.readingWidth === 'full' ? '95%' : '840px'};
    }
    h1, h2, h3, h4 { font-family: 'Outfit', var(--font-sans); margin-top: 1.8em; margin-bottom: 0.6em; line-height: 1.3; }
    h1 { font-size: 2.2em; border-bottom: 1px solid rgba(125,125,125,0.2); padding-bottom: 0.3em; }
    h2 { font-size: 1.6em; border-bottom: 1px solid rgba(125,125,125,0.2); padding-bottom: 0.25em; }
    code { font-family: var(--font-mono); background: rgba(125,125,125,0.15); padding: 0.2em 0.4em; border-radius: 4px; }
    pre { background: rgba(0,0,0,0.2); padding: 1em; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #6366f1; margin: 1.2em 0; padding: 0.6em 1em; background: rgba(125,125,125,0.08); border-radius: 0 8px 8px 0; }
    table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
    th, td { border: 1px solid rgba(125,125,125,0.25); padding: 0.6em 0.8em; text-align: left; }
    th { background: rgba(125,125,125,0.1); }
    img { max-width: 100%; border-radius: 8px; }
    .heading-link-icon, .copy-code-btn { display: none; }
  </style>
</head>
<body>
  <div class="article-container">
    ${htmlContent}
  </div>
</body>
</html>`;

  const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  anchor.href = url;
  anchor.download = `${safeName || 'document'}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
