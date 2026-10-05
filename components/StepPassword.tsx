'use client';

import React, { useState } from 'react';

interface StepPasswordProps {
  email: string;
  password: string;
  setPassword: (val: string) => void;
  name?: string;
  setName?: (val: string) => void;
  onSignIn: (e: React.FormEvent) => void;
  onChangeEmail: () => void;
  error: string | null;
  onOpenKeepSignedInDetails: () => void;
  onGetOtp: () => void;
  isDarkMode?: boolean;
  mode?: 'signin' | 'signup';
}

export default function StepPassword({
  email,
  password,
  setPassword,
  name = '',
  setName,
  onSignIn,
  onChangeEmail,
  error,
  onOpenKeepSignedInDetails,
  onGetOtp,
  isDarkMode = false,
  mode = 'signin',
}: StepPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  return (
    <div className={`amzn-auth-card ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="amzn-card-title">
        {mode === 'signin' ? 'Prime Video Sign In' : 'Create Prime Video Account'}
      </h1>

      {/* User identifier row with Change link */}
      <div className="amzn-identifier-row">
        <span className="amzn-identifier-value">{email}</span>
        <button
          type="button"
          onClick={onChangeEmail}
          className="amzn-link amzn-change-link"
          id="change-email-btn"
        >
          Change
        </button>
      </div>

      <form onSubmit={onSignIn} noValidate>
        {/* Name input if in signup mode */}
        {mode === 'signup' && (
          <div className="amzn-form-group">
            <label htmlFor="ap_customer_name" className="amzn-form-label">
              Your name
            </label>
            <input
              id="ap_customer_name"
              name="customerName"
              type="text"
              autoComplete="name"
              placeholder="First and last name"
              className="amzn-input"
              value={name}
              onChange={(e) => setName && setName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="amzn-form-group">
          <div className="amzn-label-row">
            <label htmlFor="ap_password" className="amzn-form-label">
              {mode === 'signin' ? 'Password' : 'Password'}
            </label>
            {mode === 'signin' && (
              <a
                href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GH7NM2YWEVR2FQBC"
                target="_blank"
                rel="noopener noreferrer"
                className="amzn-link amzn-forgot-link"
              >
                Forgot password?
              </a>
            )}
          </div>

          <div className="amzn-password-field-wrapper">
            <input
              id="ap_password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
              className={`amzn-input ${error ? 'error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus={mode === 'signin'}
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

          {mode === 'signup' && (
            <div style={{ fontSize: '12px', color: '#555555', marginTop: '4px' }}>
              ℹ️ Passwords must be at least 6 characters.
            </div>
          )}

          {error && (
            <div className="amzn-inline-error" role="alert">
              <span className="amzn-inline-error-icon">!</span>
              <span className="amzn-inline-error-text">{error}</span>
            </div>
          )}
        </div>

        {/* Primary Submit Button */}
        <button type="submit" className="amzn-btn-primary" id="signInSubmit">
          {mode === 'signin' ? 'Sign in' : 'Create your Amazon account'}
        </button>

        {/* Keep Me Signed In for Login */}
        {mode === 'signin' && (
          <div className="amzn-keep-signed-in">
            <label className="amzn-checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                className="amzn-checkbox-input"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              <span className="amzn-checkbox-text">Keep me signed in.</span>
            </label>
            <button
              type="button"
              onClick={onOpenKeepSignedInDetails}
              className="amzn-details-link"
            >
              Details
              <span className="amzn-details-arrow">▾</span>
            </button>
          </div>
        )}

        {/* Legal text for signup */}
        {mode === 'signup' && (
          <div className="amzn-legal-text" style={{ marginTop: '16px' }}>
            By creating an account, you agree to Amazon&apos;s{' '}
            <a
              href="https://www.amazon.com/gp/help/customer/display.html/ref=ap_signin_notification_condition_of_use?nodeId=508088"
              target="_blank"
              rel="noopener noreferrer"
              className="amzn-link"
            >
              Conditions of Use
            </a>{' '}
            and{' '}
            <a
              href="https://www.amazon.com/gp/help/customer/display.html/ref=ap_signin_notification_privacy_notice?nodeId=468496"
              target="_blank"
              rel="noopener noreferrer"
              className="amzn-link"
            >
              Privacy Notice
            </a>
            .
          </div>
        )}

        {/* Sign in with OTP option */}
        {mode === 'signin' && (
          <>
            <div className="amzn-or-divider">
              <span className="amzn-or-line"></span>
              <span className="amzn-or-text">or</span>
              <span className="amzn-or-line"></span>
            </div>

            <button
              type="button"
              className="amzn-btn-secondary"
              onClick={onGetOtp}
            >
              Get an OTP on your phone
            </button>
          </>
        )}
      </form>
    </div>
  );
}
