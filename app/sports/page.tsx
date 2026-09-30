import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Prime Video Sports – Live Events & More',
  description:
    'Watch live sports and select sporting events on Prime Video. Stream matches and coverage on demand across supported devices. Check current sports programming.',
  alternates: {
    canonical: '/sports',
  },
  openGraph: {
    title: 'Prime Video Sports – Live Events & More',
    description:
      'Watch live sports and select sporting events on Prime Video. Stream matches and coverage on demand across supported devices. Check current sports programming.',
    url: '/sports',
  },
};

export default function SportsPage() {
  return <PrimeMainView initialTab="Sports" />;
}
