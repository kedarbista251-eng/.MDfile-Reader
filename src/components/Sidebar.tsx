import React, { useState } from 'react';
import {
  ListFilter,
  Files,
  Search,
  Plus,
  HardDrive,
  Globe,
  Upload,
  FolderOpen,
  Split,
  Trash2,
  BookOpen,
  ChevronDown,
  Sparkles,
  Clock,
  FileText,
  Layers,
} from 'lucide-react';
import type { OpenDoc, TocHeading, DocumentStats } from '../types';
import { STUDENT_SUBJECT_SETS } from '../utils/sampleDocs';

interface SidebarProps {
  isOpen: boolean;
  openDocs: OpenDoc[];
  activeDocId: string;
  compareDocId: string | null;
  isCompareMode: boolean;
  onSelectDoc: (id: string) => void;
  onToggleCompareDoc: (id: string) => void;
  onCloseDoc: (id: string) => void;
  onOpenLocalFiles: () => void;
  onOpenFolder: () => void;
  onOpenGoogleDrive: () => void;
  onOpenUrlModal: () => void;
  onLoadSubjectSet: (subjectId: string) => void;
  onToggleCompareMode: () => void;
  // Outline props
  headings: TocHeading[];
  activeHeadingId: string;
  onSelectHeading: (id: string) => void;
  stats: DocumentStats;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  openDocs,
  activeDocId,
  compareDocId,
  isCompareMode,
  onSelectDoc,
  onToggleCompareDoc,
  onCloseDoc,
  onOpenLocalFiles,
  onOpenFolder,
  onOpenGoogleDrive,
  onOpenUrlModal,
  onLoadSubjectSet,
  onToggleCompareMode,
  headings,
  activeHeadingId,
  onSelectHeading,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'outline'>('files');
  const [fileFilter, setFileFilter] = useState('');
  const [tocFilter, setTocFilter] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);

  // Filtered files
  const filteredFiles = openDocs.filter((doc) =>
    doc.title.toLowerCase().includes(fileFilter.toLowerCase())
  );

  // Filtered TOC headings
  const filteredHeadings = headings.filter((h) =>
    h.text.toLowerCase().includes(tocFilter.toLowerCase())
  );

  // Calculate total subject stats
  const totalWords = openDocs.reduce((acc, doc) => {
    const words = doc.markdown.trim().split(/\s+/).filter(Boolean).length;
    return acc + words;
  }, 0);

  const getSourceIcon = (source: OpenDoc['source']) => {
    switch (source) {
      case 'gdrive':
        return (
          <span title="Google Drive Note">
            <HardDrive size={13} color="#4285f4" />
          </span>
        );
      case 'url':
        return (
          <span title="Web URL Note">
            <Globe size={13} color="var(--accent)" />
          </span>
        );
      case 'local':
        return (
          <span title="Local File">
            <Upload size={13} color="var(--callout-tip)" />
          </span>
        );
      default:
        return (
          <span title="Sample Note">
            <BookOpen size={13} color="var(--accent-light)" />
          </span>
        );
    }
  };

  return (
    <aside className={`sidebar-container ${isOpen ? '' : 'collapsed'}`} aria-label="Study Workspace Sidebar">
      {/* Segmented Tab Navigation: Files vs Outline */}
      <div className="sidebar-tab-bar">
        <button
          className={`sidebar-tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
          title="Browse Subject Files & Chapters"
        >
          <Files size={15} />
          <span>Files / Chapters</span>
          <span className="sidebar-badge">{openDocs.length}</span>
        </button>

        <button
          className={`sidebar-tab ${activeTab === 'outline' ? 'active' : ''}`}
          onClick={() => setActiveTab('outline')}
          title="Table of Contents of current document"
        >
          <ListFilter size={15} />
          <span>Outline</span>
          <span className="sidebar-badge">{headings.length}</span>
        </button>
      </div>

      {activeTab === 'files' ? (
        /* ================= FILES & CHAPTERS VIEW ================= */
        <div className="sidebar-panel">
          {/* Action Header */}
          <div className="sidebar-actions-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="sidebar-heading">
                <Layers size={14} color="var(--accent)" />
                Subject Workspace
              </span>

              {/* Add file button with dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setAddMenuOpen((prev) => !prev)}
                  title="Add files to subject"
                >
                  <Plus size={14} />
                  <span>Add Note</span>
                  <ChevronDown size={12} />
                </button>

                {addMenuOpen && (
                  <div className="dropdown-menu sidebar-dropdown" onClick={() => setAddMenuOpen(false)}>
                    <button className="dropdown-item" onClick={onOpenLocalFiles}>
                      <Upload size={14} />
                      <span>Open Local File(s)...</span>
                    </button>
                    <button className="dropdown-item" onClick={onOpenFolder}>
                      <FolderOpen size={14} />
                      <span>Open Notes Folder...</span>
                    </button>
                    <button className="dropdown-item" onClick={onOpenGoogleDrive}>
                      <HardDrive size={14} color="#4285f4" />
                      <span>Open from Google Drive...</span>
                    </button>
                    <button className="dropdown-item" onClick={onOpenUrlModal}>
                      <Globe size={14} />
                      <span>Open from URL...</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Mode Toggle & Presets Bar */}
            <div className="sidebar-quick-toolbar">
              <button
                className={`btn btn-sm ${isCompareMode ? 'btn-compare-active' : ''}`}
                onClick={onToggleCompareMode}
                title={
                  isCompareMode
                    ? 'Exit Side-by-Side Comparison'
                    : 'Compare two chapters side-by-side'
                }
              >
                <Split size={13} />
                <span>{isCompareMode ? 'Comparing (Split)' : 'Compare Mode'}</span>
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-sm"
                  onClick={() => setPresetsOpen((prev) => !prev)}
                  title="Load sample multi-chapter student subjects"
                >
                  <Sparkles size={13} color="var(--callout-important)" />
                  <span>Subjects</span>
                  <ChevronDown size={11} />
                </button>

                {presetsOpen && (
                  <div className="dropdown-menu sidebar-dropdown" onClick={() => setPresetsOpen(false)}>
                    {STUDENT_SUBJECT_SETS.map((subject) => (
                      <button
                        key={subject.id}
                        className="dropdown-item"
                        onClick={() => onLoadSubjectSet(subject.id)}
                      >
                        <BookOpen size={14} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{subject.subjectName}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                            {subject.chapters.length} chapters
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Filter for Files */}
            <div className="sidebar-search-box">
              <Search size={13} />
              <input
                type="text"
                placeholder="Search notes / chapters..."
                value={fileFilter}
                onChange={(e) => setFileFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Files List */}
          <div className="sidebar-scrollable-list">
            {filteredFiles.length === 0 ? (
              <div className="sidebar-empty-state">
                <Files size={32} style={{ opacity: 0.35, marginBottom: '0.5rem' }} />
                <p>No notes in this subject</p>
                <button className="btn btn-sm btn-primary" onClick={onOpenLocalFiles} style={{ marginTop: '0.5rem' }}>
                  <Plus size={13} /> Open Markdown Notes
                </button>
              </div>
            ) : (
              filteredFiles.map((doc, index) => {
                const isActive = doc.id === activeDocId;
                const isComparing = doc.id === compareDocId && isCompareMode;
                const wordCount = doc.markdown.trim().split(/\s+/).filter(Boolean).length;
                const readMin = Math.max(1, Math.ceil(wordCount / 200));

                return (
                  <div
                    key={doc.id}
                    className={`file-card-item ${isActive ? 'active' : ''} ${
                      isComparing ? 'comparing' : ''
                    }`}
                  >
                    <div
                      className="file-card-main"
                      onClick={() => onSelectDoc(doc.id)}
                      title={`Click to read: ${doc.title}`}
                    >
                      <div className="file-card-header">
                        <div className="file-card-badge-row">
                          <span className="file-source-icon">{getSourceIcon(doc.source)}</span>
                          <span className="file-chapter-index">
                            {doc.chapterNumber ? `Ch ${doc.chapterNumber}` : `#${index + 1}`}
                          </span>
                        </div>
                        {isActive && <span className="status-badge active-badge">Primary</span>}
                        {isComparing && <span className="status-badge compare-badge">Comparing</span>}
                      </div>

                      <div className="file-card-title">{doc.title}</div>

                      <div className="file-card-meta">
                        <span>{wordCount.toLocaleString()} words</span>
                        <span>•</span>
                        <span>~{readMin} min</span>
                      </div>
                    </div>

                    {/* Action buttons on hover/focus */}
                    <div className="file-card-actions">
                      <button
                        className={`btn-action-icon ${isComparing ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompareDoc(doc.id);
                        }}
                        title={
                          isComparing
                            ? 'Remove from comparison'
                            : 'Compare this chapter side-by-side'
                        }
                      >
                        <Split size={13} />
                      </button>

                      {openDocs.length > 1 && (
                        <button
                          className="btn-action-icon delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseDoc(doc.id);
                          }}
                          title="Close file from sidebar"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Subject Stats Footer */}
          <div className="sidebar-stats-footer">
            <div className="stat-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Files size={12} /> Notes
              </span>
              <span className="stat-value">{openDocs.length} Chapters</span>
            </div>
            <div className="stat-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={12} /> Total Words
              </span>
              <span className="stat-value">{totalWords.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TABLE OF CONTENTS (OUTLINE) VIEW ================= */
        <div className="sidebar-panel">
          <div className="sidebar-actions-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="sidebar-heading">
                <ListFilter size={14} color="var(--accent)" />
                Table of Contents
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                {headings.length} sections
              </span>
            </div>

            <div className="sidebar-search-box">
              <Search size={13} />
              <input
                type="text"
                placeholder="Filter headings..."
                value={tocFilter}
                onChange={(e) => setTocFilter(e.target.value)}
              />
            </div>
          </div>

          <nav className="toc-list">
            {filteredHeadings.length === 0 ? (
              <div className="toc-empty">
                {headings.length === 0 ? 'No headings detected' : 'No matching headings'}
              </div>
            ) : (
              filteredHeadings.map((heading) => (
                <div key={`${heading.id}-${heading.level}`} className="toc-item">
                  <a
                    href={`#${heading.id}`}
                    className={`toc-link toc-level-${heading.level} ${
                      activeHeadingId === heading.id ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectHeading(heading.id);
                    }}
                  >
                    <span>{heading.text}</span>
                  </a>
                </div>
              ))
            )}
          </nav>

          {/* Current Document Stats Footer */}
          <div className="sidebar-stats-footer">
            <div className="stat-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={12} /> Words
              </span>
              <span className="stat-value">{stats.words.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Read Time
              </span>
              <span className="stat-value">~{stats.readTimeMin} min</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
