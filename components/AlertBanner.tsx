'use client';

interface AlertBannerProps {
  title?: string;
  message: string;
}

export default function AlertBanner({
  title = 'There was a problem',
  message,
}: AlertBannerProps) {
  if (!message) return null;

  return (
    <div className="amzn-alert-box" role="alert" aria-live="assertive">
      <div className="amzn-alert-container">
        <div className="amzn-alert-icon-col">
          <svg
            className="amzn-alert-icon"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2L1 21H23L12 2Z"
              stroke="#c40000"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="#fff"
            />
            <line
              x1="12"
              y1="9"
              x2="12"
              y2="15"
              stroke="#c40000"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="18" r="1.2" fill="#c40000" />
          </svg>
        </div>
        <div className="amzn-alert-content">
          <h4 className="amzn-alert-heading">{title}</h4>
          <p className="amzn-alert-message">{message}</p>
        </div>
      </div>
    </div>
  );
}
