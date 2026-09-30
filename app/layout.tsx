import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Welcome to Prime Video | Watch Movies, TV Shows & Originals',
  description:
    'Stream movies, TV shows, and Amazon Originals — all in one place. Enjoy The Boys, Fallout, The Rings of Power, Citadel, and blockbuster hits on smart TVs, mobile, and web.',
  keywords: [
    'Prime Video',
    'Amazon Originals',
    'The Boys',
    'Fallout',
    'The Rings of Power',
    'Watch Movies Online',
    'Stream TV Shows',
    'Prime Video Channels',
  ],
  icons: {
    icon: '/media/prime_official_1.png',
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
