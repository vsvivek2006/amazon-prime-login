'use client';

import React from 'react';
import { Tv, Download, WifiOff, ShieldCheck } from 'lucide-react';

export default function PrimeFeatures() {
  const features = [
    {
      icon: <Tv size={28} />,
      title: 'Watch Anywhere',
      desc: 'Prime Video moves with you. Stream seamlessly on smart TVs, Fire TV, Apple TV, PlayStation, Xbox, tablets, iOS, Android, and the web — on up to 3 devices simultaneously.',
    },
    {
      icon: <Download size={28} />,
      title: 'Download and Go',
      desc: 'Save movies and series directly to your phone, tablet, or laptop. Enjoy uninterrupted offline playback during flights, road trips, or anywhere with limited internet connectivity.',
    },
    {
      icon: <WifiOff size={28} />,
      title: 'Data Saver',
      desc: 'Intelligently control video bitrate and monitor mobile network usage while downloading and streaming on your mobile devices without sacrificing visual quality.',
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Family Friendly',
      desc: 'Create up to 6 custom viewer profiles including dedicated Kids profiles with age-appropriate filtering and secure PIN parental controls.',
    },
  ];

  return (
    <section className="pv-features-section" id="features">
      <div className="pv-container">
        <div className="pv-features-header">
          <h2 className="pv-features-heading">One Membership, Endless Entertainment</h2>
          <p className="pv-features-subheading">
            Enjoy exclusive Amazon Originals, popular movies, TV shows, and sports with powerful features designed for how you watch.
          </p>
        </div>

        <div className="pv-features-grid">
          {features.map((f, i) => (
            <div key={i} className="pv-feature-card">
              <div className="pv-feature-icon-wrap">{f.icon}</div>
              <h3 className="pv-feature-title">{f.title}</h3>
              <p className="pv-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
