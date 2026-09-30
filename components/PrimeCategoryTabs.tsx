'use client';

import React from 'react';

interface PrimeCategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function PrimeCategoryTabs({ activeTab, onTabChange }: PrimeCategoryTabsProps) {
  const tabs = [
    'All',
    'Amazon Originals',
    'Movies',
    'TV Shows',
    'Top 10',
    'Action & Thriller',
    'Drama & Romance',
  ];

  return (
    <div className="pv-filter-bar">
      <div className="pv-container">
        <div className="pv-tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`pv-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
