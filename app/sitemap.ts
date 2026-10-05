import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.primevideo.com';
  const currentDate = new Date();

  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/login', priority: 1.0, changeFrequency: 'daily' as const },
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

  const sitemapItems: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const supabase = createServerClient();
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (posts && Array.isArray(posts)) {
      posts.forEach((post) => {
        if (post.slug) {
          sitemapItems.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updated_at ? new Date(post.updated_at) : currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch {
    // If Supabase is not configured or query fails, static routes are preserved
  }

  return sitemapItems;
}
