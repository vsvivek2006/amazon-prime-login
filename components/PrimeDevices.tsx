'use client';

import React from 'react';
import { Tv, Smartphone, Laptop, Gamepad2 } from 'lucide-react';

export default function PrimeDevices() {
  const deviceCategories = [
    {
      icon: <Tv size={36} className="pv-device-icon" />,
      title: 'Smart TVs & Streaming',
      list: 'Amazon Fire TV, Apple TV, Google TV, Samsung Smart TV, LG webOS, Roku, Chromecast, and Android TV.',
    },
    {
      icon: <Smartphone size={36} className="pv-device-icon" />,
      title: 'Phones & Tablets',
      list: 'Apple iPhone, iPad, Android smartphones, Samsung Galaxy Tab, and Amazon Fire tablets with offline download support.',
    },
    {
      icon: <Laptop size={36} className="pv-device-icon" />,
      title: 'Computers & Laptops',
      list: 'Google Chrome, Apple Safari, Microsoft Edge, Mozilla Firefox, and the official Prime Video app for Windows 10 & 11 and macOS.',
    },
    {
      icon: <Gamepad2 size={36} className="pv-device-icon" />,
      title: 'Gaming Consoles',
      list: 'Sony PlayStation 5, PlayStation 4, Microsoft Xbox Series X|S, and Xbox One with full 4K UHD and HDR support.',
    },
  ];

  return (
    <section className="pv-devices-section" id="devices">
      <div className="pv-container">
        <h2 className="pv-devices-title">Watch on All Your Favorite Devices</h2>
        <p className="pv-devices-subtitle">
          Enjoy unlimited streaming wherever you go, on the big screen at home, or on the move.
        </p>

        <div className="pv-devices-grid">
          {deviceCategories.map((dev, i) => (
            <div key={i} className="pv-device-box">
              {dev.icon}
              <h3 className="pv-device-name">{dev.title}</h3>
              <p className="pv-device-list">{dev.list}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
