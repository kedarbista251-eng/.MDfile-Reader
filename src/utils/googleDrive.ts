/**
 * Google Drive Integration Utility
 * Supports fetching Markdown and text notes from:
 * 1. Google Drive shared links (drive.google.com/file/d/...)
 * 2. Google Docs links (docs.google.com/document/d/...)
 * 3. Direct Google Drive file IDs
 * Includes smart CORS proxy fallbacks for seamless browser execution.
 */

export interface GoogleDriveFileResult {
  id: string;
  title: string;
  content: string;
  sourceUrl: string;
}

export interface GoogleDriveInfo {
  fileId: string;
  isGoogleDoc: boolean;
  cleanUrl: string;
}

/**
 * Extracts Google Drive / Docs file ID and metadata from a URL or raw ID string.
 */
export function extractGoogleDriveInfo(input: string): GoogleDriveInfo | null {
  if (!input) return null;
  const trimmed = input.trim();

  const isGoogleDoc = trimmed.includes('docs.google.com/document');

  // Match /d/([a-zA-Z0-9_-]+)
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]{15,})/);
  if (dMatch) {
    return {
      fileId: dMatch[1],
      isGoogleDoc,
      cleanUrl: trimmed,
    };
  }

  // Match id=([a-zA-Z0-9_-]+)
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{15,})/);
  if (idMatch) {
    return {
      fileId: idMatch[1],
      isGoogleDoc,
      cleanUrl: trimmed,
    };
  }

  // Raw file ID (alphanumeric, at least 15 chars)
  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) {
    return {
      fileId: trimmed,
      isGoogleDoc: false,
      cleanUrl: `https://drive.google.com/file/d/${trimmed}/view`,
    };
  }

  return null;
}

/**
 * Fetches content from a Google Drive file or Google Doc.
 * Attempts direct fetch first, and if blocked by CORS, uses transparent fallback proxies.
 */
export async function fetchGoogleDriveFile(
  urlOrId: string,
  customTitle?: string
): Promise<GoogleDriveFileResult> {
  const info = extractGoogleDriveInfo(urlOrId);
  if (!info) {
    throw new Error(
      'Invalid Google Drive link or File ID. Please paste a link like https://drive.google.com/file/d/... or a Google Doc link.'
    );
  }

  const { fileId, isGoogleDoc, cleanUrl } = info;

  // Primary download URLs
  const candidateUrls: string[] = isGoogleDoc
    ? [
        `https://docs.google.com/document/d/${fileId}/export?format=txt`,
        `https://docs.google.com/document/d/${fileId}/export?format=md`,
      ]
    : [
        `https://drive.usercontent.google.com/download?id=${fileId}&export=download`,
        `https://drive.google.com/uc?export=download&id=${fileId}`,
      ];

  let rawContent: string | null = null;
  let detectedTitle = customTitle?.trim() || '';

  // 1. Try direct fetch
  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const text = await response.text();
        // Check if Google returned an HTML login or warning page rather than file text
        if (
          text &&
          !text.includes('<!DOCTYPE html>') &&
          !text.includes('<html') &&
          text.trim().length > 0
        ) {
          rawContent = text;
          break;
        }
      }
    } catch {
      // Direct fetch might be blocked by CORS; continue to proxies
    }
  }

  // 2. If direct fetch didn't return text (e.g. CORS blocked in browser), try reliable proxies
  if (!rawContent) {
    const proxyBuilders = [
      (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
      (target: string) => `https://corsproxy.io/?url=${encodeURIComponent(target)}`,
    ];

    for (const proxyFn of proxyBuilders) {
      for (const targetUrl of candidateUrls) {
        try {
          const proxiedUrl = proxyFn(targetUrl);
          const response = await fetch(proxiedUrl);
          if (response.ok) {
            const text = await response.text();
            if (
              text &&
              !text.includes('<!DOCTYPE html>') &&
              !text.includes('<html') &&
              text.trim().length > 0
            ) {
              rawContent = text;
              break;
            }
          }
        } catch {
          // Try next proxy
        }
      }
      if (rawContent) break;
    }
  }

  if (!rawContent) {
    throw new Error(
      'Could not access the Google Drive file. Please ensure:\n1. The file sharing is set to "Anyone with the link can view"\n2. The link is correct.\nYou can also download the file to your computer and open it with "Open Local Files".'
    );
  }

  // Derive nice title if not provided
  if (!detectedTitle) {
    // Check if the document begins with a markdown H1 title (# Title)
    const firstH1Match = rawContent.match(/^#\s+(.+)$/m);
    if (firstH1Match && firstH1Match[1].trim()) {
      detectedTitle = firstH1Match[1].trim();
    } else {
      detectedTitle = isGoogleDoc
        ? `Google Doc (${fileId.substring(0, 6)}...)`
        : `Drive Note (${fileId.substring(0, 6)}...).md`;
    }
  }

  return {
    id: fileId,
    title: detectedTitle,
    content: rawContent,
    sourceUrl: cleanUrl,
  };
}

/**
 * Curated student sample Google Drive links for immediate 1-click testing.
 */
export const SAMPLE_GDRIVE_NOTES = [
  {
    title: 'Computer Science: Algorithms & Big-O Notation',
    description: 'Shared student study notes on algorithm analysis, graphs, and dynamic programming',
    url: 'https://drive.google.com/file/d/1t3gZ18Nf-SAMPLE_ALGORITHMS_STUDY_NOTE/view',
    fallbackMarkdown: `# Algorithms & Complexity Study Notes 📘
*Subject: CS 210 - Data Structures & Algorithms*
*Source: Google Drive Shared Notebook*

---

## 🎯 Chapter Overview
This chapter reviews asymptotic notation, divide-and-conquer strategies, and dynamic programming paradigms for midterms.

### 1. Asymptotic Notations
- **Big-O ($O$)**: Asymptotic upper bound ($f(n) \\le c \\cdot g(n)$)
- **Big-Omega ($\\Omega$)**: Asymptotic lower bound ($f(n) \\ge c \\cdot g(n)$)
- **Big-Theta ($\\Theta$)**: Asymptotically tight bound

$$T(n) = 2T\\left(\\frac{n}{2}\\right) + O(n) \\implies T(n) = \\Theta(n \\log n)$$

\`\`\`mermaid
graph TD
    A[Problem: Sorting] --> B{Size n <= 1?}
    B -->|Yes| C[Return Array]
    B -->|No| D[Divide into Left & Right]
    D --> E[Recursively Sort Left]
    D --> F[Recursively Sort Right]
    E --> G[Merge Sorted Halves]
    F --> G
    G --> H[Return Merged Array]
\`\`\`

### 2. Quick Reference Complexity Table

| Algorithm | Best Case | Average Case | Worst Case | Space |
| :--- | :--- | :--- | :--- | :--- |
| **Merge Sort** | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $O(n)$ |
| **Quick Sort** | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $\\Theta(n^2)$ | $O(\\log n)$ |
| **Binary Search** | $\\Theta(1)$ | $\\Theta(\\log n)$ | $\\Theta(\\log n)$ | $O(1)$ |

> [!NOTE]
> Synchronized comparison with Chapter 2 (Data Structures) is recommended when preparing for Exam 1.
`,
  },
  {
    title: 'Biochemistry: Enzymes & Kinetics',
    description: 'Shared laboratory lecture notes with Michaelis-Menten equations and graphs',
    url: 'https://drive.google.com/file/d/1k9pX72M-SAMPLE_BIOCHEMISTRY_NOTES/view',
    fallbackMarkdown: `# Biochemistry: Enzyme Kinetics & Catalysis 🧬
*Subject: BIOCHEM 301 - Molecular Principles*
*Source: Google Drive Shared Lecture Material*

---

## 🧪 Fundamental Concepts

Enzymes act as biological catalysts by lowering the activation energy $\\Delta G^{\\ddagger}$ of chemical reactions without altering the overall free energy change $\\Delta G^\\circ$.

### The Michaelis-Menten Equation

The steady-state rate equation for an enzyme-catalyzed reaction:

$$v_0 = \\frac{V_{\\max} [S]}{K_m + [S]}$$

Where:
- $v_0$ is the initial reaction velocity
- $V_{\\max}$ is the maximum rate achieved at saturating substrate concentration
- $[S]$ is substrate concentration
- $K_m$ is the Michaelis constant (substrate concentration at $\\frac{1}{2} V_{\\max}$)

\`\`\`mermaid
sequenceDiagram
    participant E as Enzyme (E)
    participant S as Substrate (S)
    participant ES as Complex (ES)
    participant P as Product (P)

    E->>S: Collision & Substrate Binding
    Note over E,S: k1 (forward) / k-1 (reverse)
    E-->>ES: Enzyme-Substrate Complex Formation
    Note over ES: Catalysis (kcat)
    ES-->>P: Transition state breakdown
    ES->>E: Free enzyme regenerated
\`\`\`

> [!TIP]
> Compare this chapter with Chapter 1 (Protein Structure & Folding) to see how amino acid residues form the catalytic active site!
`,
  },
];
