import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-api';
import { getAdminCategories, getAdminProducts } from '@/lib/mongo-catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAdminSession();
    const [categories, products] = await Promise.all([getAdminCategories(), getAdminProducts()]);
    return NextResponse.json({ ok: true, categories, products }, { headers: { 'Cache-Control': 'no-store, private, max-age=0' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status, headers: { 'Cache-Control': 'no-store, private, max-age=0' } });
  }
}