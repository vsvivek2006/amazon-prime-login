/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Grip, User, ShoppingBag, X } from 'lucide-react';

interface PrimeNavbarProps {
  onOpenSignIn: () => void;
  onSearchChange?: (query: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function PrimeNavbar({
  onOpenSignIn,
  onSearchChange,
  activeTab: propActiveTab,
  onTabChange,
}: PrimeNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [localActiveTab, setLocalActiveTab] = useState(propActiveTab || 'Home');
  const activeTab = propActiveTab || localActiveTab;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (propActiveTab) {
      setLocalActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: string
  ) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      if (onTabChange) {
        e.preventDefault();
        setLocalActiveTab(tab);
        onTabChange(tab);
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <>
      <header className={`pv-navbar${isScrolled ? ' pv-navbar--scrolled' : ''}`}>
        {/* Logo */}
        <Link
          href="/"
          className="pv-logo-link"
          title="Prime Video"
          onClick={(e) => handleNavClick(e, 'Home')}
        >
          <img
            src="/media/prime-video-logo.png"
            alt="Prime Video"
            title="Prime Video Homepage"
            width={112}
            height={32}
            decoding="async"
            className="pv-logo-img"
          />
        </Link>

        {/* Center Nav Links */}
        <nav className="pv-nav-links" aria-label="Main navigation">
          <Link
            href="/"
            className={`pv-nav-link ${activeTab === 'Home' ? 'pv-nav-link--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'Home')}
          >
            {activeTab === 'Home' ? <span className="pv-nav-pill">Home</span> : 'Home'}
          </Link>
          {['Free to me', 'Movies', 'TV shows', 'Sports', 'News', 'Live TV'].map((item) => {
            const path = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <Link
                key={item}
                href={path}
                className={`pv-nav-link ${activeTab === item ? 'pv-nav-link--active' : ''}`}
                onClick={(e) => handleNavClick(e, item)}
              >
                {activeTab === item ? <span className="pv-nav-pill">{item}</span> : item}
              </Link>
            );
          })}
          <span className="pv-nav-divider" aria-hidden="true">|</span>
          <Link
            href="/subscriptions"
            className={`pv-nav-link pv-nav-link--icon ${activeTab === 'Subscriptions' ? 'pv-nav-link--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'Subscriptions')}
          >
            {activeTab === 'Subscriptions' ? (
              <span className="pv-nav-pill pv-nav-pill--icon">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="7" height="7" rx="1.5" />
                  <rect x="9" y="0" width="7" height="7" rx="1.5" />
                  <rect x="0" y="9" width="7" height="7" rx="1.5" />
                  <rect x="9" y="9" width="7" height="7" rx="1.5" />
                </svg>
                Subscriptions
              </span>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="7" height="7" rx="1.5" />
                  <rect x="9" y="0" width="7" height="7" rx="1.5" />
                  <rect x="0" y="9" width="7" height="7" rx="1.5" />
                  <rect x="9" y="9" width="7" height="7" rx="1.5" />
                </svg>
                Subscriptions
              </>
            )}
          </Link>
          <Link
            href="/store"
            className={`pv-nav-link pv-nav-link--icon ${activeTab === 'Store' ? 'pv-nav-link--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'Store')}
          >
            {activeTab === 'Store' ? (
              <span className="pv-nav-pill pv-nav-pill--icon">
                <ShoppingBag size={14} strokeWidth={2} />
                Store
              </span>
            ) : (
              <>
                <ShoppingBag size={14} strokeWidth={2} />
                Store
              </>
            )}
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="pv-nav-actions">
          {/* Smooth Expanding Search Bar */}
          <div className={`pv-search-container ${searchOpen ? 'pv-search-container--open' : ''}`}>
            <button
              type="button"
              className="pv-icon-btn pv-search-icon-btn"
              aria-label="Search"
              title="Search Prime Video"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} strokeWidth={2} />
            </button>
            <div className="pv-search-input-wrap">
              <input
                ref={searchRef}
                type="text"
                className="pv-search-input"
                placeholder="Search Prime Video"
                aria-label="Search Prime Video"
                value={searchVal}
                onChange={handleSearch}
                onBlur={() => {
                  if (!searchVal) setSearchOpen(false);
                }}
              />
              {searchOpen && (
                <button
                  type="button"
                  className="pv-search-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchVal('');
                    onSearchChange?.('');
                    setSearchOpen(false);
                  }}
                  aria-label="Close search"
                  title="Close search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Language Selector EN matching live primevideo.com */}
          <button type="button" className="pv-lang-btn" aria-label="Language: English" title="Language: English">
            <span>EN</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* 9-dot Grid / Categories */}
          <button type="button" className="pv-icon-btn pv-grid-btn" aria-label="All Categories" title="Categories">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="currentColor">
              <circle cx="3" cy="3" r="1.6" />
              <circle cx="9" cy="3" r="1.6" />
              <circle cx="15" cy="3" r="1.6" />
              <circle cx="3" cy="9" r="1.6" />
              <circle cx="9" cy="9" r="1.6" />
              <circle cx="15" cy="9" r="1.6" />
              <circle cx="3" cy="15" r="1.6" />
              <circle cx="9" cy="15" r="1.6" />
              <circle cx="15" cy="15" r="1.6" />
            </svg>
          </button>

          {/* User Avatar */}
          <button
            type="button"
            className="pv-avatar-btn"
            aria-label="Account & Sign In"
            onClick={onOpenSignIn}
            title="Account & Sign In"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {/* Join Prime button */}
          <button
            type="button"
            className="pv-join-btn"
            onClick={onOpenSignIn}
            title="Join Prime – Start your 30-day free trial"
          >
            Join Prime
          </button>

          {/* Mobile toggle */}
          <button
            type="button"
            className="pv-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            title="Toggle navigation menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="pv-mobile-drawer" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="pv-mobile-drawer__inner" onClick={(e) => e.stopPropagation()}>
            <div className="pv-mobile-drawer__header">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} title="Prime Video">
                <img
                  src="/media/prime-video-logo.png"
                  alt="Prime Video"
                  title="Prime Video Homepage"
                  width={100}
                  height={28}
                  decoding="async"
                  className="pv-logo-img"
                />
              </Link>
              <button
                type="button"
                className="pv-mobile-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                title="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="pv-search-bar pv-mobile-search">
              <Search size={16} className="pv-search-bar__icon" />
              <input
                type="text"
                className="pv-search-bar__input"
                placeholder="Search Prime Video"
                value={searchVal}
                onChange={handleSearch}
              />
            </div>

            <div className="pv-mobile-nav-list">
              {['Home', 'Free to me', 'Movies', 'TV shows', 'Sports', 'News', 'Live TV', 'Subscriptions', 'Store'].map(
                (item) => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`pv-mobile-link ${activeTab === item ? 'pv-mobile-link--active' : ''}`}
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {item}
                  </Link>
                )
              )}
            </div>

            <div className="pv-mobile-drawer__footer">
              <button
                type="button"
                className="pv-join-btn pv-join-btn--full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSignIn();
                }}
              >
                Join Prime – Start Free Trial
              </button>
              <button
                type="button"
                className="pv-mobile-signin-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSignIn();
                }}
              >
                Already a member? Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
