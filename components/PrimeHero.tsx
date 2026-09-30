'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Info, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface PrimeHeroProps {
  onJoinPrime: () => void;
  onOpenTrailer: () => void;
  headingText?: string;
}

interface SlideItem {
  id: string;
  backdrop: string;
  logoImg: string;
  title: string;
  trendingBadge?: string;
  ctaTitle: string;
  ctaSub: string;
  subLinkText: string;
  rating: string;
  termsText: string;
}

const HERO_SLIDES: SlideItem[] = [
  {
    id: 'love-hypothesis',
    backdrop: '/media/hero-love-hypothesis.jpg',
    logoImg: '/media/hero-logo-love-hypothesis.png',
    title: 'The Love Hypothesis',
    trendingBadge: '#2 in the US',
    ctaTitle: 'Watch with Prime',
    ctaSub: 'Start your 30-day free trial',
    subLinkText: 'Join Prime',
    rating: 'R',
    termsText: 'Terms apply',
  },
  {
    id: 'casper',
    backdrop: '/media/amazon-img-003.jpg',
    logoImg: '/media/amazon-img-004.png',
    title: 'Casper',
    trendingBadge: 'Prime member deals just for you',
    ctaTitle: 'Rent or Buy',
    ctaSub: 'From $3.99 to rent',
    subLinkText: 'Explore Member Deals',
    rating: 'PG',
    termsText: 'Terms apply',
  },
  {
    id: 'backrooms',
    backdrop: '/media/amazon-img-005.jpg',
    logoImg: '/media/amazon-img-006.png',
    title: 'Backrooms',
    trendingBadge: 'Included with Max',
    ctaTitle: 'Watch with Max',
    ctaSub: 'Start your 7-day free trial',
    subLinkText: 'More Subscription Channels',
    rating: 'TV-MA',
    termsText: 'Terms apply',
  },
  {
    id: 'law-order',
    backdrop: '/media/amazon-img-009.jpg',
    logoImg: '/media/amazon-img-010.png',
    title: 'Law & Order',
    trendingBadge: 'Free with Ads',
    ctaTitle: 'Watch Free',
    ctaSub: 'Stream with ads',
    subLinkText: 'More Free Live TV',
    rating: 'TV-14',
    termsText: 'Terms apply',
  },
  {
    id: 'livestream-hell',
    backdrop: '/media/amazon-img-011.jpg',
    logoImg: '/media/amazon-img-012.png',
    title: 'Livestream From Hell',
    trendingBadge: '#1 in Horror',
    ctaTitle: 'Watch with Prime',
    ctaSub: 'Included with Prime membership',
    subLinkText: 'Join Prime',
    rating: 'TV-MA',
    termsText: 'Terms apply',
  },
];

const SLIDE_DURATION_MS = 8500;

export default function PrimeHero({
  onJoinPrime,
  onOpenTrailer,
  headingText,
}: PrimeHeroProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [watchlistMap, setWatchlistMap] = useState<Record<string, boolean>>({});
  const [loadedSlideIndices, setLoadedSlideIndices] = useState<number[]>([0]);

  const mainHeading =
    headingText ||
    'Welcome to Prime Video – Stream Movies, Watch TV Shows & Discover Amazon Originals';

  // Only load active slide on mount to prevent downloading all hero backdrops at once.
  // Preload upcoming slide 1.2s before transition to ensure seamless playback without initial bundle bloat.
  useEffect(() => {
    setLoadedSlideIndices((prev) => (prev.includes(currentSlideIndex) ? prev : [...prev, currentSlideIndex]));

    if (isPaused) return;

    const preloadTimer = setTimeout(() => {
      const nextIdx = (currentSlideIndex + 1) % HERO_SLIDES.length;
      setLoadedSlideIndices((prev) => (prev.includes(nextIdx) ? prev : [...prev, nextIdx]));
    }, Math.max(0, SLIDE_DURATION_MS - 1200));

    return () => clearTimeout(preloadTimer);
  }, [currentSlideIndex, isPaused]);

  const toggleWatchlist = (slideId: string) => {
    setWatchlistMap((prev) => ({ ...prev, [slideId]: !prev[slideId] }));
  };

  // Auto-advance carousel with smooth timing
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, isPaused]);

  const goToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setProgressKey((k) => k + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    setProgressKey((k) => k + 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgressKey((k) => k + 1);
  };

  return (
    <section
      className="pv-hero"
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Carousel"
    >
      {/* Semantic H1 for SEO & Screen Readers */}
      <h1 className="pv-seo-heading">{mainHeading}</h1>

      {/* Sliding Carousel Track with authentic horizontal momentum */}
      <div
        className="pv-hero__slider-track"
        style={{
          transform: `translateX(-${currentSlideIndex * 100}%)`,
        }}
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          const isAdded = Boolean(watchlistMap[slide.id]);
          const shouldLoad = loadedSlideIndices.includes(idx);

          return (
            <article
              key={slide.id}
              className={`pv-hero__slide ${isActive ? 'pv-hero__slide--active' : ''}`}
              aria-hidden={!isActive}
              aria-label={slide.title}
            >
              {/* Semantic hidden H2 for heading hierarchy */}
              <h2 className="pv-sr-only">{slide.title}</h2>

              {/* Slide Backdrop with Ken-Burns Motion */}
              <div className="pv-hero__backdrop-wrap">
                {shouldLoad ? (
                  <img
                    src={slide.backdrop}
                    alt={`${slide.title} Poster`}
                    title={`${slide.title} – Watch on Prime Video`}
                    width={1920}
                    height={800}
                    decoding="async"
                    fetchPriority={idx === 0 ? 'high' : 'low'}
                    className="pv-hero__poster"
                  />
                ) : (
                  <div
                    className="pv-hero__poster"
                    style={{ backgroundColor: '#00050d', width: '100%', height: '100%' }}
                  />
                )}
              </div>

              {/* Cinematic Dark Gradient Overlays */}
              <div className="pv-hero__grad-left" />
              <div className="pv-hero__grad-bottom" />
              <div className="pv-hero__grad-top" />

              {/* Left Spotlight Content Container */}
              <div className="pv-hero__content">
                {/* Title Logo Artwork */}
                <div className="pv-hero__title-wrap pv-hero__anim-item" style={{ animationDelay: '0.04s' }}>
                  {shouldLoad ? (
                    <img
                      src={slide.logoImg}
                      alt={`${slide.title} Logo`}
                      title={`${slide.title} Official Title Logo`}
                      width={360}
                      height={120}
                      decoding="async"
                      className="pv-hero__title-img"
                    />
                  ) : (
                    <div style={{ width: '220px', height: '60px' }} />
                  )}
                </div>

                {/* Trending / Category Badge */}
                {slide.trendingBadge && (
                  <div className="pv-hero__trending-badge pv-hero__anim-item" style={{ animationDelay: '0.12s' }}>
                    <span className="pv-hero__trending-icon">
                      <TrendingUp size={16} strokeWidth={2.4} />
                    </span>
                    <span className="pv-hero__trending-text">{slide.trendingBadge}</span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="pv-hero__btn-group pv-hero__anim-item" style={{ animationDelay: '0.2s' }}>
                  {/* Main Rounded Box CTA */}
                  <button
                    type="button"
                    className="pv-hero__btn-watch-prime"
                    onClick={onJoinPrime}
                    id={`hero-watch-btn-${slide.id}`}
                  >
                    <span className="pv-hero__btn-line-main">{slide.ctaTitle}</span>
                    <span className="pv-hero__btn-line-sub">{slide.ctaSub}</span>
                  </button>

                  {/* Plus / Watchlist Button */}
                  <button
                    type="button"
                    className={`pv-hero__btn-circle ${isAdded ? 'pv-hero__btn-circle--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(slide.id);
                    }}
                    aria-label={isAdded ? 'In Watchlist' : 'Add to Watchlist'}
                    title={isAdded ? 'In Watchlist' : 'Add to Watchlist'}
                  >
                    {isAdded ? <Check size={20} color="#00a8e1" /> : <Plus size={22} />}
                  </button>

                  {/* Info Button */}
                  <button
                    type="button"
                    className="pv-hero__btn-circle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTrailer();
                    }}
                    aria-label="More details and trailer"
                    title="More details and trailer"
                  >
                    <Info size={20} />
                  </button>
                </div>

                {/* Sublink with Shopping Bag Icon */}
                <button
                  type="button"
                  className="pv-hero__sublink pv-hero__anim-item"
                  style={{ animationDelay: '0.28s' }}
                  onClick={onJoinPrime}
                >
                  <svg className="pv-hero__sublink-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6h-3V5c0-2.21-1.79-4-4-4S8 2.79 8 5v1H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9-1c0-1.1.9-2 2-2s2 .9 2 2v1h-4V5zm9 15H5V8h14v12zm-7-2c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H7c0 2.76 2.24 5 5 5z" />
                  </svg>
                  <span>{slide.subLinkText}</span>
                </button>
              </div>

              {/* Bottom Right Legal & Rating */}
              <div className="pv-hero__legal-meta">
                <span className="pv-hero__terms">{slide.termsText}</span>
                <span className="pv-hero__rating-badge">{slide.rating}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Navigation Arrows with smooth hover and on-demand prefetch */}
      <button
        type="button"
        className="pv-hero__arrow pv-hero__arrow--left"
        onClick={handlePrev}
        onMouseEnter={() => {
          const prevIdx = currentSlideIndex === 0 ? HERO_SLIDES.length - 1 : currentSlideIndex - 1;
          setLoadedSlideIndices((prev) => (prev.includes(prevIdx) ? prev : [...prev, prevIdx]));
        }}
        aria-label="Previous slide"
      >
        <svg width="20" height="38" viewBox="0 0 18 34" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="pv-chevron-svg">
          <polyline points="15 2 2 17 15 32" />
        </svg>
      </button>
      <button
        type="button"
        className="pv-hero__arrow pv-hero__arrow--right"
        onClick={handleNext}
        onMouseEnter={() => {
          const nextIdx = (currentSlideIndex + 1) % HERO_SLIDES.length;
          setLoadedSlideIndices((prev) => (prev.includes(nextIdx) ? prev : [...prev, nextIdx]));
        }}
        aria-label="Next slide"
      >
        <svg width="20" height="38" viewBox="0 0 18 34" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="pv-chevron-svg">
          <polyline points="3 2 16 17 3 32" />
        </svg>
      </button>

      {/* Bottom Center Dots Indicator with Animated Filling Pill */}
      <div className="pv-hero__dots-center" role="tablist" aria-label="Hero slides">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`pv-hero__dot-pill ${isActive ? 'pv-hero__dot-pill--active' : ''}`}
              onClick={() => goToSlide(idx)}
              onMouseEnter={() => {
                setLoadedSlideIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
              }}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {isActive && (
                <span
                  key={`progress-${progressKey}`}
                  className={`pv-hero__dot-progress ${isPaused ? 'pv-hero__dot-progress--paused' : ''}`}
                  style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
