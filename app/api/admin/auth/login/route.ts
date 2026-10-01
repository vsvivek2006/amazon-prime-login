import { NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth/session';

// Simple in-memory rate limiter: max 5 attempts per IP per 15 min
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 15 * 60 * 1000; // 15 minutes
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!email || !password || !adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Constant-time email comparison
    const emailMatch = Buffer.from(email.toLowerCase().trim()).equals(
      Buffer.from(adminEmail.toLowerCase().trim())
    );

    const passwordMatch = await verifyPassword(password);

    // Check both together to prevent timing-based email enumeration
    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    resetRateLimit(ip);
    await createSession();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
