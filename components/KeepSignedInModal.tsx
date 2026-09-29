'use client';

import { useEffect } from 'react';

interface KeepSignedInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeepSignedInModal({ isOpen, onClose }: KeepSignedInModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="amzn-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="amzn-modal-card"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="amzn-modal-header">
          <h3 className="amzn-modal-title">&ldquo;Keep Me Signed In&rdquo; Checkbox</h3>
          <button
            type="button"
            className="amzn-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="amzn-modal-body">
          <p>
            Choosing &ldquo;Keep me signed in&rdquo; reduces the number of times you&apos;re asked to
            Sign-In on this device.
          </p>
          <p>
            To keep your account secure, use this option only on your personal devices.
          </p>
        </div>

        <div className="amzn-modal-footer">
          <button
            type="button"
            className="amzn-btn-secondary amzn-modal-done"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
