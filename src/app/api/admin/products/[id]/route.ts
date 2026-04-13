import { NextResponse } from 'next/server';

import { requireAdminSession, toStoredRichText } from '@/lib/admin-api';
import { d1Execute } from '@/lib/cloudflare-d1';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = (await request.json()) as {
      name?: string;
      imageUrls?: string[];
      badges?: string[];
      categoryIds?: string[];
      description?: string;
      shortDescription?: string;
    };

    const name = String(body.name || '').trim();
    const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.map((item) => String(item).trim()).filter(Boolean) : [];
    const badges = Array.isArray(body.badges) ? body.badges.map((item) => String(item).trim()).filter(Boolean) : [];
    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.map((item) => String(item).trim()).filter(Boolean) : [];
    const description = toStoredRichText(body.description);
    const shortDescription = toStoredRichText(body.shortDescription);

    if (!name || !description || !shortDescription) {
      return NextResponse.json({ ok: false, error: 'name, description, and shortDescription are required.' }, { status: 400 });
    }

    await d1Execute(
      'UPDATE products SET name = ?, image_url = ?, description = ?, short_description = ?, badges = ?, category_id = ? WHERE id = ?',
      [name, JSON.stringify(imageUrls), description, shortDescription, JSON.stringify(badges), JSON.stringify(categoryIds), id]
    );

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
    await d1Execute('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
