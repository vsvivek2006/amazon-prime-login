'use client';

import React from 'react';
import AccordionHelp from './AccordionHelp';

interface StepEmailProps {
  email: string;
  setEmail: (val: string) => void;
  onContinue: (e: React.FormEvent) => void;
  error: string | null;
  onCreateAccount: () => void;
  isDarkMode?: boolean;
  mode?: 'signin' | 'signup';
  onSwitchMode?: (mode: 'signin' | 'signup') => void;
}

export default function StepEmail({
  email,
  setEmail,
  onContinue,
  error,
  onCreateAccount,
  isDarkMode = false,
  mode = 'signin',
  onSwitchMode,
}: StepEmailProps) {
  return (
    <>
      <div className={`amzn-auth-card ${isDarkMode ? 'dark' : ''}`}>
        <h1 className="amzn-card-title">
          {mode === 'signin' ? 'Prime Video Sign In' : 'Create Prime Video Account'}
        </h1>

        <form onSubmit={onContinue} noValidate>
          <div className="amzn-form-group">
            <label htmlFor="ap_email" className="amzn-form-label">
              Email address
            </label>
            <input
              id="ap_email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="name@example.com"
              className={`amzn-input ${error ? 'error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            {error && (
              <div className="amzn-inline-error" role="alert">
                <span className="amzn-inline-error-icon">!</span>
                <span className="amzn-inline-error-text">{error}</span>
              </div>
            )}
          </div>

          <button type="submit" className="amzn-btn-primary" id="continue-btn">
            Continue
          </button>

          <div className="amzn-legal-text">
            By continuing, you agree to Amazon&apos;s{' '}
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

          <AccordionHelp />

          {mode === 'signin' ? (
            <div className="amzn-business-section">
              <div className="amzn-business-divider"></div>
              <div className="amzn-business-title">Buying for work?</div>
              <a
                href="https://www.amazon.com/business?ref_=ap_signin_b2b"
                target="_blank"
                rel="noopener noreferrer"
                className="amzn-link amzn-business-link"
              >
                Create a free business account
              </a>
            </div>
          ) : (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e7e7e7', fontSize: '13px' }}>
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => onSwitchMode ? onSwitchMode('signin') : onCreateAccount()}
                className="amzn-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 600 }}
              >
                Sign in
              </button>
            </div>
          )}
        </form>
      </div>

      {mode === 'signin' && (
        <div className="amzn-main-container" style={{ marginTop: '24px' }}>
          <div className="amzn-or-divider">
            <span className="amzn-or-line"></span>
            <span className="amzn-or-text">New to Amazon?</span>
            <span className="amzn-or-line"></span>
          </div>

          <button
            type="button"
            id="createAccountSubmit"
            className="amzn-btn-secondary"
            onClick={() => onSwitchMode ? onSwitchMode('signup') : onCreateAccount()}
          >
            Create your Amazon account
          </button>
        </div>
      )}
    </>
  );
}
