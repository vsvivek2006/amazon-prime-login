'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Send,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Unlock,
  Info,
  PenTool,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import slugify from 'slugify';
import { AIGeneratorPanel } from './AIGeneratorPanel';
import { TiptapEditor } from './TiptapEditor';
import { ImageUpload } from './ImageUpload';
import { TagInput } from './TagInput';
import { ConfirmDialog } from './ConfirmDialog';

interface Post {
  id?: string;
  title: string;
  slug: string;
  meta_description: string;
  content: string;
  cover_image_url?: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
  updated_at?: string;
}

interface PostEditorProps {
  initialPost?: Post;
}

function getDraftKey(postId?: string) {
  return postId ? `prime_post_draft_${postId}` : 'prime_post_draft_new';
}

export function PostEditor({ initialPost }: PostEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialPost?.id);
  const draftKey = getDraftKey(initialPost?.id);

  // Form State
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.meta_description || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url || '');
  const [author, setAuthor] = useState(initialPost?.author || 'Prime Video Editorial');
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status || 'draft');

  // UI state
  const [editorMode, setEditorMode] = useState<'manual' | 'ai'>('manual');
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialPost?.slug));
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initial snapshot to compare for dirty state
  const initialSnapshot = useRef({
    title: initialPost?.title || '',
    slug: initialPost?.slug || '',
    metaDescription: initialPost?.meta_description || '',
    content: initialPost?.content || '',
    coverImageUrl: initialPost?.cover_image_url || '',
    author: initialPost?.author || 'Prime Video Editorial',
    tags: JSON.stringify(initialPost?.tags || []),
  });

  // Track dirty changes
  useEffect(() => {
    const isChanged =
      title !== initialSnapshot.current.title ||
      slug !== initialSnapshot.current.slug ||
      metaDescription !== initialSnapshot.current.metaDescription ||
      content !== initialSnapshot.current.content ||
      coverImageUrl !== initialSnapshot.current.coverImageUrl ||
      author !== initialSnapshot.current.author ||
      JSON.stringify(tags) !== initialSnapshot.current.tags;
    setIsDirty(isChanged);
  }, [title, slug, metaDescription, content, coverImageUrl, author, tags]);

  // Window beforeunload prompt if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSaving && !isDeleting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSaving, isDeleting]);

  // Autosave to localStorage (debounced 1.5s)
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            savedAt: new Date().toISOString(),
            title,
            slug,
            metaDescription,
            content,
            coverImageUrl,
            author,
            tags,
          })
        );
      } catch {
        // quota exceeded / storage disabled
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isDirty, draftKey, title, slug, metaDescription, content, coverImageUrl, author, tags]);

  // Draft recovery check on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft.title && !draft.content) return;

      const draftDate = new Date(draft.savedAt);
      const dbDate = initialPost?.updated_at ? new Date(initialPost.updated_at) : null;

      if (!dbDate || draftDate > dbDate) {
        setShowDraftBanner(true);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // ignore parsing error
    }
  }, [draftKey, initialPost?.updated_at]);

  // Auto-slug from title if not customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(slugify(val, { lower: true, strict: true }).slice(0, 80));
    }
  };

  // Restore draft handler
  const handleRestoreDraft = () => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.title !== undefined) setTitle(draft.title);
      if (draft.slug !== undefined) setSlug(draft.slug);
      if (draft.metaDescription !== undefined) setMetaDescription(draft.metaDescription);
      if (draft.content !== undefined) setContent(draft.content);
      if (draft.coverImageUrl !== undefined) setCoverImageUrl(draft.coverImageUrl);
      if (draft.author !== undefined) setAuthor(draft.author);
      if (Array.isArray(draft.tags)) setTags(draft.tags);
      toast.success('Local draft restored into editor!');
    } catch {
      toast.error('Could not restore draft.');
    } finally {
      setShowDraftBanner(false);
    }
  };

  const handleDismissDraft = () => {
    localStorage.removeItem(draftKey);
    setShowDraftBanner(false);
  };

  // Callback when AI generation succeeds
  const handleAiGenerated = useCallback(
    (data: { title: string; metaDescription: string; content: string; suggestedTags: string[] }) => {
      setTitle(data.title);
      setMetaDescription(data.metaDescription);
      setContent(data.content);
      if (data.suggestedTags?.length) {
        setTags(data.suggestedTags.slice(0, 8));
      }
      const autoSlug = slugify(data.title, { lower: true, strict: true }).slice(0, 80);
      setSlug(autoSlug);
      setIsSlugCustomized(false);
      setIsDirty(true);
    },
    []
  );

  // Save handler
  async function handleSave(saveStatus: 'draft' | 'published') {
    if (isSaving || isDeleting) return;

    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error('Title, slug, and content are required.');
      return;
    }

    setIsSaving(true);
    const actionLabel = saveStatus === 'published' ? 'Publishing article live' : 'Saving draft';
    const toastId = toast.loading(`${actionLabel}...`);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        meta_description: metaDescription.trim() || null,
        content,
        cover_image_url: coverImageUrl.trim() || null,
        author: author.trim() || 'Prime Video Editorial',
        tags,
        status: saveStatus,
      };

      const url = isEditing ? `/api/blog/${initialPost!.id}` : '/api/blog';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      // Clear autosave draft on successful save
      localStorage.removeItem(draftKey);
      setStatus(saveStatus);
      setIsDirty(false);

      toast.success(
        isEditing
          ? 'Article updated successfully!'
          : saveStatus === 'published'
          ? 'Article published live!'
          : 'Article draft saved!',
        { id: toastId }
      );

      router.push('/admin/blog');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  // Delete handler
  async function handleConfirmDelete() {
    if (!initialPost?.id) return;
    setIsDeleting(true);
    const toastId = toast.loading(`Deleting "${title}"...`);

    try {
      const res = await fetch(`/api/blog/${initialPost.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      localStorage.removeItem(draftKey);
      toast.success('Article deleted permanently', { id: toastId });
      router.push('/admin/blog');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      toast.error(msg, { id: toastId });
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteOpen(false);
    }
  }

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Blog Post?"
        description={`Are you sure you want to permanently delete "${title || 'this post'}"? This cannot be undone.`}
        confirmLabel="Delete Post"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />

      {/* Draft Recovery Banner */}
      {showDraftBanner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(0, 168, 225, 0.1)',
            border: '1px solid rgba(0, 168, 225, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info size={16} color="#00a8e1" />
            <p style={{ margin: 0, fontSize: '12px', color: '#fff' }}>
              <strong>Unsaved draft recovered.</strong> You have an autosaved version stored in this browser.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleRestoreDraft}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: '#00a8e1',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Restore Draft
            </button>
            <button
              type="button"
              onClick={handleDismissDraft}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Mode Switcher for New Posts */}
      {!isEditing && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setEditorMode('manual')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '7px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: editorMode === 'manual' ? '#00a8e1' : 'transparent',
                color: editorMode === 'manual' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <PenTool size={13} /> Write Manually
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('ai')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '7px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: editorMode === 'ai' ? '#00a8e1' : 'transparent',
                color: editorMode === 'ai' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <Sparkles size={13} color={editorMode === 'ai' ? '#ff9900' : '#00a8e1'} /> AI Strategist
            </button>
          </div>

          {isDirty && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#ff9900',
                background: 'rgba(255, 153, 0, 0.1)',
                border: '1px solid rgba(255, 153, 0, 0.25)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              ● Unsaved changes
            </span>
          )}
        </div>
      )}

      {/* AI Assistant Section */}
      {editorMode === 'ai' && !isEditing && (
        <AIGeneratorPanel onGenerated={handleAiGenerated} disabled={isSaving} />
      )}

      {/* Grid Layout */}
      <div className="post-editor-grid">
        {/* Left Column: Title, Slug, Rich Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Article Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.35)' }}>
                {title.length} chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Top 10 Must-Watch Amazon Originals in 2026..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Slug */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                URL Slug <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSlugCustomized(!isSlugCustomized)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: isSlugCustomized ? '#ff9900' : '#00a8e1',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isSlugCustomized ? <><Lock size={11} /> Custom Slug (Locked)</> : <><Unlock size={11} /> Auto-Generating</>}
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.35)',
                  fontFamily: 'monospace',
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  whiteSpace: 'nowrap',
                }}
              >
                /blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsSlugCustomized(true);
                  setSlug(e.target.value);
                }}
                placeholder="top-10-amazon-originals"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#00a8e1',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Article Content <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#00a8e1',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPreview ? <><EyeOff size={12} /> Edit Content</> : <><Eye size={12} /> Live Preview</>}
              </button>
            </div>

            {showPreview ? (
              <div
                className="prime-blog-content"
                dangerouslySetInnerHTML={{
                  __html: content || '<p style="color:rgba(255,255,255,0.3);font-style:italic">No content yet...</p>',
                }}
                style={{
                  minHeight: '400px',
                  padding: '24px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e5e7eb',
                  lineHeight: 1.7,
                }}
              />
            ) : (
              <TiptapEditor content={content} onChange={setContent} />
            )}
          </div>
        </div>

        {/* Right Sidebar: Cover Image, Meta Description, Tags, Author, Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>
          {/* Actions Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  margin: 0,
                }}
              >
                Publishing
              </h3>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  background: status === 'published' ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                  color: status === 'published' ? '#00c853' : 'rgba(255, 255, 255, 0.6)',
                  border: status === 'published' ? '1px solid rgba(0, 200, 83, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {status === 'published' ? 'LIVE' : 'DRAFT'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={isSaving || isDeleting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={isSaving || isDeleting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  width: '100%',
                  background: 'linear-gradient(135deg, #00a8e1, #0066cc)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(0, 168, 225, 0.25)',
                }}
              >
                {isSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={13} />}
                Publish Live
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  disabled={isSaving || isDeleting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '8px',
                    width: '100%',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  <Trash2 size={13} /> Delete Article
                </button>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px',
                marginTop: 0,
              }}
            >
              Cover Image
            </h3>
            <ImageUpload
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              disabled={isSaving || isDeleting}
            />
          </div>

          {/* Meta Description */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  margin: 0,
                }}
              >
                SEO Description
              </h3>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color:
                    metaDescription.length >= 120 && metaDescription.length <= 160
                      ? '#00c853'
                      : metaDescription.length > 160
                      ? '#ef4444'
                      : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {metaDescription.length}/160
              </span>
            </div>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO summary for search engines (120-160 characters recommended)..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Tags */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px',
                marginTop: 0,
              }}
            >
              Tags &amp; Categories
            </h3>
            <TagInput tags={tags} onChange={setTags} />
          </div>

          {/* Author */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                marginTop: 0,
              }}
            >
              Author Byline
            </h3>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Prime Video Editorial"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar for small screens */}
      <div className="mobile-action-bar">
        <button
          type="button"
          onClick={() => handleSave('draft')}
          disabled={isSaving || isDeleting}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {isSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => handleSave('published')}
          disabled={isSaving || isDeleting}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #00a8e1, #0066cc)',
            border: 'none',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {isSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={13} />}
          Publish
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .post-editor-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        .mobile-action-bar {
          display: none;
        }
        @media (max-width: 900px) {
          .post-editor-grid {
            grid-template-columns: 1fr;
          }
          .mobile-action-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 16px;
            background: rgba(0, 5, 13, 0.95);
            backdrop-filter: blur(12px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            gap: 10px;
            z-index: 50;
          }
        }
      `}</style>
    </div>
  );
}
