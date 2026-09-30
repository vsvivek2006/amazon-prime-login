'use client';

import React, { useEffect, useRef } from 'react';
import { X, Play, Plus, Star } from 'lucide-react';
import { MovieItem } from './PrimeMovieCard';

interface PrimeTrailerModalProps {
  movie: MovieItem | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinPrime: () => void;
}

export default function PrimeTrailerModal({
  movie,
  isOpen,
  onClose,
  onJoinPrime,
}: PrimeTrailerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = movie?.title || 'Prime Video Original Preview';
  const rating = movie?.rating || '18+';
  const match = movie?.match || '99% Match';
  const year = movie?.year || '2024';

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div className="pv-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="pv-modal-close"
          onClick={onClose}
          aria-label="Close Preview"
        >
          <X size={20} />
        </button>

        <video
          ref={videoRef}
          src="/media/prime-trailer.mp4"
          autoPlay
          controls
          className="pv-modal-video"
          poster={movie?.image || '/media/hero-banner.jpg'}
        />

        <div className="pv-modal-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="pv-card-badge" style={{ position: 'static' }}>
              Included with Prime
            </span>
            <span className="pv-meta-tag">{rating}</span>
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
              {match}
            </span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{year}</span>
          </div>

          <h3 className="pv-modal-title">{title}</h3>

          <p className="pv-modal-desc">
            Experience non-stop thrill and high-stakes drama in this hit title streaming exclusively on Amazon Prime Video in stunning 4K Ultra HD and immersive Dolby Atmos audio.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '20px' }}>
            <button
              type="button"
              className="pv-btn-hero-primary"
              onClick={() => {
                onClose();
                onJoinPrime();
              }}
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              <Play size={16} fill="#00050d" />
              Watch Full Video with Prime
            </button>
            <button
              type="button"
              className="pv-btn-hero-secondary"
              onClick={onClose}
              style={{ padding: '12px 20px', fontSize: '15px' }}
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
