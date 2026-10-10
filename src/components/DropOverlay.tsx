import React from 'react';
import { UploadCloud } from 'lucide-react';

interface DropOverlayProps {
  isDragging: boolean;
}

export const DropOverlay: React.FC<DropOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="drag-drop-overlay">
      <div className="drag-drop-icon">
        <UploadCloud size={32} />
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Drop Markdown File Here</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Supports .md, .markdown, and .txt files
      </p>
    </div>
  );
};
