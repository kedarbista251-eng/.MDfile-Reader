import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ReaderView } from './components/ReaderView';
import { CompareView } from './components/CompareView';
import { AppearanceControls } from './components/AppearanceControls';
import { UrlModal } from './components/UrlModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { DropOverlay } from './components/DropOverlay';
import { STUDENT_SUBJECT_SETS } from './utils/sampleDocs';
import { parseMarkdown, extractToc, calculateStats } from './utils/markdownParser';
import { exportStandaloneHtml } from './utils/exporter';
import type { ReaderSettings, SampleDoc, TocHeading, DocumentStats, OpenDoc } from './types';

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'dark',
  fontFamily: 'sans',
  fontSize: 17,
  readingWidth: 'standard',
  lineHeight: 'comfortable',
  showLineNumbers: true,
  zenMode: false,
};

// Initial student subject chapters
const INITIAL_CHAPTERS: OpenDoc[] = STUDENT_SUBJECT_SETS[0].chapters.map((ch) => ({
  id: ch.id,
  title: ch.title,
  markdown: ch.markdown,
  source: 'sample' as const,
  chapterNumber: ch.chapterNumber,
}));

export function App() {
  // Multi-document state
  const [openDocs, setOpenDocs] = useState<OpenDoc[]>(() => {
    const saved = localStorage.getItem('lightmd_open_docs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback to default
      }
    }
    return INITIAL_CHAPTERS;
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => {
    return localStorage.getItem('lightmd_active_doc_id') || INITIAL_CHAPTERS[0].id;
  });

  const [compareDocId, setCompareDocId] = useState<string | null>(() => {
    return localStorage.getItem('lightmd_compare_doc_id') || (INITIAL_CHAPTERS[1]?.id ?? null);
  });

  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);

  // Active document helper
  const activeDoc = openDocs.find((d) => d.id === activeDocId) || openDocs[0] || INITIAL_CHAPTERS[0];
  const compareDoc =
    openDocs.find((d) => d.id === compareDocId) ||
    openDocs.find((d) => d.id !== activeDoc.id) ||
    activeDoc;

  // Rendered compilation state for active document
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [stats, setStats] = useState<DocumentStats>({ words: 0, chars: 0, readTimeMin: 1, lines: 1 });
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [scrollTargetId, setScrollTargetId] = useState<string | null>(null);

  // UI modal states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState<boolean>(false);
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
  const folderInputRef = useRef<HTMLInputElement>(null);
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

  // Persist open documents & active doc ID
  useEffect(() => {
    localStorage.setItem('lightmd_open_docs', JSON.stringify(openDocs));
    localStorage.setItem('lightmd_active_doc_id', activeDocId);
    if (compareDocId) {
      localStorage.setItem('lightmd_compare_doc_id', compareDocId);
    }
  }, [openDocs, activeDocId, compareDocId]);

  // Re-compile markdown whenever active document source changes
  useEffect(() => {
    let isCancelled = false;

    async function compile() {
      const generatedHtml = await parseMarkdown(activeDoc.markdown);
      if (!isCancelled) {
        setHtmlContent(generatedHtml);
        setHeadings(extractToc(activeDoc.markdown));
        setStats(calculateStats(activeDoc.markdown));
      }
    }

    compile();

    return () => {
      isCancelled = true;
    };
  }, [activeDoc.markdown]);

  // Update reader settings helper
  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Add or update open documents
  const handleAddOpenDoc = (newDoc: OpenDoc) => {
    setOpenDocs((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === newDoc.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newDoc;
        return updated;
      }
      return [...prev, newDoc];
    });
    setActiveDocId(newDoc.id);
  };

  // Select document to read
  const handleSelectDoc = (id: string) => {
    setActiveDocId(id);
  };

  // Toggle comparison for a specific document
  const handleToggleCompareDoc = (id: string) => {
    if (isCompareMode && compareDocId === id) {
      setIsCompareMode(false);
    } else {
      setCompareDocId(id);
      setIsCompareMode(true);
    }
  };

  // Toggle Compare Mode overall
  const handleToggleCompareMode = () => {
    if (isCompareMode) {
      setIsCompareMode(false);
    } else {
      if (openDocs.length <= 1) {
        // Prompt to add more notes
        setIsGoogleDriveModalOpen(true);
        return;
      }
      if (!compareDocId || compareDocId === activeDocId) {
        const other = openDocs.find((d) => d.id !== activeDocId);
        if (other) setCompareDocId(other.id);
      }
      setIsCompareMode(true);
    }
  };

  // Close / remove document from sidebar
  const handleCloseDoc = (id: string) => {
    if (openDocs.length <= 1) return; // Keep at least one note
    const remaining = openDocs.filter((d) => d.id !== id);
    setOpenDocs(remaining);
    if (activeDocId === id) {
      setActiveDocId(remaining[0].id);
    }
    if (compareDocId === id) {
      const nextCompare = remaining.find((d) => d.id !== remaining[0].id) || null;
      setCompareDocId(nextCompare ? nextCompare.id : null);
      if (!nextCompare) setIsCompareMode(false);
    }
  };

  // Swap Left and Right panes in Compare View
  const handleSwapPanes = () => {
    if (!compareDocId) return;
    const oldPrimary = activeDocId;
    setActiveDocId(compareDocId);
    setCompareDocId(oldPrimary);
  };

  // Switch to showcase sample document
  const handleSelectSample = (sample: SampleDoc) => {
    const docId = `sample_${sample.id}`;
    const newDoc: OpenDoc = {
      id: docId,
      title: sample.title,
      markdown: sample.markdown,
      source: 'sample',
    };
    handleAddOpenDoc(newDoc);
  };

  // Load a complete multi-chapter student subject
  const handleLoadSubjectSet = (subjectId: string) => {
    const subject = STUDENT_SUBJECT_SETS.find((s) => s.id === subjectId);
    if (!subject) return;

    const chapters: OpenDoc[] = subject.chapters.map((ch) => ({
      id: `${subject.id}_${ch.id}`,
      title: ch.title,
      markdown: ch.markdown,
      source: 'sample' as const,
      chapterNumber: ch.chapterNumber,
    }));

    setOpenDocs(chapters);
    setActiveDocId(chapters[0].id);
    if (chapters.length > 1) {
      setCompareDocId(chapters[1].id);
    }
  };

  // Open local file picker
  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Open local folder picker
  const handleOpenFolderPicker = () => {
    folderInputRef.current?.click();
  };

  // Handle local file read (supports multiple files at once!)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content !== undefined) {
          const newDoc: OpenDoc = {
            id: `local_${Date.now()}_${index}_${file.name}`,
            title: file.name,
            markdown: content,
            source: 'local',
            lastModified: file.lastModified,
            chapterNumber: index + 1,
          };
          handleAddOpenDoc(newDoc);
        }
      };
      reader.readAsText(file);
    });

    e.target.value = '';
  };

  // Handle local folder read (loads all .md/.markdown/.txt files)
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const mdFiles = Array.from(files).filter((file) => {
      const lower = file.name.toLowerCase();
      return lower.endsWith('.md') || lower.endsWith('.markdown') || lower.endsWith('.txt');
    });

    if (mdFiles.length === 0) return;

    mdFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content !== undefined) {
          const newDoc: OpenDoc = {
            id: `folder_${Date.now()}_${index}_${file.name}`,
            title: file.name,
            markdown: content,
            source: 'local',
            lastModified: file.lastModified,
            chapterNumber: index + 1,
          };
          handleAddOpenDoc(newDoc);
        }
      };
      reader.readAsText(file);
    });

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
    const newDoc: OpenDoc = {
      id: `url_${Date.now()}`,
      title: inferredName,
      markdown: text,
      source: 'url',
      sourceUrl: url,
    };
    handleAddOpenDoc(newDoc);
  };

  // Export handlers
  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    exportStandaloneHtml(activeDoc.title, htmlContent, settings);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(activeDoc.markdown);
  };

  // Extension full tab opener
  const handleOpenFullTab = () => {
    if (typeof chrome !== 'undefined' && chrome?.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    } else {
      window.open(window.location.href, '_blank');
    }
  };

  // Drag and drop events on window (supports dropping multiple files!)
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

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content !== undefined) {
            const newDoc: OpenDoc = {
              id: `drag_${Date.now()}_${index}_${file.name}`,
              title: file.name,
              markdown: content,
              source: 'local',
              lastModified: file.lastModified,
            };
            handleAddOpenDoc(newDoc);
          }
        };
        reader.readAsText(file);
      });
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

  const navbarDocTitle = isCompareMode
    ? `${activeDoc.title} ⇄ ${compareDoc.title}`
    : activeDoc.title;

  return (
    <div className="app-container">
      {/* Hidden file input for single/multiple local files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.markdown,.txt"
        multiple
        style={{ display: 'none' }}
      />

      {/* Hidden file input for folder selection */}
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderChange}
        // @ts-expect-error webkitdirectory is standard browser feature
        webkitdirectory=""
        directory=""
        style={{ display: 'none' }}
      />

      {/* Full screen Drag & Drop feedback */}
      <DropOverlay isDragging={isDragging} />

      {/* Top Navigation Bar */}
      <Navbar
        documentTitle={navbarDocTitle}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenFilePicker={handleOpenFilePicker}
        onOpenFolderPicker={handleOpenFolderPicker}
        onOpenGoogleDriveModal={() => setIsGoogleDriveModalOpen(true)}
        onOpenUrlModal={() => setIsUrlModalOpen(true)}
        onSelectSample={handleSelectSample}
        onLoadSubjectSet={handleLoadSubjectSet}
        isCompareMode={isCompareMode}
        onToggleCompareMode={handleToggleCompareMode}
        hasMultipleDocs={openDocs.length > 1}
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

      {/* Google Drive Import Modal */}
      <GoogleDriveModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        onLoadDoc={handleAddOpenDoc}
      />

      {/* Main Workspace Layout */}
      <div className="app-workspace">
        {!settings.zenMode && (
          <Sidebar
            isOpen={isSidebarOpen}
            openDocs={openDocs}
            activeDocId={activeDocId}
            compareDocId={compareDocId}
            isCompareMode={isCompareMode}
            onSelectDoc={handleSelectDoc}
            onToggleCompareDoc={handleToggleCompareDoc}
            onCloseDoc={handleCloseDoc}
            onOpenLocalFiles={handleOpenFilePicker}
            onOpenFolder={handleOpenFolderPicker}
            onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
            onOpenUrlModal={() => setIsUrlModalOpen(true)}
            onLoadSubjectSet={handleLoadSubjectSet}
            onToggleCompareMode={handleToggleCompareMode}
            headings={headings}
            activeHeadingId={activeHeadingId}
            onSelectHeading={(id) => setScrollTargetId(id)}
            stats={stats}
          />
        )}

        {isCompareMode && openDocs.length > 1 ? (
          <CompareView
            primaryDoc={activeDoc}
            compareDoc={compareDoc}
            openDocs={openDocs}
            settings={settings}
            onSelectPrimaryDoc={setActiveDocId}
            onSelectCompareDoc={(id) => setCompareDocId(id)}
            onSwapDocs={handleSwapPanes}
            onCloseCompare={() => setIsCompareMode(false)}
          />
        ) : (
          <ReaderView
            htmlContent={htmlContent}
            settings={settings}
            headings={headings}
            onActiveHeadingChange={setActiveHeadingId}
            scrollTargetId={scrollTargetId}
            onClearScrollTarget={() => setScrollTargetId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
