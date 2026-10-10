import React, { useState } from 'react';
import { Search, ListFilter, Clock, FileText } from 'lucide-react';
import type { TocHeading, DocumentStats } from '../types';

interface SidebarTocProps {
  headings: TocHeading[];
  activeHeadingId: string;
  isOpen: boolean;
  onSelectHeading: (id: string) => void;
  stats: DocumentStats;
}

export const SidebarToc: React.FC<SidebarTocProps> = ({
  headings,
  activeHeadingId,
  isOpen,
  onSelectHeading,
  stats,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredHeadings = headings.filter((h) =>
    h.text.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <aside className={`toc-sidebar ${isOpen ? '' : 'collapsed'}`} aria-label="Table of Contents">
      {/* Header */}
      <div className="toc-header">
        <span className="toc-title">
          <ListFilter size={16} />
          Table of Contents
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
          {headings.length} sections
        </span>
      </div>

      {/* Filter search */}
      <div className="toc-search">
        <div className="search-input-wrap">
          <Search size={14} />
          <input
            type="text"
            className="toc-search-input"
            placeholder="Search headings..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Headings List */}
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

      {/* Document Stats Footer */}
      <div className="toc-stats-footer">
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
    </aside>
  );
};
