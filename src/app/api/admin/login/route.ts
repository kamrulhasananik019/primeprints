import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createAdminSession, getAdminSessionCookieName, verifyPasswordAgainstHash } from '@/lib/admin-auth';
import { getAdminByEmail } from '@/lib/mongo-catalog';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  const admin = await getAdminByEmail(email);
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
