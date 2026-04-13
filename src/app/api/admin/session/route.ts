import { NextResponse } from 'next/server';

import { getAdminSessionFromRequest } from '@/lib/admin-request';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    admin: {
      id: session.sub,
      email: session.email,
      exp: session.exp,
    },
  });
}