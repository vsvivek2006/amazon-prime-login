'use client';

import { useState } from 'react';

export default function AccordionHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="amzn-accordion">
      <button
        type="button"
        className="amzn-accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <svg
          className={`amzn-accordion-arrow ${isOpen ? 'open' : ''}`}
          viewBox="0 0 10 10"
          width="10"
          height="10"
          aria-hidden="true"
        >
          <path d="M2.5 1.5 L7.5 5 L2.5 8.5 Z" fill="currentColor" />
        </svg>
        <span className="amzn-link amzn-accordion-text">Need help?</span>
      </button>

      {isOpen && (
        <div className="amzn-accordion-content">
          <ul className="amzn-help-links">
            <li>
              <a
                href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GH7NM2YWEVR2FQBC"
                target="_blank"
                rel="noopener noreferrer"
                className="amzn-link"
              >
                Forgot your password?
              </a>
            </li>
            <li>
              <a
                href="https://www.amazon.com/gp/help/customer/display.html?nodeId=G4D42UHQGE5HGDE7"
                target="_blank"
                rel="noopener noreferrer"
                className="amzn-link"
              >
                Other issues with Sign-In
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
