'use client';

import React from 'react';
import { Film, Sparkles } from 'lucide-react';

interface PrimeRentBannerProps {
  onRentClick: () => void;
}

export default function PrimeRentBanner({ onRentClick }: PrimeRentBannerProps) {
  return (
    <section className="pv-container" style={{ margin: '40px auto 60px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #19273c 0%, #0f172a 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ff9900', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            <Sparkles size={16} />
            <span>Store & Rentals</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
            Movie rentals on Prime Video
          </h2>
          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6' }}>
            Get early access to theatrical blockbuster releases and new movies before they appear on digital subscriptions. No Prime membership required to rent or buy.
          </p>
        </div>

        <button
          type="button"
          className="pv-btn-hero-primary"
          onClick={onRentClick}
          style={{ padding: '14px 28px', fontSize: '15px' }}
        >
          <Film size={18} />
          Rent New Releases
        </button>
      </div>
    </section>
  );
}
