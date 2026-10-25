import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  FileUp,
  Globe,
  Sliders,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  FileCode,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  HardDrive,
  FolderOpen,
  Split,
  Sparkles,
} from 'lucide-react';
import type { SampleDoc } from '../types';
import { SAMPLE_DOCS, STUDENT_SUBJECT_SETS } from '../utils/sampleDocs';

interface NavbarProps {
  documentTitle: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenFilePicker: () => void;
  onOpenFolderPicker: () => void;
  onOpenGoogleDriveModal: () => void;
  onOpenUrlModal: () => void;
  onSelectSample: (sample: SampleDoc) => void;
  onLoadSubjectSet: (subjectId: string) => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  hasMultipleDocs: boolean;
  zenMode: boolean;
  onToggleZenMode: () => void;
  onToggleSettings: () => void;
  isSettingsOpen: boolean;
  onPrintPdf: () => void;
  onDownloadHtml: () => void;
  onCopyMarkdown: () => void;
  isExtensionPopup: boolean;
  onOpenFullTab: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  documentTitle,
  isSidebarOpen,
  onToggleSidebar,
  onOpenFilePicker,
  onOpenFolderPicker,
  onOpenGoogleDriveModal,
  onOpenUrlModal,
  onSelectSample,
  onLoadSubjectSet,
  isCompareMode,
  onToggleCompareMode,
  hasMultipleDocs,
  zenMode,
  onToggleZenMode,
  onToggleSettings,
  isSettingsOpen,
  onPrintPdf,
  onDownloadHtml,
  onCopyMarkdown,
  isExtensionPopup,
  onOpenFullTab,
}) => {
  const [openMenuOpen, setOpenMenuOpen] = useState(false);
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const openMenuRef = useRef<HTMLDivElement>(null);
  const samplesRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openMenuRef.current && !openMenuRef.current.contains(event.target as Node)) {
        setOpenMenuOpen(false);
      }
      if (samplesRef.current && !samplesRef.current.contains(event.target as Node)) {
        setSamplesOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyMd = () => {
    onCopyMarkdown();
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  if (zenMode) {
    return (
      <div style={{ position: 'fixed', top: '12px', right: '12px', zIndex: 100 }}>
        <button
          className="btn btn-icon"
          onClick={onToggleZenMode}
          title="Exit Zen Mode (Esc)"
          aria-label="Exit Zen Mode"
        >
          <Minimize2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <header className="navbar">
      {/* Left: Brand & Sidebar toggle */}
      <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="btn btn-icon"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Hide Study Workspace' : 'Show Study Workspace'}
          aria-label="Toggle Study Workspace"
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <div className="navbar-brand" onClick={() => onSelectSample(SAMPLE_DOCS[0])}>
          <div className="brand-icon-wrapper">
            <BookOpen size={18} />
          </div>
          <span className="brand-name">
            LightMD <span className="brand-badge">Study</span>
          </span>
        </div>

        <div className="current-document-badge" title={documentTitle}>
          <FileCode size={14} />
          <span>{documentTitle}</span>
          {isCompareMode && <span className="badge-split-indicator">Comparing</span>}
        </div>
      </div>

      {/* Right: Actions & Tools */}
      <div className="navbar-actions">
        {/* Open Options Dropdown (Supports Local Files, Folder, Google Drive, URL) */}
        <div style={{ position: 'relative' }} ref={openMenuRef}>
          <button
            className="btn btn-primary"
            onClick={() => setOpenMenuOpen((prev) => !prev)}
            title="Open markdown files from Local disk, Google Drive, or URL"
          >
            <FileUp size={16} />
            <span>Open File</span>
            <ChevronDown size={14} />
          </button>

          {openMenuOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenFilePicker();
                  setOpenMenuOpen(false);
                }}
              >
                <FileUp size={15} color="var(--accent)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Open Local File(s)...</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                    Select single or multiple markdown files
                  </div>
                </div>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenFolderPicker();
                  setOpenMenuOpen(false);
                }}
              >
                <FolderOpen size={15} color="var(--callout-tip)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Open Notes Folder...</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                    Load an entire folder of chapter notes
                  </div>
                </div>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenGoogleDriveModal();
                  setOpenMenuOpen(false);
                }}
              >
                <HardDrive size={15} color="#4285f4" />
                <div>
                  <div style={{ fontWeight: 600 }}>Open from Google Drive...</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                    Paste Google Drive shared link or Doc ID
                  </div>
                </div>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenUrlModal();
                  setOpenMenuOpen(false);
                }}
              >
                <Globe size={15} color="var(--callout-important)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Open from Web URL...</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                    Fetch from GitHub raw or web link
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Study & Compare Button */}
        <button
          className={`btn ${isCompareMode ? 'btn-compare-active' : ''}`}
          onClick={onToggleCompareMode}
          title={
            isCompareMode
              ? 'Exit Side-by-Side Comparison'
              : hasMultipleDocs
              ? 'Compare two chapters side-by-side'
              : 'Open at least 2 notes to compare side-by-side'
          }
        >
          <Split size={16} />
          <span>{isCompareMode ? 'Comparing' : 'Compare'}</span>
        </button>

        {/* Sample Docs & Subjects Dropdown */}
        <div style={{ position: 'relative' }} ref={samplesRef}>
          <button
            className="btn"
            onClick={() => setSamplesOpen((prev) => !prev)}
            title="Browse sample documents and student subjects"
          >
            <BookOpen size={16} />
            <span>Samples</span>
            <ChevronDown size={14} />
          </button>
          {samplesOpen && (
            <div className="dropdown-menu" style={{ width: '280px' }}>
              <div className="dropdown-label">Student Subjects (Multi-Chapter):</div>
              {STUDENT_SUBJECT_SETS.map((subject) => (
                <button
                  key={subject.id}
                  className="dropdown-item"
                  onClick={() => {
                    onLoadSubjectSet(subject.id);
                    setSamplesOpen(false);
                  }}
                >
                  <Sparkles size={14} color="var(--callout-important)" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{subject.subjectName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                      {subject.chapters.length} chapters to compare
                    </div>
                  </div>
                </button>
              ))}

              <div className="dropdown-divider" />
              <div className="dropdown-label">Standalone Showcase Docs:</div>
              {SAMPLE_DOCS.map((sample) => (
                <button
                  key={sample.id}
                  className="dropdown-item"
                  onClick={() => {
                    onSelectSample(sample);
                    setSamplesOpen(false);
                  }}
                >
                  <FileCode size={14} />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export Dropdown */}
        <div style={{ position: 'relative' }} ref={exportRef}>
          <button
            className="btn"
            onClick={() => setExportOpen((prev) => !prev)}
            title="Export & Share options"
          >
            <Download size={16} />
            <span>Export</span>
            <ChevronDown size={14} />
          </button>
          {exportOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  onPrintPdf();
                  setExportOpen(false);
                }}
              >
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  onDownloadHtml();
                  setExportOpen(false);
                }}
              >
                <Download size={15} />
                <span>Download Standalone HTML</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  handleCopyMd();
                  setExportOpen(false);
                }}
              >
                {copiedMd ? <Check size={15} color="var(--callout-tip)" /> : <Copy size={15} />}
                <span>{copiedMd ? 'Copied Markdown!' : 'Copy Raw Markdown'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Extension "Open in full tab" button if applicable */}
        {isExtensionPopup && (
          <button
            className="btn btn-primary"
            onClick={onOpenFullTab}
            title="Open Reader in new full-size browser tab"
          >
            <ExternalLink size={15} />
            <span>Full Tab</span>
          </button>
        )}

        {/* Zen Mode */}
        <button
          className="btn btn-icon"
          onClick={onToggleZenMode}
          title="Enter Zen Mode (Focus)"
          aria-label="Zen Mode"
        >
          <Maximize2 size={18} />
        </button>

        {/* Appearance Settings Toggle */}
        <button
          className={`btn btn-icon ${isSettingsOpen ? 'active' : ''}`}
          onClick={onToggleSettings}
          title="Customize theme and typography"
          aria-label="Settings"
        >
          <Sliders size={18} />
        </button>
      </div>
    </header>
  );
};
