import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdminSession, toStoredRichText } from '@/lib/admin-api';
import { d1Execute, d1Query } from '@/lib/cloudflare-d1';
import { toSlug } from '@/lib/slug';

type CategoryRow = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  created_at: string;
};

export async function GET() {
  try {
    await requireAdminSession();
    const rows = await d1Query<CategoryRow>(
      'SELECT id, name, description, image_url, parent_id, created_at FROM categories ORDER BY created_at DESC'
    );
    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = (await request.json()) as {
      name?: string;
      imageUrl?: string;
      parentId?: string | null;
      description?: string;
    };

    const name = String(body.name || '').trim();
    const slug = toSlug(name);
    const imageUrl = String(body.imageUrl || '').trim();
    const parentId = body.parentId ? String(body.parentId) : null;
    const description = toStoredRichText(body.description);

    if (!name || !imageUrl || !description) {
      return NextResponse.json({ ok: false, error: 'name, imageUrl, and description are required.' }, { status: 400 });
    }

    await d1Execute(
      'INSERT INTO categories (id, slug, name, description, image_url, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
      [randomUUID(), slug, name, description, imageUrl, parentId]
    );
    revalidateTag('catalog', 'max');

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
