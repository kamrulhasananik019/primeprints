import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdminSession, toStoredRichText } from '@/lib/admin-api';
import { d1Execute } from '@/lib/cloudflare-d1';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = (await request.json()) as {
      name?: string;
      imageUrl?: string;
      parentId?: string | null;
      description?: string;
    };

    const name = String(body.name || '').trim();
    const imageUrl = String(body.imageUrl || '').trim();
    const parentId = body.parentId ? String(body.parentId) : null;
    const description = toStoredRichText(body.description);

    if (!name || !imageUrl || !description) {
      return NextResponse.json({ ok: false, error: 'name, imageUrl, and description are required.' }, { status: 400 });
    }

    await d1Execute('UPDATE categories SET name = ?, description = ?, image_url = ?, parent_id = ? WHERE id = ?', [
      name,
      description,
      imageUrl,
      parentId,
      id,
    ]);
    revalidateTag('catalog', 'max');

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    await d1Execute('DELETE FROM categories WHERE id = ?', [id]);
    revalidateTag('catalog', 'max');
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
