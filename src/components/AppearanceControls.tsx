import React, { useRef, useEffect } from 'react';
import { X, Sun, Moon, Coffee, Palette } from 'lucide-react';
import type { ReaderSettings, ReadingTheme, FontFamily, ReadingWidth, LineHeight } from '../types';

interface AppearanceControlsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

export const AppearanceControls: React.FC<AppearanceControlsProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themes: { id: ReadingTheme; label: string; icon: React.ReactNode }[] = [
    { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
    { id: 'light', label: 'Light', icon: <Sun size={14} /> },
    { id: 'sepia', label: 'Sepia', icon: <Coffee size={14} /> },
    { id: 'dracula', label: 'Dracula', icon: <Palette size={14} /> },
  ];

  const fonts: { id: FontFamily; label: string }[] = [
    { id: 'sans', label: 'Sans-Serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Monospace' },
  ];

  const widths: { id: ReadingWidth; label: string }[] = [
    { id: 'compact', label: 'Compact' },
    { id: 'standard', label: 'Standard' },
    { id: 'wide', label: 'Wide' },
    { id: 'full', label: 'Full' },
  ];

  const lineHeights: { id: LineHeight; label: string }[] = [
    { id: 'compact', label: 'Compact' },
    { id: 'comfortable', label: 'Normal' },
    { id: 'relaxed', label: 'Relaxed' },
  ];

  return (
    <div className="settings-drawer" ref={panelRef}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Reading Preferences</span>
        <button className="btn btn-icon" onClick={onClose} aria-label="Close settings">
          <X size={16} />
        </button>
      </div>

      {/* Theme Selection */}
      <div className="settings-group">
        <span className="settings-label">Color Theme</span>
        <div className="segmented-control">
          {themes.map((t) => (
            <button
              key={t.id}
              className={`segmented-btn ${settings.theme === t.id ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ theme: t.id })}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="settings-group">
        <span className="settings-label">Font Family</span>
        <div className="segmented-control">
          {fonts.map((f) => (
            <button
              key={f.id}
              className={`segmented-btn ${settings.fontFamily === f.id ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ fontFamily: f.id })}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="settings-group">
        <div className="slider-control-row">
          <span className="settings-label">Font Size</span>
          <span className="slider-val-badge">{settings.fontSize}px</span>
        </div>
        <input
          type="range"
          min={14}
          max={24}
          step={1}
          value={settings.fontSize}
          onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
          className="range-slider"
        />
      </div>

      {/* Content Width */}
      <div className="settings-group">
        <span className="settings-label">Page Width</span>
        <div className="segmented-control">
          {widths.map((w) => (
            <button
              key={w.id}
              className={`segmented-btn ${settings.readingWidth === w.id ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ readingWidth: w.id })}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div className="settings-group">
        <span className="settings-label">Line Spacing</span>
        <div className="segmented-control">
          {lineHeights.map((lh) => (
            <button
              key={lh.id}
              className={`segmented-btn ${settings.lineHeight === lh.id ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ lineHeight: lh.id })}
            >
              {lh.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
