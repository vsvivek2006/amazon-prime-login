'use client';

import React, { useRef } from 'react';
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

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="pv-section-row">
      <div className="pv-container">
        <div className="pv-row-header">
          <div className="pv-row-title-wrap">
            <h2 className="pv-row-title">{title}</h2>
            {subtitle && <span className="pv-row-subtitle">{subtitle}</span>}
          </div>
          <button
            type="button"
            className="pv-row-see-all"
            onClick={() => onSelectMovie(movies[0])}
          >
            See more <ChevronRight size={14} />
          </button>
        </div>

        <div className="pv-carousel-wrap">
          {/* Scroll Left Button */}
          <button
            type="button"
            className="pv-arrow-btn pv-arrow-left"
            onClick={() => scroll('left')}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Carousel Track */}
          <div className="pv-carousel-track" ref={trackRef}>
            {movies.map((m) => (
              <PrimeMovieCard
                key={m.id}
                movie={m}
                onSelect={onSelectMovie}
                onPlay={onPlayMovie}
              />
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            className="pv-arrow-btn pv-arrow-right"
            onClick={() => scroll('right')}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
