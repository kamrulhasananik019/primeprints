import { cookies } from 'next/headers';

import { getAdminSessionCookieName, verifyAdminSession } from '@/lib/admin-auth';
import type { TipTapDoc } from '@/types/rich-content';

export async function requireAdminSession(): Promise<{ email: string }> {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(getAdminSessionCookieName())?.value);
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return { email: session.email };
}

export function toStoredRichText(input: unknown): string {
  const toDoc = (text: string): TipTapDoc => ({
    type: 'doc',
    content: text.trim()
      ? [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: text.trim() }],
          },
        ]
      : [],
  });

  if (typeof input !== 'string') {
    return JSON.stringify(toDoc(''));
  }

  const trimmed = input.trim();
  if (!trimmed) return JSON.stringify(toDoc(''));

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && (parsed as { type?: string }).type === 'doc') {
      return JSON.stringify(parsed);
    }
  } catch {
    // fall through to plain-text to TipTap conversion
  }

  return JSON.stringify(toDoc(trimmed));
}
