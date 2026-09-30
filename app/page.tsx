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
import scrapedData from '@/data/formattedScrapedData.json';
import '@/styles/prime-landing.css';

export default function PrimeLandingPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'join'>('join');
  const [visibleRows, setVisibleRows] = useState(3);

  // Infinite Scroll Hook
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 300 >=
        document.documentElement.scrollHeight
      ) {
        setVisibleRows((prev) => Math.min(prev + 2, scrapedData.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        
        {scrapedData.slice(0, visibleRows).map((row, index) => (
          <React.Fragment key={index}>
            <div id={`scraped-row-${index}`}>
              <PrimeMovieRow
                title={row.title}
                movies={filterList(row.movies)}
                onSelectMovie={handlePlayMovie}
                onPlayMovie={handlePlayMovie}
              />
            </div>
            
            {/* Inject features or banners after certain rows to keep layout interesting */}
            {index === 1 && <PrimeFeatures />}
            {index === 3 && <PrimeRentBanner onRentClick={handleOpenJoin} />}
            {index === 5 && (
              <div id="channels">
                <PrimeChannels onSubscribeChannel={handleOpenJoin} />
              </div>
            )}
          </React.Fragment>
        ))}

        {visibleRows >= scrapedData.length && (
          <>
            {/* Supported Devices Section */}
            <PrimeDevices />

            {/* Frequently Asked Questions */}
            <PrimeFaq />
          </>
        )}
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
