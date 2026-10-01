import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.primevideo.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Prime Video – Stream Movies, TV Shows & Amazon Originals',
    template: '%s | Prime Video',
  },
  description:
    'Stream blockbuster movies, hit TV shows, and Amazon Originals like The Boys and Reacher with a Prime Video membership. Enjoy 4K UHD and start watching today.',
  keywords: [
    'Prime Video',
    'Amazon Originals',
    'The Boys',
    'Reacher',
    'Fallout',
    'The Rings of Power',
    'Stream Movies',
    'Watch TV Shows',
    'Live Sports',
    'Live TV Channels',
    'Prime Video Subscriptions',
  ],
  authors: [{ name: 'Amazon Prime Video' }],
  creator: 'Amazon',
  publisher: 'Amazon.com, Inc.',
  applicationName: 'Prime Video',
  category: 'entertainment',
  classification: 'Movies & TV Streaming Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/assets/prime-video-logo.svg', type: 'image/svg+xml' },
      { url: '/media/prime-video-logo.png', type: 'image/png' },
    ],
    apple: '/media/prime-video-logo.png',
  },
  openGraph: {
    title: 'Prime Video – Stream Movies, TV Shows & Amazon Originals',
    description:
      'Stream blockbuster movies, hit TV shows, and Amazon Originals like The Boys and Reacher with a Prime Video membership. Enjoy 4K UHD and start watching today.',
    url: baseUrl,
    siteName: 'Prime Video',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/media/amazon-fullpage.png',
        secureUrl: `${baseUrl}/media/amazon-fullpage.png`,
        width: 1200,
        height: 630,
        alt: 'Prime Video – Watch Movies, TV Shows & Originals',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Video – Stream Movies, TV Shows & Amazon Originals',
    description:
      'Stream blockbuster movies, hit TV shows, and Amazon Originals like The Boys and Reacher with a Prime Video membership.',
    images: [
      {
        url: '/media/amazon-fullpage.png',
        alt: 'Prime Video – Watch Movies, TV Shows & Originals',
      },
    ],
    site: '@PrimeVideo',
    creator: '@PrimeVideo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#00050d',
};

// Rich Structured Data (JSON-LD)
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Prime Video',
  url: baseUrl,
  description:
    'Stream blockbuster movies, hit TV shows, and Amazon Originals with a Prime Video membership.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Amazon Prime Video',
  url: baseUrl,
  logo: `${baseUrl}/media/prime-video-logo.png`,
  sameAs: [
    'https://twitter.com/PrimeVideo',
    'https://www.facebook.com/PrimeVideo',
    'https://www.instagram.com/primevideo',
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Movies',
      item: `${baseUrl}/movies`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'TV Shows',
      item: `${baseUrl}/tv-shows`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Free to Me',
      item: `${baseUrl}/free-to-me`,
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Live Sports',
      item: `${baseUrl}/sports`,
    },
  ],
};

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Featured Prime Video Originals',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'The Boys',
      description: 'An irreverent take on what happens when superheroes abuse their superpowers.',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Reacher',
      description: 'Veteran military police investigator Jack Reacher is framed for a murder he did not commit.',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Fallout',
      description: 'In a future post-apocalyptic Los Angeles, citizens must live in underground bunkers to protect themselves from radiation.',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'The Lord of the Rings: The Rings of Power',
      description: 'Epic drama set thousands of years before the events of J.R.R. Tolkien’s The Hobbit and The Lord of the Rings.',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Performance preconnects for ultra-fast CDN asset delivery (<0.10s initial feel) */}
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
        <link rel="preconnect" href="https://images-na.ssl-images-amazon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images-na.ssl-images-amazon.com" />
        <link
          rel="preload"
          as="image"
          href="/media/hero-love-hypothesis.jpg"
          fetchPriority="high"
        />

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
        />
      </head>
      <body>
        <Toaster
          richColors
          position="top-right"
          theme="dark"
          closeButton
        />
        {children}
      </body>
    </html>
  );
}
