import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-session';

function getCookieValue(cookieHeader: string, name: string): string | null {
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [rawKey, ...rest] = cookie.trim().split('=');
    if (rawKey === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}

export async function getAdminSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const token = getCookieValue(cookieHeader, ADMIN_SESSION_COOKIE_NAME);
  if (!token) {
    return null;
  }
  return verifyAdminSessionToken(token);
}