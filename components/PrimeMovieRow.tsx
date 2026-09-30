'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PrimeMovieCard, { MovieItem } from './PrimeMovieCard';

interface PrimeMovieRowProps {
  title: string;
  subtitle?: string;
  movies: MovieItem[];
  onSelectMovie: (movie: MovieItem) => void;
  onPlayMovie: (movie: MovieItem) => void;
}

export default function PrimeMovieRow({
  title,
  subtitle,
  movies,
  onSelectMovie,
  onPlayMovie,
}: PrimeMovieRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies, checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const clientWidth = trackRef.current.clientWidth;
      // Scroll by exact card block multiples (276px width + 12px gap = 288px)
      const visibleCards = Math.max(1, Math.floor(clientWidth / 288));
      const scrollDistance = visibleCards * 288;

      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      });

      // Recheck scroll bounds after smooth scroll completes
      setTimeout(checkScroll, 450);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="pv-section-row" aria-label={title}>
      <div className="pv-container">
        <div className="pv-row-header">
          <div className="pv-row-title-wrap">
            <h2 className="pv-row-title">{title}</h2>
            {subtitle && <p className="pv-row-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="pv-row-see-all"
            title={`See more titles in ${title}`}
            aria-label={`See more titles in ${title}`}
            onClick={() => onSelectMovie(movies[0])}
          >
            See more <ChevronRight size={14} />
          </button>
        </div>

        <div className="pv-carousel-wrap">
          {/* Scroll Left Button — only visible when there is content scrolled left */}
          {canScrollLeft && (
            <button
              type="button"
              className="pv-arrow-btn pv-arrow-left"
              onClick={() => scroll('left')}
              aria-label={`Scroll ${title} left`}
            >
              <svg width="18" height="34" viewBox="0 0 18 34" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="pv-chevron-svg">
                <polyline points="15 2 2 17 15 32" />
              </svg>
            </button>
          )}

          {/* Carousel Track */}
          <div
            className="pv-carousel-track"
            ref={trackRef}
            onScroll={checkScroll}
          >
            {movies.map((m) => (
              <PrimeMovieCard
                key={m.id}
                movie={m}
                onSelect={onSelectMovie}
                onPlay={onPlayMovie}
              />
            ))}
          </div>

          {/* Scroll Right Button — only visible when there is more content */}
          {canScrollRight && (
            <button
              type="button"
              className="pv-arrow-btn pv-arrow-right"
              onClick={() => scroll('right')}
              aria-label={`Scroll ${title} right`}
            >
              <svg width="18" height="34" viewBox="0 0 18 34" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="pv-chevron-svg">
                <polyline points="3 2 16 17 3 32" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
