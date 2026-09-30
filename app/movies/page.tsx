import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Prime Video Movies – Stream Films On Demand',
  description:
    'Watch movies on Prime Video. Stream included films, rent or buy new releases and classics on demand. Explore the full movie library now.',
  alternates: {
    canonical: '/movies',
  },
  openGraph: {
    title: 'Prime Video Movies – Stream Films On Demand',
    description:
      'Watch movies on Prime Video. Stream included films, rent or buy new releases and classics on demand. Explore the full movie library now.',
    url: '/movies',
  },
};

export default function MoviesPage() {
  return <PrimeMainView initialTab="Movies" />;
}
