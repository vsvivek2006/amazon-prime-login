'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowLeft, Mail, Lock, User as UserIcon } from 'lucide-react';

interface PrimeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'join';
}

export default function PrimeAuthModal({
  isOpen,
  onClose,
  defaultMode = 'join',
}: PrimeAuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'join'>(defaultMode);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setStep(1);
      setError(null);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  // Step 1: Email Validation & Continue
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g., name@example.com).');
      return;
    }

    setError(null);
    setStep(2);
  };

  // Step 2: Final Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'join' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setStep(1);
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    onClose();
  };

  const handleSwitchMode = (newMode: 'signin' | 'join') => {
    setMode(newMode);
    setStep(1);
    setError(null);
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal-content"
        style={{ maxWidth: '440px', background: '#0f172a', padding: 'min(36px, 8vw)', borderRadius: '12px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="pv-modal-close"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Amazon Prime Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/media/prime-video-logo.png"
            alt="Prime Video"
            title="Prime Video Authentication"
            width={124}
            height={36}
            decoding="async"
            style={{ height: '36px', width: 'auto', margin: '0 auto' }}
          />
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={48} color="#00a8e1" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#ffffff' }}>
              {mode === 'join' ? 'Welcome to Prime Video!' : 'Welcome back!'}
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              Your account <strong>{email}</strong> is now verified. You have full access to Prime Video, Amazon Originals, and offline downloads.
            </p>
            <button
              type="button"
              className="pv-btn-hero-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleReset}
            >
              Start Streaming Now
            </button>
          </div>
        ) : (
          <div>
            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '10px 0',
                  color: mode === 'signin' ? '#00a8e1' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '15px',
                  borderBottom: mode === 'signin' ? '2px solid #00a8e1' : 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onClick={() => handleSwitchMode('signin')}
              >
                Sign In
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '10px 0',
                  color: mode === 'join' ? '#00a8e1' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '15px',
                  borderBottom: mode === 'join' ? '2px solid #00a8e1' : 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onClick={() => handleSwitchMode('join')}
              >
                Join Prime
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            {/* STEP 1: ONLY EMAIL INPUT + CONTINUE BUTTON */}
            {step === 1 ? (
              <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
                <div>
                  <label htmlFor="auth-modal-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Email address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="auth-modal-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.18)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: '4px 0' }}>
                  {mode === 'signin'
                    ? 'Enter your email to sign in to your Amazon Prime Video account.'
                    : 'Enter your email to join Prime Video and start streaming.'}
                </p>

                <button
                  type="submit"
                  className="pv-btn-hero-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '12px', fontSize: '15px' }}
                >
                  Continue
                </button>

                <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '8px', lineHeight: '1.5' }}>
                  By continuing, you agree to Amazon&apos;s{' '}
                  <a
                    href="https://www.amazon.com/gp/help/customer/display.html?nodeId=508088"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#00a8e1', textDecoration: 'none' }}
                  >
                    Conditions of Use
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#00a8e1', textDecoration: 'none' }}
                  >
                    Privacy Notice
                  </a>
                  .
                </div>
              </form>
            ) : (
              /* STEP 2: PASSWORD (+ NAME FOR JOIN) */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
                {/* Active Email Display with Change Option */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Mail size={14} color="#00a8e1" />
                    <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#00a8e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '2px 6px',
                    }}
                  >
                    Change
                  </button>
                </div>

                {/* Name field for Join Prime (Signup) */}
                {mode === 'join' && (
                  <div>
                    <label htmlFor="auth-modal-name" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Your Name
                    </label>
                    <input
                      id="auth-modal-name"
                      type="text"
                      required
                      placeholder="First and last name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError(null);
                      }}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                {/* Password field */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label htmlFor="auth-modal-password" style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
                      {mode === 'join' ? 'Create a Password' : 'Password'}
                    </label>
                    {mode === 'signin' && (
                      <a
                        href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GH7NM2YWEVR2FQBC"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#00a8e1', textDecoration: 'none' }}
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <input
                    id="auth-modal-password"
                    type="password"
                    required
                    placeholder={mode === 'join' ? 'At least 6 characters' : 'Enter your password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    autoFocus={mode === 'signin'}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.18)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  {mode === 'join' && (
                    <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      Passwords must be at least 6 characters.
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    title="Go back to change email"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="submit"
                    className="pv-btn-hero-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '15px' }}
                  >
                    {mode === 'join' ? 'Create your Prime account' : 'Sign In to Prime Video'}
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', justifyContent: 'center', fontSize: '12px', color: '#64748b' }}>
              <ShieldCheck size={14} color="#00a8e1" />
              <span>Secured with Amazon 256-bit SSL Encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
