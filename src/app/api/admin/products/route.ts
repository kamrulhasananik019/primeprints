import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { requireAdminSession, toStoredRichText } from '@/lib/admin-api';
import { d1Execute, d1Query } from '@/lib/cloudflare-d1';

type ProductRow = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  short_description: string;
  badges: string;
  category_id: string;
  created_at: string;
};

export async function GET() {
  try {
    await requireAdminSession();
    const rows = await d1Query<ProductRow>(
      'SELECT id, name, image_url, description, short_description, badges, category_id, created_at FROM products ORDER BY created_at DESC'
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
      'INSERT INTO products (id, name, image_url, description, short_description, badges, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [randomUUID(), name, JSON.stringify(imageUrls), description, shortDescription, JSON.stringify(badges), JSON.stringify(categoryIds)]
    );
    revalidateTag('catalog', 'max');

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
