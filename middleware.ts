import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'pv_admin_session';

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    
    // Import the secret for HMAC SHA-256
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert hex string to Uint8Array
    const sigBytes = new Uint8Array(sig.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    const payloadBytes = encoder.encode(payload);

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      sigBytes,
      payloadBytes
    );

    if (!isValid) return false;

    // Check expiry (base64url to JSON)
    let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
      b64 += '=';
    }
    const decodedStr = atob(b64);
    const decoded = JSON.parse(decodedStr);
    
    return decoded.exp && Date.now() < decoded.exp;
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
  if (pathname === '/admin/login') return NextResponse.next();

  // Check session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifyToken(token))) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
