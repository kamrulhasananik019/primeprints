import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdminSession, toStoredRichText } from '@/lib/admin-api';
import { d1Execute, d1Query } from '@/lib/cloudflare-d1';
import { toSlug } from '@/lib/slug';

async function resolveCategoryIds(values: string[]): Promise<string[]> {
  if (values.length === 0) return [];

  const byId = await d1Query<{ id: string }>(
    `SELECT id FROM categories WHERE id IN (${values.map(() => '?').join(',')})`,
    values
  );
  const matchedIds = new Set(byId.map((row) => row.id));
  const unresolved = values.filter((value) => !matchedIds.has(value));

  if (unresolved.length === 0) {
    return Array.from(matchedIds);
  }

  const byName = await d1Query<{ id: string }>(
    `SELECT id FROM categories WHERE LOWER(name) IN (${unresolved.map(() => 'LOWER(?)').join(',')})`,
    unresolved
  );

  return Array.from(new Set([...matchedIds, ...byName.map((row) => row.id)]));
}

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
    const slug = toSlug(name);
    const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.map((item) => String(item).trim()).filter(Boolean) : [];
    const badges = Array.isArray(body.badges) ? body.badges.map((item) => String(item).trim()).filter(Boolean) : [];
    const categoryInputs = Array.isArray(body.categoryIds) ? body.categoryIds.map((item) => String(item).trim()).filter(Boolean) : [];
    const categoryIds = await resolveCategoryIds(categoryInputs);
    const description = toStoredRichText(body.description);
    const shortDescription = toStoredRichText(body.shortDescription);

    if (!name || !description || !shortDescription) {
      return NextResponse.json({ ok: false, error: 'name, description, and shortDescription are required.' }, { status: 400 });
    }

    await d1Execute(
      'UPDATE products SET slug = ?, name = ?, image_url = ?, description = ?, short_description = ?, badges = ?, category_id = ? WHERE id = ?',
      [slug, name, JSON.stringify(imageUrls), description, shortDescription, JSON.stringify(badges), JSON.stringify(categoryIds), id]
    );
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
    await d1Execute('DELETE FROM products WHERE id = ?', [id]);
    revalidateTag('catalog', 'max');
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
