import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Prime Video TV Shows – Stream Series & Originals',
  description:
    'Binge TV series and Amazon Originals on Prime Video. Stream full seasons on demand anytime. Browse Prime Video Movies and TV Shows to start watching.',
  alternates: {
    canonical: '/tv-shows',
  },
  openGraph: {
    title: 'Prime Video TV Shows – Stream Series & Originals',
    description:
      'Binge TV series and Amazon Originals on Prime Video. Stream full seasons on demand anytime. Browse Prime Video Movies and TV Shows to start watching.',
    url: '/tv-shows',
  },
};

export default function TvShowsPage() {
  return <PrimeMainView initialTab="TV shows" />;
}
