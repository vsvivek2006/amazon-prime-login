import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files (PNG, JPG, WebP, GIF) are allowed' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split('.').pop() || 'webp';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `covers/${fileName}`;

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from('blog-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
        upsert: false,
      });

    if (uploadError) {
      console.error('[uploadRoute] Storage error:', uploadError.message);
      return NextResponse.json(
        {
          error: `Storage error: ${uploadError.message}. Make sure 'blog-images' bucket exists in Supabase, or paste an image URL directly.`,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = adminClient.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    try {
      revalidatePath('/blog');
    } catch {
      // background revalidation error should not block upload
    }

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      size: buffer.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
