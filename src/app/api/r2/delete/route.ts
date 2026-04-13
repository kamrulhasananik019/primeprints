import { NextResponse } from 'next/server';

import { deleteObjectFromR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { key?: string };
    const key = body.key?.trim();

    if (!key) {
      return NextResponse.json({ ok: false, error: 'Missing required key.' }, { status: 400 });
    }

    await deleteObjectFromR2(key);

    return NextResponse.json({ ok: true, key });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown delete error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
