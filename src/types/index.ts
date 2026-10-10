export type ReadingTheme = 'dark' | 'light' | 'sepia' | 'dracula';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type ReadingWidth = 'compact' | 'standard' | 'wide' | 'full';
export type LineHeight = 'compact' | 'comfortable' | 'relaxed';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocumentStats {
  words: number;
  chars: number;
  readTimeMin: number;
  lines: number;
}

export interface ReaderSettings {
  theme: ReadingTheme;
  fontFamily: FontFamily;
  fontSize: number; // in px, e.g. 17
  readingWidth: ReadingWidth;
  lineHeight: LineHeight;
  showLineNumbers: boolean;
  zenMode: boolean;
}

export interface SampleDoc {
  id: string;
  title: string;
  description: string;
  markdown: string;
}

// Global Chrome Extension namespace declaration
declare global {
  const chrome: any;
}
