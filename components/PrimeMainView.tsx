'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import PrimeNavbar from '@/components/PrimeNavbar';
import PrimeHero from '@/components/PrimeHero';
import PrimeMovieRow from '@/components/PrimeMovieRow';
import { MovieItem } from '@/components/PrimeMovieCard';
import PrimeFooter from '@/components/PrimeFooter';
import PrimeTrailerModal from '@/components/PrimeTrailerModal';
import PrimeAuthModal from '@/components/PrimeAuthModal';
import { featuredOriginals } from '@/data/primeData';
import scrapedData from '@/data/formattedScrapedData.json';
import '@/styles/prime-landing.css';

interface PrimeMainViewProps {
  initialTab?: string;
}

export default function PrimeMainView({ initialTab = 'Home' }: PrimeMainViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'join'>('join');
  const [visibleRows, setVisibleRows] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Progressive Infinite Scroll with IntersectionObserver (Batched 2 rows, controlled, low memory)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isLoadingMore && visibleRows < scrapedData.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleRows((prev) => Math.min(prev + 2, scrapedData.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { rootMargin: '300px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [isLoadingMore, visibleRows]);

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
        Boolean(m.genre?.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      const normTab = activeTab.toLowerCase();
      if (normTab === 'home' || normTab === 'all') return true;
      if (normTab === 'movies') return m.category === 'Movies' || !m.category;
      if (normTab === 'tv shows' || normTab === 'tv-shows') return m.category === 'TV Shows';
      if (normTab === 'free to me' || normTab === 'free-to-me') return true;
      if (normTab === 'sports') return Boolean(m.genre?.toLowerCase().includes('sport') || m.title.toLowerCase().includes('live'));
      if (normTab === 'news') return Boolean(m.genre?.toLowerCase().includes('news') || m.title.toLowerCase().includes('news'));
      if (normTab === 'live tv' || normTab === 'live-tv') return true;
      if (normTab === 'subscriptions') return true;
      if (normTab === 'store') return true;

      return true;
    });
  };

  const categoryHeadings: Record<string, string> = {
    Home: 'Welcome to Prime Video – Stream Movies, Watch TV Shows & Discover Amazon Originals',
    Movies: 'Prime Video Movies – Stream Blockbusters, Award-Winning Films & New Releases',
    'TV shows': 'Prime Video TV Shows – Stream Hit Series, Binge Dramas & Amazon Originals',
    'Free to me': 'Free to Me – Stream Movies and TV Shows Included With Prime',
    Sports: 'Prime Video Sports – Watch Live Sports Events, Highlights & Replays',
    News: 'Prime Video News – Stream 24/7 Live Breaking News & Top Networks',
    'Live TV': 'Prime Video Live TV – Stream 100+ Free Real-Time TV Channels Online',
    Subscriptions: 'Prime Video Subscriptions – Add Premium Channels & Networks to Your Account',
    Store: 'Prime Video Store – Rent or Buy The Latest Theatrical Releases & Shows',
  };

  const currentHeading = categoryHeadings[activeTab] || categoryHeadings.Home;

  return (
    <div className="pv-landing-root">
      {/* Sticky Prime Video Navbar */}
      <PrimeNavbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenSignIn={handleOpenSignIn}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Hero Spotlight Section with semantic H1 */}
      <PrimeHero
        headingText={currentHeading}
        onJoinPrime={handleOpenJoin}
        onOpenTrailer={handleHeroTrailer}
      />

      {/* Main Content Showcase */}
      <main id="main-content">
        {scrapedData.slice(0, visibleRows).map((row, index) => {
          const filtered = filterList(row.movies);
          if (filtered.length === 0) return null;
          return (
            <div id={`scraped-row-${index}`} key={index} className="pv-scraped-row">
              <PrimeMovieRow
                title={row.title}
                movies={filtered}
                onSelectMovie={handlePlayMovie}
                onPlayMovie={handlePlayMovie}
              />
            </div>
          );
        })}

        {/* Controlled Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="pv-infinite-sentinel">
          {isLoadingMore && (
            <div className="pv-infinite-loader">
              <div className="pv-spinner" />
              <span>Loading more titles...</span>
            </div>
          )}
          {visibleRows >= scrapedData.length && (
            <div className="pv-infinite-end">
              <span>You&apos;ve reached the end of the Prime Video catalog</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer with authentic Prime Video styling and official links */}
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
