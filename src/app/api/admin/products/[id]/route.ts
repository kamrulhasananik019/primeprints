import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdminSession, toStoredRichText } from '@/lib/admin-api';
import { deleteAdminProduct, resolveCategoryIds, updateAdminProduct } from '@/lib/mongo-catalog';
export const runtime = 'nodejs';

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
    const categoryInputs = Array.isArray(body.categoryIds) ? body.categoryIds.map((item) => String(item).trim()).filter(Boolean) : [];
    const categoryIds = await resolveCategoryIds(categoryInputs);
    const description = toStoredRichText(body.description);
    const shortDescription = toStoredRichText(body.shortDescription);

    if (!name || !description || !shortDescription) {
      return NextResponse.json({ ok: false, error: 'name, description, and shortDescription are required.' }, { status: 400 });
    }

    await updateAdminProduct(id, { name, imageUrls, badges, categoryIds, description, shortDescription });
    revalidateTag('catalog', 'max');

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status, headers: { 'Cache-Control': 'no-store, private, max-age=0' } });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    await deleteAdminProduct(id);
    revalidateTag('catalog', 'max');
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
