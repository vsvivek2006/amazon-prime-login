import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Prime Video Live TV – Stream Channels in Real Time',
  description:
    'Watch live TV on Prime Video. Stream news, entertainment, and more in real time. Explore available live channels and schedules today.',
  alternates: {
    canonical: '/live-tv',
  },
  openGraph: {
    title: 'Prime Video Live TV – Stream Channels in Real Time',
    description:
      'Watch live TV on Prime Video. Stream news, entertainment, and more in real time. Explore available live channels and schedules today.',
    url: '/live-tv',
  },
};

export default function LiveTvPage() {
  return <PrimeMainView initialTab="Live TV" />;
}
