import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Free to Me – Stream Included Titles',
  description:
    'Browse movies and TV shows included with your Prime membership at no additional cost. Watch unlimited entertainment instantly on Prime Video.',
  alternates: {
    canonical: '/free-to-me',
  },
  openGraph: {
    title: 'Free to Me – Stream Included Titles',
    description:
      'Browse movies and TV shows included with your Prime membership at no additional cost. Watch unlimited entertainment instantly on Prime Video.',
    url: '/free-to-me',
  },
};

export default function FreeToMePage() {
  return <PrimeMainView initialTab="Free to me" />;
}
