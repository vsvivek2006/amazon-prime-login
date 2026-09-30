'use client';

import React, { useState, useRef } from 'react';
import { Play, Volume2, VolumeX, Info, Plus, CheckCircle2 } from 'lucide-react';

interface PrimeHeroProps {
  onJoinPrime: () => void;
  onOpenTrailer: () => void;
}

export default function PrimeHero({ onJoinPrime, onOpenTrailer }: PrimeHeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="pv-hero" id="hero">
      {/* Background Media */}
      <div className="pv-hero-media">
        {/* Video Trailer */}
        <video
          ref={videoRef}
          src="/media/prime-trailer.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="pv-hero-video"
          poster="/media/hero-banner.jpg"
        />

        {/* Fallback image if video is loading */}
        {!isVideoLoaded && (
          <img
            src="/media/hero-banner.jpg"
            alt="Prime Video Featured Original"
            className="pv-hero-poster"
          />
        )}

        {/* Cinematic Vignette Gradients */}
        <div className="pv-hero-gradient-x" />
        <div className="pv-hero-gradient-y" />
      </div>

      {/* Hero Content Overlay */}
      <div className="pv-container">
        <div className="pv-hero-content">
          <h1 className="pv-hero-title">
            Welcome to Prime Video
          </h1>

          <p className="pv-hero-desc">
            Watch the latest movies, TV shows, and award-winning Amazon Originals
          </p>

          <div className="pv-hero-actions">
            <button
              type="button"
              className="pv-btn-hero-primary"
              onClick={onJoinPrime}
              id="hero-join-prime-btn"
            >
              Sign in to join Prime
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
