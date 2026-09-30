'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AmazonLogo from '@/components/AmazonLogo';
import PrimeVideoLogo from '@/components/PrimeVideoLogo';
import AlertBanner from '@/components/AlertBanner';
import StepEmail from '@/components/StepEmail';
import StepPassword from '@/components/StepPassword';
import KeepSignedInModal from '@/components/KeepSignedInModal';
import Footer from '@/components/Footer';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import '@/styles/amazon-auth.css';

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Step 1: Handle Continue
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Enter your email or mobile phone number');
      return;
    }

    if (cleanEmail.length < 3) {
      setError('Please enter a valid email address or phone number');
      return;
    }

    setError(null);
    setStep(2);
  };

  // Step 2: Handle Sign-In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError('Enter your password');
      return;
    }

    setError(null);
    setIsLoggedIn(true);
  };

  // Reset to Step 1 to change email
  const handleChangeEmail = () => {
    setError(null);
    setStep(1);
  };

  // Create Amazon Account click
  const handleCreateAccount = () => {
    alert('Create Account Flow: In the real app, this takes you to /ap/register. You can sign in with your email above.');
  };

  // Get OTP click
  const handleGetOtp = () => {
    alert(`An OTP (One-Time Password) was sent to ${email}. Please enter the 6-digit code to continue.`);
  };

  // Full reset
  const handleReset = () => {
    setStep(1);
    setEmail('');
    setPassword('');
    setError(null);
    setIsLoggedIn(false);
  };

  return (
    <div className={`amzn-page-wrapper ${isDarkMode ? 'dark' : ''}`}>
      {/* Top Floating Controls */}
      <ThemeSwitcher
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onReset={handleReset}
      />

      <div className="amzn-content-area">
        {/* Header with Amazon or Prime Video Logo */}
        <header className="amzn-header">
          <Link
            href="/"
            className="amzn-logo-link"
            title="Amazon Home"
          >
            {isDarkMode ? (
              <PrimeVideoLogo />
            ) : (
              <AmazonLogo isDarkMode={isDarkMode} />
            )}
          </Link>
        </header>

        {/* Top Alert Banner for Errors */}
        {error && (
          <div className="amzn-main-container">
            <AlertBanner title="There was a problem" message={error} />
          </div>
        )}

        {/* Successful Authentication State */}
        {isLoggedIn ? (
          <div className="amzn-main-container">
            <div className={`amzn-auth-card ${isDarkMode ? 'dark' : ''}`}>
              <h1 className="amzn-card-title">Welcome back!</h1>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                You have successfully signed in to <strong>Amazon Prime USA</strong> as:
              </p>
              <div
                style={{
                  padding: '12px',
                  background: isDarkMode ? '#1e2936' : '#f0f2f2',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '13px',
                  marginBottom: '20px',
                  wordBreak: 'break-all',
                }}
              >
                {email}
              </div>

              <button
                type="button"
                className="amzn-btn-primary"
                onClick={() =>
                  alert('Redirecting to Prime Video USA catalog (The Boys, Rings of Power, Fallout)...')
                }
                style={{ marginBottom: '10px' }}
              >
                Go to Prime Video USA
              </button>

              <button
                type="button"
                className="amzn-btn-secondary"
                onClick={handleReset}
              >
                Sign out / Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Authentication */
          <main className="amzn-main-container">
            {step === 1 ? (
              <StepEmail
                email={email}
                setEmail={(val) => {
                  setEmail(val);
                  if (error) setError(null);
                }}
                onContinue={handleContinue}
                error={error}
                onCreateAccount={handleCreateAccount}
                isDarkMode={isDarkMode}
              />
            ) : (
              <StepPassword
                email={email}
                password={password}
                setPassword={(val) => {
                  setPassword(val);
                  if (error) setError(null);
                }}
                onSignIn={handleSignIn}
                onChangeEmail={handleChangeEmail}
                error={error}
                onOpenKeepSignedInDetails={() => setIsDetailsModalOpen(true)}
                onGetOtp={handleGetOtp}
                isDarkMode={isDarkMode}
              />
            )}
          </main>
        )}

        {/* Keep Me Signed In Informational Dialog */}
        <KeepSignedInModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />

        {/* Footer with Legal Links & Copyright */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
