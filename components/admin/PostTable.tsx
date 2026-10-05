'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Edit2,
  Trash2,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  FileText,
  Search,
  X,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from './ConfirmDialog';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  author: string | null;
  tags: string[] | null;
  cover_image_url?: string | null;
  published_at: string | null;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function PostTable({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ConfirmDialog State
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Dynamic counts for status pills
  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === 'published').length,
      draft: posts.filter((p) => p.status === 'draft').length,
    }),
    [posts]
  );

  // Filtered posts based on search query and status tab
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        (post.author && post.author.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'all' ? true : post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  // Handle Delete Confirmation
  async function handleConfirmDelete() {
    const { id, title } = confirmDelete;
    if (!id) return;

    setDeletingId(id);
    const toastId = toast.loading(`Deleting "${title}"...`);

    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${title}" deleted successfully`, { id: toastId });
      setConfirmDelete({ isOpen: false, id: '', title: '' });
      router.refresh();
    } catch (err) {
      toast.error('Failed to delete: ' + (err instanceof Error ? err.message : 'Unknown error'), { id: toastId });
    } finally {
      setDeletingId(null);
    }
  }

  // Handle Status Toggle (Draft <-> Published)
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p)));
      toast.success(`Article marked as ${newStatus}`);
      router.refresh();
    } catch (err) {
      toast.error('Failed to update status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setTogglingId(null);
    }
  }

  // Zero posts state
  if (posts.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 24px',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <FileText size={48} color="rgba(0,168,225,0.3)" style={{ margin: '0 auto 16px' }} />
        <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          No articles created yet
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>
          Create your first blog post using the AI strategist or manual editor.
        </p>
        <Link
          href="/admin/blog/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 24px',
            borderRadius: '8px',
            background: '#00a8e1',
            color: '#fff',
            fontWeight: 700,
            fontSize: '13px',
            textDecoration: 'none',
          }}
        >
          + Create First Article
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Reusable Custom Modal Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Delete Blog Post?"
        description={`Are you sure you want to permanently delete "${confirmDelete.title}"? This will remove the article from the website and database.`}
        confirmLabel="Delete Post"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={deletingId === confirmDelete.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', title: '' })}
      />

      {/* Search & Filter Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
          <Search
            size={14}
            color="rgba(255,255,255,0.4)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, slug, or author..."
            style={{
              width: '100%',
              padding: '8px 32px 8px 34px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {(
            [
              { key: 'all', label: 'All', count: counts.all },
              { key: 'published', label: 'Published', count: counts.published },
              { key: 'draft', label: 'Drafts', count: counts.draft },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: statusFilter === tab.key ? '#00a8e1' : 'transparent',
                color: statusFilter === tab.key ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  background:
                    statusFilter === tab.key
                      ? 'rgba(0, 0, 0, 0.3)'
                      : 'rgba(255, 255, 255, 0.08)',
                  color: statusFilter === tab.key ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* If search/filter returns 0 results */}
      {filteredPosts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <Search size={32} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
            No matching articles found
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '16px' }}>
            Try adjusting your search query or switching the status filter.
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (≥768px) */}
          <div className="admin-posts-desktop-table" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Title', 'Status', 'Author', 'Date', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: 'rgba(255,255,255,0.35)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, idx) => (
                  <tr
                    key={post.id}
                    style={{
                      borderBottom: idx < filteredPosts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
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
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 700,
                          border: 'none',
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
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '30px',
                              height: '30px',
                              borderRadius: '6px',
                              background: 'rgba(0,168,225,0.1)',
                              border: '1px solid rgba(0,168,225,0.2)',
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                          }}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete({ isOpen: true, id: post.id, title: post.title })}
                          disabled={deletingId === post.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.15)',
                            color: '#ef4444',
                            cursor: 'pointer',
                          }}
                          title="Delete"
                        >
                          {deletingId === post.id ? (
                            <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (<768px) */}
          <div className="admin-posts-mobile-cards">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#00a8e1', fontFamily: 'monospace' }}>
                      /blog/{post.slug}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(post)}
                    disabled={togglingId === post.id}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      border: 'none',
                      background: post.status === 'published' ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.08)',
                      color: post.status === 'published' ? '#00c853' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                    }}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  <span>{post.author || 'Prime Video Editorial'}</span>
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  {post.status === 'published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '6px',
                        borderRadius: '6px',
                        background: 'rgba(0,168,225,0.1)',
                        color: '#00a8e1',
                        fontSize: '11px',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={12} /> View
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '6px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <Edit2 size={12} /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete({ isOpen: true, id: post.id, title: post.title })}
                    disabled={deletingId === post.id}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '6px',
                      borderRadius: '6px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-posts-mobile-cards {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-posts-desktop-table {
            display: none;
          }
          .admin-posts-mobile-cards {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
