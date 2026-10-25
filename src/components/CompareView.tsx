import React, { useState, useEffect, useRef } from 'react';
import {
  Split,
  ArrowLeftRight,
  Link2,
  Link2Off,
  X,
  FileText,
  Clock,
  HardDrive,
  Globe,
  Upload,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { ReaderView } from './ReaderView';
import { parseMarkdown } from '../utils/markdownParser';
import type { OpenDoc, ReaderSettings } from '../types';

interface CompareViewProps {
  primaryDoc: OpenDoc;
  compareDoc: OpenDoc;
  openDocs: OpenDoc[];
  settings: ReaderSettings;
  onSelectPrimaryDoc: (id: string) => void;
  onSelectCompareDoc: (id: string) => void;
  onSwapDocs: () => void;
  onCloseCompare: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  primaryDoc,
  compareDoc,
  openDocs,
  settings,
  onSelectPrimaryDoc,
  onSelectCompareDoc,
  onSwapDocs,
  onCloseCompare,
}) => {
  const [primaryHtml, setPrimaryHtml] = useState<string>('');
  const [compareHtml, setCompareHtml] = useState<string>('');
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [primaryMenuOpen, setPrimaryMenuOpen] = useState<boolean>(false);
  const [compareMenuOpen, setCompareMenuOpen] = useState<boolean>(false);

  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef<boolean>(false);

  // Compile Primary Document Markdown
  useEffect(() => {
    let cancelled = false;
    async function compileLeft() {
      const html = await parseMarkdown(primaryDoc.markdown);
      if (!cancelled) setPrimaryHtml(html);
    }
    compileLeft();
    return () => {
      cancelled = true;
    };
  }, [primaryDoc.markdown]);

  // Compile Compare Document Markdown
  useEffect(() => {
    let cancelled = false;
    async function compileRight() {
      const html = await parseMarkdown(compareDoc.markdown);
      if (!cancelled) setCompareHtml(html);
    }
    compileRight();
    return () => {
      cancelled = true;
    };
  }, [compareDoc.markdown]);

  // Handle synchronized scrolling from Left to Right
  const handleLeftScroll = () => {
    if (!syncScroll || isSyncingRef.current) return;
    const leftEl = leftContainerRef.current;
    const rightEl = rightContainerRef.current;
    if (!leftEl || !rightEl) return;

    const leftMax = leftEl.scrollHeight - leftEl.clientHeight;
    if (leftMax <= 0) return;
    const ratio = leftEl.scrollTop / leftMax;

    isSyncingRef.current = true;
    const rightMax = rightEl.scrollHeight - rightEl.clientHeight;
    rightEl.scrollTop = ratio * rightMax;
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  // Handle synchronized scrolling from Right to Left
  const handleRightScroll = () => {
    if (!syncScroll || isSyncingRef.current) return;
    const leftEl = leftContainerRef.current;
    const rightEl = rightContainerRef.current;
    if (!leftEl || !rightEl) return;

    const rightMax = rightEl.scrollHeight - rightEl.clientHeight;
    if (rightMax <= 0) return;
    const ratio = rightEl.scrollTop / rightMax;

    isSyncingRef.current = true;
    const leftMax = leftEl.scrollHeight - leftEl.clientHeight;
    leftEl.scrollTop = ratio * leftMax;
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  const getSourceIcon = (source: OpenDoc['source']) => {
    switch (source) {
      case 'gdrive':
        return <HardDrive size={13} color="#4285f4" />;
      case 'url':
        return <Globe size={13} color="var(--accent)" />;
      case 'local':
        return <Upload size={13} color="var(--callout-tip)" />;
      default:
        return <BookOpen size={13} color="var(--accent-light)" />;
    }
  };

  const primaryWords = primaryDoc.markdown.trim().split(/\s+/).filter(Boolean).length;
  const compareWords = compareDoc.markdown.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="compare-workspace-container">
      {/* Top Split View Toolbar */}
      <div className="compare-toolbar">
        <div className="compare-toolbar-badge">
          <Split size={15} color="var(--accent-light)" />
          <span>Study & Compare Mode</span>
        </div>

        <div className="compare-toolbar-controls">
          <button
            className={`btn btn-sm ${syncScroll ? 'btn-primary' : ''}`}
            onClick={() => setSyncScroll((prev) => !prev)}
            title={
              syncScroll
                ? 'Synchronized scroll is ON (click to scroll independently)'
                : 'Synchronized scroll is OFF (click to sync scrolling)'
            }
          >
            {syncScroll ? <Link2 size={14} /> : <Link2Off size={14} />}
            <span>{syncScroll ? 'Sync Scroll: ON' : 'Sync Scroll: OFF'}</span>
          </button>

          <button className="btn btn-sm" onClick={onSwapDocs} title="Swap Left and Right Panes">
            <ArrowLeftRight size={14} />
            <span>Swap Panes</span>
          </button>

          <button
            className="btn btn-sm btn-icon"
            onClick={onCloseCompare}
            title="Exit Compare Mode (Return to single reader)"
            aria-label="Exit Compare Mode"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Side-by-Side Panes */}
      <div className="compare-panes-grid">
        {/* ================= LEFT PANE ================= */}
        <div className="compare-pane">
          <div className="compare-pane-header">
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <button
                className="compare-pane-selector"
                onClick={() => setPrimaryMenuOpen((p) => !p)}
                title="Switch document in Left Pane"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                  <span className="pane-tag left-tag">Pane 1</span>
                  {getSourceIcon(primaryDoc.source)}
                  <span className="pane-title-text">{primaryDoc.title}</span>
                </span>
                <ChevronDown size={14} />
              </button>

              {primaryMenuOpen && (
                <div
                  className="dropdown-menu compare-dropdown"
                  onClick={() => setPrimaryMenuOpen(false)}
                >
                  <div className="dropdown-label">Select Document for Left Pane:</div>
                  {openDocs.map((doc) => (
                    <button
                      key={doc.id}
                      className={`dropdown-item ${doc.id === primaryDoc.id ? 'active' : ''}`}
                      onClick={() => onSelectPrimaryDoc(doc.id)}
                    >
                      {getSourceIcon(doc.source)}
                      <span>{doc.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="compare-pane-stats">
              <span>
                <FileText size={12} /> {primaryWords.toLocaleString()} words
              </span>
              <span>
                <Clock size={12} /> ~{Math.max(1, Math.ceil(primaryWords / 200))} min
              </span>
            </div>
          </div>

          <div className="compare-pane-content">
            <ReaderView
              htmlContent={primaryHtml}
              settings={settings}
              viewportId="compare-left-viewport"
              hideProgressBar={true}
              scrollContainerRef={leftContainerRef}
              onScrollContainer={handleLeftScroll}
            />
          </div>
        </div>

        {/* ================= RIGHT PANE ================= */}
        <div className="compare-pane right-pane">
          <div className="compare-pane-header">
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <button
                className="compare-pane-selector"
                onClick={() => setCompareMenuOpen((p) => !p)}
                title="Switch document in Right Pane"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                  <span className="pane-tag right-tag">Pane 2</span>
                  {getSourceIcon(compareDoc.source)}
                  <span className="pane-title-text">{compareDoc.title}</span>
                </span>
                <ChevronDown size={14} />
              </button>

              {compareMenuOpen && (
                <div
                  className="dropdown-menu compare-dropdown"
                  onClick={() => setCompareMenuOpen(false)}
                >
                  <div className="dropdown-label">Select Document for Right Pane:</div>
                  {openDocs.map((doc) => (
                    <button
                      key={doc.id}
                      className={`dropdown-item ${doc.id === compareDoc.id ? 'active' : ''}`}
                      onClick={() => onSelectCompareDoc(doc.id)}
                    >
                      {getSourceIcon(doc.source)}
                      <span>{doc.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="compare-pane-stats">
              <span>
                <FileText size={12} /> {compareWords.toLocaleString()} words
              </span>
              <span>
                <Clock size={12} /> ~{Math.max(1, Math.ceil(compareWords / 200))} min
              </span>
            </div>
          </div>

          <div className="compare-pane-content">
            <ReaderView
              htmlContent={compareHtml}
              settings={settings}
              viewportId="compare-right-viewport"
              hideProgressBar={true}
              scrollContainerRef={rightContainerRef}
              onScrollContainer={handleRightScroll}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
