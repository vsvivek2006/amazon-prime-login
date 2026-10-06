import 'server-only';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const SESSION_COOKIE = 'pv_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase configuration missing in environment variables');
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ── Session CRUD backed directly by Supabase Auth ───────────────────
export async function createSession(accessToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<{ email: string; role: string; userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    const role = (user.app_metadata?.role as string) || '';
    return {
      email: user.email || '',
      role,
      userId: user.id,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin(): Promise<{ email: string; role: string; userId: string }> {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
