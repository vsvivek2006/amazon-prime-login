'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const lastEmittedHtml = useRef<string>(content || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { style: 'color: #00a8e1; text-decoration: underline; cursor: pointer;' },
      }),
      ImageExtension.configure({
        inline: true,
        HTMLAttributes: { style: 'max-width: 100%; border-radius: 8px; margin: 16px 0;' },
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        style: 'min-height: 320px; padding: 20px; color: #fff; outline: none; font-size: 14px; line-height: 1.7;',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedHtml.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== lastEmittedHtml.current) {
      lastEmittedHtml.current = content || '';
      editor.commands.setContent(content || '', { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const toastId = toast.loading('Uploading and inserting image...');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      editor.chain().focus().setImage({ src: data.url }).run();
      toast.success('Image inserted into article!', { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload image';
      toast.error(msg, { id: toastId });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addImage = () => {
    const input = window.prompt('Enter image URL (or leave blank to select an image from your device):');
    if (input === null) return;
    if (input.trim()) {
      editor.chain().focus().setImage({ src: input.trim() }).run();
      toast.success('Image inserted!');
      return;
    }
    fileInputRef.current?.click();
  };

  const btnStyle = (isActive: boolean) => ({
    padding: '6px', borderRadius: '4px', cursor: 'pointer', border: 'none',
    background: isActive ? '#00a8e1' : 'transparent',
    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  });

  return (
    <div style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleInlineImageUpload}
        style={{ display: 'none' }}
      />
      
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))} title="Bold"><Bold size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive('italic'))} title="Italic"><Italic size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={btnStyle(editor.isActive('strike'))} title="Strikethrough"><Strikethrough size={16} /></button>
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))} title="Heading 2"><Heading2 size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive('heading', { level: 3 }))} title="Heading 3"><Heading3 size={16} /></button>
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))} title="Bullet List"><List size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive('orderedList'))} title="Numbered List"><ListOrdered size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive('blockquote'))} title="Blockquote"><Quote size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btnStyle(false)} title="Divider"><Minus size={16} /></button>
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        
        <button type="button" onClick={setLink} style={btnStyle(editor.isActive('link'))} title="Add Link"><LinkIcon size={16} /></button>
        <button type="button" onClick={addImage} style={btnStyle(false)} title="Add Image (URL or Upload)"><ImageIcon size={16} /></button>
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} style={{ ...btnStyle(false), opacity: editor.can().undo() ? 1 : 0.4 }} title="Undo"><Undo size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} style={{ ...btnStyle(false), opacity: editor.can().redo() ? 1 : 0.4 }} title="Redo"><Redo size={16} /></button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
      
      <style>{`
        .ProseMirror p { margin-bottom: 1em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #fff; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #fff; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .ProseMirror blockquote { border-left: 3px solid #00a8e1; padding-left: 1em; margin-left: 0; color: rgba(255,255,255,0.7); font-style: italic; }
      `}</style>
    </div>
  );
}
