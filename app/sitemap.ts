import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // In a real application, you would dynamically generate this based on your database or CMS
  return [
    {
      url: 'https://www.yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.yourdomain.com/movies',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.yourdomain.com/tv-shows',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ];
}
