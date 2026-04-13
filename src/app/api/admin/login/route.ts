import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createAdminSession, getAdminSessionCookieName, verifyPasswordAgainstHash } from '@/lib/admin-auth';
import { d1Query } from '@/lib/cloudflare-d1';

type AdminRow = {
  email: string;
  password_hash: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  const rows = await d1Query<AdminRow>('SELECT email, password_hash FROM admins WHERE LOWER(email) = LOWER(?) LIMIT 1', [email]);
  const admin = rows[0];
  if (!admin || !verifyPasswordAgainstHash(password, String(admin.password_hash || ''))) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createAdminSession(admin.email);
  const cookieStore = await cookies();
  cookieStore.set(getAdminSessionCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true, email: admin.email });
}
