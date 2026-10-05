import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';

// GET /api/blog — list all posts (admin: all, public would filter by status)
export async function GET() {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, meta_description, cover_image_url, author, tags, status, published_at, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch posts';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/blog — create a new post (admin only)
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { title, slug, meta_description, content, cover_image_url, author, tags, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        meta_description: meta_description || null,
        content,
        cover_image_url: cover_image_url || null,
        author: author || 'Prime Video Editorial',
        tags: tags || [],
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A post with this slug already exists. Please choose a different slug.' }, { status: 400 });
      }
      throw error;
    }

    try {
      revalidatePath('/admin/blog');
      revalidatePath('/blog');
      if (slug) revalidatePath(`/blog/${slug}`);
    } catch {
      // background revalidation error shouldn't block response
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create post';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
