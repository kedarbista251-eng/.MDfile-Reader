import React, { useState } from 'react';
import { Globe, X, Loader2 } from 'lucide-react';

interface UrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadUrl: (url: string) => Promise<void>;
}

export const UrlModal: React.FC<UrlModalProps> = ({ isOpen, onClose, onLoadUrl }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onLoadUrl(url.trim());
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch markdown from URL');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="var(--accent)" />
            <span className="modal-title">Load Markdown from URL</span>
          </div>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Enter a link to a raw Markdown file (e.g., GitHub raw, GitLab, or Gist):
            </p>
            <input
              type="url"
              className="text-input"
              placeholder="https://raw.githubusercontent.com/user/repo/main/README.md"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              autoFocus
            />

            {error && (
              <div
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--callout-caution)',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '6px',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Quick Examples:</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  onClick={() =>
                    handleQuickExample(
                      'https://raw.githubusercontent.com/facebook/react/main/README.md'
                    )
                  }
                >
                  React README
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  onClick={() =>
                    handleQuickExample(
                      'https://raw.githubusercontent.com/vitejs/vite/main/README.md'
                    )
                  }
                >
                  Vite README
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !url.trim()}>
              {loading ? (
                <>
                  <Loader2 size={15} className="spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                'Load Document'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
