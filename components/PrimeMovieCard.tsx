'use client';

import React, { useState } from 'react';
import { Play, Plus, Check, Star } from 'lucide-react';

export interface MovieItem {
  id: string;
  title: string;
  image: string;
  badge?: string;
  rank?: number;
  year: string;
  rating: string;
  match: string;
  genre: string;
  category: string;
}

interface PrimeMovieCardProps {
  movie: MovieItem;
  onSelect: (movie: MovieItem) => void;
  onPlay: (movie: MovieItem) => void;
}

export default function PrimeMovieCard({ movie, onSelect, onPlay }: PrimeMovieCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div className="pv-card" onClick={() => onSelect(movie)}>
      <div className="pv-card-poster-wrap">
        <img
          src={movie.image}
          alt={movie.title}
          className="pv-card-poster"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/media/the-boys.jpg';
          }}
        />

        {/* Badge */}
        {movie.badge && <div className="pv-card-badge">{movie.badge}</div>}

        {/* Top 10 Rank Number if available */}
        {movie.rank && <div className="pv-top10-rank">{movie.rank}</div>}

        {/* Quick Play overlay button */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0, 168, 225, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00050d',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPlay(movie);
          }}
          title="Play Trailer"
        >
          <Play size={16} fill="#00050d" />
        </div>

        {/* Watchlist Quick Toggle */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(0, 5, 13, 0.7)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsAdded(!isAdded);
          }}
          title={isAdded ? 'In Watchlist' : 'Add to Watchlist'}
        >
          {isAdded ? <Check size={14} color="#00a8e1" /> : <Plus size={14} />}
      </div>

      <div className="pv-card-info">
        <h3 className="pv-card-title">{movie.title}</h3>
        <div className="pv-card-submeta">
          <span className="pv-card-prime-tag">Prime</span>
          <span>•</span>
          <span>{movie.match}</span>
          <span>•</span>
          <span>{movie.rating}</span>
        </div>
      </div>
    </div>
  );
}
