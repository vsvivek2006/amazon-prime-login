'use client';

import React from 'react';
import Link from 'next/link';

export default function PrimeFooter() {
  return (
    <footer className="pv-footer">
      <div className="pv-container">
        <div className="pv-footer-logo-wrap">
          <Link href="/">
            <img
              src="/media/prime_official_1.png"
              alt="Prime Video"
              className="pv-footer-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/prime-video-logo.svg';
              }}
            />
          </Link>
        </div>

        <ul className="pv-footer-links">
          <li>
            <a href="https://www.primevideo.com/help/ref=atv_ftr_terms" target="_blank" rel="noreferrer" className="pv-footer-link">
              Terms and Privacy Notice
            </a>
          </li>
          <li>
            <a href="https://www.primevideo.com/feedback" target="_blank" rel="noreferrer" className="pv-footer-link">
              Send us feedback
            </a>
          </li>
          <li>
            <a href="https://www.primevideo.com/help" target="_blank" rel="noreferrer" className="pv-footer-link">
              Help
            </a>
          </li>
          <li>
            <Link href="/login" className="pv-footer-link">
              Sign In
            </Link>
          </li>
          <li>
            <a href="#cookies" className="pv-footer-link">
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
