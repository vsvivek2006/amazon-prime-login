'use client';

import React from 'react';
import Link from 'next/link';

export default function PrimeFooter() {
  return (
    <footer className="pv-footer">
      <div className="pv-container">
        <div className="pv-footer-logo-wrap">
          <Link href="/" title="Prime Video Home">
            <img
              src="/media/prime-video-logo.png"
              alt="Prime Video"
              title="Prime Video Official Logo"
              className="pv-footer-logo"
              width={110}
              height={32}
              decoding="async"
            />
          </Link>
        </div>

        <ul className="pv-footer-links" aria-label="Footer links">
          <li>
            <a
              href="https://www.primevideo.com/help/ref=atv_ftr_terms"
              target="_blank"
              rel="noopener noreferrer"
              className="pv-footer-link"
            >
              Terms and Privacy Notice
            </a>
          </li>
          <li>
            <a
              href="https://www.primevideo.com/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="pv-footer-link"
            >
              Send us feedback
            </a>
          </li>
          <li>
            <a
              href="https://www.primevideo.com/help"
              target="_blank"
              rel="noopener noreferrer"
              className="pv-footer-link"
            >
              Help
            </a>
          </li>
          <li>
            <a
              href="https://www.primevideo.com/help?nodeId=202064890"
              target="_blank"
              rel="noopener noreferrer"
              className="pv-footer-link"
            >
              Cookie Preferences
            </a>
          </li>
        </ul>

        <p className="pv-footer-copy">
          © 1996-2026, Amazon.com, Inc. or its affiliates. Amazon, Prime Video, and all related logos are trademarks of Amazon.com, Inc. or its affiliates.
        </p>
      </div>
    </footer>
  );
}
