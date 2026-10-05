import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.primevideo.com';
  const currentDate = new Date();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/movies', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/tv-shows', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/free-to-me', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/sports', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/news', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/live-tv', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/subscriptions', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/store', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
