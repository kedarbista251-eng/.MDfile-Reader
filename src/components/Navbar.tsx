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
  ChevronDown
} from 'lucide-react';
import type { SampleDoc } from '../types';
import { SAMPLE_DOCS } from '../utils/sampleDocs';

interface NavbarProps {
  documentTitle: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenFilePicker: () => void;
  onOpenUrlModal: () => void;
  onSelectSample: (sample: SampleDoc) => void;
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
  onOpenUrlModal,
  onSelectSample,
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
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const samplesRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
          title={isSidebarOpen ? 'Hide Table of Contents' : 'Show Table of Contents'}
          aria-label="Toggle Table of Contents"
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <div className="navbar-brand" onClick={() => onSelectSample(SAMPLE_DOCS[0])}>
          <div className="brand-icon-wrapper">
            <BookOpen size={18} />
          </div>
          <span className="brand-name">
            LightMD <span className="brand-badge">Lite</span>
          </span>
        </div>

        <div className="current-document-badge" title={documentTitle}>
          <FileCode size={14} />
          <span>{documentTitle}</span>
        </div>
      </div>

      {/* Right: Actions & Tools */}
      <div className="navbar-actions">
        {/* Open File Button */}
        <button className="btn" onClick={onOpenFilePicker} title="Open local markdown file">
          <FileUp size={16} />
          <span>Open File</span>
        </button>

        {/* Load from URL */}
        <button className="btn" onClick={onOpenUrlModal} title="Load markdown from raw URL or GitHub">
          <Globe size={16} />
          <span>URL</span>
        </button>

        {/* Sample Docs Dropdown */}
        <div style={{ position: 'relative' }} ref={samplesRef}>
          <button
            className="btn"
            onClick={() => setSamplesOpen((prev) => !prev)}
            title="Browse sample documents"
          >
            <BookOpen size={16} />
            <span>Samples</span>
            <ChevronDown size={14} />
          </button>
          {samplesOpen && (
            <div className="dropdown-menu">
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
