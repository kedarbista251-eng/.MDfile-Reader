import React, { useState } from 'react';
import {
  X,
  Loader2,
  HardDrive,
  FileText,
  AlertCircle,
  ExternalLink,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchGoogleDriveFile,
  extractGoogleDriveInfo,
  SAMPLE_GDRIVE_NOTES,
} from '../utils/googleDrive';
import type { OpenDoc } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDoc: (doc: OpenDoc) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onLoadDoc,
}) => {
  const [driveUrl, setDriveUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'link' | 'samples'>('link');

  if (!isOpen) return null;

  const detectedInfo = extractGoogleDriveInfo(driveUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await fetchGoogleDriveFile(driveUrl.trim(), customTitle.trim());
      const newDoc: OpenDoc = {
        id: `gdrive_${result.id}_${Date.now()}`,
        title: result.title,
        markdown: result.content,
        source: 'gdrive',
        sourceUrl: result.sourceUrl,
        lastModified: Date.now(),
      };
      setSuccessMsg(`Successfully loaded "${result.title}"!`);
      setTimeout(() => {
        onLoadDoc(newDoc);
        onClose();
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch file from Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample: (typeof SAMPLE_GDRIVE_NOTES)[0]) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const newDoc: OpenDoc = {
        id: `gdrive_sample_${Date.now()}`,
        title: sample.title,
        markdown: sample.fallbackMarkdown,
        source: 'gdrive',
        sourceUrl: sample.url,
        lastModified: Date.now(),
      };
      onLoadDoc(newDoc);
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card gdrive-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="gdrive-icon-badge">
              <HardDrive size={18} color="#ffffff" />
            </div>
            <div>
              <span className="modal-title">Open from Google Drive</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Import shared chapter notes and study files directly into your workspace
              </p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="gdrive-modal-tabs">
          <button
            type="button"
            className={`gdrive-tab-btn ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => setActiveTab('link')}
          >
            <FileText size={14} />
            <span>Drive / Docs Link</span>
          </button>
          <button
            type="button"
            className={`gdrive-tab-btn ${activeTab === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveTab('samples')}
          >
            <BookOpen size={14} />
            <span>Student Samples</span>
          </button>
        </div>

        {activeTab === 'link' ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div>
                <label className="form-label">Google Drive Share Link or File ID</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                  value={driveUrl}
                  onChange={(e) => {
                    setDriveUrl(e.target.value);
                    setError(null);
                  }}
                  required
                  autoFocus
                />
                {detectedInfo && (
                  <div className="url-detected-badge">
                    <CheckCircle2 size={13} color="var(--callout-tip)" />
                    <span>
                      {detectedInfo.isGoogleDoc ? 'Google Doc detected' : 'Google Drive file detected'} (ID:{' '}
                      <code>{detectedInfo.fileId.slice(0, 10)}...</code>)
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">
                  Document / Chapter Title <span style={{ color: 'var(--text-faint)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. Chapter 3: Network Security"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                />
              </div>

              {/* Instructions box */}
              <div className="gdrive-instructions">
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={12} /> Sharing Instructions:
                </span>
                <p>
                  In Google Drive, right-click your file &gt; click <strong>Share</strong> &gt; set General
                  Access to <strong>"Anyone with the link can view"</strong> &gt; copy link. Works with{' '}
                  <code>.md</code>, <code>.txt</code> files, and Google Docs!
                </p>
              </div>

              {error && (
                <div className="modal-alert modal-alert-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="modal-alert modal-alert-success">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !driveUrl.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="spin" />
                    <span>Downloading Note...</span>
                  </>
                ) : (
                  'Open into Workspace'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Try these shared student lecture notes directly imported from Google Drive storage:
            </p>
            <div className="sample-notes-list">
              {SAMPLE_GDRIVE_NOTES.map((sample, idx) => (
                <div key={idx} className="sample-note-card" onClick={() => handleSelectSample(sample)}>
                  <div className="sample-note-icon">
                    <FileText size={18} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="sample-note-title">{sample.title}</div>
                    <div className="sample-note-desc">{sample.description}</div>
                  </div>
                  <button type="button" className="btn btn-sm" disabled={loading}>
                    Import
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-footer" style={{ marginTop: '1rem', padding: '0.5rem 0 0 0' }}>
              <button type="button" className="btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
