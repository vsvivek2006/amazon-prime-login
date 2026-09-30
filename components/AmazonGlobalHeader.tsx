'use client';

import React from 'react';
import Link from 'next/link';
import { Search, MapPin, ShoppingCart, Menu } from 'lucide-react';
import '@/styles/amazon-header.css';

export default function AmazonGlobalHeader() {
  return (
    <div className="amz-global-header">
      {/* Top row */}
      <div className="amz-top-row">
        <div className="amz-nav-left">
          <Link href="/" className="amz-logo-link">
            <img
              src="/assets/amazon-logo.svg"
              alt="Amazon"
              title="Amazon Logo"
              width={96}
              height={30}
              decoding="async"
              className="amz-logo"
              style={{ filter: 'brightness(0) invert(1)', height: '30px', width: 'auto', marginTop: '8px' }}
            />
          </Link>
          <div className="amz-nav-deliver">
            <MapPin size={16} className="amz-pin-icon" />
            <div className="amz-deliver-text">
              <span className="amz-deliver-line1">Deliver to</span>
              <span className="amz-deliver-line2">Select your address</span>
            </div>
          </div>
        </div>

        <div className="amz-nav-fill">
          <div className="amz-search-box">
            <div className="amz-search-dropdown">
              <span>All</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 3L5 7L9 3" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input type="text" className="amz-search-input" placeholder="Search Amazon" />
            <div className="amz-search-button">
              <Search size={20} color="#333" />
            </div>
          </div>
        </div>

        <div className="amz-nav-right">
          <div className="amz-nav-item amz-lang">
            <span className="amz-lang-text">EN</span>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 3L5 7L9 3" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="amz-nav-item">
            <span className="amz-nav-line1">Hello, sign in</span>
            <span className="amz-nav-line2">Account & Lists <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '2px'}}><path d="M1 3L5 7L9 3" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          </div>

          <div className="amz-nav-item">
            <span className="amz-nav-line1">Returns</span>
            <span className="amz-nav-line2">& Orders</span>
          </div>

          <div className="amz-nav-cart">
            <ShoppingCart size={28} />
            <span className="amz-cart-count">0</span>
            <span className="amz-nav-line2" style={{ marginTop: '12px' }}>Cart</span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="amz-bottom-row">
        <div className="amz-menu-all">
          <Menu size={18} />
          <span>All</span>
        </div>
        <div className="amz-bottom-links">
          <a href="https://www.amazon.com/deals" target="_blank" rel="noopener noreferrer">Today&apos;s Deals</a>
          <a href="https://www.amazon.com/gp/help/customer/display.html" target="_blank" rel="noopener noreferrer">Customer Service</a>
          <a href="https://www.amazon.com/registries" target="_blank" rel="noopener noreferrer">Registry</a>
          <a href="https://www.amazon.com/gift-cards" target="_blank" rel="noopener noreferrer">Gift Cards</a>
          <a href="https://sell.amazon.com" target="_blank" rel="noopener noreferrer">Sell</a>
        </div>
      </div>
    </div>
  );
}
