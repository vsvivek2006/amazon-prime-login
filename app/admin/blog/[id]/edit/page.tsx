import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tv2 } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { PostEditor } from '@/components/admin/PostEditor';
import { LogoutButton } from '@/components/admin/LogoutButton';

export const metadata: Metadata = {
  title: 'Edit Article — Prime Video Blog Admin',
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let post = null;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    post = data;
  } catch (err) {
    console.error('Edit page fetch error:', err);
  }

  if (!post) return notFound();

  return (
    <main style={{ minHeight: '100vh', background: '#00050d', padding: '0 0 80px' }}>
      <header style={{
        background: 'rgba(0,5,13,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Tv2 size={20} color="#00a8e1" />
            <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>Prime Video</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>/</span>
            <Link href="/admin/blog" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textDecoration: 'none' }}>Blog Admin</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>/</span>
            <span style={{ fontSize: '13px', color: '#00a8e1', fontWeight: 600 }}>Edit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/admin/blog"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '7px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                fontSize: '12px', fontWeight: 600,
              }}
            >
              <ArrowLeft size={12} /> Back to Posts
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Edit Article</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Editing: {post.title}</p>
        </div>
        <PostEditor initialPost={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          meta_description: post.meta_description || '',
          content: post.content,
          author: post.author || 'Prime Video Editorial',
          tags: post.tags || [],
          status: post.status,
        }} />
      </div>
    </main>
  );
}
