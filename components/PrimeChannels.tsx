'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PrimeChannelsProps {
  onSubscribeChannel: (channelName: string) => void;
}

export default function PrimeChannels({ onSubscribeChannel }: PrimeChannelsProps) {
  const channels = [
    { name: 'Lionsgate Play', logo: '/media/prime_official_3.png', plan: '₹699/year' },
    { name: 'Discovery+', logo: '/media/prime_official_8.png', plan: '₹399/year' },
    { name: 'Sony LIV', logo: '/media/prime_official_11.png', plan: '₹699/year' },
    { name: 'Eros Now', logo: '/media/prime_official_15.png', plan: '₹299/year' },
    { name: 'Anime Times', logo: '/media/prime_official_18.png', plan: '₹899/year' },
    { name: 'DocuBay', logo: '/media/prime_official_20.png', plan: '₹499/year' },
  ];

  return (
    <section className="pv-channels-section" id="channels">
      <div className="pv-container">
        <div className="pv-channels-banner">
          <div className="pv-channels-content">
            <h2>Your favorite channels all in one app</h2>
            <p>
              With Prime Video Channels, subscribe to your favorite premium networks and streaming services with no extra cable or satellite subscriptions. Watch on any device and cancel anytime with a single click.
            </p>
            <button
              type="button"
              className="pv-btn-hero-primary"
              onClick={() => onSubscribeChannel('All Channels')}
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              Explore Channels <ChevronRight size={16} />
            </button>
          </div>

          <div className="pv-channels-grid">
            {channels.map((c) => (
              <div
                key={c.name}
                className="pv-channel-item"
                onClick={() => onSubscribeChannel(c.name)}
                title={`Subscribe to ${c.name}`}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  title={`${c.name} on Prime Video`}
                  width={120}
                  height={40}
                  decoding="async"
                  className="pv-channel-logo-img"
                  onError={(e) => {
                    // Fallback to text badge if needed
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="font-weight: 800; font-size: 14px; color: #00a8e1;">${c.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
