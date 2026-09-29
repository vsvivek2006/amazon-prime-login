'use client';

interface AmazonLogoProps {
  isDarkMode?: boolean;
  className?: string;
}

export default function AmazonLogo({ isDarkMode = false, className = '' }: AmazonLogoProps) {
  return (
    <div className={`amzn-logo-wrapper ${className}`} aria-label="Amazon">
      {/* Official Amazon Logo SVG */}
      <img
        src="/assets/amazon-logo.svg"
        alt="Amazon"
        width="103"
        height="31"
        className={`amzn-official-logo ${isDarkMode ? 'dark' : ''}`}
        style={{
          width: '103px',
          height: '31px',
          display: 'block',
          filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </div>
  );
}
