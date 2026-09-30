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

        {/* Top 10 rank indicator if applicable */}
        {movie.rank && <div className="pv-top10-rank">{movie.rank}</div>}

        {/* Prime Video Watermark bottom-right */}
        <div className="pv-card-prime-watermark" aria-hidden="true">
          <svg viewBox="0 0 54 20" width="34" height="13" fill="#ffffff">
            <path d="M7.7 5.5c-2.4 0-4.3 1.9-4.3 4.3 0 2.4 1.9 4.3 4.3 4.3 2.4 0 4.3-1.9 4.3-4.3 0-2.4-1.9-4.3-4.3-4.3zm0 6.6c-1.3 0-2.3-1-2.3-2.3 0-1.3 1-2.3 2.3-2.3 1.3 0 2.3 1 2.3 2.3 0 1.3-1 2.3-2.3 2.3zm8.5-6.4h-1.9v8.4h1.9V5.7zm10.7 0h-2v1.3c-.6-.9-1.7-1.5-2.9-1.5-2.4 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3c1.2 0 2.3-.6 2.9-1.5v1.3h2V5.7zm-4.3 6.6c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm12.3-3.8c0-1.7-1.3-3-3.1-3-1.8 0-3.2 1.3-3.2 3.1 0 1.9 1.4 3.2 3.3 3.2 1.2 0 2.2-.6 2.7-1.6l-1.5-.8c-.3.5-.7.8-1.2.8-.7 0-1.3-.5-1.4-1.2h4.5c0-.1 0-.3 0-.5zm-4.4-.5c.1-.7.6-1.2 1.3-1.2.7 0 1.2.5 1.3 1.2h-2.6zM0 16.5c4.7 1.8 10.4 2.8 16.3 2.8 9.3 0 17.5-2.5 23.3-6.5-.4-.4-1.1-.6-1.8-.4-5.2 3.5-12.7 5.6-21.2 5.6-5.4 0-10.7-.9-15.1-2.4-.7-.2-1.3.3-1.5.9z"/>
          </svg>
        </div>
      </div>
    </article>
  );
}
