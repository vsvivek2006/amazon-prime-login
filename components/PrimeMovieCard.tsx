/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface MovieItem {
  id: string;
  title: string;
  image: string;
  badge?: string;
  rank?: number;
  year?: string;
  rating?: string;
  match?: string;
  genre?: string;
  category?: string;
}

interface PrimeMovieCardProps {
  movie: MovieItem;
  onSelect: (movie: MovieItem) => void;
  onPlay: (movie: MovieItem) => void;
}

export default function PrimeMovieCard({ movie, onSelect, onPlay }: PrimeMovieCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // Only load card image when it approaches viewport (horizontal or vertical)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="pv-card"
      onClick={() => onSelect(movie)}
      tabIndex={0}
      role="button"
      aria-label={`Watch ${movie.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(movie);
        }
      }}
    >
      <h3 className="pv-sr-only">{movie.title}</h3>
      <div className="pv-card-poster-wrap">
        {isVisible ? (
          <img
            src={movie.image}
            alt={movie.title}
            title={movie.title}
            width={276}
            height={155}
            decoding="async"
            loading="lazy"
            className="pv-card-poster"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/media/card-landscape-1.jpg';
            }}
          />
        ) : (
          <div
            className="pv-card-poster pv-card-poster--skeleton"
            style={{ width: '100%', height: '100%', backgroundColor: '#131a22' }}
          />
        )}

        {/* Live Amazon Top-Right Badge (e.g. MOST LIKED, MOST REWATCHED, ON NOW) */}
        {movie.badge && <div className="pv-card-badge">{movie.badge}</div>}
      </div>

      {/* Top 10 rank indicator rendered outside overflow-hidden poster wrap */}
      {movie.rank && (
        <div className="pv-top10-rank" aria-label={`Rank #${movie.rank}`}>
          {movie.rank}
        </div>
      )}
    </article>
  );
}
