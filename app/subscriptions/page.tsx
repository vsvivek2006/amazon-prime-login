import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Prime Video Subscriptions – Add Channels & Plans',
  description:
    'Add premium channels and subscriptions to your Prime Video account. Stream content from your favorite networks on demand. Explore your options now.',
  alternates: {
    canonical: '/subscriptions',
  },
  openGraph: {
    title: 'Prime Video Subscriptions – Add Channels & Plans',
    description:
      'Add premium channels and subscriptions to your Prime Video account. Stream content from your favorite networks on demand. Explore your options now.',
    url: '/subscriptions',
  },
};

export default function SubscriptionsPage() {
  return <PrimeMainView initialTab="Subscriptions" />;
}
