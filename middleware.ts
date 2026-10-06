import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'pv_admin_session';

async function verifyAdminToken(token: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !token) return false;

  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) return false;
    const user = await res.json();
    return Boolean(user && user.app_metadata?.role === 'admin');
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /admin to /admin/blog
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/blog', request.url));
  }

  // Only protect /admin/* routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Allow login page through
  if (pathname === '/admin/login') {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token && (await verifyAdminToken(token))) {
      return NextResponse.redirect(new URL('/admin/blog', request.url));
    }
    return NextResponse.next();
  }

  // Check session cookie for protected admin pages
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
