import type { Metadata } from 'next';
import PrimeLoginClient from '@/components/PrimeLoginClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.primevideo.com';

export const metadata: Metadata = {
  title: {
    absolute: 'Prime Video Login – Sign In to Amazon Prime Video',
  },
  description:
    'Sign in to your Amazon Prime Video account to stream movies, TV series, Amazon Originals, and live sports. Use your Amazon sign-in details to start watching.',
  keywords: [
    'Prime Video Login',
    'Amazon Prime sign in',
    'Prime Video account',
    'stream Prime Video',
    'Amazon login',
    'primevideo com mytv',
    'Prime Video sign in on TV',
  ],
  alternates: {
    canonical: `${baseUrl}/login`,
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
  openGraph: {
    title: 'Prime Video Login – Sign In to Amazon Prime Video',
    description:
      'Sign in to your Amazon Prime Video account to stream movies, TV series, Amazon Originals, and live sports. Use your Amazon sign-in details to start watching.',
    url: `${baseUrl}/login`,
    siteName: 'Prime Video',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Video Login – Sign In to Amazon Prime Video',
    description:
      'Sign in to your Amazon Prime Video account to stream movies, TV series, Amazon Originals, and live sports.',
  },
};

export default function LoginPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/login`,
        url: `${baseUrl}/login`,
        name: 'Prime Video Login – Sign In to Amazon Prime Video',
        description:
          'Sign in to your Amazon Prime Video account to stream movies, TV series, Amazon Originals, and live sports.',
        potentialAction: {
          '@type': 'AuthorizeAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/login`,
            actionPlatform: [
              'http://schema.org/DesktopWebPlatform',
              'http://schema.org/MobileWebPlatform',
            ],
          },
          name: 'Sign In to Prime Video',
        },
      },
      {
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
            name: 'Sign In',
            item: `${baseUrl}/login`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I sign in to Prime Video?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Enter your registered Amazon account email address and select Continue, then enter your password to sign in. Once signed in, you get immediate access to movies, TV series, Amazon Originals, and live sports.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need a separate login for Prime Video?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Prime Video uses the exact same account credentials as your Amazon account. If you already have an Amazon Prime membership or a standalone Prime Video subscription, sign in using the same email and password.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I sign in to Prime Video on a Smart TV or streaming device?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Open the Prime Video app on your TV, select Sign In, and note the activation code. On your phone or computer, go to primevideo.com/mytv, sign in with your Amazon account, and enter the code to activate your device.',
            },
          },
          {
            '@type': 'Question',
            name: 'What should I do if I cannot sign in or forgot my password?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Select the Forgot password? link above the password input to reset your password via email OTP, or select Get an OTP on your phone to sign in with a one-time verification code.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I sign in to Prime Video on multiple devices at once?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can stream up to three videos simultaneously using the same Amazon account, and you can stream the same title on up to two devices at a time.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrimeLoginClient />
    </>
  );
}
