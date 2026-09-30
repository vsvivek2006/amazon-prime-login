'use client';

import React, { useState } from 'react';

interface StepPasswordProps {
  email: string;
  password: string;
  setPassword: (val: string) => void;
  onSignIn: (e: React.FormEvent) => void;
  onChangeEmail: () => void;
  error: string | null;
  onOpenKeepSignedInDetails: () => void;
  onGetOtp: () => void;
  isDarkMode?: boolean;
}

export default function StepPassword({
  email,
  password,
  setPassword,
  onSignIn,
  onChangeEmail,
  error,
  onOpenKeepSignedInDetails,
  onGetOtp,
  isDarkMode = false,
}: StepPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  return (
    <div className={`amzn-auth-card ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="amzn-card-title">Sign in</h1>

      {/* User identifier row with Change link */}
      <div className="amzn-identifier-row">
        <span className="amzn-identifier-value">{email}</span>
        <button
          type="button"
          onClick={onChangeEmail}
          className="amzn-link amzn-change-link"
        >
          Change
        </button>
      </div>

      <form onSubmit={onSignIn} noValidate>
        <div className="amzn-form-group">
          <div className="amzn-label-row">
            <label htmlFor="ap_password" className="amzn-form-label">
              Password
            </label>
            <a
              href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GH7NM2YWEVR2FQBC"
              target="_blank"
              rel="noopener noreferrer"
              className="amzn-link amzn-forgot-link"
            >
              Forgot password?
            </a>
          </div>

          <div className="amzn-password-field-wrapper">
            <input
              id="ap_password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`amzn-input ${error ? 'error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="amzn-password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <div className="amzn-inline-error" role="alert">
              <span className="amzn-inline-error-icon">!</span>
              <span className="amzn-inline-error-text">{error}</span>
            </div>
          )}
        </div>

        <button type="submit" className="amzn-btn-primary">
          Sign in
        </button>

        {/* Keep me signed in */}
        <div className="amzn-keep-signed-in">
          <label className="amzn-checkbox-label">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="amzn-checkbox-input"
            />
            <span className="amzn-checkbox-text">Keep me signed in.</span>
          </label>
          <button
            type="button"
            className="amzn-details-link"
            onClick={onOpenKeepSignedInDetails}
          >
            Details
            <svg
              viewBox="0 0 10 10"
              width="8"
              height="8"
              className="amzn-details-arrow"
              aria-hidden="true"
            >
              <path d="M2.5 1.5 L7.5 5 L2.5 8.5 Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Or divider */}
        <div className="amzn-or-divider">
          <span className="amzn-or-line"></span>
          <span className="amzn-or-text">or</span>
          <span className="amzn-or-line"></span>
        </div>

        {/* OTP button */}
        <button
          type="button"
          className="amzn-btn-secondary"
          onClick={onGetOtp}
        >
          Get an OTP on your phone
        </button>
      </form>
    </div>
  );
}
