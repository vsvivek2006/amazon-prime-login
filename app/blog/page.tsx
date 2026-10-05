import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Tv2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Streaming Insights & Entertainment',
  description: 'Explore expert articles on streaming, Amazon Originals, must-watch shows, movies, and everything Prime Video. Updated regularly by our editorial team.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 60;

const POSTS_PER_PAGE = 9;

interface Post {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  author: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1);
  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let postList: Post[] = [];
  let totalCount = 0;

  try {
    const supabase = createServerClient();
    const { data, count, error } = await supabase
      .from('posts')
      .select('id, title, slug, meta_description, author, tags, published_at, created_at', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(from, to);

    if (!error) {
      postList = (data || []) as Post[];
      totalCount = count || 0;
    }
  } catch (err) {
    console.error('Blog page fetch error:', err);
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE) || 1;

  return (
    <main className="min-h-screen" style={{ background: '#00050d' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #00050d 0%, #0d1f3c 50%, #002147 100%)',
          padding: '80px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '20%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,168,225,0.12) 0%, transparent 70%)',
          borderRadius: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', right: '20%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(255,153,0,0.08) 0%, transparent 70%)',
          borderRadius: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 16px', borderRadius: '999px',
            border: '1px solid rgba(0,168,225,0.3)',
            background: 'rgba(0,168,225,0.08)',
            marginBottom: '20px',
          }}>
            <Tv2 size={14} color="#00a8e1" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#00a8e1', letterSpacing: '0.05em' }}>
              PRIME VIDEO EDITORIAL
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}>
            Stream Smarter with{' '}
            <span style={{ color: '#00a8e1' }}>Prime Video</span>{' '}
            Insights
          </h1>
          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.65)',
            maxWidth: '600px', margin: '0 auto', lineHeight: 1.7,
          }}>
            Expert picks, deep dives into Amazon Originals, streaming guides, and everything you need to watch next.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        {postList.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            border: '1px solid rgba(0,168,225,0.15)',
            borderRadius: '16px',
            background: 'rgba(0,168,225,0.04)',
          }}>
            <Tv2 size={48} color="rgba(0,168,225,0.4)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              No articles published yet
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              Check back soon — our editorial team is working on great content.
            </p>
            <Link
              href="/admin/blog"
              style={{
                display: 'inline-block', marginTop: '24px',
                padding: '10px 24px', borderRadius: '8px',
                background: '#00a8e1', color: '#fff',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none',
              }}
            >
              Write First Article →
            </Link>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '24px',
            }}>
              {postList.map((post) => (
                <article
                  key={post.id}
                  className="pv-blog-card"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                >
                  {/* Color accent bar */}
                  <div style={{
                    height: '3px',
                    background: 'linear-gradient(90deg, #00a8e1, #ff9900)',
                  }} />

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} style={{
                            fontSize: '11px', fontWeight: 600,
                            padding: '2px 8px', borderRadius: '4px',
                            background: 'rgba(0,168,225,0.12)',
                            color: '#00a8e1',
                            border: '1px solid rgba(0,168,225,0.2)',
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 style={{
                      fontSize: '18px', fontWeight: 700, color: '#fff',
                      lineHeight: 1.4, marginBottom: '10px', flex: 1,
                    }}>
                      <Link
                        href={`/blog/${post.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {post.meta_description && (
                      <p style={{
                        fontSize: '13px', color: 'rgba(255,255,255,0.5)',
                        lineHeight: 1.6, marginBottom: '20px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {post.meta_description}
                      </p>
                    )}

                    {/* Footer */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={11} />
                          {post.author || 'Prime Video Editorial'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} />
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '12px', fontWeight: 600,
                          color: '#00a8e1', textDecoration: 'none',
                        }}
                      >
                        Read <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '16px',
                marginTop: '48px',
              }}>
                {currentPage > 1 ? (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '8px',
                      border: '1px solid rgba(0,168,225,0.3)',
                      color: '#00a8e1', textDecoration: 'none',
                      fontSize: '13px', fontWeight: 600,
                    }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </Link>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)', fontSize: '13px', fontWeight: 600, cursor: 'not-allowed' }}>
                    <ChevronLeft size={14} /> Previous
                  </span>
                )}

                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  Page <strong style={{ color: '#fff' }}>{currentPage}</strong> of <strong style={{ color: '#fff' }}>{totalPages}</strong>
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '8px',
                      border: '1px solid rgba(0,168,225,0.3)',
                      color: '#00a8e1', textDecoration: 'none',
                      fontSize: '13px', fontWeight: 600,
                    }}
                  >
                    Next <ChevronRight size={14} />
                  </Link>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)', fontSize: '13px', fontWeight: 600, cursor: 'not-allowed' }}>
                    Next <ChevronRight size={14} />
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
