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
}

export default function StepEmail({
  email,
  setEmail,
  onContinue,
  error,
  onCreateAccount,
  isDarkMode = false,
}: StepEmailProps) {
  return (
    <>
      <div className={`amzn-auth-card ${isDarkMode ? 'dark' : ''}`}>
        <h1 className="amzn-card-title">
          Sign in or create account
        </h1>

        <form onSubmit={onContinue} noValidate>
          <div className="amzn-form-group">
            <label htmlFor="ap_email" className="amzn-form-label">
              Enter mobile number or email
            </label>
            <input
              id="ap_email"
              name="email"
              type="text"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
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

          <button type="submit" className="amzn-btn-primary">
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
        </form>
      </div>
    </>
  );
}
