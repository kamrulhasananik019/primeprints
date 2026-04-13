import { cookies } from 'next/headers';

import { getAdminSessionCookieName, verifyAdminSession } from '@/lib/admin-auth';

export async function requireAdminSession(): Promise<{ email: string }> {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(getAdminSessionCookieName())?.value);
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return { email: session.email };
}

export function toStoredRichText(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      return JSON.stringify(parsed);
    }
  } catch {
    // Keep raw markdown/plain text if JSON parse fails.
  }

  return trimmed;
}
