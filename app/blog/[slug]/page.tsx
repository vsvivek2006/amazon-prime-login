import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  content: string;
  author: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('posts')
      .select('title, meta_description, slug')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (!data) return { title: 'Article Not Found' };
    return {
      title: data.title,
      description: data.meta_description || undefined,
      alternates: { canonical: `/blog/${data.slug}` },
    };
  } catch {
    return { title: 'Article' };
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: Post | null = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, meta_description, content, author, tags, published_at, created_at')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    post = data as Post | null;
  } catch (err) {
    console.error('Blog detail fetch error:', err);
  }

  if (!post) return notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.title,
    author: {
      '@type': 'Person',
      name: post.author || 'Prime Video Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Amazon Prime Video',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.primevideo.com/media/prime-video-logo.png',
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.published_at || post.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.primevideo.com/blog/${post.slug}`,
    },
  };

  return (
    <main style={{ background: '#00050d', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero */}
      <header style={{
        background: 'linear-gradient(180deg, #0d1f3c 0%, #00050d 100%)',
        padding: '60px 24px 48px',
        borderBottom: '1px solid rgba(0,168,225,0.1)',
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#00a8e1', textDecoration: 'none',
              fontSize: '13px', fontWeight: 600,
              marginBottom: '32px',
            }}
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
                  padding: '3px 10px', borderRadius: '4px',
                  background: 'rgba(0,168,225,0.12)',
                  color: '#00a8e1',
                  border: '1px solid rgba(0,168,225,0.2)',
                }}>
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
            fontWeight: 800, color: '#fff',
            lineHeight: 1.25, marginBottom: '20px',
          }}>
            {post.title}
          </h1>

          {post.meta_description && (
            <p style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7, marginBottom: '24px',
            }}>
              {post.meta_description}
            </p>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            fontSize: '12px', color: 'rgba(255,255,255,0.35)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={12} />
              {post.author || 'Prime Video Editorial'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={12} />
              {formatDate(post.published_at || post.created_at)}
            </span>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div
          className="prime-blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back link */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '8px',
              background: 'rgba(0,168,225,0.1)',
              border: '1px solid rgba(0,168,225,0.25)',
              color: '#00a8e1', textDecoration: 'none',
              fontSize: '13px', fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> More Articles
          </Link>
        </div>
      </article>
    </main>
  );
}
