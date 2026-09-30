'use client';

interface PrimeVideoLogoProps {
  className?: string;
}

export default function PrimeVideoLogo({ className = '' }: PrimeVideoLogoProps) {
  return (
    <div className={`prime-logo-wrapper ${className}`} aria-label="Prime Video">
      <img
        src="/assets/prime-video-logo.svg"
        alt="Prime Video"
        title="Prime Video Logo"
        width="128"
        height="32"
        decoding="async"
        className="prime-official-logo"
        style={{
          width: '128px',
          height: '32px',
          display: 'block',
        }}
      />
    </div>
  );
}
