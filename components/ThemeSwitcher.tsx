'use client';

import { useState } from 'react';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onReset: () => void;
}

export default function ThemeSwitcher({
  isDarkMode,
  onToggleDarkMode,
  onReset,
}: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className="amzn-floating-control"
      aria-label="Demo controls"
    >
      <button
        type="button"
        className="amzn-floating-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Theme"
      >
        <span className="amzn-floating-gear">⚙</span>
        <span className="amzn-floating-text">
          {isDarkMode ? 'Prime Dark' : 'Amazon USA'}
        </span>
      </button>

      {isOpen && (
        <div className="amzn-floating-menu">
          <div className="amzn-floating-section">
            <span className="amzn-floating-heading">Theme:</span>
            <div className="amzn-floating-btn-group">
              <button
                type="button"
                className={`amzn-mini-btn ${!isDarkMode ? 'active' : ''}`}
                onClick={() => isDarkMode && onToggleDarkMode()}
              >
                Amazon USA
              </button>
              <button
                type="button"
                className={`amzn-mini-btn ${isDarkMode ? 'active' : ''}`}
                onClick={() => !isDarkMode && onToggleDarkMode()}
              >
                Prime Video Dark
              </button>
            </div>
          </div>

          <div className="amzn-floating-footer">
            <button
              type="button"
              className="amzn-mini-reset"
              onClick={() => {
                onReset();
                setIsOpen(false);
              }}
            >
              ↻ Reset Demo
            </button>
            <button
              type="button"
              className="amzn-mini-close"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
