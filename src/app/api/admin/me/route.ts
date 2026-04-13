import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getAdminSessionCookieName, verifyAdminSession } from '@/lib/admin-auth';

export async function GET() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(getAdminSessionCookieName())?.value);
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, email: session.email });
}
