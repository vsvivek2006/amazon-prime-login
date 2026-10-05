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

export default function PrimeLoginClient() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Step 1: Email Only Validation & Continue
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setError('Enter your email address');
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    setError(null);
    setStep(2);
  };

  // Step 2: Authentication / Registration Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name');
      return;
    }

    if (!password.trim()) {
      setError('Enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    setIsLoggedIn(true);
  };

  // Change email - goes back to Step 1
  const handleChangeEmail = () => {
    setError(null);
    setStep(1);
  };

  // Switch between Sign in and Signup modes
  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setStep(1);
    setError(null);
  };

  // Reset all fields
  const handleReset = () => {
    setMode('signin');
    setStep(1);
    setEmail('');
    setName('');
    setPassword('');
    setError(null);
    setIsLoggedIn(false);
  };

  // OTP Simulation
  const handleGetOtp = () => {
    alert(`An OTP (One-Time Password) was sent to ${email}. Please enter the 6-digit code to continue.`);
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
            title="Return to Prime Video Home"
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
              <h1 className="amzn-card-title">
                {mode === 'signup' ? 'Welcome to Prime!' : 'Welcome back!'}
              </h1>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                {mode === 'signup'
                  ? 'Your Amazon account has been successfully created with:'
                  : 'You have successfully signed in to Amazon Prime Video as:'}
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

              <Link
                href="/"
                className="amzn-btn-primary"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  textDecoration: 'none',
                  lineHeight: '32px',
                  marginBottom: '10px',
                }}
              >
                Start Watching Prime Video
              </Link>

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
                onCreateAccount={() => handleSwitchMode('signup')}
                isDarkMode={isDarkMode}
                mode={mode}
                onSwitchMode={handleSwitchMode}
              />
            ) : (
              <StepPassword
                email={email}
                password={password}
                setPassword={(val) => {
                  setPassword(val);
                  if (error) setError(null);
                }}
                name={name}
                setName={(val) => {
                  setName(val);
                  if (error) setError(null);
                }}
                onSignIn={handleSubmit}
                onChangeEmail={handleChangeEmail}
                error={error}
                onOpenKeepSignedInDetails={() => setIsDetailsModalOpen(true)}
                onGetOtp={handleGetOtp}
                isDarkMode={isDarkMode}
                mode={mode}
              />
            )}
          </main>
        )}

        {/* Keep Me Signed In Informational Dialog */}
        <KeepSignedInModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />

        {/* SEO & User Support: Prime Video Login & Troubleshooting Guide */}
        <section className="amzn-seo-faq-section" aria-label="Prime Video Sign In Help and FAQs">
          <div className="amzn-seo-faq-container">
            <h2 className="amzn-seo-faq-heading">Frequently Asked Questions About Prime Video Login</h2>
            <p className="amzn-seo-faq-intro">
              Having trouble getting into your account? Find quick answers for signing in, supported devices, smart TV activation, and password recovery.
            </p>

            <div className="amzn-faq-list">
              <div className="amzn-faq-item">
                <button
                  type="button"
                  className="amzn-faq-question"
                  onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                  aria-expanded={openFaq === 0}
                >
                  <span>How do I sign in to Prime Video?</span>
                  <span className={`amzn-faq-arrow ${openFaq === 0 ? 'open' : ''}`}>▼</span>
                </button>
                {openFaq === 0 && (
                  <div className="amzn-faq-answer">
                    <p>
                      Enter your registered Amazon account email address and select <strong>Continue</strong>, then enter your password to sign in. Once signed in, you get immediate access to movies, TV series, Amazon Originals, and live sports.
                    </p>
                  </div>
                )}
              </div>

              <div className="amzn-faq-item">
                <button
                  type="button"
                  className="amzn-faq-question"
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  aria-expanded={openFaq === 1}
                >
                  <span>Do I need a separate login for Prime Video?</span>
                  <span className={`amzn-faq-arrow ${openFaq === 1 ? 'open' : ''}`}>▼</span>
                </button>
                {openFaq === 1 && (
                  <div className="amzn-faq-answer">
                    <p>
                      No. Prime Video uses the exact same account credentials as your Amazon account. If you already have an Amazon Prime membership or a standalone Prime Video subscription, sign in using the same email and password.
                    </p>
                  </div>
                )}
              </div>

              <div className="amzn-faq-item">
                <button
                  type="button"
                  className="amzn-faq-question"
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  aria-expanded={openFaq === 2}
                >
                  <span>How do I sign in to Prime Video on a Smart TV or streaming device?</span>
                  <span className={`amzn-faq-arrow ${openFaq === 2 ? 'open' : ''}`}>▼</span>
                </button>
                {openFaq === 2 && (
                  <div className="amzn-faq-answer">
                    <ol>
                      <li>Open the Prime Video app on your Smart TV, Fire TV, Roku, Apple TV, or console.</li>
                      <li>Select <strong>Sign In</strong> and note the 5 to 6-character registration code on your TV screen.</li>
                      <li>On your computer or smartphone browser, go to <strong>primevideo.com/mytv</strong>.</li>
                      <li>Sign in to your Amazon account and enter the code displayed on your screen to activate streaming.</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="amzn-faq-item">
                <button
                  type="button"
                  className="amzn-faq-question"
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                  aria-expanded={openFaq === 3}
                >
                  <span>What should I do if I cannot sign in or forgot my password?</span>
                  <span className={`amzn-faq-arrow ${openFaq === 3 ? 'open' : ''}`}>▼</span>
                </button>
                {openFaq === 3 && (
                  <div className="amzn-faq-answer">
                    <p>
                      Click the <strong>Forgot password?</strong> link above the password box to receive an OTP or password reset link to your email. Check your spam folder if it doesn&apos;t arrive within two minutes. You can also select <strong>Get an OTP on your phone</strong> to sign in securely.
                    </p>
                  </div>
                )}
              </div>

              <div className="amzn-faq-item">
                <button
                  type="button"
                  className="amzn-faq-question"
                  onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                  aria-expanded={openFaq === 4}
                >
                  <span>Can I sign in to Prime Video on multiple devices at once?</span>
                  <span className={`amzn-faq-arrow ${openFaq === 4 ? 'open' : ''}`}>▼</span>
                </button>
                {openFaq === 4 && (
                  <div className="amzn-faq-answer">
                    <p>
                      Yes. You can stream up to three videos simultaneously using the same Amazon account, and you can stream the same title on up to two devices at a time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer with Legal Links & Copyright */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
