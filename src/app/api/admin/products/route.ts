import { NextResponse } from 'next/server';

import { getAdminSessionFromRequest } from '@/lib/admin-request';
import { runD1Query } from '@/lib/d1';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  category: string;
  status: string | null;
  created_at: string;
};

function asOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function ensureCategoryExists(categorySlug: string): Promise<boolean> {
  const rows = await runD1Query<{ slug: string }>('SELECT slug FROM categories WHERE slug = ?1 LIMIT 1', [
    categorySlug,
  ]);
  return rows.length > 0;
}

async function requireAdmin(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id')?.trim();

  if (id) {
    const rows = await runD1Query<ProductRow>(
      'SELECT id, slug, name, title, category, status, created_at FROM products WHERE id = ?1 LIMIT 1',
      [id]
    );

    if (!rows[0]) {
      return NextResponse.json({ ok: false, error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product: rows[0] });
  }

  const products = await runD1Query<ProductRow>(
    'SELECT id, slug, name, title, category, status, created_at FROM products ORDER BY created_at DESC'
  );

  return NextResponse.json({ ok: true, products });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const id = asOptionalString(body.id) ?? crypto.randomUUID();
    const slug = asOptionalString(body.slug);
    const name = asOptionalString(body.name);
    const category = asOptionalString(body.category);
    const title = asOptionalString(body.title);
    const status = asOptionalString(body.status);

    if (!slug || !name || !category) {
      return NextResponse.json(
        { ok: false, error: 'slug, name and category are required.' },
        { status: 400 }
      );
    }

    if (!(await ensureCategoryExists(category))) {
      return NextResponse.json({ ok: false, error: 'Category does not exist.' }, { status: 400 });
    }

    await runD1Query(
      'INSERT INTO products (id, slug, name, title, category, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
      [id, slug, name, title, category, status]
    );

    const inserted = await runD1Query<ProductRow>(
      'SELECT id, slug, name, title, category, status, created_at FROM products WHERE id = ?1 LIMIT 1',
      [id]
    );

    return NextResponse.json({ ok: true, product: inserted[0] }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown create error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = asOptionalString(body.id);

    if (!id) {
      return NextResponse.json({ ok: false, error: 'id is required.' }, { status: 400 });
    }

    const updates: Array<{ key: string; value: string | null }> = [];
    const slug = asOptionalString(body.slug);
    const name = asOptionalString(body.name);
    const category = asOptionalString(body.category);
    const title = asOptionalString(body.title);
    const status = asOptionalString(body.status);

    if (slug !== null) updates.push({ key: 'slug', value: slug });
    if (name !== null) updates.push({ key: 'name', value: name });
    if (category !== null) updates.push({ key: 'category', value: category });
    if (title !== null || body.title === '') updates.push({ key: 'title', value: title });
    if (status !== null || body.status === '') updates.push({ key: 'status', value: status });

    if (updates.length === 0) {
      return NextResponse.json({ ok: false, error: 'No valid fields to update.' }, { status: 400 });
    }

    if (category && !(await ensureCategoryExists(category))) {
      return NextResponse.json({ ok: false, error: 'Category does not exist.' }, { status: 400 });
    }

    const setClause = updates.map((update, index) => `${update.key} = ?${index + 1}`).join(', ');
    const params = [...updates.map((update) => update.value), id];

    await runD1Query(`UPDATE products SET ${setClause} WHERE id = ?${updates.length + 1}`, params);

    const updated = await runD1Query<ProductRow>(
      'SELECT id, slug, name, title, category, status, created_at FROM products WHERE id = ?1 LIMIT 1',
      [id]
    );

    if (!updated[0]) {
      return NextResponse.json({ ok: false, error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product: updated[0] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown update error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      return NextResponse.json({ ok: false, error: 'id query parameter is required.' }, { status: 400 });
    }

    const existing = await runD1Query<{ id: string }>('SELECT id FROM products WHERE id = ?1 LIMIT 1', [id]);
    if (!existing[0]) {
      return NextResponse.json({ ok: false, error: 'Product not found.' }, { status: 404 });
    }

    await runD1Query('DELETE FROM products WHERE id = ?1', [id]);

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown delete error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}