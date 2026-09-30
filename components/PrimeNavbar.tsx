'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Menu, X, Globe } from 'lucide-react';

interface PrimeNavbarProps {
  onOpenSignIn: () => void;
  onSearchChange?: (query: string) => void;
}

export default function PrimeNavbar({ onOpenSignIn, onSearchChange }: PrimeNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const categories = [
    'Action & Adventure',
    'Anime',
    'Comedy',
    'Documentary',
    'Drama',
    'Fantasy & Sci-Fi',
    'Horror & Mystery',
    'Kids & Family',
    'Romance',
    'Thriller',
  ];

  return (
    <header className={`pv-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="pv-nav-left">
        {/* Prime Video Logo */}
        <Link href="/" className="pv-logo-link" title="Prime Video">
          <img
            src="/media/prime_official_1.png"
            alt="Prime Video"
            className="pv-logo-img"
            onError={(e) => {
              // fallback to svg logo if needed
              (e.target as HTMLImageElement).src = '/assets/prime-video-logo.svg';
            }}
          />
        </Link>

        {/* Desktop Menu */}
        <nav>
          <ul className="pv-nav-menu">
            <li className="pv-nav-item">
              <Link href="/" className="pv-nav-link active">
                Home
              </Link>
            </li>
            <li className="pv-nav-item">
              <a href="#movies" className="pv-nav-link">
                Movies
              </a>
            </li>
            <li className="pv-nav-item">
              <a href="#tv-shows" className="pv-nav-link">
                TV Shows
              </a>
            </li>
            <li className="pv-nav-item">
              <a href="#channels" className="pv-nav-link">
                Subscriptions
              </a>
            </li>
            <li className="pv-nav-item" onMouseLeave={() => setIsCategoryOpen(false)}>
              <button
                type="button"
                className="pv-nav-link"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                onMouseEnter={() => setIsCategoryOpen(true)}
              >
                Categories <ChevronDown size={14} />
              </button>
              {isCategoryOpen && (
                <div className="pv-dropdown-menu">
                  {categories.map((cat) => (
                    <a
                      key={cat}
                      href={`#${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      className="pv-dropdown-item"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <div className="pv-nav-right">
        {/* Search Input */}
        <div className="pv-search-box">
          <Search size={16} className="pv-search-icon" />
          <input
            type="text"
            className="pv-search-input"
            placeholder="Search titles..."
            value={searchVal}
            onChange={handleSearch}
          />
        </div>

        {/* Language Selector */}
        <div className="pv-nav-item" onMouseLeave={() => setIsLanguageOpen(false)}>
          <button
            type="button"
            className="pv-nav-link"
            style={{ fontSize: '13px' }}
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          >
            <Globe size={15} />
            {currentLang}
            <ChevronDown size={12} />
          </button>
          {isLanguageOpen && (
            <div className="pv-dropdown-menu" style={{ minWidth: '130px', right: 0, left: 'auto' }}>
              {['EN (English)', 'HI (हिंदी)', 'ES (Español)', 'FR (Français)', 'DE (Deutsch)'].map((l) => (
                <button
                  key={l}
                  type="button"
                  className="pv-dropdown-item"
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                  onClick={() => {
                    setCurrentLang(l.substring(0, 2));
                    setIsLanguageOpen(false);
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign In Button */}
        <button type="button" className="pv-btn-signin" onClick={onOpenSignIn}>
          Sign In
        </button>

        {/* Join Prime CTA */}
        <button type="button" className="pv-btn-join" onClick={onOpenSignIn}>
          Join Prime
        </button>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="pv-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 5, 13, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 999,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
          }}
        >
          <div className="pv-search-box" style={{ width: '100%' }}>
            <Search size={16} className="pv-search-icon" />
            <input
              type="text"
              className="pv-search-input"
              style={{ width: '100%' }}
              placeholder="Search movies, TV shows..."
              value={searchVal}
              onChange={handleSearch}
            />
          </div>
          <Link
            href="/"
            className="pv-nav-link"
            style={{ fontSize: '18px', padding: '12px 0' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <a
            href="#movies"
            className="pv-nav-link"
            style={{ fontSize: '18px', padding: '12px 0' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Movies
          </a>
          <a
            href="#tv-shows"
            className="pv-nav-link"
            style={{ fontSize: '18px', padding: '12px 0' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            TV Shows
          </a>
          <a
            href="#channels"
            className="pv-nav-link"
            style={{ fontSize: '18px', padding: '12px 0' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Channels & Subscriptions
          </a>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              className="pv-btn-join"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSignIn();
              }}
            >
              Join Prime - Free Trial
            </button>
            <button
              type="button"
              className="pv-btn-signin"
              style={{ width: '100%', textAlign: 'center', padding: '12px' }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSignIn();
              }}
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
