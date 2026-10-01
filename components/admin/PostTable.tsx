'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Eye, Loader2, CheckCircle, Clock, FileText } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
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

export function PostTable({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setPosts(posts.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleStatus(post: Post) {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    setTogglingId(post.id);
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      setPosts(posts.map((p) => p.id === post.id ? { ...p, status: newStatus } : p));
      router.refresh();
    } catch (err) {
      alert('Failed to update status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setTogglingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 24px',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', background: 'rgba(255,255,255,0.02)',
      }}>
        <FileText size={48} color="rgba(0,168,225,0.3)" style={{ margin: '0 auto 16px' }} />
        <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No articles yet</p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>
          Create your first blog post using the AI generator.
        </p>
        <Link
          href="/admin/blog/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 24px', borderRadius: '8px',
            background: '#00a8e1', color: '#fff',
            fontWeight: 700, fontSize: '13px', textDecoration: 'none',
          }}
        >
          + Create First Article
        </Link>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['Title', 'Status', 'Author', 'Date', 'Actions'].map((h) => (
              <th key={h} style={{
                padding: '12px 16px', textAlign: 'left',
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((post, idx) => (
            <tr
              key={post.id}
              style={{
                borderBottom: idx < posts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ padding: '14px 16px', maxWidth: '340px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                  /blog/{post.slug}
                </div>
              </td>

              <td style={{ padding: '14px 16px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(post)}
                  disabled={togglingId === post.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '11px', fontWeight: 700, border: 'none',
                    background: post.status === 'published' ? 'rgba(0,200,83,0.12)' : 'rgba(255,255,255,0.07)',
                    color: post.status === 'published' ? '#00c853' : 'rgba(255,255,255,0.45)',
                    outline: post.status === 'published' ? '1px solid rgba(0,200,83,0.25)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {togglingId === post.id ? (
                    <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : post.status === 'published' ? (
                    <CheckCircle size={10} />
                  ) : (
                    <Clock size={10} />
                  )}
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </button>
              </td>

              <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                {post.author || 'Prime Video Editorial'}
              </td>

              <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                {formatDate(post.published_at || post.created_at)}
              </td>

              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {post.status === 'published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '30px', height: '30px', borderRadius: '6px',
                        background: 'rgba(0,168,225,0.1)', border: '1px solid rgba(0,168,225,0.2)',
                        color: '#00a8e1',
                      }}
                      title="View live"
                    >
                      <Eye size={13} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '30px', height: '30px', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '30px', height: '30px', borderRadius: '6px',
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                      color: '#ef4444', cursor: 'pointer',
                    }}
                    title="Delete"
                  >
                    {deletingId === post.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
