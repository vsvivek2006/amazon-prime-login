import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle, ArrowLeft, Tv2 } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { PostTable } from '@/components/admin/PostTable';
import { LogoutButton } from '@/components/admin/LogoutButton';

export const metadata: Metadata = {
  title: 'Blog Admin — Prime Video',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function AdminBlogPage() {
  let posts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    author: string | null;
    tags: string[] | null;
    published_at: string | null;
    created_at: string;
  }> = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, status, author, tags, published_at, created_at')
      .order('created_at', { ascending: false });
    posts = (data || []) as typeof posts;
  } catch (err) {
    console.error('Admin blog fetch error:', err);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#00050d', padding: '0 0 80px' }}>
      {/* Top Nav */}
      <header style={{
        background: 'rgba(0,5,13,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Tv2 size={20} color="#00a8e1" />
              <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>Prime Video</span>
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>/</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Blog Admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/blog"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '7px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                fontSize: '12px', fontWeight: 600,
              }}
            >
              <ArrowLeft size={12} /> View Blog
            </Link>
            <Link
              href="/admin/blog/new"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 16px', borderRadius: '7px',
                background: '#00a8e1', color: '#fff', textDecoration: 'none',
                fontSize: '12px', fontWeight: 700,
              }}
            >
              <PlusCircle size={12} /> New Article
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Blog Posts
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            {posts.length} article{posts.length !== 1 ? 's' : ''} total · Manage, draft, and publish Prime Video editorial content
          </p>
        </div>

        <PostTable initialPosts={posts} />
      </div>
    </main>
  );
}
