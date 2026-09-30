'use client';

import React, { useState, useMemo } from 'react';
import PrimeNavbar from '@/components/PrimeNavbar';
import PrimeHero from '@/components/PrimeHero';
import PrimeCategoryTabs from '@/components/PrimeCategoryTabs';
import PrimeMovieRow from '@/components/PrimeMovieRow';
import { MovieItem } from '@/components/PrimeMovieCard';
import PrimeFeatures from '@/components/PrimeFeatures';
import PrimeRentBanner from '@/components/PrimeRentBanner';
import PrimeChannels from '@/components/PrimeChannels';
import PrimeDevices from '@/components/PrimeDevices';
import PrimeFaq from '@/components/PrimeFaq';
import PrimeFooter from '@/components/PrimeFooter';
import PrimeTrailerModal from '@/components/PrimeTrailerModal';
import PrimeAuthModal from '@/components/PrimeAuthModal';
import {
  recentlyAdded,
  asianDramas,
  crimeThrillers,
  featuredOriginals,
} from '@/data/primeData';
import '@/styles/prime-landing.css';

export default function PrimeLandingPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'join'>('join');

  // Open Auth Dialog
  const handleOpenJoin = () => {
    setAuthMode('join');
    setIsAuthOpen(true);
  };

  const handleOpenSignIn = () => {
    setAuthMode('signin');
    setIsAuthOpen(true);
  };

  // Open Video Trailer Modal
  const handlePlayMovie = (movie: MovieItem) => {
    setSelectedMovie(movie);
    setIsTrailerOpen(true);
  };

  const handleHeroTrailer = () => {
    setSelectedMovie(featuredOriginals[0]);
    setIsTrailerOpen(true);
  };

  // Filter movies based on search and category
  const filterList = (list: MovieItem[]) => {
    return list.filter((m) => {
      const matchesSearch =
        searchQuery === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'All') return true;
      if (activeTab === 'Amazon Originals') return m.category === 'Amazon Originals';
      if (activeTab === 'Movies') return m.category === 'Movies';
      if (activeTab === 'TV Shows') return m.category === 'TV Shows';
      if (activeTab === 'Top 10') return m.category === 'Top 10';
      if (activeTab === 'Action & Thriller') return m.genre.includes('Action') || m.genre.includes('Thriller');
      if (activeTab === 'Drama & Romance') return m.genre.includes('Drama') || m.genre.includes('Romance');

      return true;
    });
  };

  const filteredRecentlyAdded = useMemo(() => filterList(recentlyAdded), [searchQuery, activeTab]);
  const filteredAsianDramas = useMemo(() => filterList(asianDramas), [searchQuery, activeTab]);
  const filteredCrimeThrillers = useMemo(() => filterList(crimeThrillers), [searchQuery, activeTab]);
  const filteredOriginals = useMemo(() => filterList(featuredOriginals), [searchQuery, activeTab]);

  return (
    <div className="pv-landing-root">
      {/* Sticky Prime Video Navbar */}
      <PrimeNavbar
        onOpenSignIn={handleOpenSignIn}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Hero Spotlight Section */}
      <PrimeHero
        onJoinPrime={handleOpenJoin}
        onOpenTrailer={handleHeroTrailer}
      />

      {/* Category Filter Tabs */}
      <PrimeCategoryTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Showcase */}
      <main id="main-content">
        {/* Row 1: Recently Added */}
        <div id="recently-added">
          <PrimeMovieRow
            title="Recently added: Watch for Free"
            movies={filteredRecentlyAdded}
            onSelectMovie={handlePlayMovie}
            onPlayMovie={handlePlayMovie}
          />
        </div>

        {/* Row 2: Asian Dramas */}
        <div id="asian-dramas">
          <PrimeMovieRow
            title="Popular Asian dramas: Watch for Free"
            movies={filteredAsianDramas}
            onSelectMovie={handlePlayMovie}
            onPlayMovie={handlePlayMovie}
          />
        </div>

        {/* Value Proposition Feature Highlights (Watch Anywhere, Download & Go, Data Saver) */}
        <PrimeFeatures />

        {/* Row 3: Crime Thrillers */}
        <div id="crime-thrillers">
          <PrimeMovieRow
            title="Crime Thrillers: Watch for Free"
            movies={filteredCrimeThrillers}
            onSelectMovie={handlePlayMovie}
            onPlayMovie={handlePlayMovie}
          />
        </div>

        {/* Movie Rentals / Store Promotion Banner */}
        <PrimeRentBanner onRentClick={handleOpenJoin} />

        {/* Row 4: Featured Originals */}
        <div id="featured-originals">
          <PrimeMovieRow
            title="Featured Originals: Movies"
            movies={filteredOriginals}
            onSelectMovie={handlePlayMovie}
            onPlayMovie={handlePlayMovie}
          />
        </div>

        {/* Prime Video Channels Subscriptions */}
        <div id="channels">
          <PrimeChannels onSubscribeChannel={handleOpenJoin} />
        </div>

        {/* Supported Devices Section */}
        <PrimeDevices />

        {/* Frequently Asked Questions */}
        <PrimeFaq />
      </main>

      {/* Footer */}
      <PrimeFooter />

      {/* Interactive Video Trailer Pop-up Player */}
      <PrimeTrailerModal
        movie={selectedMovie}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onJoinPrime={handleOpenJoin}
      />

      {/* Quick Authentication / Trial Dialog */}
      <PrimeAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}
