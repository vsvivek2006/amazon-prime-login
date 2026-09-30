'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Lock, CheckCircle, ShieldCheck } from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
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
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    onClose();
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal-content"
        style={{ maxWidth: '440px', background: '#0f172a', padding: '36px' }}
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
              Welcome to Prime!
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
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
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
                }}
                onClick={() => {
                  setMode('join');
                  setError(null);
                }}
              >
                Start 30-Day Trial
              </button>
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
                }}
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
              >
                Sign In
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mode === 'join' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Email or Mobile Phone Number
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                className="pv-btn-hero-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}
              >
                {mode === 'join' ? 'Continue with Free Trial' : 'Sign In to Prime Video'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link
                href="/login"
                style={{ fontSize: '13px', color: '#00a8e1', textDecoration: 'none' }}
                onClick={onClose}
              >
                Open standard Amazon Sign-In page →
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', justifyContent: 'center', fontSize: '12px', color: '#64748b' }}>
              <ShieldCheck size={14} color="#00a8e1" />
              <span>Secured with Amazon 256-bit SSL Encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
