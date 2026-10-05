'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Loader2, Image as ImageIcon, Trash2, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndUploadFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeded (Max 5MB)');
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error('Unsupported file type. Use PNG, JPG, WebP, or GIF.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading image to storage...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to upload image.');
      }

      onChange(data.url);
      toast.success('Cover image uploaded successfully!', { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Try entering a URL instead.';
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAndUploadFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processAndUploadFile(file);
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setUrlInput('');
    setShowUrlInput(false);
    toast.success('Cover image URL updated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        style={{ display: 'none' }}
      />

      {value ? (
        <div
          style={{
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.4)',
            aspectRatio: '16 / 9',
            maxHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="cover-image-container"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div
            className="cover-image-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 5, 13, 0.75)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
            }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                background: '#00a8e1',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={12} /> Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={disabled || isUploading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !isUploading && !showUrlInput) {
              fileInputRef.current?.click();
            }
          }}
          style={{
            border: isDragOver ? '2px dashed #00a8e1' : '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '20px 16px',
            textAlign: 'center',
            cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
            background: isDragOver ? 'rgba(0, 168, 225, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#00a8e1' }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>Uploading image...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDragOver ? '#00a8e1' : 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {isDragOver ? <ImageIcon size={18} /> : <Upload size={18} />}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#00a8e1', fontWeight: 600 }}>Click to browse</span> or drag and drop
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)' }}>
                PNG, JPG, WebP, GIF (Max 5MB)
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Toggle / Input */}
      {!value && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {!showUrlInput ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: '#00a8e1',
                fontSize: '11px',
                cursor: 'pointer',
                padding: '2px 0',
              }}
            >
              <LinkIcon size={11} /> Or paste image URL
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                placeholder="https://example.com/image.jpg"
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '11px',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: '#00a8e1',
                  color: '#fff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  border: 'none',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .cover-image-container .cover-image-overlay {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .cover-image-container:hover .cover-image-overlay {
          opacity: 1;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
