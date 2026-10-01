'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Send, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { AIGeneratorPanel } from './AIGeneratorPanel';
import slugify from 'slugify';
import { TiptapEditor } from './TiptapEditor';

interface Post {
  id?: string;
  title: string;
  slug: string;
  meta_description: string;
  content: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
}

interface PostEditorProps {
  initialPost?: Post;
}


export function PostEditor({ initialPost }: PostEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialPost?.id);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.meta_description || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [author, setAuthor] = useState(initialPost?.author || 'Prime Video Editorial');
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status || 'draft');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isSlugCustomized && title) {
      setSlug(slugify(title, { lower: true, strict: true }).slice(0, 80));
    }
  }, [title, isSlugCustomized]);

  const handleGenerated = useCallback((data: {
    title: string;
    metaDescription: string;
    content: string;
    suggestedTags: string[];
  }) => {
    setTitle(data.title);
    setMetaDescription(data.metaDescription);
    setContent(data.content);
    if (data.suggestedTags?.length) setTags(data.suggestedTags.slice(0, 6));
    setIsSlugCustomized(false); // re-sync slug to new title
  }, []);

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, '');
      if (val && !tags.includes(val) && tags.length < 8) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSave(saveStatus: 'draft' | 'published') {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setSaveError('Title, slug, and content are required.');
      return;
    }
    setSaveError(null);
    setIsSaving(true);

    try {
      const payload = { title, slug, meta_description: metaDescription, content, author, tags, status: saveStatus };
      const url = isEditing ? `/api/blog/${initialPost!.id}` : '/api/blog';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      setStatus(saveStatus);
      router.push('/admin/blog');
      router.refresh();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* AI Generator */}
      <div style={{ marginBottom: '24px' }}>
        <AIGeneratorPanel onGenerated={handleGenerated} disabled={isSaving} />
      </div>

      <div className="post-editor-grid">
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '18px', fontWeight: 700, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Slug */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                URL Slug <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSlugCustomized(!isSlugCustomized)}
                style={{ fontSize: '11px', color: '#00a8e1', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isSlugCustomized ? '🔒 Custom slug' : '🔓 Auto-generating'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', borderRight: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>
                /blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setIsSlugCustomized(true); setSlug(e.target.value); }}
                style={{
                  flex: 1, padding: '10px 12px',
                  background: 'transparent', border: 'none',
                  color: '#ff9900', fontSize: '13px', fontFamily: 'monospace', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Content (HTML) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#00a8e1', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPreview ? <><EyeOff size={12} /> Hide Preview</> : <><Eye size={12} /> Preview</>}
              </button>
            </div>

            {showPreview ? (
              <div
                className="prime-blog-content"
                dangerouslySetInnerHTML={{ __html: content || '<p style="color:rgba(255,255,255,0.3);font-style:italic">No content yet...</p>' }}
                style={{
                  minHeight: '400px', padding: '20px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            ) : (
              <TiptapEditor content={content} onChange={setContent} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>

          {/* Publish Actions */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Publish
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '10px', borderRadius: '8px', width: '100%',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={isSaving}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '10px', borderRadius: '8px', width: '100%',
                  background: 'linear-gradient(135deg, #00a8e1, #0066cc)',
                  border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={13} />}
                Publish Live
              </button>
            </div>
            {saveError && (
              <p style={{ marginTop: '8px', fontSize: '11px', color: '#fca5a5' }}>{saveError}</p>
            )}
          </div>

          {/* Meta Description */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Meta Description
              </h3>
              <span style={{
                fontSize: '10px', fontFamily: 'monospace', fontWeight: 700,
                color: metaDescription.length >= 120 && metaDescription.length <= 160 ? '#00c853'
                  : metaDescription.length > 160 ? '#ef4444' : 'rgba(255,255,255,0.35)',
              }}>
                {metaDescription.length}/160
              </span>
            </div>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO summary for search engines (120-160 chars)..."
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '12px', outline: 'none', resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Tags */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Tags
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '3px 8px', borderRadius: '4px',
                  background: 'rgba(0,168,225,0.12)', border: '1px solid rgba(0,168,225,0.2)',
                  fontSize: '11px', color: '#00a8e1',
                }}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,168,225,0.5)', padding: 0 }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tag, press Enter..."
              style={{
                width: '100%', padding: '8px 10px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '12px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Author */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Author
            </h3>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Prime Video Editorial"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .post-editor-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .post-editor-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
