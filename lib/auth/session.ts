import 'server-only';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE = 'pv_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET!;
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

// ── Password verification (PBKDF2) ──────────────────────────────────
export async function verifyPassword(password: string): Promise<boolean> {
  const storedSalt = process.env.ADMIN_PASSWORD_SALT;
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedSalt || !storedHash) return false;

  return new Promise((resolve) => {
    crypto.pbkdf2(password, storedSalt, 310000, 32, 'sha256', (err, key) => {
      if (err) { resolve(false); return; }
      const hash = key.toString('hex');
      // Constant-time comparison to prevent timing attacks
      const a = Buffer.from(hash);
      const b = Buffer.from(storedHash);
      resolve(a.length === b.length && crypto.timingSafeEqual(a, b));
    });
  });
}

// ── Session token — HMAC-signed payload ─────────────────────────────
function signToken(payload: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(payload);
  return `${payload}.${hmac.digest('hex')}`;
}

function verifyToken(token: string): string | null {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  return payload;
}

// ── Session CRUD ────────────────────────────────────────────────────
export async function createSession(): Promise<void> {
  const payload = JSON.stringify({ role: 'admin', exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const encoded = Buffer.from(payload).toString('base64url');
  const token = signToken(encoded);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<{ role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!data.exp || Date.now() > data.exp) return null;
    return { role: data.role };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin(): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('UNAUTHORIZED');
  }
}
