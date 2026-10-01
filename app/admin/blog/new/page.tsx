import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Tv2 } from 'lucide-react';
import { PostEditor } from '@/components/admin/PostEditor';
import { LogoutButton } from '@/components/admin/LogoutButton';

export const metadata: Metadata = {
  title: 'New Article — Prime Video Blog Admin',
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
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
            <Tv2 size={20} color="#00a8e1" />
            <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>Prime Video</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>/</span>
            <Link href="/admin/blog" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textDecoration: 'none' }}>
              Blog Admin
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>/</span>
            <span style={{ fontSize: '13px', color: '#00a8e1', fontWeight: 600 }}>New Article</span>
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
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Create New Article
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Use the AI generator to create a full draft, or write manually. Then save as draft or publish live.
          </p>
        </div>

        <PostEditor />
      </div>
    </main>
  );
}
