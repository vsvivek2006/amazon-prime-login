import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amazon Sign-In',
  description:
    'Sign in to your Amazon Prime account in the USA to stream Prime Video, enjoy fast shipping on eligible items, and manage your membership benefits. Secure Amazon account sign-in portal.',
  icons: {
    icon: 'https://www.amazon.com/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
