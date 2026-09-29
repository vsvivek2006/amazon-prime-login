'use client';

interface FooterProps {
  isDarkMode?: boolean;
}

export default function Footer({ isDarkMode = false }: FooterProps) {
  return (
    <footer className={`amzn-footer ${isDarkMode ? 'dark' : ''}`}>
      <div className="amzn-footer-divider"></div>
      <div className="amzn-footer-links">
        <a
          href="https://www.amazon.com/gp/help/customer/display.html/ref=ap_signin_notification_condition_of_use?nodeId=508088"
          target="_blank"
          rel="noopener noreferrer"
          className="amzn-footer-link"
        >
          Conditions of Use
        </a>
        <a
          href="https://www.amazon.com/gp/help/customer/display.html/ref=ap_signin_notification_privacy_notice?nodeId=468496"
          target="_blank"
          rel="noopener noreferrer"
          className="amzn-footer-link"
        >
          Privacy Notice
        </a>
        <a
          href="https://www.amazon.com/gp/help/customer/display.html?nodeId=508510"
          target="_blank"
          rel="noopener noreferrer"
          className="amzn-footer-link"
        >
          Help
        </a>
      </div>
      <div className="amzn-footer-copyright">
        &copy; 1996&ndash;2026, Amazon.com, Inc. or its affiliates
      </div>
    </footer>
  );
}
