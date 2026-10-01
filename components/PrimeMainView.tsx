'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import PrimeNavbar from '@/components/PrimeNavbar';
import PrimeHero from '@/components/PrimeHero';
import PrimeMovieRow from '@/components/PrimeMovieRow';
import { MovieItem } from '@/components/PrimeMovieCard';
import PrimeFooter from '@/components/PrimeFooter';
import PrimeTrailerModal from '@/components/PrimeTrailerModal';
import PrimeAuthModal from '@/components/PrimeAuthModal';
import { featuredOriginals, liveNewsChannels, liveTvChannels } from '@/data/primeData';
import scrapedData from '@/data/formattedScrapedData.json';
import '@/styles/prime-landing.css';

interface PrimeMainViewProps {
  initialTab?: string;
}

interface CatalogRow {
  title: string;
  subtitle?: string;
  movies: MovieItem[];
}

function getCategoryRows(tab: string, scraped: CatalogRow[]): CatalogRow[] {
  const normTab = tab.toLowerCase();

  if (normTab === 'news') {
    const newsDocRows = scraped.filter((row) => {
      const t = row.title.toLowerCase();
      return (
        t.includes('documentar') ||
        t.includes('biography') ||
        t.includes('news') ||
        t.includes('historical') ||
        t.includes('chronicle') ||
        t.includes('military') ||
        t.includes('warzone')
      );
    });
    return [
      {
        title: 'Top Live News Networks',
        subtitle: 'Watch 24/7 live news coverage and breaking reports from trusted global networks',
        movies: liveNewsChannels,
      },
      ...newsDocRows,
    ];
  }

  if (normTab === 'live tv' || normTab === 'live-tv') {
    const liveCatalogRows = scraped.filter((row) => {
      const t = row.title.toLowerCase();
      return (
        t.includes('live') ||
        t.includes('sport') ||
        t.includes('event') ||
        t.includes('trending') ||
        t.includes('popular now')
      );
    });
    return [
      {
        title: 'Live TV Channels (24/7)',
        subtitle: 'Stream popular broadcast channels and live programs at no extra cost',
        movies: liveTvChannels,
      },
      ...liveCatalogRows,
    ];
  }

  if (normTab === 'sports') {
    return scraped.filter((row) => {
      const t = row.title.toLowerCase();
      return (
        t.includes('sport') ||
        t.includes('event') ||
        t.includes('adrenaline') ||
        t.includes('battlefront')
      );
    });
  }

  if (normTab === 'movies') {
    return scraped.filter((row) => {
      const t = row.title.toLowerCase();
      const isTv =
        t.includes(' tv') ||
        t.includes('series') ||
        t.includes('shows') ||
        t.includes('unscripted') ||
        t.includes('reality') ||
        t.includes('emmy');
      return !isTv;
    });
  }

  if (normTab === 'tv shows' || normTab === 'tv-shows') {
    return scraped.filter((row) => {
      const t = row.title.toLowerCase();
      return (
        t.includes('tv') ||
        t.includes('series') ||
        t.includes('shows') ||
        t.includes('unscripted') ||
        t.includes('reality') ||
        t.includes('emmy') ||
        t.includes('laughs') ||
        t.includes('anime')
      );
    });
  }

  if (normTab === 'free to me' || normTab === 'free-to-me') {
    return scraped.filter((row) => {
      const t = row.title.toLowerCase();
      return (
        t.includes('free') ||
        t.includes('amazon originals') ||
        t.includes('top 10') ||
        t.includes('popular')
      );
    });
  }

  if (normTab === 'subscriptions') {
    return scraped.filter((row) => {
      const t = row.title.toLowerCase();
      return (
        t.includes('subscription') ||
        t.includes('hbo') ||
        t.includes('amc') ||
        t.includes('hallmark') ||
        t.includes('bbc') ||
        t.includes('royalty') ||
        t.includes('a24')
      );
    });
  }

  if (normTab === 'store') {
    return scraped.filter((row) => {
      const t = row.title.toLowerCase();
      return (
        t.includes('purchases') ||
        t.includes('deals') ||
        t.includes('rent') ||
        t.includes('buy') ||
        t.includes('store') ||
        t.includes('top 10') ||
        t.includes('classics')
      );
    });
  }

  return scraped;
}

export default function PrimeMainView({ initialTab = 'Home' }: PrimeMainViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'join'>('join');
  const [visibleRows, setVisibleRows] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isFetchingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync initialTab when route changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Support browser back and forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').replace(/-/g, ' ');
      if (!path) {
        setActiveTab('Home');
      } else {
        const found = [
          'Home',
          'Free to me',
          'Movies',
          'TV shows',
          'Sports',
          'News',
          'Live TV',
          'Subscriptions',
          'Store',
        ].find((t) => t.toLowerCase() === path.toLowerCase());
        if (found) setActiveTab(found);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute matching rows directly from pre-filtered categories & search query
  const matchingRows = useMemo(() => {
    const categoryRows = getCategoryRows(activeTab, scrapedData as CatalogRow[]);

    if (!searchQuery.trim()) {
      return categoryRows;
    }

    const query = searchQuery.trim().toLowerCase();
    return categoryRows
      .map((row) => ({
        ...row,
        movies: row.movies.filter(
          (m) =>
            m.title.toLowerCase().includes(query) ||
            Boolean(m.genre?.toLowerCase().includes(query)) ||
            Boolean(m.category?.toLowerCase().includes(query)) ||
            Boolean(m.badge?.toLowerCase().includes(query))
        ),
      }))
      .filter((row) => row.movies.length > 0);
  }, [activeTab, searchQuery]);

  // Reset pagination state whenever active tab or search query changes
  useEffect(() => {
    setVisibleRows(4);
    setIsLoadingMore(false);
    isFetchingRef.current = false;
  }, [activeTab, searchQuery]);

  const hasMore = visibleRows < matchingRows.length;

  // Progressive Infinite Scroll with IntersectionObserver (Batched 4 rows, strictly guarded)
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true;
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleRows((prev) => Math.min(prev + 4, matchingRows.length));
            setIsLoadingMore(false);
            isFetchingRef.current = false;
          }, 200);
        }
      },
      { rootMargin: '350px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, matchingRows.length]);

  // Seamless client-side tab switching without page reload or remount
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const path = newTab === 'Home' ? '/' : `/${newTab.toLowerCase().replace(/\s+/g, '-')}`;
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        onTabChange={handleTabChange}
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
        {matchingRows.slice(0, visibleRows).map((row, index) => (
          <div
            id={`scraped-row-${index}`}
            key={`${row.title}-${index}`}
            className="pv-scraped-row"
          >
            <PrimeMovieRow
              title={row.title}
              subtitle={row.subtitle}
              movies={row.movies}
              onSelectMovie={handlePlayMovie}
              onPlayMovie={handlePlayMovie}
            />
          </div>
        ))}

        {/* Empty state when search or tab yields 0 items */}
        {matchingRows.length === 0 && (
          <div className="pv-empty-state">
            <p className="pv-empty-title">
              No titles found{searchQuery ? ` for "${searchQuery}"` : ''}
            </p>
            <p className="pv-empty-subtitle">
              Try searching for another movie, TV show, genre, or actor
            </p>
          </div>
        )}

        {/* Controlled Infinite Scroll Sentinel */}
        {hasMore && (
          <div ref={sentinelRef} className="pv-infinite-sentinel">
            {isLoadingMore && (
              <div className="pv-infinite-loader">
                <div className="pv-spinner" />
                <span>Loading more titles...</span>
              </div>
            )}
          </div>
        )}

        {!hasMore && matchingRows.length > 0 && (
          <div className="pv-infinite-end">
            <span>You&apos;ve reached the end of the Prime Video catalog</span>
          </div>
        )}
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
