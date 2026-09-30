import type { Metadata } from 'next';
import PrimeMainView from '@/components/PrimeMainView';

export const metadata: Metadata = {
  title: 'Live News – Watch Breaking News & Coverage | Prime Video',
  description:
    'Stream live news networks and breaking coverage on Prime Video. Stay updated with national and global reports 24/7 on your connected devices.',
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'Live News – Watch Breaking News & Coverage | Prime Video',
    description:
      'Stream live news networks and breaking coverage on Prime Video. Stay updated with national and global reports 24/7 on your connected devices.',
    url: '/news',
  },
};

export default function NewsPage() {
  return <PrimeMainView initialTab="News" />;
}
