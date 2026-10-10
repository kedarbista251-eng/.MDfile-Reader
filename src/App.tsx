import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SidebarToc } from './components/SidebarToc';
import { ReaderView } from './components/ReaderView';
import { AppearanceControls } from './components/AppearanceControls';
import { UrlModal } from './components/UrlModal';
import { DropOverlay } from './components/DropOverlay';
import { SAMPLE_DOCS } from './utils/sampleDocs';
import { parseMarkdown, extractToc, calculateStats } from './utils/markdownParser';
import { exportStandaloneHtml } from './utils/exporter';
import type { ReaderSettings, SampleDoc, TocHeading, DocumentStats } from './types';

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'dark',
  fontFamily: 'sans',
  fontSize: 17,
  readingWidth: 'standard',
  lineHeight: 'comfortable',
  showLineNumbers: true,
  zenMode: false,
};

export function App() {
  // Document state
  const [markdown, setMarkdown] = useState<string>(() => {
    const cached = localStorage.getItem('lightmd_last_doc');
    return cached || SAMPLE_DOCS[0].markdown;
  });
  const [docTitle, setDocTitle] = useState<string>(() => {
    return localStorage.getItem('lightmd_last_title') || 'Welcome to LightMD';
  });

  // Rendered compilation state
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [stats, setStats] = useState<DocumentStats>({ words: 0, chars: 0, readTimeMin: 1, lines: 1 });
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [scrollTargetId, setScrollTargetId] = useState<string | null>(null);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Settings state persisted in localStorage
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('lightmd_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef<number>(0);

  // Detect if running inside Chrome extension popup
  const isExtensionPopup =
    typeof window !== 'undefined' &&
    window.location.protocol === 'chrome-extension:' &&
    window.innerWidth <= 600;

  // Apply theme to DOM document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('lightmd_settings', JSON.stringify(settings));
  }, [settings]);

  // Re-compile markdown whenever source changes
  useEffect(() => {
    let isCancelled = false;

    async function compile() {
      const generatedHtml = await parseMarkdown(markdown);
      if (!isCancelled) {
        setHtmlContent(generatedHtml);
        setHeadings(extractToc(markdown));
        setStats(calculateStats(markdown));
        localStorage.setItem('lightmd_last_doc', markdown);
        localStorage.setItem('lightmd_last_title', docTitle);
      }
    }

    compile();

    return () => {
      isCancelled = true;
    };
  }, [markdown, docTitle]);

  // Update reader settings helper
  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Switch to sample document
  const handleSelectSample = (sample: SampleDoc) => {
    setDocTitle(sample.title);
    setMarkdown(sample.markdown);
  };

  // Open file picker dialog
  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Handle local file read
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content !== undefined) {
        setDocTitle(file.name);
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  // Fetch markdown from web URL
  const handleLoadFromUrl = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load file (${response.status}: ${response.statusText})`);
    }
    const text = await response.text();
    const urlParts = url.split('/');
    const inferredName = urlParts[urlParts.length - 1] || 'Web Document';
    setDocTitle(inferredName);
    setMarkdown(text);
  };

  // Export handlers
  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    exportStandaloneHtml(docTitle, htmlContent, settings);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
  };

  // Extension full tab opener
  const handleOpenFullTab = () => {
    if (typeof chrome !== 'undefined' && chrome?.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    } else {
      window.open(window.location.href, '_blank');
    }
  };

  // Drag and drop events on window
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    if (e.dataTransfer?.types?.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      setIsDragging(false);
      dragCounterRef.current = 0;
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content !== undefined) {
          setDocTitle(file.name);
          setMarkdown(content);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && settings.zenMode) {
        handleUpdateSettings({ zenMode: false });
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenFilePicker();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.zenMode]);

  return (
    <div className="app-container">
      {/* Hidden file input for file picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.markdown,.txt"
        style={{ display: 'none' }}
      />

      {/* Full screen Drag & Drop feedback */}
      <DropOverlay isDragging={isDragging} />

      {/* Top Navigation Bar */}
      <Navbar
        documentTitle={docTitle}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenFilePicker={handleOpenFilePicker}
        onOpenUrlModal={() => setIsUrlModalOpen(true)}
        onSelectSample={handleSelectSample}
        zenMode={settings.zenMode}
        onToggleZenMode={() => handleUpdateSettings({ zenMode: !settings.zenMode })}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
        isSettingsOpen={isSettingsOpen}
        onPrintPdf={handlePrintPdf}
        onDownloadHtml={handleDownloadHtml}
        onCopyMarkdown={handleCopyMarkdown}
        isExtensionPopup={isExtensionPopup}
        onOpenFullTab={handleOpenFullTab}
      />

      {/* Appearance & Typography customization panel */}
      <AppearanceControls
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Web URL Markdown fetcher modal */}
      <UrlModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onLoadUrl={handleLoadFromUrl}
      />

      {/* Main Workspace Layout */}
      <div className="app-workspace">
        {!settings.zenMode && (
          <SidebarToc
            headings={headings}
            activeHeadingId={activeHeadingId}
            isOpen={isSidebarOpen}
            onSelectHeading={(id) => setScrollTargetId(id)}
            stats={stats}
          />
        )}

        <ReaderView
          htmlContent={htmlContent}
          settings={settings}
          headings={headings}
          onActiveHeadingChange={setActiveHeadingId}
          scrollTargetId={scrollTargetId}
          onClearScrollTarget={() => setScrollTargetId(null)}
        />
      </div>
    </div>
  );
}

export default App;
