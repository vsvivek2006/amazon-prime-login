import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found – Prime Video',
  description: "We're sorry. The page you requested could not be found on Prime Video.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#00050d',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        fontFamily: '"Amazon Ember", Arial, sans-serif',
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <Link href="/">
          <img
            src="/media/prime-video-logo.png"
            alt="Prime Video"
            title="Prime Video Homepage"
            width={140}
            height={42}
            decoding="async"
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      <div
        style={{
          maxWidth: '520px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#00a8e1',
            fontWeight: 700,
            display: 'block',
            marginBottom: '12px',
          }}
        >
          Error 404
        </span>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '16px',
            color: '#f2f4f6',
            lineHeight: 1.25,
          }}
        >
          Looking for something?
        </h1>

        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#a3b8cc',
            marginBottom: '32px',
          }}
        >
          We&apos;re sorry. The Web address you entered is not a functioning page
          on our site. Explore our popular movies, series, and originals from the homepage.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#00a8e1',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '15px',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            Go to Prime Video Home
          </Link>

          <a
            href="https://www.primevideo.com/help"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '14px',
              color: '#00a8e1',
              textDecoration: 'none',
              marginTop: '8px',
            }}
          >
            Visit Prime Video Help & Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
