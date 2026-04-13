import { NextResponse } from 'next/server';

import { runD1Query } from '@/lib/d1';
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionTtlSeconds,
} from '@/lib/admin-session';
import { verifyPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type AdminRow = {
  id: string;
  email: string;
  password_hash: string;
};

async function writeLoginAudit(
  email: string,
  success: boolean,
  ipAddress: string | null,
  userAgent: string | null
) {
  try {
    await runD1Query(
      'INSERT INTO admin_login_audit (admin_email, success, ip_address, user_agent) VALUES (?1, ?2, ?3, ?4)',
      [email, success ? 1 : 0, ipAddress, userAgent]
    );
  } catch {
    // Best-effort logging should not block login flow.
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const userAgent = request.headers.get('user-agent');

    const admins = await runD1Query<AdminRow>(
      'SELECT id, email, password_hash FROM admins WHERE email = ?1 LIMIT 1',
      [email]
    );

    const admin = admins[0];
    if (!admin || !verifyPassword(password, admin.password_hash)) {
      await writeLoginAudit(email, false, ipAddress, userAgent);
      return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    await runD1Query('UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?1', [admin.id]);
    await writeLoginAudit(email, true, ipAddress, userAgent);

    const token = await createAdminSessionToken(admin.id, admin.email);
    const response = NextResponse.json({ ok: true, admin: { id: admin.id, email: admin.email } });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getAdminSessionTtlSeconds(),
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown login error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}