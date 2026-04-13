import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createAdminSession, getAdminCredentials, getAdminSessionCookieName } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  const expected = getAdminCredentials();
  if (email !== expected.email.toLowerCase() || password !== expected.password) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createAdminSession(expected.email);
  const cookieStore = await cookies();
  cookieStore.set(getAdminSessionCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true, email: expected.email });
}
