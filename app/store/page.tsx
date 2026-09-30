import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Prime Video Store – Rent or Buy Movies & TV',
  description:
    'Rent or buy movies and TV shows from the Prime Video Store. Stream your purchased titles anytime on supported devices. Browse the store today.',
  alternates: {
    canonical: '/store',
  },
  openGraph: {
    title: 'Prime Video Store – Rent or Buy Movies & TV',
    description:
      'Rent or buy movies and TV shows from the Prime Video Store. Stream your purchased titles anytime on supported devices. Browse the store today.',
    url: '/store',
  },
};

export default function StorePage() {
  return <PrimeMainView initialTab="Store" />;
}
